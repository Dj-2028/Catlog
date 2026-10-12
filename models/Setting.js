const mongoose = require('mongoose');

// Single-document collection holding the store's public contact information.
const settingSchema = new mongoose.Schema(
    {
        key: { type: String, default: 'store', unique: true },
        storeName: { type: String, default: 'Hardware & Plywood Store', trim: true, maxlength: 120 },
        tagline: { type: String, default: '', trim: true, maxlength: 200 },
        about: { type: String, default: '', trim: true, maxlength: 3000 },
        established: { type: String, default: '', trim: true, maxlength: 20 },
        phone: { type: String, default: '', trim: true, maxlength: 30 },
        alternatePhone: { type: String, default: '', trim: true, maxlength: 30 },
        whatsapp: { type: String, default: '', trim: true, maxlength: 30 },
        email: { type: String, default: '', trim: true, maxlength: 120 },
        address: { type: String, default: '', trim: true, maxlength: 500 },
        gstin: { type: String, default: '', trim: true, maxlength: 20 },
        businessHours: { type: [String], default: [] },
        mapEmbedUrl: { type: String, default: '', trim: true, maxlength: 2000 },
        mapUrl: { type: String, default: '', trim: true, maxlength: 1000 },
        socialLinks: {
            facebook: { type: String, default: '', trim: true },
            instagram: { type: String, default: '', trim: true },
            youtube: { type: String, default: '', trim: true },
            linkedin: { type: String, default: '', trim: true },
        },
    },
    { timestamps: true }
);

settingSchema.statics.getStore = async function () {
    let doc = await this.findOne({ key: 'store' });
    if (!doc) doc = await this.create({ key: 'store' });
    return doc;
};

module.exports = mongoose.model('Setting', settingSchema);
