const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary is the primary storage. When its credentials are not configured
// (e.g. local development), fall back to local disk storage in public/uploads
// so the admin dashboard keeps working. Production behaviour is unchanged.
const useCloudinary = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

function folderFor(req) {
    return (req.body.category || req.uploadFolder || 'general')
        .toLowerCase()
        .replace(/\s+/g, '-');
}

function buildStorage() {
    if (useCloudinary) {
        return new CloudinaryStorage({
            cloudinary,
            params: async (req, file) => {
                const category = folderFor(req);

                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

                return {
                    folder: `product-catalog/${category}`,
                    public_id: uniqueName,
                    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
                    transformation: [
                        { quality: 'auto', fetch_format: 'auto' },
                    ],
                };
            },
        });
    }

    console.warn('⚠ Cloudinary not configured — using local disk uploads (public/uploads)');
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });

    const disk = multer.diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
            cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        },
    });

    // Wrap disk storage so `file.path` is a public URL (matches the Cloudinary
    // contract used by controllers: url = file.path, public_id = file.filename).
    return {
        _handleFile(req, file, cb) {
            disk._handleFile(req, file, (err, info) => {
                if (err) return cb(err);
                cb(null, { ...info, diskPath: info.path, path: `/uploads/${info.filename}` });
            });
        },
        _removeFile(req, file, cb) {
            fs.unlink(file.diskPath || path.join(uploadDir, file.filename), () => cb(null));
        },
    };
}

const storage = buildStorage();

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    if (allowed.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error('Only image files (jpeg, jpg, png, gif, webp, svg) are allowed'),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

upload.useCloudinary = useCloudinary;

module.exports = upload;