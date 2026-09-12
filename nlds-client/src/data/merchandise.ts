export type ProductCategory =
  "combo" | "tshirt" | "wristband" | "stickers" | "bucket-hat";

export interface SizeChart {
  oversized: string; // image path for oversized chart
  regular: string;   // image path for regular chart
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  shortDescription: string;
  price: number; // in LKR — base/fallback price
  fitPrices?: Record<string, number>; // per-fit price override e.g. { Oversized: 2200, Regular: 1900 }
  images: string[]; // paths relative to /public (up to 3)
  sizes: string[]; // empty array = no size selector
  fitTypes?: string[]; // e.g. ["Oversized", "Regular"] — if set, fit selection is required
  available: boolean;
  itemCode: string;
  badge?: string; // e.g. "BEST VALUE", "LIMITED"
  sizeChart?: SizeChart; // optional size chart images for tshirts
}

export const PRODUCTS: Product[] = [
  {
    id: "combo-001",
    name: "NLDS'26 COMBO PACK",
    category: "combo",
    description:
      "The complete operative kit. Everything you need to gear up for the mission. Includes the official NLDS'26 T-Shirt, wrist band, and sticker pack. Best value for the full NLDS'26 experience.",
    shortDescription:
      "Complete operative kit — T-Shirt, wrist band, & stickers.",
    price: 5500,
    fitPrices: { Oversized: 2200, Regular: 1900 },
    images: ["https://res.cloudinary.com/daamlqcer/image/upload/v1789236358/12_fpvwli.png",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1789236360/13_a2jzmb.png"
    ],
    sizes: ["S", "M", "L", "XL"],
    fitTypes: ["Oversized", "Regular"],
    available: true,
    itemCode: "NLDS26-001",
    badge: "BEST VALUE",
    sizeChart: {
      oversized: "https://res.cloudinary.com/daamlqcer/image/upload/v1789211011/Oversize_dyqjdc.png",
      regular: "https://res.cloudinary.com/daamlqcer/image/upload/v1789211011/Regular_pvxpwb.png",
    },
  },
  {
    id: "tshirt-001",
    name: "NLDS'26 OFFICIAL DELEGATE T-SHIRT",
    category: "tshirt",
    description:
      "Official mission apparel. Premium quality cotton T-Shirt with the Ignite The Leader Within. Wear the mission wherever you go. Limited edition.",
    shortDescription:
      "Official mission apparel. Premium cotton. Limited edition.",
    price: 3500,
    fitPrices: { Oversized: 2100, Regular: 1800 },
    images: [
      "https://res.cloudinary.com/daamlqcer/image/upload/v1789217445/2_gycikk.png",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1789217445/8_tracy0.png",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1789217443/9_mmzmlo.png",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1789217436/3_kz9d4d.png",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1789217451/10_tmstxj.png",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1789217454/11_qtbxql.png",
    ],
    sizes: ["S", "M", "L", "XL"],
    fitTypes: ["Oversized", "Regular"],
    available: false,
    itemCode: "NLDS26-002",
    badge: "COMING SOON",
    sizeChart: {
      oversized: "https://res.cloudinary.com/daamlqcer/image/upload/v1789211011/Oversize_dyqjdc.png",
      regular: "https://res.cloudinary.com/daamlqcer/image/upload/v1789211011/Regular_pvxpwb.png",
    },
  },
  {
    id: "wristband-001",
    name: "NLDS'26 WRIST BAND",
    category: "wristband",
    description:
      "Official silicone wrist band. Compact mission identifier. Wear it as a mark of your commitment to the NLDS'26 mission. One size fits all.",
    shortDescription: "Official mission identifier. One size fits all.",
    price: 350,
    images: ["https://res.cloudinary.com/daamlqcer/image/upload/v1789217450/1_imggci.png"],
    sizes: [], // no size selector needed
    available: false,
    itemCode: "NLDS26-003",
    badge: "COMING SOON",
  },
  {
    id: "stickers-001",
    name: "NLDS'26 STICKER PACK",
    category: "stickers",
    description:
      "NLDS'26 Mission Impossible themed designs. Perfect for laptops, notebooks, and equipment.",
    shortDescription: "Mission themed.",
    price: 150,
    images: ["https://res.cloudinary.com/daamlqcer/image/upload/v1789217449/6_m1a7xc.png",
      "https://res.cloudinary.com/daamlqcer/image/upload/v1789217451/5_hokdcw.png"
    ],
    sizes: [], // no size selector needed
    available: false,
    itemCode: "NLDS26-004",
    badge: "COMING SOON",
  },
  {
    id: "bucket-hat-001",
    name: "NLDS'26 BUCKET HAT",
    category: "bucket-hat",
    description:
      "Official AIESEC bucket hat. premium quality. AIESEC Man embroidered logo. One size fits most.",
    shortDescription:
      "Official operative headgear. Embroidered logo. One size fits most.",
    price: 500,
    images: ["https://res.cloudinary.com/daamlqcer/image/upload/v1789217439/7_px5vlk.png"],
    sizes: [], // one size fits most
    available: false,
    itemCode: "NLDS26-005",
    badge: "COMING SOON",
  },
];

/** Helper: get product by id */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
