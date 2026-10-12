require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Service = require('./models/Service');
const Setting = require('./models/Setting');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/catalog';

const CATEGORIES = [
    'Plywood',
    'Block Boards & Flush Doors',
    'MDF & HDF Boards',
    'Laminates & Veneers',
    'Door Locks & Handles',
    'Hinges & Drawer Channels',
    'Cabinet & Kitchen Hardware',
    'Adhesives & Sealants',
    'Screws & Fasteners',
    'Edge Bands & Profiles',
];

const SERVICES = [
    {
        title: 'Precision Plywood Cutting',
        shortDescription: 'Computerized panel sizing and custom dimension cutting for plywood, MDF, and block boards with zero edge chipping.',
        description: 'Bring your cutting list or CAD drawings — our in-house heavy-duty panel saws and beam saws deliver millimetre-accurate cuts. Perfect for modular kitchens, wardrobes, and carpentry workshops looking to save labor and reduce on-site dust.',
        icon: 'saw',
        highlights: [
            'Millimeter-accurate cuts on panel saws',
            'Optimal sheet nesting to minimize material wastage',
            'Clean cuts ready for edge banding',
            'Quick turnaround for bulk contractor orders',
        ],
        ctaLabel: 'Request Cutting Estimate',
        isActive: true,
        order: 1,
        image: {
            url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
            public_id: 'seed/cutting',
        },
    },
    {
        title: 'Hardware & Architectural Consultation',
        shortDescription: 'Expert guidance on selecting matching locks, concealed hinges, tandem boxes, and sliding systems for your residential or commercial space.',
        description: 'Choosing the right hardware grade and weight capacity prevents sagging shutters and premature failures. Our hardware specialists assist architects, interior designers, and homeowners with comprehensive hardware scheduling, finish matching, and warranty-backed recommendations.',
        icon: 'consult',
        highlights: [
            'Hardware scheduling for entire floor plans',
            'Finish matching across door, window, and cabinet fittings',
            'Weight-rated hardware calculations',
            'Authorized warranty validation on Godrej, Hafele, & Ebco',
        ],
        ctaLabel: 'Book a Consultation',
        isActive: true,
        order: 2,
        image: {
            url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
            public_id: 'seed/consultation',
        },
    },
    {
        title: 'Modular Furniture Hardware Solutions',
        shortDescription: 'Complete fitting kits for modular kitchens, walk-in closets, soft-close drawers, and concealed hydraulic flap fittings.',
        description: 'Upgrade your cabinetry with premium European soft-close hinges, slim tandem drawers, corner pull-outs, pantry units, and motorized lift systems. We provide complete hardware packages tailored to modern interior workshops.',
        icon: 'cabinet',
        highlights: [
            'Soft-close telescopic & concealed drawer runners',
            'Magic corner & tall larder pantry mechanisms',
            'Heavy-duty hydraulic bed-lift mechanisms',
            'Matching designer profile handles & edge pulls',
        ],
        ctaLabel: 'Enquire for Kitchen Hardware',
        isActive: true,
        order: 3,
        image: {
            url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
            public_id: 'seed/modular',
        },
    },
    {
        title: 'Bulk Project Material Supply',
        shortDescription: 'End-to-end supply of commercial & marine plywood, laminates, and construction fasteners for builders, architects, and interior turn-key contractors.',
        description: 'We partner with construction contractors, commercial interior firms, and hospitality developers to provide seamless bulk material deliveries with guaranteed batch shade consistency and test certificates.',
        icon: 'truck',
        highlights: [
            'Wholesale contractor pricing with tiered volume slabs',
            'Batch-consistent laminate sheets & veneer flitches',
            'BIS / ISI test certificates provided on demand',
            'Dedicated account manager and consolidated billing',
        ],
        ctaLabel: 'Request Contractor Quote',
        isActive: true,
        order: 4,
        image: {
            url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
            public_id: 'seed/bulk',
        },
    },
    {
        title: 'Job-Site Delivery & Unloading',
        shortDescription: 'Dedicated transport fleet equipped for damage-free delivery and direct unloading at your building site or workshop.',
        description: 'Large 8x4 plywood sheets and heavy hardware boxes require careful handling. Our trained loading crew ensures corners and faces remain protected during transit and unloads materials safely to your designated site staging area.',
        icon: 'delivery',
        highlights: [
            'Same-day local dispatch for running hardware items',
            'Protected transport to avoid corner damage on sheets',
            'Experienced handling crew for multi-story unloading',
            'GPS live delivery updates for site supervisors',
        ],
        ctaLabel: 'Check Delivery Areas',
        isActive: true,
        order: 5,
        image: {
            url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
            public_id: 'seed/delivery',
        },
    },
    {
        title: 'Contractor & Carpenter Support Desk',
        shortDescription: 'Dedicated technical desk for carpenters and contractors for sample boards, catalogue books, template jigs, and warranty claims.',
        description: 'We respect craftsmen. We provide physical laminate swatches, hinge drilling templates, technical routing jigs, and instant replacement on verified manufacturing defects so your site work never halts.',
        icon: 'support',
        highlights: [
            'Physical laminate, veneer, and hardware swatch folders',
            'Specialized hinge and lock installation template jigs',
            'Quick warranty claims & over-the-counter replacements',
            'Seasonal contractor loyalty bonus schemes',
        ],
        ctaLabel: 'Connect with Support Desk',
        isActive: true,
        order: 6,
        image: {
            url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
            public_id: 'seed/carpenter',
        },
    },
];

