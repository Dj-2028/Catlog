require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
    {
        name: 'Premium Metal Key Chain',
        description: 'High-quality zinc alloy key chain with custom logo engraving. Perfect for corporate branding and promotional events. Comes with polished chrome finish and split ring attachment.',
        price: 150,
        serialNo: 'KC-001',
        category: 'Key Chains',
        specifications: { Material: 'Zinc Alloy', Finish: 'Chrome', Size: '5cm x 3cm', Weight: '25g' },
        isPublished: true,
        isFeatured: true,
    },
    {
        name: 'Leather Key Chain with Clip',
        description: 'Elegant genuine leather key chain with metal clip and custom embossing. Available in multiple colors including black, brown, and tan.',
        price: 250,
        serialNo: 'KC-002',
        category: 'Key Chains',
        specifications: { Material: 'Genuine Leather + Metal', Colors: 'Black, Brown, Tan', Size: '8cm x 3cm' },
        isPublished: true,
    },
    {
        name: 'Crystal Star Trophy',
        description: 'Stunning crystal star trophy with 3D laser engraving capability. Ideal for employee recognition, academic achievements, and sports events.',
        price: 1200,
        serialNo: 'TR-001',
        category: 'Trophies',
        specifications: { Material: 'K9 Crystal', Height: '20cm', Base: 'Black Crystal', Engraving: '3D Laser' },
        isPublished: true,
        isFeatured: true,
    },
    {
        name: 'Wooden Shield Plaque',
        description: 'Handcrafted wooden shield plaque with brass accents and engraved nameplate. Traditional design suitable for lifetime achievement awards.',
        price: 800,
        serialNo: 'TR-002',
        category: 'Trophies',
        specifications: { Material: 'Teak Wood + Brass', Height: '30cm', Width: '22cm' },
        isPublished: true,
    },
    {
        name: 'Golden Cup Trophy',
        description: 'Classic gold-plated cup trophy with marble base. A timeless design for sports championships and competition winners.',
        price: 1500,
        serialNo: 'TR-003',
        category: 'Trophies',
        specifications: { Material: 'Metal (Gold Plated)', Height: '35cm', Base: 'Italian Marble' },
        isPublished: true,
    },
    {
        name: 'Personalized Photo Frame',
        description: 'Premium wooden photo frame with custom laser-cut designs. Perfect gift for weddings, anniversaries, and corporate events.',
        price: 450,
        serialNo: 'GI-001',
        category: 'Gift Items',
        specifications: { Material: 'MDF Wood', 'Frame Size': '8x10 inches', Finish: 'Matte Laminated' },
        isPublished: true,
        isFeatured: true,
    },
    {
        name: 'Custom Desk Organizer',
        description: 'Elegant acrylic desk organizer with company branding. Multi-compartment design for pens, cards, and stationery.',
        price: 600,
        serialNo: 'GI-002',
        category: 'Gift Items',
        specifications: { Material: 'Premium Acrylic', Dimensions: '20cm x 12cm x 10cm', Compartments: '4' },
        isPublished: true,
    },
    {
        name: 'Premium Visiting Cards',
        description: 'Luxury visiting cards on 350 GSM art card with matte lamination and spot UV coating. Minimum order 500 pieces.',
        price: 2,
        serialNo: 'VC-001',
        category: 'Visiting Cards',
        specifications: { Paper: '350 GSM Art Card', Finish: 'Matte Lamination + Spot UV', Size: 'Standard 3.5x2 inches', 'Min Order': '500 pcs' },
        isPublished: true,
        isFeatured: true,
    },
    {
        name: 'Metallic Foil Stamped Cards',
        description: 'Premium business cards with gold or silver foil stamping on thick cotton paper. Executive quality for distinguished professionals.',
        price: 5,
        serialNo: 'VC-002',
        category: 'Visiting Cards',
        specifications: { Paper: '600 GSM Cotton', Finish: 'Foil Stamped', Colors: 'Gold, Silver, Rose Gold', 'Min Order': '250 pcs' },
        isPublished: true,
    },
    {
        name: 'Tri-Fold Brochure',
        description: 'Full-color tri-fold brochures on premium glossy paper. Ideal for product catalogs, service menus, and marketing materials.',
        price: 8,
        serialNo: 'PM-001',
        category: 'Pamphlets',
        specifications: { Paper: '170 GSM Art Paper', Finish: 'Glossy Lamination', Size: 'A4 (folded to DL)', 'Min Order': '500 pcs' },
        isPublished: true,
    },
    {
        name: 'A5 Saddle-Stitched Booklet',
        description: 'Professional A5 booklets with saddle-stitch binding. Perfect for product catalogs, price lists, and company profiles.',
        price: 25,
        serialNo: 'PM-002',
        category: 'Pamphlets',
        specifications: { Paper: '130 GSM (inner) + 250 GSM (cover)', Pages: '16 pages', Binding: 'Saddle Stitch', 'Min Order': '250 pcs' },
        isPublished: true,
    },
    {
        name: 'Acrylic Key Chain Set',
        description: 'Custom-shaped acrylic key chains with full-color UV printing. Available in any shape, perfect for anime, mascots, and brand characters.',
        price: 80,
        serialNo: 'KC-003',
        category: 'Key Chains',
        specifications: { Material: 'Clear Acrylic (3mm)', Printing: 'UV Full Color', 'Max Size': '6cm x 6cm' },
        isPublished: true,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productCatalog');
        console.log('✓ Connected to MongoDB');

        await Product.deleteMany({});
        console.log('✓ Cleared existing products');

        const created = [];
        for (const data of sampleProducts) {
            const product = new Product(data);
            await product.save();
            created.push(product);
        }
        console.log(`✓ Seeded ${created.length} products`);

        console.log('\nSeeded products:');
        created.forEach(p => console.log(`  - [${p.serialNo}] ${p.name} (${p.category}) — ₹${p.price}`));

        await mongoose.connection.close();
        console.log('\n✓ Done. Database seeded successfully.');
        process.exit(0);
    } catch (err) {
        console.error('✗ Seed error:', err.message);
        process.exit(1);
    }
}

seed();
