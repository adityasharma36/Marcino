(function () {
	// Intentionally wrapped to avoid leaking helpers globally in Jest.
})();

const request = require('supertest');
const jwt = require('jsonwebtoken');

// ---- In-memory Cart model mock (no MongoDB needed) ----
// Must be declared before importing the Express app, since controllers require the model.
jest.mock('../models/cart.model', () => {
	// Har user ka cart memory me store karne ke liye map use ho raha hai.
	const cartsByUserId = new Map();

	// Helper jo id ko stable string format me convert karta hai.
	function normalizeId(value) {
		if (!value) return '';
		return typeof value === 'string' ? value : value.toString();
	}

	// Minimal cart model jo real mongoose model ko mimic karta hai.
	class CartModel {
		constructor({ user, items = [], totals } = {}) {
			this.user = user;
			this.items = items;
			if (totals !== undefined) this.totals = totals;
		}

		// Save call pe cart ko in-memory map me persist kar do.
		async save() {
			cartsByUserId.set(normalizeId(this.user), this);
			return this;
		}
	}

	// Test isolation ke liye reset helper.
	CartModel.__reset = () => cartsByUserId.clear();
	// Direct cart inspect karne ke liye helper.
	CartModel.__get = (userId) => cartsByUserId.get(normalizeId(userId));

	// findOne ka simple in-memory version.
	CartModel.findOne = async (query = {}) => {
		const userId = normalizeId(query.user);
		return cartsByUserId.get(userId) || null;
	};

	// Delete query ka minimal support.
	CartModel.deleteOne = async (query = {}) => {
		const userId = normalizeId(query.user);
		const existed = cartsByUserId.delete(userId);
		return { deletedCount: existed ? 1 : 0 };
	};

	// findOneAndDelete ka basic support.
	CartModel.findOneAndDelete = async (query = {}) => {
		const userId = normalizeId(query.user);
		const doc = cartsByUserId.get(userId) || null;
		cartsByUserId.delete(userId);
		return doc;
	};

	// findOneAndUpdate ka limited subset for tests.
	CartModel.findOneAndUpdate = async (query = {}, update = {}, options = {}) => {
		const userId = normalizeId(query.user);
		let doc = cartsByUserId.get(userId) || null;
		// Upsert enabled hai to new cart create kar do.
		if (!doc && options.upsert) {
			doc = new CartModel({ user: userId, items: [] });
			cartsByUserId.set(userId, doc);
		}
		if (!doc) return null;

		// Extremely small subset to support common patterns.
		// $set se direct fields update ho sakti hain.
		if (update.$set) Object.assign(doc, update.$set);
		// $push se items array me naya item add hota hai.
		if (update.$push && update.$push.items) doc.items.push(update.$push.items);
		// $pull se kisi specific product ko remove kar sakte hain.
		if (update.$pull && update.$pull.items && update.$pull.items.productId) {
			const pid = normalizeId(update.$pull.items.productId);
			doc.items = doc.items.filter((it) => normalizeId(it.productId) !== pid);
		}
		// Direct items overwrite support.
		if (update.items) doc.items = update.items;
		// Totals overwrite support.
		if (update.totals !== undefined) doc.totals = update.totals;

		cartsByUserId.set(userId, doc);
		return doc;
	};

	return CartModel;
});

const CartModel = require('../models/cart.model');
const express = require('express');

// NOTE: Import after mocks.
const app = require('../app');

// Stable product ids for test cases.
const P1 = '507f191e810c19729de860ea';
const P2 = '507f191e810c19729de860eb';

// JWT token bhejne ke liye Authorization header helper.
function makeAuthHeader(overrides = {}) {
	const payload = {
		_id: '507f191e810c19729de860ff',
		role: 'user',
		...overrides,
	};

	const token = jwt.sign(payload, process.env.JWT_SECRET);
	return `Bearer ${token}`;
}

// Response body me cart object ko normalize karne ka helper.
function getCartFromBody(body) {
	if (!body) return null;
	if (body.cart && typeof body.cart === 'object') return body.cart;
	if (body.items || body.totals) return body;
	return null;
}

// Items array safely nikaalne ka helper.
function getItems(cart) {
	if (!cart) return [];
	return Array.isArray(cart.items) ? cart.items : [];
}

// Quantity field ka support do possible names ke liye.
function getQty(item) {
	if (!item || typeof item !== 'object') return undefined;
	if (typeof item.qty === 'number') return item.qty;
	if (typeof item.quantity === 'number') return item.quantity;
	return undefined;
}

