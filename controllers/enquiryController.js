const mongoose = require('mongoose');
const Enquiry = require('../models/Enquiry');
const Product = require('../models/Product');
const Service = require('../models/Service');

const TYPES = ['product', 'service', 'quote', 'general'];
const STATUSES = ['new', 'contacted', 'closed'];

const clean = (v, max = 2000) => (v === undefined || v === null ? '' : String(v).trim().slice(0, max));

// POST /api/enquiries — public
exports.createEnquiry = async (req, res, next) => {
    try {
        const body = req.body || {};

        // Honeypot: bots fill hidden "website" field. Pretend success.
        if (body.website) return res.status(201).json({ message: 'Enquiry received' });

        const data = {
            type: TYPES.includes(body.type) ? body.type : 'general',
            name: clean(body.name, 100),
            phone: clean(body.phone, 20),
            email: clean(body.email, 120),
            quantity: clean(body.quantity, 100),
            message: clean(body.message, 2000),
            sourcePage: clean(body.sourcePage, 300),
        };

        // Resolve product/service server-side so names can't be spoofed
        if (body.product && mongoose.isValidObjectId(body.product)) {
            const p = await Product.findOne({ _id: body.product, isDeleted: { $ne: true } }).select('name serialNo');
            if (p) {
                data.product = p._id;
                data.productName = p.serialNo ? `${p.name} (${p.serialNo})` : p.name;
                if (data.type === 'general') data.type = 'product';
            }
        } else if (body.productName) {
            data.productName = clean(body.productName, 200);
        }
        if (body.service && mongoose.isValidObjectId(body.service)) {
            const s = await Service.findById(body.service).select('title');
            if (s) {
                data.service = s._id;
                data.serviceTitle = s.title;
                if (data.type === 'general') data.type = 'service';
            }
        }

        const enquiry = await Enquiry.create(data);
        res.status(201).json({ message: 'Enquiry received', id: enquiry._id });
    } catch (err) {
        next(err);
    }
};

// GET /api/enquiries — admin
exports.listEnquiries = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 50 } = req.query;
        const query = STATUSES.includes(status) ? { status } : {};
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));

        const [enquiries, totalCount, counts] = await Promise.all([
            Enquiry.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
            Enquiry.countDocuments(query),
            Enquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        ]);

        res.json({
            enquiries,
            counts: Object.fromEntries(STATUSES.map((s) => [s, counts.find((c) => c._id === s)?.count || 0])),
            pagination: { page: pageNum, totalPages: Math.ceil(totalCount / limitNum), totalCount },
        });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/enquiries/:id — admin (status update)
exports.updateEnquiry = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { returnDocument: 'after' }
        );
        if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
        res.json(enquiry);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/enquiries/:id — admin
exports.deleteEnquiry = async (req, res, next) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
        res.json({ message: 'Enquiry deleted', id: req.params.id });
    } catch (err) {
        next(err);
    }
};
