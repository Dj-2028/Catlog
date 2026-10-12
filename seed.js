require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Service = require('./models/Service');
const Setting = require('./models/Setting');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/catalog';

const CATEGORIES = [
    'Paints',
    'Hardware supplies',
    'Plywood',
    'Sunmica / decorative laminates',
    'Plumbing supplies',
    'Sanitaryware',
    'Electrical supplies',
    'Electronics',
    'Interior-related materials and supplies',
];

const SERVICES = [
    {
        title: 'Hardware & Material Consultation',
        shortDescription: 'Guidance on selecting matching hardware, plywood grades, laminates, and building supplies for your residential or commercial project.',
        description: 'With over 15 years of industry experience, we assist homeowners, carpenters, and contractors in selecting the right materials, structural fittings, and durable interior finishes suited for their specific project needs.',
        icon: 'consult',
        highlights: [
            '15+ years of practical material expertise',
            'Hardware and architectural fitting recommendations',
            'Guidance on moisture-resistant & commercial plywood grades',
            'Friendly, over-the-counter assistance in Jabalpur',
        ],
        ctaLabel: 'Enquire for Consultation',
        isActive: true,
        order: 1,
        image: {
            url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
            public_id: 'seed/consultation',
        },
    },
    {
        title: 'Project Material Sizing & Estimation',
        shortDescription: 'Material estimation and sizing guidance for carpenters, interior contractors, and home builders.',
        description: 'Bring your material requirements or room dimensions — we assist in calculating required sheet counts, hardware quantities, and compatible fittings to help optimize project planning and reduce wastage.',
        icon: 'saw',
        highlights: [
            'Accurate sheet and hardware quantity estimation',
            'Support for custom project requirements',
            'Assistance for modular furniture and interior work',
            'Direct counter consultations',
        ],
        ctaLabel: 'Request Estimation',
        isActive: true,
        order: 2,
        image: {
            url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
            public_id: 'seed/sizing',
        },
    },
    {
        title: 'Bulk Contractor & Project Material Supply',
        shortDescription: 'Reliable supply of building materials, hardware fittings, paints, and sanitaryware for builders and contractors.',
        description: 'We partner with local contractors, builders, and interior specialists to provide reliable supplies of hardware, plywood, plumbing fittings, paints, and electrical materials with dependable order execution.',
        icon: 'truck',
        highlights: [
            'All key building material categories under one roof',
            'Reliable order fulfillment for residential and commercial sites',
            'Coordination with site supervisors and carpenters',
            'Prompt WhatsApp and telephone support',
        ],
        ctaLabel: 'Connect for Project Supply',
        isActive: true,
        order: 3,
        image: {
            url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
            public_id: 'seed/bulk',
        },
    },
    {
        title: 'Job-Site Delivery Coordination',
        shortDescription: 'Local transport coordination for safe and timely dispatch of plywood sheets, hardware, and building supplies.',
        description: 'Careful handling and timely dispatch of heavy hardware boxes, plywood sheets, and interior materials directly to your building site or workshop in Jabalpur.',
        icon: 'delivery',
        highlights: [
            'Careful handling of plywood sheets and fittings',
            'Local dispatch coordination within Jabalpur',
            'Support for multiple building material categories',
            'Direct site coordination',
        ],
        ctaLabel: 'Enquire for Delivery',
        isActive: true,
        order: 4,
        image: {
            url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
            public_id: 'seed/delivery',
        },
    },
];

