const mongoose = require('mongoose');
const { Schema } = mongoose;
const PaymentSchema = new Schema({
    orderId: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        default: 'COD',
    },
    paymentStatus: {
        type: String,
        default: 'Pending',
    },
    productData: {
        type: Object,
        required: true,
    },
    userData: {
        type: Object,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    totalAmount: {
        type: Number,
    },
    razorpay_order_id: {
        type: String,
        required: false,
    },
    razorpay_payment_id: {
        type: String,
        required: false,
    },
    razorpay_signature: {
        type: String,
        required: false,
    },
}, { timestamps: true })

module.exports = mongoose.model("payment", PaymentSchema)