const mongoose = require('mongoose');
const slugify = require('slugify');

const serviceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Service title is required'],
            trim: true,
            maxlength: [120, 'Title is too long'],
        },
        slug: {
            type: String,
            unique: true,
        },
        shortDescription: {
            type: String,
            default: '',
            trim: true,
            maxlength: [300, 'Short description is too long (max 300 characters)'],
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        // Icon key rendered by the frontend icon set (e.g. "saw", "truck")
        icon: {
            type: String,
            default: '',
            trim: true,
        },
        image: {
            url: { type: String, default: '' },
            public_id: { type: String, default: '' },
        },
        // Optional bullet points shown on the services page
        highlights: {
            type: [String],
            default: [],
        },
        ctaLabel: {
            type: String,
            default: '',
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

serviceSchema.pre('save', async function () {
    if (this.title && !this.slug) {
        const base = slugify(this.title, { lower: true, strict: true }) || 'service';
        let slug = base;
        let n = 1;
        // Ensure uniqueness without timestamps in the URL
        while (await mongoose.models.Service.exists({ slug, _id: { $ne: this._id } })) {
            n += 1;
            slug = `${base}-${n}`;
        }
        this.slug = slug;
    }
});

serviceSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
