
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        // Old field name discription rakha hai taaki existing data break na ho.
        discription: {
            type: String
        },
        price: {
            amount: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                enum: ['INR', 'USD'],
                default: 'INR'
            }
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        images: [
            {
                url: String,
                thumbnail: String,
                id: String
            }
        ]
    },
    { timestamps: true }
);

// query ko fast karne ke liye index create karte hai 

productSchema.index({title:'text',discription:'text'})

const productModel = mongoose.model('product', productSchema);


module.exports = productModel;