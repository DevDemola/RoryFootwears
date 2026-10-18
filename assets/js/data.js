/* =========================================================
   OAK Footwears — store configuration & catalogue
   Edit this file to change prices, products and settings.
   ========================================================= */

window.RW_CONFIG = {
  brand: "OAK Footwears",
  tagline: "Crafted to be worn",
  currency: "NGN",
  // Paystack PUBLIC key (pk_live_… or pk_test_…). The placeholder runs checkout in demo mode.
  paystackPublicKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  // WhatsApp number in international format, digits only (e.g. 2348012345678)
  whatsapp: "2348000000000",
  whatsappDisplay: "0800 000 0000",
  instagram: "oakfootwears",
  tiktok: "oakfootwears",
  email: "hello@oakfootwears.com",
  city: "Lagos, Nigeria",
  freeDeliveryThreshold: 100000,
  dispatchCutoffHour: 14, // orders before 2pm (Lagos time) ship same day
  discountCodes: { WELCOME10: 0.10, OAK10: 0.10 },
  // Delivery methods shown at checkout. "lagosOnly" methods are hidden for other states.
  delivery: [
    { id: "lagos", label: "Lagos express", desc: "Same / next day · order before 2pm", fee: 3000, eta: "Same / next day", lagosOnly: true },
    { id: "nationwide", label: "Nationwide delivery", desc: "Tracked, 2–5 working days to any state", fee: 5500, eta: "2–5 working days" },
    { id: "pickup", label: "Studio pickup · Lagos", desc: "We'll WhatsApp you the pickup details", fee: 0, eta: "Ready within 24 hours", lagosOnly: true }
  ]
};

const SIZES = {
  men: ["40", "41", "42", "43", "44", "45", "46"],
  women: ["36", "37", "38", "39", "40", "41", "42"],
  kids: ["24", "25", "26", "27", "28", "29", "30", "31", "32"]
};