const PRODUCTS = [
    // Plywood
    {
        name: 'Century Club Prime BWP Marine Plywood (IS:710)',
        serialNo: 'PLY-CEN-710-19',
        category: 'Plywood',
        brand: 'CenturyPly',
        price: 3850,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Century Club Prime is a premium boiling waterproof (BWP) marine grade plywood engineered with Glue Line Protection (GLP) technology. Treated against borer and termite attacks with a 30-year warranty, it is the gold standard for kitchens, bathrooms, and exterior furniture.',
        specifications: {
            'Thickness': '19 mm',
            'Sheet Size': '8 ft x 4 ft (2440 x 1220 mm)',
            'Grade': 'BWP Marine (IS:710)',
            'Core Material': '100% Imported Hardwood Timber',
            'Preservative Treatment': 'Patented GLP Technology',
            'Warranty': '30 Years (Manufacturer Covered)',
            'Density': 'Approx. 750 kg/m³',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/ply-1',
            },
            {
                url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/ply-1-alt',
            },
        ],
    },
    {
        name: 'Green Platinum 710 Boiling Waterproof Plywood',
        serialNo: 'PLY-GRN-PLT-16',
        category: 'Plywood',
        brand: 'Greenply',
        price: 3450,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Green Platinum Marine Grade Plywood is 2x fire retardant and un-extended BWP resin bonded. Certified with E-0 emission norms for cleaner indoor air, ideal for luxury wardrobes, kitchens, and wet-zone panelling.',
        specifications: {
            'Thickness': '16 mm',
            'Sheet Size': '8 ft x 4 ft',
            'Grade': 'IS:710 Marine Grade',
            'Fire Retardancy': 'IS:5509 Compliant',
            'Emission Level': 'E-0 Eco Certified',
            'Warranty': '30 Years Replacement',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/ply-2',
            },
        ],
    },
    {
        name: 'Austin Gold Moisture Resistant MR Commercial Plywood (IS:303)',
        serialNo: 'PLY-AUS-MR-12',
        category: 'Plywood',
        brand: 'Austin Plywood',
        price: 2150,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'High-strength commercial grade MR plywood manufactured with selected plantation hardwood and synthetic melamine urea-formaldehyde resin. Perfect for living room wall panelling, study desks, and ceiling battens.',
        specifications: {
            'Thickness': '12 mm',
            'Sheet Size': '8 ft x 4 ft',
            'Grade': 'MR Commercial (IS:303)',
            'Resistance': 'Moisture & Borer Proof',
            'Warranty': '15 Years',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/ply-3',
            },
        ],
    },
    {
        name: 'Shuttering Film Faced Plywood (34 kg / 30 kg)',
        serialNo: 'PLY-SHT-FFP-12',
        category: 'Plywood',
        brand: 'CenturyPly',
        price: 2450,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Mirror-finish phenolic film-faced densified plywood designed specifically for concrete formwork and slab casting. Mirror finish ensures smooth concrete ceilings with up to 25+ re-uses under proper oiling care.',
        specifications: {
            'Thickness': '12 mm',
            'Weight': '34 kg / sheet',
            'Film Coating': '120 GSM Phenolic Dynea Film',
            'Re-use Cycle': 'Up to 25 repetitions',
            'Application': 'RCC Slab & Column Casting',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/shuttering',
            },
        ],
    },

    // MDF & Boards
    {
        name: 'Action TESA HDHMR (High Density High Moisture Resistance) Board',
        serialNo: 'BRD-TES-HDH-18',
        category: 'MDF & HDF Boards',
        brand: 'Action TESA',
        price: 2600,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Action TESA HDHMR is an engineered wood board with density exceeding 850 kg/m³. Distinct green core with superior screw-holding strength, routing capability, and moisture tolerance compared to ordinary MDF.',
        specifications: {
            'Thickness': '18 mm',
            'Sheet Size': '8 ft x 4 ft',
            'Density': '> 850 kg/m³',
            'Core Color': 'Uniform Green Core',
            'Machinability': 'CNC Routing & Carving Friendly',
            'Moisture Resistance': 'High (Kitchen & Bath Vanities)',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/hdhmr',
            },
        ],
    },
    {
        name: 'Greenpanel Exterior Grade High Density MDF Board',
        serialNo: 'BRD-GPN-MDF-12',
        category: 'MDF & HDF Boards',
        brand: 'Greenpanel',
        price: 1750,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Uniform density exterior grade medium-density fibreboard. Free from knots and grain direction, ideal for decorative laser cut jalis, acoustic panels, and CNC membrane doors.',
        specifications: {
            'Thickness': '12 mm',
            'Sheet Size': '8 ft x 4 ft',
            'Density': '750-800 kg/m³',
            'Grade': 'Grade 1 Exterior',
            'Certification': 'FSC Certified Eco-Friendly',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/mdf',
            },
        ],
    },

    // Laminates
    {
        name: 'Merino 1mm High-Pressure Matte Fluted Decorative Laminate',
        serialNo: 'LAM-MER-FLU-01',
        category: 'Laminates & Veneers',
        brand: 'Merino Laminates',
        price: 2100,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Merino 1mm premium decorative HPL featuring tactile fluted flutes and scratch-resistant matte European design. Anti-bacterial surface treatment protects your kitchen shutters and wardrobe shutters from stains and bacteria.',
        specifications: {
            'Thickness': '1.0 mm',
            'Sheet Size': '8 ft x 4 ft (1220 x 2440 mm)',
            'Finish': 'Fluted Matte Texture',
            'Surface Treatment': 'Antibacterial & Anti-Fingerprint',
            'Wear Resistance': '350+ Cycles (EN 438)',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/lam-1',
            },
        ],
    },
    {
        name: 'CenturyLaminates Lucida 1mm High Gloss Acrylic-Feel Sheet',
        serialNo: 'LAM-CEN-LUC-08',
        category: 'Laminates & Veneers',
        brand: 'CenturyPly',
        price: 2750,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Lucida range features mirror-like high gloss finish with abrasive scratch resistance (Scuff Resistant Technology). Gives an expensive acrylic shutter look at a fraction of the cost.',
        specifications: {
            'Thickness': '1.0 mm',
            'Sheet Size': '8 ft x 4 ft',
            'Finish': 'Mirror High Gloss (Lucida)',
            'Color / Texture': 'Bianco Statuario Marble Print',
            'Impact Resistance': 'Heavy Duty High Tensile',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/lam-2',
            },
        ],
    },

    // Door Hardware
    {
        name: 'Godrej Advantis Revolution Smart Digital Door Lock',
        serialNo: 'HWD-GDJ-SMT-01',
        category: 'Door Locks & Handles',
        brand: 'Godrej',
        price: 21500,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Next-generation biometric smart lock with 360° fingerprint scanner, RFID card access, PIN code, manual emergency mechanical key, and mobile app unlocking with OTP generation for guests. Solid stainless steel mortise.',
        specifications: {
            'Access Modes': 'Fingerprint, RFID Card, PIN, Mechanical Key, Mobile App',
            'Fingerprint Capacity': '100 Fingerprints',
            'Door Thickness Compatibility': '35 mm to 65 mm',
            'Power Source': '4 x AA Alkaline Batteries (1 Year Life)',
            'Emergency Power': 'USB-C External Port',
            'Finish': 'Matte Black Ceramic Coat',
            'Warranty': '3 Years Comprehensive On-Site',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/lock-1',
            },
            {
                url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/lock-1-alt',
            },
        ],
    },
    {
        name: 'Dorma Brass Mortise Door Handle Pair with 70mm Brass Cylinder',
        serialNo: 'HWD-DOR-MTH-70',
        category: 'Door Locks & Handles',
        brand: 'Dorma',
        price: 4600,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Heavy solid forged brass rose lever handle pair with dual-finish antique brass and satin brass coat. Supplied with high-security 70mm euro profile brass cylinder and 3 computerised brass keys.',
        specifications: {
            'Material': 'Solid Forged Brass (Grade CuZn40)',
            'Lock Type': 'Euro Profile Mortise Lock Body (72mm C to C)',
            'Keys': '3 Dimple Computerized Brass Keys',
            'Finish': 'Satin Brass / Antique Bronze PVD',
            'Door Suitability': 'Main Entrance & Bedroom Timber Doors',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/handle-1',
            },
        ],
    },
    {
        name: 'Ozone Hydraulic Heavy Duty Floor Spring (120 kg Glass / Timber)',
        serialNo: 'HWD-OZN-FS-120',
        category: 'Door Locks & Handles',
        brand: 'Ozone',
        price: 5200,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Double cylinder hydraulic floor spring designed for heavy toughened glass and wooden pivot doors. Dual speed adjustment (closing speed & latching speed) with 90° hold-open feature.',
        specifications: {
            'Max Door Weight': '120 kg',
            'Max Door Width': '1100 mm',
            'Testing': '5,00,000 Cycles Tested (EN 1154)',
            'Hold Open': '90° Built-in Hold Open',
            'Body Material': 'Cast Iron with SS 304 Cover Plate',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/floor-spring',
            },
        ],
    },

    // Hinges & Channels
    {
        name: 'Hettich Sensys 8645i 110° Integrated Soft-Close Clip-on Hinge',
        serialNo: 'HWD-HET-SEN-110',
        category: 'Hinges & Drawer Channels',
        brand: 'Hettich',
        price: 360,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'German-engineered Sensys soft-closing concealed hinge with damping invisibly integrated into the hinge arm. Shutter closes quietly from an angle of 35° even in temperatures down to +5°C.',
        specifications: {
            'Opening Angle': '110°',
            'Mounting Type': 'Clip-on Base Plate with 3D Cam Adjustment',
            'Door Thickness': '15 mm to 24 mm',
            'Cranking': '0 mm (Full Overlay) / 9.5 mm (Half Overlay)',
            'Corrosion Test': 'Salt Spray 48 Hours Pass',
            'Origin': 'Germany',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/hinge-1',
            },
        ],
    },
    {
        name: 'Ebco Heavy Duty Soft-Close Telescopic Drawer Channel (45 kg)',
        serialNo: 'HWD-EBC-SCT-20',
        category: 'Hinges & Drawer Channels',
        brand: 'Ebco',
        price: 780,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Triple-extension zinc plated ball bearing drawer runners with hydraulic soft-closing damper. Prevents drawer slams and ensures smooth whisper-quiet gliding under full loads.',
        specifications: {
            'Length': '20 Inch (500 mm)',
            'Weight Rating': '45 kg Dynamic Load',
            'Extension': '100% Full Extension',
            'Mechanism': 'Steel Ball Bearings with Hydraulic Buffer',
            'Material': 'Cold Rolled Steel (Electro-Zinc Plated)',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/channel-1',
            },
        ],
    },
    {
        name: 'Hafele Matrix Box Slim A Drawer System (Anthracite 175mm)',
        serialNo: 'HWD-HAF-MTX-175',
        category: 'Cabinet & Kitchen Hardware',
        brand: 'Hafele',
        price: 3200,
        availability: 'limited',
        isFeatured: true,
        isPublished: true,
        description: 'Sleek 13mm straight inner wall tandem box system with synchronised soft-closing concealed slides. Anthracite grey metallic finish matches modern luxury modular kitchens.',
        specifications: {
            'Drawer Height': '175 mm (Pan Drawer)',
            'Slide Length': '500 mm (20 Inch)',
            'Weight Capacity': '40 kg Dynamic Load Capacity',
            'Finish': 'Anthracite Metallic Powder Coat',
            'Adjustment': 'Tool-free 3D Front Adjustment',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/tandem',
            },
        ],
    },

    // Adhesives & Fasteners
    {
        name: 'Fevicol Marine Waterproof Wood Adhesive (5 kg Bucket)',
        serialNo: 'ADH-PID-MAR-05',
        category: 'Adhesives & Sealants',
        brand: 'Fevicol',
        price: 1350,
        availability: 'in_stock',
        isFeatured: true,
        isPublished: true,
        description: 'Advanced waterproof synthetic resin adhesive for marine plywood bonding. Withstands 48 hours of continuous boiling water immersion and 7 days of cold water soaking without bond failure.',
        specifications: {
            'Pack Size': '5 kg Heavy-Duty Bucket',
            'Form': 'Thick White Emulsion',
            'Water Resistance': 'Boiling Water Proof (IS:4835)',
            'Setting Time': '4 to 6 Hours Clamping',
            'Coverage': 'Approx. 50-55 sq.ft per kg',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/fevicol',
            },
        ],
    },
    {
        name: 'Fevicol HeatX Fast Setting Heat-Resistant Adhesive (5 Ltr)',
        serialNo: 'ADH-PID-HTX-05',
        category: 'Adhesives & Sealants',
        brand: 'Fevicol',
        price: 2150,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Specialised contact adhesive with heat resistance up to 170°C. Ideal for fixing laminates in kitchen chimney zones, burner areas, and curved surfaces where spring-back occurs.',
        specifications: {
            'Pack Size': '5 Litre Tin',
            'Heat Resistance': 'Up to 170°C',
            'Open Time': '10 to 15 Minutes Quick Tack',
            'Application': 'Kitchen Countertops & Curved Columns',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/heatx',
            },
        ],
    },
    {
        name: 'Stainless Steel SS 304 Self-Tapping Wood Screws (Box of 500)',
        serialNo: 'FST-GEN-SS304-75',
        category: 'Screws & Fasteners',
        brand: 'General Hardware',
        price: 680,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Deep-threaded countersunk cross-recess wood screws crafted from genuine non-magnetic AISI 304 stainless steel. Guaranteed zero corrosion in coastal zones and wet kitchen environments.',
        specifications: {
            'Size': '8 x 1.5 Inch (38 mm) & 8 x 2.0 Inch (50 mm)',
            'Head Type': 'Phillips Countersunk Flat Head (CSK)',
            'Material Grade': 'AISI 304 Non-Magnetic Stainless Steel',
            'Quantity': '500 Pieces per Sealed Pack',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/screws',
            },
        ],
    },
    {
        name: 'Century Heavy Block Board Pine Wood (IS:1659 BWP Grade)',
        serialNo: 'BRD-CEN-BLK-19',
        category: 'Block Boards & Flush Doors',
        brand: 'CenturyPly',
        price: 3600,
        availability: 'in_stock',
        isFeatured: false,
        isPublished: true,
        description: 'Manufactured with treated imported seasoned New Zealand Pine battens framed with hardwood core and face veneers. Zero warping and outstanding screw holding capacity for long wardrobe doors up to 8 feet.',
        specifications: {
            'Thickness': '19 mm & 25 mm',
            'Sheet Size': '8 ft x 4 ft / 7 ft x 4 ft',
            'Grade': 'BWP Grade (IS:1659)',
            'Core Wood': '100% Seasoned NZ Pine Battens',
            'Warp Resistance': 'Double Dip Treated Anti-Bending',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
                public_id: 'seed/blockboard',
            },
        ],
    },
];

