const request = require('supertest');

// Auth ko mock karke seller user set kar rahe hain.
jest.mock('../middleware/auth.middleware', () => () => (req, res, next) => {
  req.user = { id: 'seller_1', role: 'seller' };
  next();
});

jest.mock('../models/product.model', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findOne: jest.fn(),
  findOneAndDelete: jest.fn()
}));

jest.mock('../services/imagekit', () => ({
  upload: jest.fn()
}));

const app = require('../app');
const Product = require('../models/product.model');
const imagekit = require('../services/imagekit');

describe('POST /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a product with uploaded image and returns 201', async () => {
    // Image upload mock result de rahe hain.
    imagekit.upload.mockResolvedValue({
      url: 'https://ik.imagekit.io/demo/product.jpg',
      thumbnailUrl: 'https://ik.imagekit.io/demo/tr:n-thumbnail/product.jpg',
      fileId: 'file_123'
    });

    Product.create.mockResolvedValue({
      _id: 'product_1',
      title: 'Nike Air Max',
      discription: 'Running shoes',
      seller: 'seller_1',
      price: { amount: 7999, currency: 'INR' },
      images: [
        {
          url: 'https://ik.imagekit.io/demo/product.jpg',
          thumbnail: 'https://ik.imagekit.io/demo/tr:n-thumbnail/product.jpg',
          id: 'file_123'
        }
      ]
    });

    const response = await request(app)
      .post('/api/products')
      .field('title', 'Nike Air Max')
      .field('discription', 'Running shoes')
      .field('seller', '507f1f77bcf86cd799439011')
      .field('priceAmount', '7999')
      .field('currency', 'INR')
      .attach('image', Buffer.from('fake-image-content'), 'nike-air-max.jpg');

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Product created successfully');
    expect(imagekit.upload).toHaveBeenCalledTimes(1);
    expect(Product.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Nike Air Max',
        discription: 'Running shoes',
        seller: 'seller_1',
        price: {
          amount: 7999,
          currency: 'INR'
        }
      })
    );
  });

  it('returns 400 when image is not provided', async () => {
    const response = await request(app)
      .post('/api/products')
      .field('title', 'Product without image')
      .field('seller', '507f1f77bcf86cd799439011')
      .field('priceAmount', '100');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('At least one image is required');
    expect(imagekit.upload).not.toHaveBeenCalled();
    expect(Product.create).not.toHaveBeenCalled();
  });

  it('returns 400 when title is missing', async () => {
    const response = await request(app)
      .post('/api/products')
      .field('seller', '507f1f77bcf86cd799439011')
      .field('priceAmount', '100')
      .attach('image', Buffer.from('fake-image-content'), 'without-title.jpg');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Title is required');
    expect(Product.create).not.toHaveBeenCalled();
  });

  it('returns 400 when priceAmount is invalid', async () => {
    const response = await request(app)
      .post('/api/products')
      .field('title', 'Invalid price product')
      .field('seller', '507f1f77bcf86cd799439011')
      .field('priceAmount', '0')
      .attach('image', Buffer.from('fake-image-content'), 'invalid-price.jpg');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Valid priceAmount is required');
    expect(Product.create).not.toHaveBeenCalled();
    expect(imagekit.upload).not.toHaveBeenCalled();
  });
});

describe('GET /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns products with default pagination', async () => {
    // Default skip=0, limit=20 check kar rahe hain.
    const products = [
      { _id: 'p1', title: 'Air Max', price: { amount: 7999, currency: 'INR' } },
      { _id: 'p2', title: 'Zoom', price: { amount: 6999, currency: 'INR' } }
    ];

    const mockSkip = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockResolvedValue(products);
    Product.find.mockReturnValue({ skip: mockSkip, limit: mockLimit });

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: products });
    expect(Product.find).toHaveBeenCalledWith({});
    expect(mockSkip).toHaveBeenCalledWith(0);
    expect(mockLimit).toHaveBeenCalledWith(20);
  });

  it('applies query filters and pagination', async () => {
    const products = [
      { _id: 'p3', title: 'Query Hit', price: { amount: 5000, currency: 'INR' } }
    ];

    const mockSkip = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockResolvedValue(products);
    Product.find.mockReturnValue({ skip: mockSkip, limit: mockLimit });

    const response = await request(app).get(
      '/api/products?q=air&minPrice=100&maxPrice=900&skip=5&limit=10'
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: products });
    expect(Product.find).toHaveBeenCalledWith({
      $text: { $search: 'air' },
      'price.amount': { $gte: 900 }
    });
    expect(mockSkip).toHaveBeenCalledWith(5);
    expect(mockLimit).toHaveBeenCalledWith(10);
  });
});

