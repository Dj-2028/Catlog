const mongoose = require('mongoose');
const slugify = require('slugify');

const CATEGORIES = [
  'Key Chains',
  'Trophies',
  'Gift Items',
  'Visiting Cards',
  'Pamphlets',
  'Uncategorized',
];

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  images: {
    type: [imageSchema],
    default: [],
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative'],
  },
  serialNo: {
    type: String,
    unique: true,
    required: [true, 'Serial number is required'],
    trim: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    default: 'Uncategorized',
    trim: true,
    enum: {
      values: CATEGORIES,
      message: '{VALUE} is not a valid category',
    },
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Auto-generate slug from name before saving
productSchema.pre('save', function () {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug =
      slugify(this.name, { lower: true, strict: true }) + '-' + Date.now();
  }
});

// ---------- Indexes ----------
productSchema.index({ category: 1 });
productSchema.index({ isPublished: 1, dateAdded: -1 });
productSchema.index({ isPublished: 1, isFeatured: 1 });
productSchema.index({ name: 'text', serialNo: 'text' });

module.exports = mongoose.model('Product', productSchema);
module.exports.CATEGORIES = CATEGORIES;
