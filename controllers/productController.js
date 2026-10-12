const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');

const SORT_MAP = {
    newest: { dateAdded: -1 },
    oldest: { dateAdded: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name: { name: 1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 },
};

const AVAILABILITY_VALUES = ['in_stock', 'limited', 'on_order', 'out_of_stock'];

function escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isAdminRequest(req) {
    return Boolean(req.session && req.session.isAdmin);
}

function getSortOption(sort) {
    return SORT_MAP[sort] || SORT_MAP.newest;
}

async function destroyImages(images) {
    if (!images || images.length === 0) return;
    const promises = images
        .filter((img) => img.public_id)
        .map((img) => {
            // Images stored by the local-disk upload fallback
            if (img.url && img.url.startsWith('/uploads/')) {
                const file = path.join(__dirname, '..', 'public', 'uploads', path.basename(img.url));
                return fs.promises.unlink(file).catch(() => { });
            }
            return cloudinary.uploader.destroy(img.public_id).catch(() => { });
        });
    await Promise.allSettled(promises);
}

function buildImageObjects(files) {
    if (!files || files.length === 0) return [];
    return files.map((f) => ({
        url: f.path,
        public_id: f.filename,
    }));
}

const ensureCategoryExists = async (categoryName) => {
    if (!categoryName || categoryName.trim() === 'Uncategorized') return 'Uncategorized';

    const cleanName = categoryName.trim();
    const existing = await Category.findOne({ name: new RegExp(`^${cleanName}$`, 'i') });

    if (!existing) {
        await Category.create({ name: cleanName });
    }
    return cleanName;
};

const cleanupOrphanedCategory = async (categoryName) => {
    if (!categoryName || categoryName === 'Uncategorized') return;

    const productCount = await Product.countDocuments({
        category: categoryName,
        isDeleted: { $ne: true }
    });

    if (productCount === 0) {
        await Category.findOneAndDelete({ name: categoryName });
        console.log(`Cleaned up orphaned category: ${categoryName}`);
    }
};


exports.getHomePage = async (req, res, next) => {
    try {
        let featured = await Product.find({
            isPublished: true,
            isFeatured: true,
            isDeleted: { $ne: true },
        })
            .sort({ dateAdded: -1 })
            .limit(8);

        if (featured.length === 0) {
            featured = await Product.find({
                isPublished: true,
                isDeleted: { $ne: true },
            })
                .sort({ dateAdded: -1 })
                .limit(8);
        }

        res.render('home', { title: 'Home', featured, currentPage: 'home' });
    } catch (err) {
        next(err);
    }
};

exports.getProductsPage = async (req, res, next) => {
    try {
        const { q, category, page = 1, limit = 12, sort } = req.query;
        const query = { isPublished: true, isDeleted: { $ne: true } };

        if (category && category !== 'All') {
            query.category = category;
        }
        if (q && q.trim()) {
            query.$or = [
                { name: { $regex: q.trim(), $options: 'i' } },
                { serialNo: { $regex: q.trim(), $options: 'i' } },
            ];
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [products, totalCount, categoryDocs] = await Promise.all([
            Product.find(query)
                .sort(getSortOption(sort))
                .skip(skip)
                .limit(limitNum),
            Product.countDocuments(query),
            Category.find().sort({ name: 1 })
        ]);

        const categories = categoryDocs.map(c => c.name);

        res.render('products', {
            title: 'Our Products',
            products,
            categories,
            currentCategory: category || 'All',
            searchQuery: q || '',
            currentSort: sort || 'newest',
            currentPage: 'products',
            pagination: {
                page: pageNum,
                totalPages: Math.ceil(totalCount / limitNum),
                totalCount,
                limit: limitNum,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.getProductDetail = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            slug: req.params.slug,
            isPublished: true,
            isDeleted: { $ne: true },
        });
        if (!product) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Product not found',
                currentPage: '',
            });
        }
        res.render('product-detail', {
            title: product.name,
            product,
            currentPage: 'products',
        });
    } catch (err) {
        next(err);
    }
};

exports.getAboutPage = (req, res) => {
    res.render('about', { title: 'About Us', currentPage: 'about' });
};

exports.listProducts = async (req, res, next) => {
    try {
        const { q, category, brand, availability, featured, page = 1, limit = 50, sort } = req.query;
        const query = { isDeleted: { $ne: true } };

        // Drafts are only visible to the logged-in admin
        if (!isAdminRequest(req)) query.isPublished = true;

        if (category && category !== 'All') {
            const cats = String(category).split(',').map((c) => c.trim()).filter(Boolean);
            query.category = cats.length > 1 ? { $in: cats } : cats[0];
        }
        if (brand) {
            const brands = String(brand).split(',').map((b) => b.trim()).filter(Boolean);
            if (brands.length) query.brand = { $in: brands };
        }
        if (availability) {
            const values = String(availability).split(',').filter((a) => AVAILABILITY_VALUES.includes(a));
            if (values.length) query.availability = { $in: values };
        }
        if (featured === 'true' || featured === '1') query.isFeatured = true;
        if (q && String(q).trim()) {
            const rx = { $regex: escapeRegex(String(q).trim()), $options: 'i' };
            query.$or = [
                { name: rx },
                { serialNo: rx },
                { brand: rx },
                { category: rx },
                { description: rx },
            ];
        }

        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
        const skip = (pageNum - 1) * limitNum;

        const [products, totalCount] = await Promise.all([
            Product.find(query)
                .sort({ ...getSortOption(sort), _id: -1 })
                .skip(skip)
                .limit(limitNum),
            Product.countDocuments(query),
        ]);

        res.json({
            products,
            pagination: {
                page: pageNum,
                totalPages: Math.ceil(totalCount / limitNum),
                totalCount,
            },
        });
    } catch (err) {
        next(err);
    }
};

