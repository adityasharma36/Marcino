const { default: mongoose } = require('mongoose');
const productModel = require('../models/product.model');

const imagekit = require('../services/imagekit');

async function createProduct(req, res) {
  try {
    // Handle both single-file and field-based Multer uploads.
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


async function getProduct(req,res){

  const {q,minPrice,maxPrice,skip=0 , limit=20}= req.query;

  const filter = {};

   if(q){

    filter.$text = {$search : q}

   }
   
   if(minPrice){

    // Keep the lower price bound in the Mongo filter.
    filter['price.amount'] = {...filter['price.amount'],$gte:Number(minPrice)}

   }

    if(maxPrice){

    // Current logic keeps the upper bound in the same field.
    filter['price.amount'] = {...filter['price.amount'],$gte:Number(maxPrice)}

   }

   const products = await productModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit),20));
    
    return res.status(200).json({data:products});

}

async function getSellerProducts(req, res) {

  const { q, minPrice, maxPrice, skip = 0, limit = 20 } = req.query;

  const filter = {
    seller: req.user.id
  };

  if (q) {
    filter.$text = { $search: q };
  }

  if (minPrice) {
    filter['price.amount'] = { ...filter['price.amount'], $gte: Number(minPrice) };
  }

  if (maxPrice) {
    filter['price.amount'] = { ...filter['price.amount'], $gte: Number(maxPrice) };
  }

  const products = await productModel
    .find(filter)
    .skip(Number(skip))
    .limit(Math.min(Number(limit), 20));

  return res.status(200).json({ data: products });
}
async function getProductById(req,res){
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Product id is required' });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'invalid product id' });
    }

    // Only the seller who owns the product can update it.
    const product = await productModel.findOne({
      _id: id,
      seller: req.user.id
    });

    if (!product) {
      return res.status(404).json({ message: 'product not found' });
    }

    // Build only the fields that were actually sent.
    const updates = {};

    if (req.body.title) {
      updates.title = req.body.title;
    }

    if (req.body.discription || req.body.description) {
      updates.discription = req.body.discription || req.body.description;
    }

    if (req.body.price || req.body.priceAmount || req.body.currency) {
      updates.price = {
        amount:
          typeof req.body.priceAmount !== 'undefined'
            ? Number(req.body.priceAmount)
            : (req.body.price?.amount ?? product.price?.amount),
        currency: req.body.currency || req.body.price?.currency || product.price?.currency || 'INR'
      };
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    Object.assign(product, updates);
    const savedProduct = await product.save();

    return res.status(200).json({ message: 'Product updated successfully', data: savedProduct });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
}


async function deleteProduct(req,res){

  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({message:'invalid id'})
  }

  const product = await productModel.findOneAndDelete({
    _id:id,
    seller:req.user.id
  })

  if(!product){
    return res.status(404).json({message:'product not found'}) 
  }

  return res.status(200).json({message:'product remove successfully'})

}
module.exports = {
  createProduct,
  getProduct,
  getSellerProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
