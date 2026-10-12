const Setting = require('../models/Setting');

const TEXT_FIELDS = [
    'storeName', 'tagline', 'about', 'established', 'phone', 'alternatePhone',
    'whatsapp', 'email', 'address', 'gstin', 'mapEmbedUrl', 'mapUrl',
];
const SOCIAL_FIELDS = ['facebook', 'instagram', 'youtube', 'linkedin'];

const digits = (v) => String(v || '').replace(/\D/g, '');

function serialize(doc) {
    const s = doc.toObject();
    delete s.key;
    delete s.__v;
    // WhatsApp: admin-configured number wins, otherwise fall back to env config
    s.whatsapp = digits(s.whatsapp) || digits(process.env.WHATSAPP_NUMBER);
    return s;
}

// Only allow https Google Maps embeds (rendered in an iframe on the frontend)
function sanitizeEmbedUrl(url) {
    if (!url) return '';
    const str = String(url).trim();
    // Admin may paste the full <iframe ...> snippet — extract the src
    const m = str.match(/src=["']([^"']+)["']/i);
    const src = m ? m[1] : str;
    try {
        const u = new URL(src);
        if (u.protocol === 'https:' && /(^|\.)google\.[a-z.]+$/i.test(u.hostname)) return u.toString();
    } catch { /* invalid */ }
    return '';
}

// GET /api/settings — public
exports.getSettings = async (req, res, next) => {
    try {
        const doc = await Setting.getStore();
        res.json(serialize(doc));
    } catch (err) {
        next(err);
    }
};

// PUT /api/settings — admin
exports.updateSettings = async (req, res, next) => {
    try {
        const body = req.body || {};
        const doc = await Setting.getStore();

        TEXT_FIELDS.forEach((k) => {
            if (body[k] !== undefined) doc[k] = String(body[k]).trim();
        });
        if (body.mapEmbedUrl !== undefined) {
            const safe = sanitizeEmbedUrl(body.mapEmbedUrl);
            if (body.mapEmbedUrl && !safe) {
                return res.status(400).json({ error: 'Map embed must be a Google Maps https embed URL or iframe snippet' });
            }
            doc.mapEmbedUrl = safe;
        }
        if (body.businessHours !== undefined) {
            const hours = Array.isArray(body.businessHours)
                ? body.businessHours
                : String(body.businessHours).split(/\r?\n/);
            doc.businessHours = hours.map((h) => String(h).trim()).filter(Boolean).slice(0, 14);
        }
        if (body.socialLinks && typeof body.socialLinks === 'object') {
            SOCIAL_FIELDS.forEach((k) => {
                if (body.socialLinks[k] !== undefined) {
                    const v = String(body.socialLinks[k]).trim();
                    doc.socialLinks[k] = /^https?:\/\//i.test(v) || !v ? v : `https://${v}`;
                }
            });
        }

        await doc.save();
        res.json(serialize(doc));
    } catch (err) {
        next(err);
    }
};
