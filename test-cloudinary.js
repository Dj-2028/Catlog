// Quick test: verify Cloudinary credentials and upload a tiny test image
require('dotenv').config();
const cloudinary = require('./config/cloudinary');

(async () => {
    console.log('\n=== Cloudinary Config Test ===');
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME || '❌ MISSING');
    console.log('API key:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '❌ MISSING');
    console.log('API secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '❌ MISSING');

    console.log('\nCloudinary SDK config:', {
        cloud_name: cloudinary.config().cloud_name,
        api_key: cloudinary.config().api_key ? '✓' : '❌',
        api_secret: cloudinary.config().api_secret ? '✓' : '❌',
    });

    try {
        console.log('\n=== Testing Upload ===');
        // Upload a 1x1 red pixel (base64) to test credentials + folder creation
        const result = await cloudinary.uploader.upload(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            {
                folder: 'product-catalog/test',
                public_id: 'test-upload-' + Date.now(),
            }
        );
        console.log('\n✅ Upload SUCCESS!');
        console.log('URL:', result.secure_url);
        console.log('Public ID:', result.public_id);
        console.log('Folder:', result.folder);
        console.log('\nCheck your Cloudinary dashboard — you should see a "product-catalog/test" folder now.');

        // Clean up test image
        await cloudinary.uploader.destroy(result.public_id);
        console.log('🗑️  Test image cleaned up.');
    } catch (err) {
        console.error('\n❌ Upload FAILED!');
        console.error('Error:', err.message);
        if (err.http_code) console.error('HTTP code:', err.http_code);
        console.error('\nThis means your Cloudinary credentials are invalid or the account is restricted.');
        console.error('Double-check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
    }
})();
