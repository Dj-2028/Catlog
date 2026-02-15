// Simulate the full admin upload flow: login then create a product with an image
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:3000';

function request(method, urlPath, opts = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(urlPath, BASE);
        const reqOpts = {
            method,
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            headers: { ...opts.headers },
        };
        const req = http.request(reqOpts, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: data,
                });
            });
        });
        req.on('error', reject);
        if (opts.body) req.write(opts.body);
        req.end();
    });
}

(async () => {
    try {
        // Step 1: Login to get session cookie
        console.log('=== Step 1: Login ===');
        const loginBody = 'username=admin&password=admin123';
        const loginRes = await request('POST', '/login', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(loginBody),
            },
            body: loginBody,
        });
        console.log('Login status:', loginRes.status);

        // Extract session cookie
        const cookies = loginRes.headers['set-cookie'];
        if (!cookies) {
            console.error('No cookies returned from login!');
            return;
        }
        const sessionCookie = cookies.map(c => c.split(';')[0]).join('; ');
        console.log('Session cookie:', sessionCookie.substring(0, 50) + '...');

        // Step 2: Create product with image using multipart/form-data
        console.log('\n=== Step 2: Upload Product ===');
        const boundary = '----TestBoundary' + Date.now();
        const imagePath = path.join(__dirname, 'test-pixel.png');
        const imageData = fs.readFileSync(imagePath);

        const fields = [
            { name: 'name', value: 'Upload Test Product' },
            { name: 'serialNo', value: 'TEST-001' },
            { name: 'price', value: '100' },
            { name: 'category', value: 'Key Chains' },
            { name: 'description', value: 'Testing Cloudinary upload' },
            { name: 'isPublished', value: 'true' },
            { name: 'isFeatured', value: 'false' },
        ];

        let body = '';
        for (const f of fields) {
            body += `--${boundary}\r\n`;
            body += `Content-Disposition: form-data; name="${f.name}"\r\n\r\n`;
            body += `${f.value}\r\n`;
        }

        // Add image file
        body += `--${boundary}\r\n`;
        body += `Content-Disposition: form-data; name="images"; filename="test-pixel.png"\r\n`;
        body += `Content-Type: image/png\r\n\r\n`;

        const bodyStart = Buffer.from(body, 'utf-8');
        const bodyEnd = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
        const fullBody = Buffer.concat([bodyStart, imageData, bodyEnd]);

        const uploadRes = await request('POST', '/api/products', {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': fullBody.length,
                'Cookie': sessionCookie,
            },
            body: fullBody,
        });

        console.log('Upload status:', uploadRes.status);
        console.log('Raw response body:', uploadRes.body.substring(0, 1000));
        try {
            const product = JSON.parse(uploadRes.body);
            console.log('Product ID:', product._id);
            console.log('Product name:', product.name);
            console.log('Product images:', JSON.stringify(product.images, null, 2));
            console.log('Image count:', product.images ? product.images.length : 0);
        } catch {
            console.log('Response body:', uploadRes.body.substring(0, 500));
        }

    } catch (err) {
        console.error('Error:', err.message);
    }
})();
