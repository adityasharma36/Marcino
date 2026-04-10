const productModel = require('../models/product.model');

const imagekit = require('../services/imagekit');

async function createProduct(req, res) {
  try {
    // Normalize Multer output so both upload.array and upload.fields are supported.
    const files = Array.isArray(req.files)
      ? req.files
      : req.files && typeof req.files === 'object'
        ? Object.values(req.files).flat()
        : (req.file ? [req.file] : []);

    // Prefer authenticated seller from token; keep body fallback for compatibility.
    const sellerId = req.user?.id || req.user?._id || req.body.seller;
    if (!sellerId) {
      return res.status(400).json({ message: 'Seller is required' });
    }

    // Upload each image and keep the returned CDN metadata for DB storage.
    const uploads = await Promise.all(
      
      files.map((file) =>
        imagekit.upload({
          file: file.buffer,
          fileName: file.originalname || `product-${Date.now()}.jpg`,
          folder: '/products'
        })
      )
    );

    const product = await productModel.create({
      title: req.body.title,
      // Accept both legacy discription and new description request fields.
      discription: req.body.discription || req.body.description,
      seller: sellerId,
      price: {
        amount: Number(req.body.priceAmount),
        currency: req.body.currency || 'INR'
      },
      images: uploads.map((uploaded) => ({
        url: uploaded.url,
        thumbnail: uploaded.thumbnailUrl,
        id: uploaded.fileId
      }))
    });

    return res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
}

module.exports = {
  createProduct
};