describe('Cart API contract (/api/cart)', () => {
	let productServiceServer;
	let productServiceBaseUrl;
	// In-memory product catalog for stubbed Product Service.
	const products = new Map();

	beforeAll(async () => {
		// JWT secret test environment me available hona chahiye.
		process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

		// Stub Product Service used by cart implementation.
		const productApp = express();
		productApp.use(express.json());

		// Product lookup endpoint jo cart controller call karta hai.
		productApp.get('/products/:id', (req, res) => {
			const product = products.get(req.params.id);
			if (!product) {
				return res.status(404).json({ message: 'Product not found' });
			}
			return res.status(200).json({ id: req.params.id, ...product });
		});

		// Random local port pe stub server start kar rahe hain.
		productServiceServer = await new Promise((resolve) => {
			const srv = productApp.listen(0, '127.0.0.1', () => resolve(srv));
		});

		// Actual service URL ko env me set kar rahe hain.
		const address = productServiceServer.address();
		productServiceBaseUrl = `http://127.0.0.1:${address.port}`;
		process.env.PRODUCT_SERVICE_URL = productServiceBaseUrl;
	});

	afterAll(async () => {
		// Test ke baad stub server close kar rahe hain.
		if (productServiceServer) {
			await new Promise((resolve) => productServiceServer.close(resolve));
		}
	});

	beforeEach(() => {
		// Har test se pehle cart state reset kar do.
		CartModel.__reset();
		// Product catalog ko fresh start do.
		products.clear();

		// Default catalog for tests.
		products.set(P1, { priceCents: 1500, availableQty: 10 });
		products.set(P2, { priceCents: 2500, availableQty: 10 });
	});

	// Token ke bina cart routes unauthorized hone chahiye.
	test('POST /api/cart/items requires auth token (401)', async () => {
		const res = await request(app).post('/api/cart/items').send({ productId: P1, qty: 1 });
		expect(res.status).toBe(401);
	});

	// Add item flow ka happy-path contract.
	test('POST /api/cart/items adds { productId, qty } to cart', async () => {
		const res = await request(app)
			.post('/api/cart/items')
			.set('Authorization', makeAuthHeader())
			.send({ productId: P1, qty: 2 });

		expect([200, 201]).toContain(res.status);

		const cart = getCartFromBody(res.body);
		expect(cart).toBeTruthy();
		expect(getItems(cart).length).toBeGreaterThanOrEqual(1);

		const line = getItems(cart).find((it) => `${it.productId}` === P1);
		expect(line).toBeTruthy();
		expect(getQty(line)).toBe(2);
	});

	// Stock validation rejection ka contract.
	test('POST /api/cart/items validates availability (insufficient stock rejects)', async () => {
		const ok = await request(app)
			.post('/api/cart/items')
			.set('Authorization', makeAuthHeader())
			.send({ productId: P1, qty: 1 });

		expect([200, 201]).toContain(ok.status);

		products.set(P1, { priceCents: 1500, availableQty: 1 });

		const res = await request(app)
			.post('/api/cart/items')
			.set('Authorization', makeAuthHeader())
			.send({ productId: P1, qty: 2 });

		// Implementation may choose 400/409/422; contract is "reject".
		expect([400, 409, 422]).toContain(res.status);
	});

	// PATCH route quantity update ka contract.
	test('PATCH /api/cart/items/:productId updates item quantity', async () => {
		const createRes = await request(app)
			.post('/api/cart/items')
			.set('Authorization', makeAuthHeader())
			.send({ productId: P1, qty: 2 });

		expect([200, 201]).toContain(createRes.status);

		const res = await request(app)
			.patch(`/api/cart/items/${P1}`)
			.set('Authorization', makeAuthHeader())
			.send({ qty: 5 });

		expect(res.status).toBe(200);

		const cart = getCartFromBody(res.body);
		expect(cart).toBeTruthy();

		const line = getItems(cart).find((it) => `${it.productId}` === P1);
		expect(line).toBeTruthy();
		expect(getQty(line)).toBe(5);
	});

	// GET cart contract jo current cart aur totals return kare.
	test('GET /api/cart fetches current cart with items and totals', async () => {
		await request(app)
			.post('/api/cart/items')
			.set('Authorization', makeAuthHeader())
			.send({ productId: P1, qty: 2 });

		const res = await request(app)
			.get('/api/cart')
			.set('Authorization', makeAuthHeader());

		expect(res.status).toBe(200);

		const cart = getCartFromBody(res.body);
		expect(cart).toBeTruthy();
		expect(Array.isArray(cart.items)).toBe(true);
		expect(cart.items.length).toBeGreaterThan(0);
		expect(cart.totals).toBeDefined();
	});
});

