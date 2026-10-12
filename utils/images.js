const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

/** Delete a stored image (Cloudinary or local-disk fallback). Never throws. */
async function destroyImage(img) {
    if (!img || !img.public_id) return;
    try {
        if (img.url && img.url.startsWith('/uploads/')) {
            await fs.promises.unlink(
                path.join(__dirname, '..', 'public', 'uploads', path.basename(img.url))
            );
        } else if (!img.public_id.startsWith('seed/')) {
            await cloudinary.uploader.destroy(img.public_id);
        }
    } catch {
        /* ignore */
    }
}

function fileToImage(file) {
    return file ? { url: file.path, public_id: file.filename } : null;
}

module.exports = { destroyImage, fileToImage };
