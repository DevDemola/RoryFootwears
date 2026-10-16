/* =========================================================
   Rory Footwear — store configuration & catalog
   Edit this file to change prices, products and settings.
   ========================================================= */

window.RW_CONFIG = {
  brand: "Rory Footwear",
  tagline: "Step Up Your Style",
  currency: "NGN",
  // Paystack PUBLIC key (starts with pk_live_ or pk_test_). Leave the placeholder
  // to run checkout in demo mode.
  paystackPublicKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  // WhatsApp number in international format, digits only.
  whatsapp: "2348143223688",          // 0814 322 3688
  whatsappDisplay: "0814 322 3688",
  tiktok: "rory_footwear1",
  email: "",                           // add your email when ready (optional)
  freeDeliveryThreshold: 50000,
  dispatchCutoffHour: 14, // orders before 2pm (Lagos time) ship same day
  discountCodes: { WELCOME10: 0.10, RORY10: 0.10 },
  // Delivery methods shown at checkout. "lagosOnly" methods are hidden for other states.
  delivery: [
    { id: "lagos", label: "Lagos same / next day", desc: "Order before 2pm for same-day dispatch", fee: 2500, eta: "Same / next day", lagosOnly: true },
    { id: "nationwide", label: "Nationwide delivery", desc: "2–5 working days to any state", fee: 4500, eta: "2–5 working days" },
    { id: "pickup", label: "Pickup in Lagos", desc: "We'll WhatsApp you the pickup details", fee: 0, eta: "Ready within 24 hours", lagosOnly: true }
  ]
};

const SIZES = {
  men: ["40", "41", "42", "43", "44", "45", "46"],
  women: ["36", "37", "38", "39", "40", "41", "42"],
  kids: ["24", "25", "26", "27", "28", "29", "30", "31", "32"]
};

window.RW_PRODUCTS = [
  {
    id: "ikoyi-slide", name: "Ikoyi Tricolour Slide", gender: "men", category: "slides",
    price: 28500, compareAt: 34000, image: "ikoyi-slide.jpg",
    colors: [{ name: "Cognac / White / Wine", hex: "#8a4a24" }],
    sizes: SIZES.men, soldOut: ["46"], stock: 4, tags: ["bestseller"],
    blurb: "Three crossed leather bands over a cushioned black footbed. Slip on, look sharp.",
    details: ["Leather upper bands", "Cushioned moulded footbed", "Non-slip rubber outsole", "Handfinished edges"]
  },
  {
    id: "lekki-toeloop", name: "Lekki Toe-Loop Sandal", gender: "men", category: "sandals",
    price: 32000, image: "lekki-toeloop.jpg",
    colors: [{ name: "Tan", hex: "#a8612b" }],
    sizes: SIZES.men, soldOut: [], stock: 12, tags: ["bestseller", "new"],
    blurb: "A clean toe-loop silhouette in polished tan leather. Easy with trousers or shorts.",
    details: ["Polished leather upper", "Leather-lined footbed", "Toe-loop for a secure step", "Rubber sole"]
  },
  {
    id: "ade-strap", name: "Adé Double-Strap Sandal", gender: "men", category: "sandals",
    price: 38000, image: "ade-strap.jpg",
    colors: [{ name: "Espresso", hex: "#3d1f17" }],
    sizes: SIZES.men, soldOut: ["40"], stock: 9, tags: ["new"],
    blurb: "Leather and woven-texture straps with an adjustable back strap. Weekend to owambe.",
    details: ["Leather + woven straps", "Adjustable buckle back strap", "Padded footbed", "Durable rubber sole"]
  },
  {
    id: "nova-wedge", name: "Nova Platform Wedge", gender: "women", category: "wedges",
    price: 45000, image: "nova-wedge.jpg",
    colors: [{ name: "Nude", hex: "#d9c0aa" }],
    sizes: SIZES.women, soldOut: ["36"], stock: 3, tags: ["bestseller"],
    blurb: "Soft nubuck peep-toe on a light, sculpted platform. Height without the struggle.",
    details: ["Nubuck upper", "Lightweight 7cm platform", "Brass-tone ankle buckle", "Cushioned insole"]
  },
  {
    id: "clara-sandal", name: "Clara Square-Toe Sandal", gender: "women", category: "sandals",
    price: 29500, image: "clara-sandal.jpg",
    colors: [{ name: "Cream", hex: "#efe8dc" }],
    sizes: SIZES.women, soldOut: [], stock: 15, tags: ["new"],
    blurb: "A minimal square-toe sandal on a low block heel. The everyday pair you'll reach for.",
    details: ["Smooth leather straps", "2.5cm block heel", "Adjustable ankle strap", "Padded footbed"]
  },
  {
    id: "mira-slide", name: "Mira Buckle Slide", gender: "women", category: "slides",
    price: 18500, compareAt: 22000, image: "mira-slide.jpg",
    colors: [
      { name: "Caramel", hex: "#c9772f" }, { name: "Sage", hex: "#cfdcc5" },
      { name: "Lilac", hex: "#c9a3cf" }, { name: "Black", hex: "#2b2724" }
    ],
    sizes: SIZES.women, soldOut: ["42"], stock: 20, tags: ["bestseller"],
    blurb: "Sculpted strap, padded square footbed, four colours. Your new go-everywhere slide.",
    details: ["Textured upper", "Padded square footbed", "Flexible sole", "Available in 4 colours"]
  },
  {
    id: "tobi-velcro", name: "Tobi Easy-Strap Sandal", gender: "kids", category: "sandals",
    price: 14500, image: "tobi-velcro.jpg",
    colors: [{ name: "Navy", hex: "#273450" }],
    sizes: SIZES.kids, soldOut: [], stock: 14, tags: ["bestseller"],
    blurb: "Hook-and-loop straps little ones can do themselves. Built for running about.",
    details: ["Soft suede-feel straps", "3 adjustable easy straps", "Grippy rubber sole", "Lightweight"]
  },
  {
    id: "junior-buckle", name: "Junior Double-Buckle", gender: "kids", category: "sandals",
    price: 16000, image: "junior-buckle.jpg",
    colors: [{ name: "Denim Blue", hex: "#3f5675" }],
    sizes: SIZES.kids, soldOut: ["24"], stock: 7, tags: [],
    blurb: "A mini classic: double buckles, cork-look sole and a supportive contoured footbed.",
    details: ["Two adjustable buckles", "Elastic back strap", "Contoured footbed", "Cork-look sole"]
  },
  {
    id: "ivy-bow", name: "Ivy Bow Sandal", gender: "kids", category: "sandals",
    price: 13500, image: "ivy-bow.jpg",
    colors: [{ name: "Tan", hex: "#a46a3a" }],
    sizes: SIZES.kids, soldOut: [], stock: 11, tags: ["new"],
    blurb: "Criss-cross straps topped with a sweet bow. Party-ready, playground-proof.",
    details: ["Criss-cross straps", "Bow detail", "Easy strap closure", "Flexible sole"]
  },
  {
    id: "kemi-cross", name: "Kemi Cross-Strap", gender: "kids", category: "sandals",
    price: 15500, image: "kemi-cross.jpg",
    colors: [{ name: "Brown", hex: "#9a6448" }],
    sizes: SIZES.kids, soldOut: [], stock: 10, tags: [],
    blurb: "Wide cross-over straps and a cushioned wood-look sole. Comfort for growing feet.",
    details: ["Wide cross-over straps", "Buckle back strap", "Cushioned sole", "Treaded grip"]
  }
];

window.RW_CATEGORIES = {
  slides: "Slides", sandals: "Sandals", wedges: "Wedges"
};
