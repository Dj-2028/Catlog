const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['product', 'service', 'quote', 'general'],
            default: 'general',
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name is too long'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            match: [/^[+()\-\s\d]{7,20}$/, 'Please enter a valid phone number'],
        },
        email: {
            type: String,
            default: '',
            trim: true,
            lowercase: true,
            maxlength: 120,
            validate: {
                validator: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                message: 'Please enter a valid email address',
            },
        },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
        productName: { type: String, default: '', trim: true, maxlength: 200 },
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', default: null },
        serviceTitle: { type: String, default: '', trim: true, maxlength: 200 },
        quantity: { type: String, default: '', trim: true, maxlength: 100 },
        message: { type: String, default: '', trim: true, maxlength: 2000 },
        status: {
            type: String,
            enum: ['new', 'contacted', 'closed'],
            default: 'new',
        },
        sourcePage: { type: String, default: '', trim: true, maxlength: 300 },
    },
    { timestamps: true }
);

enquirySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
