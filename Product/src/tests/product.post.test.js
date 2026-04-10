const request = require('supertest');

jest.mock('../middleware/auth.middleware', () => () => (req, res, next) => next());

jest.mock('../models/product.model', () => ({
  create: jest.fn()
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
    imagekit.upload.mockResolvedValue({
      url: 'https://ik.imagekit.io/demo/product.jpg',
      thumbnailUrl: 'https://ik.imagekit.io/demo/tr:n-thumbnail/product.jpg',
      fileId: 'file_123'
    });

    Product.create.mockResolvedValue({
      _id: 'product_1',
      title: 'Nike Air Max',
      discription: 'Running shoes',
      seller: '507f1f77bcf86cd799439011',
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
        seller: '507f1f77bcf86cd799439011',
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
