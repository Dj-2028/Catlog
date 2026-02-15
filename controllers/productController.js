const Product = require('../models/Product');
const { CATEGORIES } = require('../models/Product');
const cloudinary = require('../config/cloudinary');

const SORT_MAP = {
    newest: { dateAdded: -1 },
    oldest: { dateAdded: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name: { name: 1 },
};

function getSortOption(sort) {
    return SORT_MAP[sort] || SORT_MAP.newest;
}

async function destroyImages(images) {
    if (!images || images.length === 0) return;
    const promises = images
        .filter((img) => img.public_id)
        .map((img) =>
            cloudinary.uploader.destroy(img.public_id).catch(() => { })
        );
    await Promise.allSettled(promises);
}

function buildImageObjects(files) {
    if (!files || files.length === 0) return [];
    return files.map((f) => ({
        url: f.path,
        public_id: f.filename,
    }));
}

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

        const [products, totalCount, categories] = await Promise.all([
            Product.find(query)
                .sort(getSortOption(sort))
                .skip(skip)
                .limit(limitNum),
            Product.countDocuments(query),
            Product.distinct('category', {
                isPublished: true,
                isDeleted: { $ne: true },
            }),
        ]);

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
        const { q, category, page = 1, limit = 50, sort } = req.query;
        const query = { isDeleted: { $ne: true } };

        if (category && category !== 'All') query.category = category;
        if (q && q.trim()) {
            query.$or = [
                { name: { $regex: q.trim(), $options: 'i' } },
                { serialNo: { $regex: q.trim(), $options: 'i' } },
            ];
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [products, totalCount] = await Promise.all([
            Product.find(query)
                .sort(getSortOption(sort))
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

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted)
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
        } = req.body;

        const images = buildImageObjects(req.files);

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
            category,
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
        } = req.body;

        let keepImages = [];
        if (existingImages) {
            try {
                keepImages =
                    typeof existingImages === 'string'
                        ? JSON.parse(existingImages)
                        : existingImages;
            } catch {
                keepImages = [];
            }
        }

        const keepPublicIds = keepImages.map((img) => img.public_id);
        const imagesToDestroy = product.images.filter(
            (img) => !keepPublicIds.includes(img.public_id)
        );
        await destroyImages(imagesToDestroy);

        const newImages = buildImageObjects(req.files);
        const finalImages = [...keepImages, ...newImages];
        let specs = product.specifications;
        if (specifications) {
            try {
                specs =
                    typeof specifications === 'string'
                        ? JSON.parse(specifications)
                        : specifications;
            } catch {
            }
        }

        product.name = name || product.name;
        product.description =
            description !== undefined ? description : product.description;
        product.price =
            price !== undefined ? parseFloat(price) || 0 : product.price;
        product.serialNo = serialNo || product.serialNo;
        product.category = category || product.category;
        product.specifications = specs;
        product.isPublished = isPublished === 'true' || isPublished === true;
        product.isFeatured = isFeatured === 'true' || isFeatured === true;
        product.images = finalImages;

        await product.save();
        res.json(product);
    } catch (err) {
        if (req.files) {
            await destroyImages(buildImageObjects(req.files));
        }
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted)
            return res.status(404).json({ error: 'Product not found' });

        await destroyImages(product.images);

        product.isDeleted = true;
        product.images = [];
        await product.save();

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        next(err);
    }
};