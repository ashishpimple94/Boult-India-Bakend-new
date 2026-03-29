export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  variants?: Array<{
    name: string;
    price: number;
  }>;
  specifications?: string[];
  directions?: string[];
  benefits?: string[];
  featured?: boolean;
  onSale?: boolean;
  discount?: number;
}

export const products: Product[] = [
  {
    id: 'anti-rust-spray',
    name: 'Anti Rust Spray',
    description: 'Boult Anti Rust Spray is a specially formulated chemical which penetrates, cracks and dissolves the rust by displacing the moisture. Can be used at home, office, factory, automobiles and so forth. Safe on metal, painted surfaces, plastic & rubber.',
    price: 90,
    category: 'spray',
    images: [
      '/Anti-Rust-Spray-500ml-Website-2.png'
    ],
    rating: 4.6,
    reviews: 0,
    variants: [
      { name: '60ml', price: 90 },
      { name: '500ml', price: 425 }
    ],
    specifications: [
      'Penetrates deep through rust clusters and cracks',
      'Displaces moisture and inhibits rust formation',
      'Lubricates metal surfaces',
      'Safe on metal, painted surfaces, plastic & rubber',
      'Easy to apply with handy snorkel tube'
    ],
    directions: [
      'Shake the can thoroughly before use',
      'Hold the can 150-180 mm away from the affected surface',
      'Apply evenly through the nozzle and capillary',
      'Allow few minutes for deep penetration',
      'Reapply if needed'
    ],
    benefits: [
      'Penetrates deep through rust clusters and cracks',
      'Removes rust from rusted nuts and bolts',
      'Displaces moisture and inhibits further rust formation',
      'Lubricates metal surface for smooth movement',
      'Reduces creaking sound',
      'Cleans and lubricates hinges and corroded areas',
      'Easy application with snorkel tube',
      'Works on hard to reach areas'
    ],
    featured: true,
    onSale: false
  },
  {
    id: 'battery-terminal-mask',
    name: 'Battery Terminal Mask',
    description: 'Boult Battery Terminal mask provides a superior coating on the battery terminals and inhibits sulphonation and gives better connectivity and longer battery life.',
    price: 265,
    category: 'mask',
    images: [
      '/Battery-Terminal-Mask-front.png'
    ],
    rating: 4.5,
    reviews: 0,
    variants: [
      { name: '150ml', price: 265 },
      { name: '500ml', price: 675 }
    ],
    specifications: [
      'Provides protective mask on battery terminals',
      'Removes sulphur deposits',
      'Inhibits corrosion due to sulphonation',
      'Improves connectivity',
      'Enhances battery life',
      'No residual effect'
    ],
    directions: [
      'Clean the battery terminals and cables',
      'Shake the can well before use',
      'Spray evenly as a thin coat on the terminals'
    ],
    benefits: [
      'Protective mask on battery terminals',
      'Removes sulphur deposits',
      'Inhibits corrosion and moisture damage',
      'Improves electrical connectivity',
      'Enhances battery life',
      'No residual effect',
      'Easy application',
      'Long-lasting protection'
    ],
    featured: true,
    onSale: false
  },
  {
    id: 'brake-parts-clean',
    name: 'Brake Parts Clean',
    description: 'Boult Brake Cleaner cleans the dirt, oil, and grease from the brake linings, drum, brake disc, shoes, pads and clutch assembly and provides efficient braking.',
    price: 205,
    category: 'cleaner',
    images: [
      '/Brake-Parts-front-clean.png',
      '/Brake-Parts-Clean-backside.png'
    ],
    rating: 4.6,
    reviews: 0,
    variants: [
      { name: '100ml', price: 205 },
      { name: '500ml', price: 435 }
    ],
    specifications: [
      'Cleans brake and clutch assembly',
      'Works on drum & disc brakes',
      'Removes dirt, grease and oil',
      'Ensures efficient braking',
      'Eliminates squealing noise',
      'Safe on all brake components'
    ],
    directions: [
      'Shake well before use and use capillary pipe to spray evenly',
      'Spray evenly to flush the contaminants on the brake parts',
      'Repeat the process if heavily contaminated',
      'Clean the brake parts with a clean cloth after application'
    ],
    benefits: [
      'Cleans brake and clutch assembly',
      'Removes dirt, grease and oil',
      'Ensures efficient braking',
      'Eliminates squealing noise',
      'Works on drum & disc brakes',
      'Cleans brake pads and springs',
      'Professional cleaning power',
      'Improves brake performance'
    ],
    featured: true,
    onSale: false
  },
  {
    id: 'all-in-one-polish',
    name: 'All in One Polish',
    description: 'Premium all-in-one polish for complete car care and shine',
    price: 1800,
    category: 'polish',
    images: [
      '/vkhj.png'
    ],
    rating: 4.8,
    reviews: 0,
    variants: [
      { name: '5 Ltr', price: 1800 }
    ],
    specifications: ['All-in-one formula', 'UV protection', 'Long-lasting shine', 'Water resistant'],
    directions: ['Clean surface', 'Apply thin coat', 'Buff to shine', 'Let dry completely'],
    benefits: ['Complete car care', 'Professional shine', 'UV protection', 'Water resistant', 'Easy application', 'Long-lasting results', 'Protects paint', 'Enhances appearance'],
    featured: true,
    onSale: true,
    discount: 25
  },
  {
    id: 'car-wash-soap',
    name: 'Car Wash Soap',
    description: 'Three levels of cleaning power from moderate to extreme for the wash best suited to your needs. Removes stains, tar, tree sap and even old wax to prep and restore tired surfaces. Fragrance-infused formula creates a pleasant atmosphere for a refreshing car care routine.',
    price: 325,
    category: 'soap',
    images: [
      '/car-wash-soap-1024x1024.png'
    ],
    rating: 4.5,
    reviews: 0,
    variants: [
      { name: '1Ltr', price: 325 },
      { name: '5Ltr', price: 1100 }
    ],
    specifications: [
      'Three levels of cleaning power',
      'Removes stains, tar, and tree sap',
      'Removes old wax buildup',
      'Fragrance-infused formula',
      'Safe for all paint types',
      'Restores tired surfaces'
    ],
    directions: [
      'Dilution Ratio: Mix 1 part Car Wash Soap with 1 part water',
      'Spray evenly on the vehicle surface',
      'Wipe and clean with a soft, clean cloth',
      'Wipe off excess material with a clean dry cloth',
      'Rinse thoroughly with water for best results'
    ],
    benefits: [
      'Three levels of cleaning power',
      'Removes stains and tar',
      'Removes tree sap and old wax',
      'Restores vehicle shine',
      'Fragrance-infused for pleasant experience',
      'Preps surface for protection',
      'Safe for all paint finishes',
      'Professional results at home'
    ],
    featured: true,
    onSale: false
  },
  {
    id: 'chain-clean',
    name: 'Chain Clean',
    description: 'Boult Chain Clean is a superior non-corrosive cleaner which removes the grease and dirt deposits from the chain rim, swing arm and the rollers. Compatible for all types of motorcycle and bicycle chains.',
    price: 220,
    category: 'cleaner',
    images: [
      '/Chain-Clean-front-1024x1024.png'
    ],
    rating: 4.3,
    reviews: 0,
    variants: [
      { name: '100ml', price: 220 },
      { name: '500ml', price: 425 }
    ],
    specifications: [
      'Superior non-corrosive formula',
      'Compatible for all motorcycle chains',
      'Compatible for all bicycle chains',
      'Removes grease and dirt deposits',
      'Cleans chain rim and swing arm',
      'Cleans rollers effectively',
      'Ensures smooth chain running'
    ],
    directions: [
      'Clean the chain with a cloth or brush to remove the dirt',
      'Shake the can thoroughly before use',
      'Apply the spray evenly on the rotating chain',
      'Rotate the rear wheel in reverse direction while spraying',
      'Apply Chain Clean spray on the rollers and chain rim',
      'Remove grease and dirt deposits',
      'Wipe with a dry cloth for best results'
    ],
    benefits: [
      'Compatible for all motorcycle chains',
      'Compatible for all bicycle chains',
      'Removes grease and dirt deposits',
      'Non-corrosive formula',
      'Ensures smooth chain running',
      'Protects chain from rust',
      'Extends chain life',
      'Professional cleaning power'
    ],
    featured: true,
    onSale: false
  },
  {
    id: 'chain-lubricant-spray',
    name: 'Chain Lubricant Spray',
    description: 'Boult Chain Lubricant is a superior chain spray designed to protect the chains against wear and corrosion. The special formulation penetrates the vital parts of the bike chains and provides excellent, long-lasting protection. It is compatible for all types of motorcycle and bicycle chains with (O-ring/ X-ring/ Z-ring) and operates at wide temperature range from -10°C to 150°C.',
    price: 175,
    category: 'lubricant',
    images: [
      '/Chain-Lube-Spray-500ml-2-1024x1024.png'
    ],
    rating: 4.6,
    reviews: 0,
    variants: [
      { name: '100ml', price: 175 },
      { name: '150ml', price: 250 },
      { name: '500ml', price: 550 }
    ],
    specifications: [
      'Superior chain spray formula',
      'Compatible with all motorcycle chains',
      'Compatible with all bicycle chains',
      'Works with O-ring, X-ring, Z-ring chains',
      'Operates at -10°C to 150°C temperature range',
      'Tacky and long-lasting protective layer',
      'Reduces friction and wear',
      'Noiseless chain operation'
    ],
    directions: [
      'Clean the chain surface with Boult Chain Cleaner spray',
      'Shake well before use',
      'Spray with the extension tube evenly from a distance of 6-8 inches',
      'Spray over entire length of the chain',
      'Allow the product to settle for few minutes'
    ],
    benefits: [
      'Provides excellent lubrication on all types of motorcycle and bicycle chains',
      'The tacky & long-lasting protective layer provides superior protection against wear and corrosion',
      'Reduced wear ensures longer life of chains',
      'Reduces the friction and ensures smooth, noiseless working of chains',
      'Compatible with O-ring, X-ring, Z-ring chains',
      'Wide temperature range operation (-10°C to 150°C)',
      'Professional-grade protection',
      'Easy application with extension tube'
    ],
    featured: true,
    onSale: true,
    discount: 15
  },
  {
    id: 'electrical-parts-clean',
    name: 'Electrical Parts Clean',
    description: 'Boult Electrical Parts Clean is designed to clean and restore the electrical components and circuits which are damaged due to moisture and corrosion. Removes oil, dirt and displaces moisture from electrical circuits and connections.',
    price: 275,
    category: 'cleaner',
    images: [
      '/Electrical-Parts-Clean-front-1024x1024.png'
    ],
    rating: 4.4,
    reviews: 0,
    variants: [
      { name: '200ml', price: 275 },
      { name: '500ml', price: 425 }
    ],
    specifications: [
      'Removes oil, dirt and moisture',
      'Protects electrical contacts',
      'Restores electrical connectivity',
      'Non-residual formula',
      'Quickly evaporates',
      'Harmless to plastics and insulators',
      'Safe for all electrical components',
      'Professional-grade cleaner'
    ],
    directions: [
      'Shake the can thoroughly before use',
      'Spray on the circuit board with capillary tube',
      'Should not be used on live circuits',
      'Allow proper drying time',
      'Ensure the circuit is dry before restarting',
      'Use in well-ventilated areas'
    ],
    benefits: [
      'Removes oil, dirt and moisture from circuits',
      'Protects electrical contacts from humidity',
      'Prevents corrosion on connections',
      'Restores electrical connectivity',
      'Non-residual and quickly evaporates',
      'Harmless to plastics and insulators',
      'Professional cleaning power',
      'Extends component life',
      'Improves electrical performance',
      'Safe for sensitive electronics'
    ],
    featured: true,
    onSale: false
  },
  {
    id: 'engine-dresser',
    name: 'Engine Dresser',
    description: 'Boult Engine Dresser removes and cleans the under-bonnet surface of the engine area from dust, oil, and grease. Provides a new, fresh look to the surface under the bonnet. Heat resistant and does not harm the engine and other parts. Suitable for all types of passenger and commercial vehicles.',
    price: 575,
    category: 'dresser',
    images: [
      '/WhatsApp-Image-2025-08-14-at-12.34.25-AM-1-Photoroom.png'
    ],
    rating: 4.5,
    reviews: 0,
    variants: [
      { name: '1Ltr', price: 575 },
      { name: '5Ltr', price: 2750 }
    ],
    specifications: [
      'Removes dust, oil and grease',
      'Heat resistant formula',
      'Water-based formulation',
      'Safe for all engine parts',
      'Suitable for passenger vehicles',
      'Suitable for commercial vehicles',
      'Provides fresh engine appearance',
      'Professional-grade cleaner'
    ],
    directions: [
      'Dilution Ratio: Mix 1 part Engine Dresser with 1 part water',
      'Spray evenly on to the engine surface',
      'Wipe and clean the surface with a soft, clean cloth',
      'Wipe off excess material with a clean dry cloth',
      'Get a new, fresh look on the engine surface',
      'Allow to dry completely before starting engine'
    ],
    benefits: [
      'Removes dust, oil and grease from engine',
      'Cleans under-bonnet surfaces effectively',
      'Heat resistant formula',
      'Does not harm engine parts',
      'Water-based safe formulation',
      'Suitable for all vehicle types',
      'Provides professional appearance',
      'Restores engine shine',
      'Easy to apply and use',
      'Long-lasting cleanliness'
    ],
    featured: false,
    onSale: false
  },
  {
    id: 'engine-oil-flush',
    name: 'Engine Oil Flush',
    description: 'Boult Engine Oil Flush removes oxidised oil deposits from the crank case. Dissolves carbon particles and sludge from restricted oil passages. Eliminates wear caused by carbon deposits and enhances the performance of new engine oil.',
    price: 190,
    category: 'treatment',
    images: [
      '/Engin-oil-flush.png'
    ],
    rating: 4.2,
    reviews: 0,
    variants: [
      { name: '50ml', price: 190 },
      { name: '250ml', price: 510 }
    ],
    specifications: [
      'Removes oxidised oil deposits',
      'Dissolves carbon particles',
      'Removes sludge from oil passages',
      'Eliminates wear from carbon deposits',
      'Enhances new oil performance',
      'Restores peak engine performance',
      'Compatible with mineral oils',
      'Compatible with synthetic oils'
    ],
    directions: [
      'Add Boult Engine Oil Flush to existing engine oil before oil change',
      'Allow engine to run at idle condition for 10-15 minutes',
      'Remove the drain plug and drain old engine oil in warm conditions',
      'Replace with new engine oil and oil filter',
      'Run engine to circulate new oil',
      'Check oil level after running'
    ],
    benefits: [
      'Removes oxidised oil deposits',
      'Dissolves carbon particles effectively',
      'Cleans restricted oil passages',
      'Eliminates wear from carbon buildup',
      'Enhances new oil performance',
      'Restores peak engine performance',
      'Compatible with all oil grades',
      'Improves engine efficiency',
      'Extends engine life',
      'Professional maintenance solution'
    ],
    featured: false,
    onSale: false
  },
  {
    id: 'engine-oil-treatment',
    name: 'Engine Oil Treatment',
    description: 'Boult Engine Oil Additive is equipped with synthetic formulation which forms a stable layer on the engine surfaces which ensures reduced friction and gives ultimate wear protection. Suitable for all types of Bikes, Cars and commercial vehicles and compatible with mineral and synthetic lubricants.',
    price: 500,
    category: 'treatment',
    images: [
      '/Engin-oil-treatment-1024x1024.png'
    ],
    rating: 4.4,
    reviews: 0,
    variants: [
      { name: '50ml (Bikes)', price: 190 },
      { name: '250ml (Cars/SCVs/LCVs)', price: 500 }
    ],
    specifications: [
      'Multi-polar formulation',
      'Smooth engine operation',
      'Quiet engine running',
      'Efficient performance',
      'Anti-oxidation protection',
      'Anti-sludge protection',
      'Anti-varnish protection',
      'Strong anti-wear protection'
    ],
    directions: [
      'Change the older oil with a new oil',
      'Keep the engine running idle for 5 minutes',
      'Add the Boult Engine Oil Additive into the crank case as per the dosage',
      'Keep the engine running again for 5 minutes in idle condition for better results'
    ],
    benefits: [
      'The Multi polar formulation keeps the engine run smooth, quiet and efficient',
      'Protects the engine parts from oxidation, sludge and varnish deposition',
      'Gives strong anti-wear protection',
      'Makes the cold start easier and smoother',
      'Reduces the power loss and helps the fuel efficiency',
      'Suitable for all types of Bikes, Cars and commercial vehicles',
      'Compatible with mineral and synthetic lubricants'
    ],
    featured: false,
    onSale: false
  },
  {
    id: 'four-wheeler-kit',
    name: 'Four Wheeler Kit',
    description: 'Complete car care kit with 6 premium Boult products. Includes Plastic and Fibre Restorer, Anti Rust Spray, Microfiber Cloth, All in One Polish, Windshield Screen Wash, and Car Wash Soap. Everything you need for professional car maintenance and detailing.',
    price: 675,
    category: 'kit',
    images: [
      '/4W-Kit-1-1024x1024.png'
    ],
    rating: 4.7,
    reviews: 0,
    variants: [{ name: 'Bundle', price: 675 }],
    specifications: [
      'Boult Plastic and Fibre Restorer (50ml)',
      'Boult Anti Rust Spray (100ml)',
      'Boult Multi-purpose Microfiber Cloth (1 Unit)',
      'Boult All in One Polish (200ml)',
      'Boult Windshield Screen Wash (50ml x 2)',
      'Boult Car Wash Soap (200ml)',
      '6 products included',
      'Complete car care solution'
    ],
    directions: [
      'Follow individual product instructions',
      'Use products in recommended sequence',
      'Start with cleaning products first',
      'Apply protective products last',
      'Use regularly for best results',
      'Store safely in cool, dry place'
    ],
    benefits: [
      'Revives dull and faded plastic parts',
      'Restores original shine to fibre components',
      'Long-lasting rust and corrosion protection',
      'Premium scratch-free microfiber cloth',
      'Versatile polish for all surfaces',
      'Streak-free windshield cleaning',
      'Gentle car wash soap protects paint',
      'Complete car care in one kit',
      'Professional results at home',
      'Value for money bundle',
      'All essential car care products',
      'Easy to use and apply'
    ],
    featured: true,
    onSale: false
  },
  {
    id: 'microfiber-cloth',
    name: 'Multi Purpose Microfiber Cloth',
    description: 'Premium microfiber cloth with 340 GSM thickness. High density material that is highly absorbent and traps dirt easily. Provides efficient cleaning for all surfaces without scratching.',
    price: 175,
    category: 'cloth',
    images: [
      '/Multi-purpose-Micro-Fiber-Cloth.png'
    ],
    rating: 4.6,
    reviews: 0,
    variants: [{ name: 'Single', price: 175 }],
    specifications: [
      '340 GSM thickness',
      'High density material',
      'Highly absorbent',
      'Traps dirt easily',
      'Scratch-free cleaning',
      'Lint-free finish',
      'Reusable and durable',
      'Multi-purpose use'
    ],
    directions: [
      'Wet the cloth with water or cleaning solution',
      'Wipe the surface gently',
      'For dry cleaning, use directly on surface',
      'Machine washable in cold water',
      'Air dry completely before storage',
      'Do not use fabric softener',
      'Avoid high heat drying'
    ],
    benefits: [
      'Premium 340 GSM thickness',
      'High density absorbs dirt efficiently',
      'Scratch-free cleaning on all surfaces',
      'Lint-free finish',
      'Highly absorbent material',
      'Reusable and durable',
      'Machine washable',
      'Suitable for wet and dry use',
      'Professional-grade quality',
      'Cost-effective solution',
      'Ideal for car, home, and office',
      'Long-lasting performance'
    ],
    featured: false,
    onSale: false
  },
  {
    id: 'plastic-restorer-kit',
    name: 'Plastic and Fibre Restorer Kit',
    description: 'Nano coating restores the original shine on plastic and fibre parts of cars and bikes. Reduces dust pickup and keeps surfaces clean. Easy to apply and quick drying. Includes Restoration Chemical and 2 Sponges for complete restoration.',
    price: 225,
    category: 'restorer',
    images: [
      '/4W-Plastic-and-Fibre-Restorer.png'
    ],
    rating: 4.3,
    reviews: 0,
    variants: [
      { name: '20ml', price: 225 },
      { name: '50ml', price: 375 }
    ],
    specifications: [
      'Nano coating technology',
      'Restores original shine',
      'Reduces dust pickup',
      'Easy to apply',
      'Quick drying formula',
      'Weather resistant',
      'Water resistant',
      'Includes 2 sponges'
    ],
    directions: [
      'Use proper PPE kit for application',
      'Wash and clean the faded surface',
      'Remove dust and contaminants thoroughly',
      'Apply 10ml at a time on the sponge',
      'Allow the chemical to soak into sponge',
      'Gently apply sponge across faded area',
      'Uniformly cover the entire surface',
      'Allow to dry completely',
      'Do not expose to water for at least 24 hours',
      'Store in well-ventilated place'
    ],
    benefits: [
      'Nano coating restores original shine',
      'Revitalizes faded plastic and fibre',
      'Reduces dust pickup significantly',
      'Keeps surfaces clean longer',
      'Easy to apply with included sponges',
      'Quick drying formula',
      'Superior long-lasting coating',
      'Weather resistant protection',
      'Water resistant finish',
      'Professional results at home',
      'Suitable for cars and bikes',
      'Complete restoration kit included'
    ],
    featured: false,
    onSale: false
  },
  {
    id: 'radiator-coolant',
    name: 'Radiator Coolant',
    description: 'Premium radiator coolant that provides effective protection against scaling, rust and corrosion within the cooling system. Equipped with excellent heat transfer properties. Protects against freezing in winter and boil over in summer.',
    price: 275,
    category: 'coolant',
    images: [
      '/bott-1024x1024.png'
    ],
    rating: 4.5,
    reviews: 0,
    variants: [
      { name: '1 Ltr', price: 275 }
    ],
    specifications: [
      'Protects against scaling',
      'Rust and corrosion protection',
      'Excellent heat transfer properties',
      'Prevents freezing in winter',
      'Prevents boil over in summer',
      'Increases engine life',
      'Improves engine performance',
      'Compatible with all vehicles'
    ],
    directions: [
      'Ensure cooling system is clean',
      'Remove any contamination from system',
      'Dilute with potable water at 1:2 ratio',
      'Mix 1 part coolant with 2 parts water',
      'Fill radiator with diluted coolant',
      'Check coolant level regularly',
      'Replace coolant as per vehicle manual'
    ],
    benefits: [
      'Effective scaling protection',
      'Prevents rust formation',
      'Prevents corrosion in cooling system',
      'Excellent heat transfer',
      'Winter freeze protection',
      'Summer boil over prevention',
      'Increases engine life',
      'Improves engine performance',
      'Better cooling efficiency',
      'Professional-grade formula',
      'Long-lasting protection',
      'Compatible with all cooling systems'
    ],
    featured: false,
    onSale: false
  },
  {
    id: 'rat-repellent-spray',
    name: 'Rat Repellent Spray',
    description: 'Effective rat repellent spray that repels rodents from the car engine area and protects cables, wires and rubber parts. Repels rodents for at least 3 months. Environment friendly, non-toxic and safe for human beings. Can be used for interior and exterior areas.',
    price: 80,
    category: 'repellent',
    images: [
      '/boult-raat-repelent.png'
    ],
    rating: 4.2,
    reviews: 0,
    variants: [
      { name: '50ml', price: 80 },
      { name: '200ml', price: 595 }
    ],
    specifications: [
      'Repels rodents effectively',
      'Protects cables and wires',
      'Protects rubber parts',
      'Lasts up to 3 months',
      'Environment friendly',
      'Non-toxic formula',
      'Safe for human beings',
      'Interior and exterior use'
    ],
    directions: [
      'Shake well before use',
      'Applicator must cover nose and mouth with cloth',
      'Spray uniformly on rubber parts',
      'Spray on cables to cover completely',
      'Repeat process for effective coating',
      'Allow to dry before use',
      'Reapply every 3 months for best results'
    ],
    benefits: [
      'Repels rodents from engine area',
      'Protects cables from rodent damage',
      'Protects wires from chewing',
      'Protects rubber parts',
      'Long-lasting 3-month protection',
      'Environment friendly formula',
      'Non-toxic and safe',
      'Safe for human beings',
      'Can be used indoors and outdoors',
      'Prevents costly repairs',
      'Easy to apply',
      'Cost-effective solution'
    ],
    featured: false,
    onSale: false
  },
  {
    id: 'spray-paint',
    name: 'Spray Paint',
    description: 'Boult Spray Paint is a high quality 100% acrylic paint which offers strong compatibility with most types of paints. Can be used on wood, metal, steel, glass, plaster, ceramics, stone, and fabric. Provides smooth coverage, fast drying, and excellent corrosion resistance.',
    price: 300,
    category: 'paint',
    images: [
      '/spray-paint-front.png',
      '/Spray-Paint-backside.png'
    ],
    rating: 4.4,
    reviews: 0,
    variants: [
      { name: 'Regular', price: 300 },
      { name: 'Heat Resistant', price: 375 }
    ],
    specifications: [
      '100% acrylic paint',
      'Compatible with most paints',
      'Smooth and excellent coverage',
      'Fast drying formula',
      'Consistent coats',
      'Excellent corrosion resistance',
      'Heat and cold protection',
      'Durable against mechanical agents'
    ],
    directions: [
      'Clean surface from moisture, dust, grease and wax',
      'Carefully tape over non-paintable areas',
      'Use appropriate PPE (gloves and mask)',
      'Shake well before application',
      'Spray from 15-18 cm away from surface',
      'Allow 4-5 minutes between coats',
      'Remove splashes immediately with spirit or petrol',
      'Do not use on engine, gears or brakes'
    ],
    benefits: [
      'High quality 100% acrylic paint',
      'Compatible with most paint types',
      'Suitable for multiple surfaces',
      'Smooth and excellent coverage',
      'Fast drying time',
      'Consistent coat application',
      'Excellent corrosion resistance',
      'Heat and cold protection',
      'Durable against mechanical agents',
      'Chemical resistant',
      'Professional finish',
      'Long-lasting protection'
    ],
    featured: false,
    onSale: false
  },
  {
    id: 'throttle-carburettor-clean',
    name: 'Throttle and Carburettor Clean',
    description: 'Boult Throttle and Carburettor Clean is designed to provide superior cleaning formula which penetrates and flushes the carbon, varnish and gum deposits from the Throttle Body, carburettor and injectors which delivers optimum fuel, restores the engine power and enhances the fuel economy.',
    price: 225,
    category: 'cleaner',
    images: [
      '/Throttle-and-Carburettor-Clean-500ml-Website-2.png'
    ],
    rating: 4.6,
    reviews: 0,
    variants: [
      { name: '100ml', price: 225 },
      { name: '150ml', price: 280 },
      { name: '500ml', price: 425 }
    ],
    specifications: [
      'Cleans stubborn gummy deposits',
      'Penetrates throttle assembly',
      'Flushes carburettor deposits',
      'Cleans fuel pump injectors',
      'Improves fuel atomisation',
      'Ensures complete fuel combustion',
      'Restores engine power',
      'Oxygen sensor safe formula'
    ],
    directions: [
      'Hold the can 8 to 10 inches from the surface',
      'Ensure proper ventilation',
      'Spray and flush the exterior of throttle plate assembly',
      'Allow to dry for 30 minutes',
      'When dry, start the engine',
      'Spray short bursts into throttle plate assembly',
      'If engine stalls, stop spraying and restart it',
      'Continue until entire liquid is drawn off'
    ],
    benefits: [
      'Cleans stubborn gummy deposits',
      'Penetrates throttle assembly effectively',
      'Flushes carburettor deposits',
      'Cleans fuel pump injectors',
      'Improves fuel atomisation',
      'Ensures complete fuel combustion',
      'Restores engine power',
      'Enhances fuel economy',
      'Highly effective formula',
      'Easy to apply',
      'Longer shelf life',
      'Oxygen sensor safe'
    ],
    featured: true,
    onSale: false
  },
  {
    id: 'two-wheeler-kit',
    name: 'Two Wheeler Kit',
    description: 'Complete bike care kit with 5 premium Boult products. Includes Chain Lubricant Spray, Plastic and Fibre Restorer, Anti Rust Spray, Multi-purpose Microfiber Cloth, and Spray n Shine. Everything you need for professional bike maintenance and detailing.',
    price: 600,
    category: 'kit',
    images: [
      '/2W-Kit-1-1024x1024.png'
    ],
    rating: 4.7,
    reviews: 0,
    variants: [{ name: 'Bundle', price: 600 }],
    specifications: [
      'Boult Chain Lubricant Spray (150ml)',
      'Boult Plastic and Fibre Restorer (20ml)',
      'Boult Anti Rust Spray (100ml)',
      'Boult Multi-purpose Microfiber Cloth (1 Unit)',
      'Boult Spray n Shine (100ml)',
      '5 products included',
      'Complete bike care solution'
    ],
    directions: [
      'Follow individual product instructions',
      'Use products in recommended sequence',
      'Start with cleaning products first',
      'Apply protective products last',
      'Use regularly for best results',
      'Store safely in cool, dry place'
    ],
    benefits: [
      'High-performance chain lubricant reduces friction',
      'Ensures smooth and long-lasting chain operation',
      'Restores original shine to plastic and fiber',
      'Gives vehicle renewed look',
      'Protects metal parts from corrosion and rust',
      'Ideal for long-term maintenance',
      'Ultra-soft microfiber cloth for scratch-free cleaning',
      'Perfect for polishing and dusting',
      'Quick detailing spray for glossy finish',
      'Removes light dust and smudges',
      'Complete bike care in one kit',
      'Professional results at home'
    ],
    featured: true,
    onSale: false
  },
  {
    id: 'windshield-screen-wash',
    name: 'Windshield Screen Wash',
    description: 'Removes and cleans the dirt, deposits and pollutants from the windshield. Anti-smear formula provides clear visibility while driving. Compatible for all types of seasons. Protects the wiper and increases its life. Provides safety and comfort.',
    price: 50,
    category: 'wash',
    images: [
      '/windsheild-wash-1024x1024.png'
    ],
    rating: 4.5,
    reviews: 0,
    variants: [
      { name: '50ml Bottle', price: 50 },
      { name: '50ml Pouch', price: 25 }
    ],
    specifications: [
      'Removes dirt and deposits',
      'Removes pollutants from windshield',
      'Anti-smear formula',
      'Provides clear visibility',
      'Compatible for all seasons',
      'Protects wiper blades',
      'Increases wiper life',
      'Provides safety and comfort'
    ],
    directions: [
      'Pour the contents into the windshield water tank',
      'Then pour water into the tank up to the level',
      'Use the windshield trigger intermittently',
      'Give clean windshield with each use',
      'Refill tank as needed'
    ],
    benefits: [
      'Removes dirt and deposits effectively',
      'Removes pollutants from windshield',
      'Anti-smear formula for clear visibility',
      'Provides crystal clear view while driving',
      'Compatible for all types of seasons',
      'Protects wiper blades from damage',
      'Increases wiper blade life',
      'Provides safety while driving',
      'Provides comfort and convenience',
      'Easy to use and apply',
      'Affordable solution',
      'Long-lasting protection'
    ],
    featured: false,
    onSale: false
  },
  {
    id: 'silencer-coat-matt-black',
    name: 'Silencer Coat Matt Black',
    description: 'Boult Silencer Coat provides a superior long-lasting coating on silencer metal surfaces and protects them from rust and corrosion. Resistant to heat up to 500-600°C and water/salt corrosion. Fast drying and easy to use.',
    price: 290,
    category: 'coating',
    images: [
      '/Silencer-Coat-matt-black-front-1024x1024.png'
    ],
    rating: 4.5,
    reviews: 0,
    variants: [
      { name: '150ml', price: 290 },
      { name: '200ml', price: 375 }
    ],
    specifications: [
      'Long-lasting coating',
      'Rust and corrosion protection',
      'Heat resistant up to 500-600°C',
      'Water resistant',
      'Salt corrosion resistant',
      'Fast drying formula',
      'Easy to apply',
      'Matt black finish'
    ],
    directions: [
      'Surface should be free from dust, moisture and grease',
      'Shake well before use until agitator ball moves freely',
      'Spray evenly to provide uniform coat',
      'Apply 2nd coat after 10 minutes',
      'Allow initial coat to dry completely',
      'Use in well-ventilated area',
      'Wear appropriate PPE'
    ],
    benefits: [
      'Provides long-lasting protection',
      'Prevents rust formation',
      'Prevents corrosion on metal',
      'Heat resistant up to 500-600°C',
      'Water resistant coating',
      'Salt corrosion resistant',
      'Fast drying time',
      'Easy to apply',
      'Professional matt black finish',
      'Protects silencer surfaces',
      'Extends silencer life',
      'Cost-effective solution'
    ],
    featured: false,
    onSale: false
  },
  {
    id: 'silencer-coat-silver',
    name: 'Silencer Coat Silver',
    description: 'Boult Silencer Coat Silver provides a superior long-lasting coating on silencer metal surfaces and protects them from rust and corrosion. Resistant to heat up to 500-600°C and water/salt corrosion. Fast drying and easy to use with professional silver finish.',
    price: 290,
    category: 'coating',
    images: [
      '/Silencer-Coat-silver-front-1024x1024.png'
    ],
    rating: 4.5,
    reviews: 0,
    variants: [
      { name: '150ml', price: 290 },
      { name: '400ml', price: 375 }
    ],
    specifications: [
      'Long-lasting coating',
      'Rust and corrosion protection',
      'Heat resistant up to 500-600°C',
      'Water resistant',
      'Salt corrosion resistant',
      'Fast drying formula',
      'Easy to apply',
      'Silver finish'
    ],
    directions: [
      'Surface should be free from dust, moisture and grease',
      'Shake well before use until agitator ball moves freely',
      'Spray evenly to provide uniform coat',
      'Apply 2nd coat after 10 minutes',
      'Allow initial coat to dry completely',
      'Use in well-ventilated area',
      'Wear appropriate PPE'
    ],
    benefits: [
      'Provides long-lasting protection',
      'Prevents rust formation',
      'Prevents corrosion on metal',
      'Heat resistant up to 500-600°C',
      'Water resistant coating',
      'Salt corrosion resistant',
      'Fast drying time',
      'Easy to apply',
      'Professional silver finish',
      'Protects silencer surfaces',
      'Extends silencer life',
      'Cost-effective solution'
    ],
    featured: false,
    onSale: false
  }
];