// Clearly marked sample catalogue items representing the 9 required categories
const PRODUCTS = [
    // 1. Paints
    {
        name: 'Premium Interior & Exterior Emulsion Paint (Sample)',
        serialNo: 'PNT-EMU-001',
        category: 'Paints',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Sample catalogue item. Durable interior and exterior wall emulsion paints offering smooth finish, rich coverage, and protection against weather and dampness. Available in multiple finishes and shades.',
        specifications: {
            'Category': 'Paints',
            'Type': 'Interior & Exterior Emulsion',
            'Finish': 'Smooth Matte / Satin',
            'Pack Sizes': '1L, 4L, 10L, 20L',
            'Application': 'Walls, ceilings, plaster',
            'Note': 'Sample listing - contact store for available shades & current pricing',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/paints-1',
            },
        ],
    },
    {
        name: 'Wood Finish & Enamel Paint Primer (Sample)',
        serialNo: 'PNT-PRM-002',
        category: 'Paints',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Sample catalogue item. High-adhesion primer and synthetic enamel for timber, metal railings, and doors, providing protective undercoating and smooth final gloss.',
        specifications: {
            'Category': 'Paints',
            'Surface': 'Wood & Metal',
            'Drying Time': 'Quick dry formulation',
            'Note': 'Sample listing - please enquire for specifications',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/paints-2',
            },
        ],
    },

    // 2. Hardware supplies
    {
        name: 'Stainless Steel Mortise Door Handles & Lock Set (Sample)',
        serialNo: 'HWD-HDL-001',
        category: 'Hardware supplies',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Sample catalogue item. Premium SS 304 architectural door handles with sturdy mortise latch mechanisms, designed for smooth operation and contemporary aesthetics.',
        specifications: {
            'Category': 'Hardware supplies',
            'Material': 'Stainless Steel',
            'Finish': 'Satin Matt / Antique',
            'Usage': 'Main doors, bedroom doors',
            'Note': 'Sample listing - contact store for models & options',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/hwd-1',
            },
        ],
    },
    {
        name: 'Concealed Auto Hinges & Telescopic Drawer Channels (Sample)',
        serialNo: 'HWD-HNG-002',
        category: 'Hardware supplies',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Sample catalogue item. Soft-closing cabinet hinges and heavy-duty ball bearing drawer slides suitable for modular kitchens, wardrobes, and office storage units.',
        specifications: {
            'Category': 'Hardware supplies',
            'Type': 'Soft Close / Standard',
            'Sizes': '12", 14", 16", 18", 20", 24"',
            'Note': 'Sample listing - contact store for available models',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/hwd-2',
            },
        ],
    },

    // 3. Plywood
    {
        name: 'Boiling Waterproof (BWP) Marine Plywood Sheet (Sample)',
        serialNo: 'PLY-BWP-001',
        category: 'Plywood',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Sample catalogue item. Quality boiling waterproof marine grade plywood bonded with phenolic resin, engineered for high moisture exposure in modular kitchens, wardrobes, and exterior applications.',
        specifications: {
            'Category': 'Plywood',
            'Grade': 'BWP Marine Grade',
            'Thickness': '12 mm, 16 mm, 19 mm',
            'Standard Size': '8 ft x 4 ft (2440 x 1220 mm)',
            'Note': 'Sample listing - contact store for available grades & pricing',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/ply-1',
            },
            {
                url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/ply-1-alt',
            },
        ],
    },
    {
        name: 'Commercial Moisture Resistant (MR) Plywood Sheet (Sample)',
        serialNo: 'PLY-CMR-002',
        category: 'Plywood',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Sample catalogue item. Commercial grade moisture resistant plywood suitable for interior panelling, partition walls, study desks, and dry-area cabinetry.',
        specifications: {
            'Category': 'Plywood',
            'Grade': 'MR Commercial Grade',
            'Thickness': '6 mm, 9 mm, 12 mm, 16 mm, 19 mm',
            'Standard Size': '8 ft x 4 ft',
            'Note': 'Sample listing - contact store for available grades & pricing',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/ply-2',
            },
        ],
    },

    // 4. Sunmica / decorative laminates
    {
        name: 'Decorative Sunmica & High-Pressure Laminates (Sample)',
        serialNo: 'LAM-SUN-001',
        category: 'Sunmica / decorative laminates',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Sample catalogue item. Decorative high-pressure surface laminates available in solid matte, woodgrain textures, high gloss, and stone textures for furniture and wall cladding.',
        specifications: {
            'Category': 'Sunmica / decorative laminates',
            'Thickness': '0.8 mm / 1.0 mm',
            'Sheet Size': '8 ft x 4 ft',
            'Textures': 'Matte, Suede, High Gloss, Timber Grain',
            'Note': 'Sample listing - contact store for catalog books & swatches',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/lam-1',
            },
        ],
    },

    // 5. Plumbing supplies
    {
        name: 'CPVC & PVC Plumbing Pipes and Fittings (Sample)',
        serialNo: 'PLM-PIP-001',
        category: 'Plumbing supplies',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Sample catalogue item. Comprehensive plumbing supplies including hot & cold CPVC pipes, UPVC conduits, brass fittings, ball valves, and sanitary drainage connections.',
        specifications: {
            'Category': 'Plumbing supplies',
            'Material': 'CPVC / UPVC / Brass',
            'Application': 'Residential water distribution, drainage',
            'Sizes': 'Standard diameters available',
            'Note': 'Sample listing - contact store for sizing & details',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/plm-1',
            },
        ],
    },

    // 6. Sanitaryware
    {
        name: 'Ceramic Sanitaryware & Wash Basin Collection (Sample)',
        serialNo: 'SAN-BSN-001',
        category: 'Sanitaryware',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Sample catalogue item. Ceramic bathroom sanitaryware including tabletop wash basins, pedestal sinks, closets, and modern bathroom accessories.',
        specifications: {
            'Category': 'Sanitaryware',
            'Material': 'Vitreous China Ceramic',
            'Finish': 'Glossy White / Matte',
            'Usage': 'Bathroom & wash area',
            'Note': 'Sample listing - visit store or enquire for models',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/san-1',
            },
        ],
    },

    // 7. Electrical supplies
    {
        name: 'Modular Electrical Switches & Surface Accessories (Sample)',
        serialNo: 'ELE-SWT-001',
        category: 'Electrical supplies',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Sample catalogue item. Modular switches, sockets, multi-gang face plates, conduit pipes, and copper wiring supplies for domestic and commercial electrical fitting.',
        specifications: {
            'Category': 'Electrical supplies',
            'Type': 'Modular Switch Systems',
            'Voltage Rating': 'Standard Indian 230V AC',
            'Note': 'Sample listing - contact store for electrical inventory',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/ele-1',
            },
        ],
    },

    // 8. Electronics
    {
        name: 'Electronic Accessories & Control Fittings (Sample)',
        serialNo: 'ELC-ACC-001',
        category: 'Electronics',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Sample catalogue item. Electronic installation fittings, surge protection adapters, and related building electronic supplies for residential setups.',
        specifications: {
            'Category': 'Electronics',
            'Type': 'Electronic Installation Supplies',
            'Application': 'Building & household electronics',
            'Note': 'Sample listing - contact store for current stock',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/elc-1',
            },
        ],
    },

    // 9. Interior-related materials and supplies
    {
        name: 'Interior Decorative Profiles & Moulding Supplies (Sample)',
        serialNo: 'INT-PRF-001',
        category: 'Interior-related materials and supplies',
        brand: 'Standard Grade',
        price: 0,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Sample catalogue item. Decorative louvers, edge banding tapes, wall beading, and interior architectural finishing materials for residential and commercial interiors.',
        specifications: {
            'Category': 'Interior-related materials and supplies',
            'Material': 'Polystyrene / Charcoal Louvers / PVC',
            'Usage': 'Wall panelling, ceiling decor, furniture edges',
            'Note': 'Sample listing - contact store for available patterns',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/int-1',
            },
        ],
    },
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✓ Connected to MongoDB');

        // 1. Categories
        console.log('Seeding categories...');
        for (const catName of CATEGORIES) {
            await Category.findOneAndUpdate(
                { name: catName },
                { name: catName },
                { upsert: true, new: true }
            );
        }
        console.log(`✓ Seeded ${CATEGORIES.length} verified categories`);

        // 2. Services
        console.log('Seeding services...');
        const slugify = require('slugify');
        for (const s of SERVICES) {
            let doc = await Service.findOne({ title: s.title });
            const sSlug = slugify(s.title, { lower: true, strict: true });
            if (doc) {
                Object.assign(doc, s, { slug: doc.slug || sSlug });
                await doc.save();
            } else {
                doc = new Service({ ...s, slug: sSlug });
                await doc.save();
            }
        }
        console.log(`✓ Seeded ${SERVICES.length} store services`);

        // 3. Products
        console.log('Seeding sample products...');
        for (const p of PRODUCTS) {
            const existing = await Product.findOne({ serialNo: p.serialNo });
            if (existing) {
                Object.assign(existing, p, { isDeleted: false });
                await existing.save();
            } else {
                const doc = new Product(p);
                await doc.save();
            }
        }
        console.log(`✓ Seeded ${PRODUCTS.length} sample products across all categories`);

        // 4. Store settings
        await Setting.findOneAndUpdate(
            { key: 'store' },
            {
                key: 'store',
                storeName: 'Shiv Shakti Ply And Hardware',
                tagline: 'Quality Building & Interior Materials | 15+ Years of Experience',
                about: 'With 15+ years of experience, Shiv Shakti Ply And Hardware is an established supplier in Jabalpur providing quality plywood, hardware supplies, paints, decorative laminates, plumbing, sanitaryware, electrical supplies, electronics, and interior materials.',
                established: '15+ Years',
                phone: '7987158644',
                alternatePhone: '',
                whatsapp: '9755672433',
                email: '',
                address: 'Narmada Road, Bhim Nagar, Polipather, Gwarighat, Jabalpur, Madhya Pradesh 482001',
                gstin: '',
                businessHours: [
                    'Open daily from 10:00 AM',
                ],
                mapEmbedUrl: 'https://maps.google.com/maps?q=Shiv+Shakti+Ply+And+Hardware+Narmada+Road+Polipather+Gwarighat+Jabalpur&t=&z=15&ie=UTF8&iwloc=&output=embed',
                mapUrl: 'https://share.google/cPLJQiTvGPre2xRWt',
                socialLinks: {
                    facebook: '',
                    instagram: '',
                    youtube: '',
                    linkedin: '',
                },
            },
            { upsert: true, new: true }
        );
        console.log('✓ Seeded store contact settings for Shiv Shakti Ply And Hardware');

        console.log('\n🎉 Database seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('✗ Seeding error:', err);
        process.exit(1);
    }
}

seed();
