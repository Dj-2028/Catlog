const mongoose = require('mongoose');

// Single-document collection holding the store's public contact information.
const settingSchema = new mongoose.Schema(
    {
        key: { type: String, default: 'store', unique: true },
        storeName: { type: String, default: 'Shiv Shakti Ply And Hardware', trim: true, maxlength: 120 },
        tagline: { type: String, default: 'Quality Building & Interior Materials | 15+ Years of Experience', trim: true, maxlength: 200 },
        about: { type: String, default: 'With 15+ years of experience, Shiv Shakti Ply And Hardware is an established supplier in Jabalpur providing quality plywood, hardware supplies, paints, decorative laminates, plumbing, sanitaryware, electrical supplies, electronics, and interior materials.', trim: true, maxlength: 3000 },
        established: { type: String, default: '15+ Years', trim: true, maxlength: 20 },
        phone: { type: String, default: '7987158644', trim: true, maxlength: 30 },
        alternatePhone: { type: String, default: '', trim: true, maxlength: 30 },
        whatsapp: { type: String, default: '9755672433', trim: true, maxlength: 30 },
        email: { type: String, default: '', trim: true, maxlength: 120 },
        address: { type: String, default: 'Narmada Road, Bhim Nagar, Polipather, Gwarighat, Jabalpur, Madhya Pradesh 482001', trim: true, maxlength: 500 },
        gstin: { type: String, default: '', trim: true, maxlength: 20 },
        businessHours: { type: [String], default: ['Open daily from 10:00 AM'] },
        mapEmbedUrl: { type: String, default: 'https://maps.google.com/maps?q=Shiv+Shakti+Ply+And+Hardware+Narmada+Road+Polipather+Gwarighat+Jabalpur&t=&z=15&ie=UTF8&iwloc=&output=embed', trim: true, maxlength: 2000 },
        mapUrl: { type: String, default: 'https://share.google/cPLJQiTvGPre2xRWt', trim: true, maxlength: 1000 },
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