describe('GET /api/products/seller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns only the authenticated seller products', async () => {
    const products = [
      { _id: 's1', title: 'Seller Product 1', seller: 'seller_1' },
      { _id: 's2', title: 'Seller Product 2', seller: 'seller_1' }
    ];

    const mockSkip = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockResolvedValue(products);
    Product.find.mockReturnValue({ skip: mockSkip, limit: mockLimit });

    const response = await request(app).get('/api/products/seller');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: products });
    expect(Product.find).toHaveBeenCalledWith({ seller: 'seller_1' });
    expect(mockSkip).toHaveBeenCalledWith(0);
    expect(mockLimit).toHaveBeenCalledWith(20);
  });
});
 
describe('GET /api/products/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a product by id', async () => {
    // Simple id se product fetch ka test.
    const product = {
      _id: 'p10',
      title: 'Single Product',
      price: { amount: 1200, currency: 'INR' }
    };

    Product.findById.mockResolvedValue(product);

    const response = await request(app).get('/api/products/p10');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: product });
    expect(Product.findById).toHaveBeenCalledWith('p10');
  });

  it('returns 404 when product is not found', async () => {
    Product.findById.mockResolvedValue(null);

    const response = await request(app).get('/api/products/p404');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Product not found');
  });

  it('returns 500 when model throws', async () => {
    Product.findById.mockRejectedValue(new Error('DB failure'));

    const response = await request(app).get('/api/products/p500');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to fetch product');
  });
});

describe('PATCH /api/products/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates product fields for seller and returns 200', async () => {
    // Seller apne product ko update kare to 200 aana chahiye.
    const product = {
      _id: '507f1f77bcf86cd799439011',
      title: 'Updated Title',
      discription: 'Updated description',
      price: { amount: 2500, currency: 'INR' },
      save: jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        title: 'Updated Title',
        discription: 'Updated description',
        price: { amount: 2500, currency: 'INR' }
      })
    };

    Product.findOne.mockResolvedValue(product);

    const response = await request(app)
      .patch('/api/products/507f1f77bcf86cd799439011')
      .send({ title: 'Updated Title', discription: 'Updated description', priceAmount: 2500 });

    expect(response.status).toBe(200);
    expect(Product.findOne).toHaveBeenCalledWith({
      _id: '507f1f77bcf86cd799439011',
      seller: 'seller_1'
    });
    expect(product.save).toHaveBeenCalledTimes(1);
  });

  it('returns 404 when product does not exist', async () => {
    Product.findOne.mockResolvedValue(null);

    const response = await request(app)
      .patch('/api/products/507f1f77bcf86cd799439012')
      .send({ title: 'Nope' });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /api/products/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes the seller product and returns 200', async () => {
    const product = {
      _id: '507f1f77bcf86cd799439013',
      title: 'Delete Me'
    };

    Product.findOneAndDelete.mockResolvedValue(product);

    const response = await request(app).delete('/api/products/507f1f77bcf86cd799439013');

    expect(response.status).toBe(200);
    expect(Product.findOneAndDelete).toHaveBeenCalledWith({
      _id: '507f1f77bcf86cd799439013',
      seller: 'seller_1'
    });
  });

  it('returns 404 when product is not found', async () => {
    Product.findOneAndDelete.mockResolvedValue(null);

    const response = await request(app).delete('/api/products/507f1f77bcf86cd799439014');

    expect(response.status).toBe(404);
  });

  it('returns 400 when product id is invalid', async () => {
    const response = await request(app).delete('/api/products/invalid-id');

    expect(response.status).toBe(400);
  });
});
