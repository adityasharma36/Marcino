

const mongoose = require('mongoose');

// Ek address ka basic structure define kar rahe hain
const addressSchema = new mongoose.Schema({
    street:String,
    city:String,
    state:String,
    pincode:String,
    country:String,
    phone:String,
    isDefault:{type:Boolean,default:false}
})

// User ka main schema yahan define hai
const userSchema = new  mongoose.Schema({

    username:{
        type:String,
        required: true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        
        // Password frontend tak kabhi nahi jana chahiye
        select:false
    },
    fullName:{
        firstName:{type:String, required:true},
        lastName:{type:String, required: true}
    },
    role:{
        type:String,
        enum:['user','seller'],
        default:'user' 
    },
    addresses:[
        addressSchema 
    ]
})

// User model bana kar export kar rahe hain
const userModel = mongoose.model('user',userSchema);

module.exports = userModel;