async function seed() {
    try {
        console.log('Connecting to MongoDB:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('✓ Connected');

        // 1. Categories
        for (const catName of CATEGORIES) {
            await Category.findOneAndUpdate(
                { name: catName },
                { name: catName },
                { upsert: true, new: true }
            );
        }
        console.log(`✓ Seeded ${CATEGORIES.length} categories`);

        // Remove old printing categories if present
        const oldPrinting = ['Key Chains', 'Trophies', 'Gift Items', 'Visiting Cards', 'Pamphlets'];
        await Category.deleteMany({ name: { $in: oldPrinting } });

        // 2. Services
        await Service.deleteMany({});
        for (const s of SERVICES) {
            const doc = new Service(s);
            await doc.save();
        }
        console.log(`✓ Seeded ${SERVICES.length} services`);

        // 3. Products
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
        console.log(`✓ Seeded ${PRODUCTS.length} hardware and plywood products`);

        // 4. Store settings
        await Setting.findOneAndUpdate(
            { key: 'store' },
            {
                key: 'store',
                storeName: 'Shree Hardware & Plywood',
                tagline: 'Quality Materials. Reliable Hardware. Built for Every Project.',
                about: 'Established in 1998, Shree Hardware & Plywood is a premier destination for genuine BWP Marine plywood, decorative laminates, architectural door fittings, modular cabinet systems, and heavy-duty building materials. We partner with India’s most trusted brands — CenturyPly, Greenply, Godrej, Dorma, Hettich, Hafele, and Fevicol — serving architects, interior turn-key contractors, carpenters, and homeowners with transparent pricing, technical expertise, and guaranteed quality certificates.',
                established: '1998',
                phone: '+91 98765 43210',
                alternatePhone: '+91 83490 17574',
                whatsapp: '919876543210',
                email: 'sales@shreehardwareply.com',
                address: 'Plot 42, Ring Road Industrial Area, Near Timber Market, Katangi Road, Jabalpur, Madhya Pradesh 482002',
                gstin: '23AAAAA0000A1Z5',
                businessHours: [
                    'Monday - Saturday: 9:00 AM – 8:30 PM',
                    'Sunday: 10:00 AM – 4:00 PM',
                ],
                mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117366.94084724855!2d79.88248386349942!3d23.18146665721151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae1a0fb6f941%3A0x27027d14207f2a1b!2sJabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
                mapUrl: 'https://maps.google.com/?q=Jabalpur+Madhya+Pradesh',
                socialLinks: {
                    facebook: 'https://facebook.com',
                    instagram: 'https://instagram.com',
                    youtube: '',
                    linkedin: '',
                },
            },
            { upsert: true, new: true }
        );
        console.log('✓ Seeded store contact settings');

        console.log('\n🎉 Database seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('✗ Seeding error:', err);
        process.exit(1);
    }
}

seed();