window.RW_PRODUCTS = [
  {
    id: "aurum-loafer", name: "Aurum Loafer", gender: "men", category: "loafers",
    price: 85000, image: "aurum-loafer.jpg",
    colors: [{ name: "Oxblood", hex: "#5a1f1c" }],
    sizes: SIZES.men, soldOut: ["46"], stock: 4, tags: ["bestseller", "new", "hero"],
    blurb: "Polished oxblood leather finished with a sculpted gold bar. Sharp enough for the boardroom, easy enough for the weekend.",
    details: ["Polished leather upper", "Sculpted gold-tone bar", "Leather-lined, cushioned insole", "Low stacked heel with rubber grip"]
  },
  {
    id: "bordeaux-loafer", name: "Bordeaux Lug Loafer", gender: "women", category: "loafers",
    price: 78000, image: "bordeaux-loafer.jpg",
    colors: [{ name: "Bordeaux", hex: "#7a1c1c" }],
    sizes: SIZES.women, soldOut: ["36"], stock: 6, tags: ["bestseller", "new"],
    blurb: "A glossy penny loafer on a light, chunky lug sole. Adds height and attitude without the weight.",
    details: ["Brush-off glossy leather", "Classic penny strap", "Lightweight lug sole", "Padded leather footbed"]
  },
  {
    id: "suede-cross-slide", name: "Suede Cross Slide", gender: "men", category: "slides",
    price: 42000, image: "suede-cross-slide.jpg",
    colors: [{ name: "Chocolate", hex: "#4a2a1c" }],
    sizes: SIZES.men, soldOut: [], stock: 12, tags: ["bestseller", "new"],
    blurb: "Soft chocolate suede crossed over a cushioned cream footbed, finished with contrast stitching.",
    details: ["Suede cross straps", "Contrast hand-stitch detail", "Cushioned moulded footbed", "Lightweight EVA sole"]
  },
  {
    id: "mocha-thong", name: "Mocha Leather Thong", gender: "men", category: "sandals",
    price: 35000, image: "mocha-thong.jpg",
    colors: [{ name: "Mocha", hex: "#8a5a4a" }],
    sizes: SIZES.men, soldOut: ["40"], stock: 9, tags: ["new"],
    blurb: "A clean, wide-strap thong sandal in smooth mocha leather. The everyday pair that goes with everything.",
    details: ["Smooth leather upper", "Wide padded strap", "Leather-wrapped footbed", "Durable rubber sole"]
  },
  {
    id: "ade-strap", name: "Adé Double-Strap", gender: "men", category: "sandals",
    price: 48000, image: "ade-strap.jpg",
    colors: [{ name: "Espresso", hex: "#3d1f17" }],
    sizes: SIZES.men, soldOut: [], stock: 8, tags: [],
    blurb: "Leather and woven-texture straps with an adjustable back strap. Weekend to owambe.",
    details: ["Leather + woven straps", "Adjustable buckle back strap", "Padded footbed", "Durable rubber sole"]
  },
  {
    id: "lekki-toeloop", name: "Lekki Toe-Loop", gender: "men", category: "sandals",
    price: 42000, image: "lekki-toeloop.jpg",
    colors: [{ name: "Tan", hex: "#a8612b" }],
    sizes: SIZES.men, soldOut: [], stock: 11, tags: ["bestseller"],
    blurb: "A clean toe-loop silhouette in polished tan leather. Easy with trousers or shorts.",
    details: ["Polished leather upper", "Leather-lined footbed", "Toe-loop for a secure step", "Rubber sole"]
  },
  {
    id: "ikoyi-slide", name: "Ikoyi Tricolour Slide", gender: "men", category: "slides",
    price: 38000, compareAt: 45000, image: "ikoyi-slide.jpg",
    colors: [{ name: "Cognac / White / Wine", hex: "#8a4a24" }],
    sizes: SIZES.men, soldOut: ["46"], stock: 5, tags: [],
    blurb: "Three crossed leather bands over a cushioned black footbed. Slip on, look sharp.",
    details: ["Leather upper bands", "Cushioned moulded footbed", "Non-slip rubber outsole", "Hand-finished edges"]
  },
  {
    id: "nova-wedge", name: "Nova Platform Wedge", gender: "women", category: "sandals",
    price: 55000, image: "nova-wedge.jpg",
    colors: [{ name: "Nude", hex: "#d9c0aa" }],
    sizes: SIZES.women, soldOut: ["36"], stock: 3, tags: ["bestseller"],
    blurb: "Soft nubuck peep-toe on a light, sculpted platform. Height without the struggle.",
    details: ["Nubuck upper", "Lightweight 7cm platform", "Brass-tone ankle buckle", "Cushioned insole"]
  },
  {
    id: "clara-sandal", name: "Clara Square-Toe", gender: "women", category: "sandals",
    price: 39500, image: "clara-sandal.jpg",
    colors: [{ name: "Cream", hex: "#efe8dc" }],
    sizes: SIZES.women, soldOut: [], stock: 14, tags: [],
    blurb: "A minimal square-toe sandal on a low block heel. The everyday pair you'll reach for.",
    details: ["Smooth leather straps", "2.5cm block heel", "Adjustable ankle strap", "Padded footbed"]
  },
  {
    id: "mira-slide", name: "Mira Buckle Slide", gender: "women", category: "slides",
    price: 28500, compareAt: 34000, image: "mira-slide.jpg",
    colors: [
      { name: "Caramel", hex: "#c9772f" }, { name: "Sage", hex: "#cfdcc5" },
      { name: "Lilac", hex: "#c9a3cf" }, { name: "Black", hex: "#2b2724" }
    ],
    sizes: SIZES.women, soldOut: ["42"], stock: 18, tags: [],
    blurb: "Sculpted strap, padded square footbed, four colours. Your new go-everywhere slide.",
    details: ["Textured upper", "Padded square footbed", "Flexible sole", "Available in 4 colours"]
  },
  {
    id: "tobi-velcro", name: "Tobi Easy-Strap", gender: "kids", category: "sandals",
    price: 19500, image: "tobi-velcro.jpg",
    colors: [{ name: "Navy", hex: "#273450" }],
    sizes: SIZES.kids, soldOut: [], stock: 14, tags: [],
    blurb: "Hook-and-loop straps little ones can do themselves. Built for running about.",
    details: ["Soft suede-feel straps", "3 adjustable easy straps", "Grippy rubber sole", "Lightweight"]
  },
  {
    id: "junior-buckle", name: "Junior Double-Buckle", gender: "kids", category: "sandals",
    price: 22000, image: "junior-buckle.jpg",
    colors: [{ name: "Denim Blue", hex: "#3f5675" }],
    sizes: SIZES.kids, soldOut: ["24"], stock: 7, tags: [],
    blurb: "A mini classic: double buckles, cork-look sole and a supportive contoured footbed.",
    details: ["Two adjustable buckles", "Elastic back strap", "Contoured footbed", "Cork-look sole"]
  },
  {
    id: "ivy-bow", name: "Ivy Bow Sandal", gender: "kids", category: "sandals",
    price: 18500, image: "ivy-bow.jpg",
    colors: [{ name: "Tan", hex: "#a46a3a" }],
    sizes: SIZES.kids, soldOut: [], stock: 11, tags: [],
    blurb: "Criss-cross straps topped with a sweet bow. Party-ready, playground-proof.",
    details: ["Criss-cross straps", "Bow detail", "Easy strap closure", "Flexible sole"]
  },
  {
    id: "kemi-cross", name: "Kemi Cross-Strap", gender: "kids", category: "sandals",
    price: 21000, image: "kemi-cross.jpg",
    colors: [{ name: "Brown", hex: "#9a6448" }],
    sizes: SIZES.kids, soldOut: [], stock: 10, tags: [],
    blurb: "Wide cross-over straps and a cushioned wood-look sole. Comfort for growing feet.",
    details: ["Wide cross-over straps", "Buckle back strap", "Cushioned sole", "Treaded grip"]
  }
];

window.RW_CATEGORIES = { loafers: "Loafers", slides: "Slides", sandals: "Sandals" };
