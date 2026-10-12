const mongoose = require('mongoose');
const Service = require('../models/Service');
const { destroyImage, fileToImage } = require('../utils/images');

const toBool = (v) => v === true || v === 'true' || v === '1' || v === 'on';

function parseHighlights(value) {
    if (value === undefined) return undefined;
    if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean);
    const str = String(value).trim();
    if (!str) return [];
    if (str.startsWith('[')) {
        try {
            const arr = JSON.parse(str);
            if (Array.isArray(arr)) return arr.map((s) => String(s).trim()).filter(Boolean);
        } catch { /* fall through to newline parsing */ }
    }
    return str.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}

function pickFields(body) {
    const fields = {};
    ['title', 'shortDescription', 'description', 'icon', 'ctaLabel'].forEach((k) => {
        if (body[k] !== undefined) fields[k] = String(body[k]).trim();
    });
    if (body.isActive !== undefined) fields.isActive = toBool(body.isActive);
    if (body.order !== undefined && body.order !== '') {
        const n = parseInt(body.order, 10);
        if (!Number.isNaN(n)) fields.order = n;
    }
    const highlights = parseHighlights(body.highlights);
    if (highlights !== undefined) fields.highlights = highlights;
    return fields;
}

async function findByIdOrSlug(idOrSlug) {
    return mongoose.isValidObjectId(idOrSlug)
        ? Service.findById(idOrSlug)
        : Service.findOne({ slug: idOrSlug });
}

// Used by routes to place uploads in a "services" folder
exports.setUploadFolder = (req, res, next) => {
    req.uploadFolder = 'services';
    next();
};

// GET /api/services  — public: active only. Admin can pass ?all=1
exports.listServices = async (req, res, next) => {
    try {
        const isAdmin = Boolean(req.session && req.session.isAdmin);
        const query = isAdmin && (req.query.all === '1' || req.query.all === 'true') ? {} : { isActive: true };
        const services = await Service.find(query).sort({ order: 1, createdAt: 1 });
        res.json(services);
    } catch (err) {
        next(err);
    }
};

// GET /api/services/:id  (id or slug)
exports.getService = async (req, res, next) => {
    try {
        const service = await findByIdOrSlug(req.params.id);
        const isAdmin = Boolean(req.session && req.session.isAdmin);
        if (!service || (!service.isActive && !isAdmin)) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    } catch (err) {
        next(err);
    }
};

exports.createService = async (req, res, next) => {
    try {
        const fields = pickFields(req.body);
        if (!fields.title) {
            if (req.file) await destroyImage(fileToImage(req.file));
            return res.status(400).json({ error: 'Service title is required' });
        }
        if (fields.order === undefined) {
            const last = await Service.findOne().sort({ order: -1 }).select('order');
            fields.order = last ? last.order + 1 : 0;
        }
        const service = new Service({ ...fields, image: fileToImage(req.file) || undefined });
        await service.save();
        res.status(201).json(service);
    } catch (err) {
        if (req.file) await destroyImage(fileToImage(req.file));
        next(err);
    }
};

// PUT /api/services/:id — accepts multipart (with optional image) or JSON
exports.updateService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            if (req.file) await destroyImage(fileToImage(req.file));
            return res.status(404).json({ error: 'Service not found' });
        }

        const fields = pickFields(req.body);
        if (fields.title !== undefined && !fields.title) {
            if (req.file) await destroyImage(fileToImage(req.file));
            return res.status(400).json({ error: 'Service title is required' });
        }

        const oldImage = service.image && service.image.url
            ? { url: service.image.url, public_id: service.image.public_id }
            : null;
        if (req.file) {
            service.image = fileToImage(req.file);
        } else if (toBool(req.body.removeImage)) {
            service.image = { url: '', public_id: '' };
        }

        Object.assign(service, fields);
        await service.save();

        if (oldImage && (req.file || toBool(req.body.removeImage))) await destroyImage(oldImage);
        res.json(service);
    } catch (err) {
        if (req.file) await destroyImage(fileToImage(req.file));
        next(err);
    }
};

exports.deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ error: 'Service not found' });
        await destroyImage(service.image);
        await service.deleteOne();
        res.json({ message: 'Service deleted successfully', id: req.params.id });
    } catch (err) {
        next(err);
    }
};

// PUT /api/services/reorder  { ids: [id1, id2, ...] }
exports.reorderServices = async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.some((id) => !mongoose.isValidObjectId(id))) {
            return res.status(400).json({ error: 'ids must be an array of service ids' });
        }
        await Service.bulkWrite(
            ids.map((id, index) => ({
                updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
            }))
        );
        const services = await Service.find().sort({ order: 1, createdAt: 1 });
        res.json(services);
    } catch (err) {
        next(err);
    }
};
