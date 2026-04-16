
const cartModel = require('../models/cart.model')

async function fetchProduct(productId) {
    // Product Service ka base URL env se uthate hain.
    const baseUrl = process.env.PRODUCT_SERVICE_URL;

    // Agar config missing hai to early error throw kar do.
    if (!baseUrl) {
        throw new Error('PRODUCT_SERVICE_URL is not configured');
    }

    const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
    const candidateUrls = [
        `${normalizedBaseUrl}/api/products/${productId}`,
        `${normalizedBaseUrl}/products/${productId}`
    ];

    // Pehle service ka real mounted route try kar rahe hain, phir test/legacy route fallback.
    for (const url of candidateUrls) {
        const response = await fetch(url);

        if (response.ok) {
            return response.json();
        }

        if (response.status !== 404) {
            break;
        }
    }

    return null;
}

async function getCart(req,res){
    // Logged-in user ko request se nikaal rahe hain.
    const user = req.user;

    // Different auth payload shapes support kar rahe hain.
    const userId = user?._id || user?.id;

    // Agar user ka cart pehle se nahi hai, to empty cart bana ke save kar do.
    let cart = await cartModel.findOne({user:userId});

    // Missing cart ke case me blank cart create kar dete hain.
    if(!cart){
        cart = new cartModel({user:userId,items:[]});
        await cart.save();
    }

    // Total quantity nikal ke response me bhej rahe hain.
    const totalQuantity = cart.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    // Response me items aur simple totals dono return kar rahe hain.
    res.status(200).json({
        items: cart.items,
        totals: {
            itemsCount: cart.items.length,
            totalQuantity
        }
    })
}

async function addToCart(req,res){

    // Body se product aur quantity le rahe hain.
    const {productId,qty}= req.body;
    // Request user context se cart owner identify kar rahe hain.
    const user = req.user;

    const userId = user?._id || user?.id;
    // Existing cart dhundh rahe hain.
    let cart = await cartModel.findOne({user:userId});

    // Cart na mile to naya cart object bana lo.
    if(!cart){
        cart = new cartModel({user:userId,items:[]})
    }

    // Product Service se product ka current stock check kar rahe hain.
    const product = await fetchProduct(productId);

    console.log('Fetched product for cart addition:', product);
    console.log(product.data.stock)

    // Product missing hai to add nahi karna.
    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    // Same product cart me already hai ya nahi, ye dekh rahe hain.
    const existingIndex = cart.items.findIndex(item =>item.productId.toString()===productId);
    // Agar item pehle se hai to uski quantity le lo, warna zero.
    const existingQty = existingIndex >= 0 ? Number(cart.items[existingIndex].quantity || 0) : 0;
    // Requested quantity ko number me convert kar rahe hain.
    const requestedQty = Number(qty);
    // Available stock ko safe numeric value me nikaal rahe hain.
    const availableQty = Number(product.data.stock ?? 0);

    // Existing + new quantity stock se zyada hui to reject.
    if (existingQty + requestedQty > availableQty) {
        return res.status(409).json({
            message: 'Requested quantity exceeds available stock'
        });
    }

    // Item already hai to quantity add karo, warna naya line item push karo.
    if(existingIndex>=0){
        cart.items[existingIndex].quantity+=requestedQty;
    }else{
        cart.items.push({productId,quantity:requestedQty})
    }

    // Updated cart ko persist kar rahe hain.
    await cart.save();

    // Success response me updated cart bhej rahe hain.
    res.status(200).json({
        message:'item has been added',
        cart
    });

}

async function updateCartItem(req, res) {
    // URL params se productId aur body se qty le rahe hain.
    const { productId } = req.params;
    const { qty } = req.body;
    // Request ke auth payload se user identify kar rahe hain.
    const user = req.user;

    const userId = user?._id || user?.id;
    // User ka cart load kar rahe hain.
    const cart = await cartModel.findOne({ user: userId });

    // Cart hi nahi mila to update possible nahi hai.
    if (!cart) {
        return res.status(404).json({
            message: 'Cart not found'
        });
    }

    // Cart ke items me exact product dhoondh rahe hain.
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    // Item cart me nahi hai to 404 bhej do.
    if (itemIndex < 0) {
        return res.status(404).json({
            message: 'Item not found in cart'
        });
    }

    // Update se pehle stock re-check kar rahe hain.
    const product = await fetchProduct(productId);

    // Product unavailable ho to update fail.
    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    // New quantity aur stock value ko numeric form me le rahe hain.
    const requestedQty = Number(qty);
    const availableQty = Number(product.data.stock ?? 0);

    // Stock se zyada quantity allow nahi karni.
    if (requestedQty > availableQty) {
        return res.status(409).json({
            message: 'Requested quantity exceeds available stock'
        });
    }

    // Existing item ki quantity ko nayi value se replace kar do.
    cart.items[itemIndex].quantity = requestedQty;

    // Cart changes save kar do.
    await cart.save();

    // Updated cart return kar rahe hain.
    return res.status(200).json({
        message: 'item quantity has been updated',
        cart
    });
}

module.exports = {addToCart, updateCartItem , getCart}