// Facets for the public catalog filters (brands + availability counts)
exports.getProductFilters = async (req, res, next) => {
    try {
        const match = { isDeleted: { $ne: true }, isPublished: true };
        const [brands, availability, categories] = await Promise.all([
            Product.aggregate([
                { $match: { ...match, brand: { $nin: ['', null] } } },
                { $group: { _id: '$brand', count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
            Product.aggregate([
                { $match: match },
                { $group: { _id: '$availability', count: { $sum: 1 } } },
            ]),
            Product.aggregate([
                { $match: match },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
        ]);
        res.json({
            brands: brands.map((b) => ({ name: b._id, count: b.count })),
            availability: availability
                .map((a) => ({ value: a._id || 'in_stock', count: a.count }))
                .sort((a, b) => AVAILABILITY_VALUES.indexOf(a.value) - AVAILABILITY_VALUES.indexOf(b.value)),
            categories: categories.map((c) => ({ name: c._id, count: c.count })),
        });
    } catch (err) {
        next(err);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Accept either a Mongo ObjectId or the product slug
        const product = mongoose.isValidObjectId(id)
            ? await Product.findById(id)
            : await Product.findOne({ slug: id });
        if (!product || product.isDeleted || (!product.isPublished && !isAdminRequest(req)))
            return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const {
            name,
            description,
            price,
            serialNo,
            category,
            specifications,
            isPublished,
            isFeatured,
            brand,
            availability,
        } = req.body;

        const images = buildImageObjects(req.files);

        const finalCategory = await ensureCategoryExists(category);

        let specs = {};
        if (specifications) {
            try {
                specs =
                    typeof specifications === 'string'
                        ? JSON.parse(specifications)
                        : specifications;
            } catch {
                specs = {};
            }
        }

        const product = new Product({
            name,
            description,
            price: parseFloat(price) || 0,
            serialNo,
            category: category || 'Uncategorized',
            brand: brand || '',
            availability: availability || 'in_stock',
            specifications: specs,
            isPublished: isPublished === 'true' || isPublished === true,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            images,
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        if (req.files) {
            await destroyImages(buildImageObjects(req.files));
        }
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted)
            return res.status(404).json({ error: 'Product not found' });

        const {
            name,
            description,
            price,
            serialNo,
            category,
            specifications,
            isPublished,
            isFeatured,
            existingImages,
            brand,
            availability,
        } = req.body;

        let keepImages = [];
        let finalImages = product.images;
        if (existingImages !== undefined) {
            try {
                keepImages = typeof existingImages === 'string'
                    ? JSON.parse(existingImages)
                    : existingImages;
            } catch {
                keepImages = product.images;
            }
            const keepPublicIds = keepImages.map((img) => img.public_id);
            const imagesToDestroy = product.images.filter(
                (img) => !keepPublicIds.includes(img.public_id)
            );
            await destroyImages(imagesToDestroy);
            const newImages = buildImageObjects(req.files);
            finalImages = [...keepImages, ...newImages];
        } else {
            const newImages = buildImageObjects(req.files);
            finalImages = [...product.images, ...newImages];
        }

        let specs = product.specifications || {};
        if (specifications !== undefined) {
            try {
                specs = typeof specifications === 'string'
                    ? JSON.parse(specifications)
                    : specifications;
            } catch { }
        }

        const finalCategory = await ensureCategoryExists(category);

        const updateFields = {
            images: finalImages,
            specifications: specs,
            isPublished: isPublished === 'true' || isPublished === true,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            category: finalCategory,
        };

        if (description !== undefined) updateFields.description = description;
        if (price !== undefined) updateFields.price = parseFloat(price) || 0;
        if (name && name.trim()) updateFields.name = name.trim();
        if (serialNo && serialNo.trim()) updateFields.serialNo = serialNo.trim();
        if (brand !== undefined) updateFields.brand = String(brand).trim();
        if (availability !== undefined && availability !== '') updateFields.availability = availability;

        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { returnDocument: 'after', runValidators: true }
        );

        if (product.category && product.category !== finalCategory) {
            await cleanupOrphanedCategory(product.category);
        }

        res.json(updated);
    } catch (err) {
        if (req.files) await destroyImages(buildImageObjects(req.files));
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted)
            return res.status(404).json({ error: 'Product not found' });

        await destroyImages(product.images);

        const categoryToCheck = product.category;

        product.isDeleted = true;
        product.images = [];
        await product.save();

        await cleanupOrphanedCategory(categoryToCheck);

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        next(err);
    }
};