import productMoisturizer from "@/assets/product-moisturizer.jpg";
import productSerum from "@/assets/product-serum.jpg";
import productCleanser from "@/assets/product-cleanser.jpg";
import productSunscreen from "@/assets/product-sunscreen.jpg";
import productLipcare from "@/assets/product-lipcare.jpg";
import productEyecream from "@/assets/product-eyecream.jpg";
import productFacemask from "@/assets/product-facemask.jpg";
import productToner from "@/assets/product-toner.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  tag?: string;
  category: string;
  description: string;
  ingredients: string;
  howToUse: string;
  size: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Hydra Glow Moisturizer",
    price: 850,
    originalPrice: 1200,
    image: productMoisturizer,
    images: [productMoisturizer, productSerum, productCleanser],
    tag: "Bestseller",
    category: "Skincare",
    description: "A lightweight, deeply hydrating moisturizer that locks in moisture for up to 72 hours. Formulated with hyaluronic acid and vitamin E, it leaves your skin plump, dewy, and radiantly healthy. Perfect for all skin types.",
    ingredients: "Aqua, Glycerin, Hyaluronic Acid, Vitamin E, Shea Butter, Niacinamide, Aloe Vera Extract, Jojoba Oil, Cetearyl Alcohol, Phenoxyethanol.",
    howToUse: "Apply a small amount to clean, dry face and neck. Gently massage in upward circular motions. Use morning and evening for best results.",
    size: "50ml",
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 2,
    name: "Vitamin C Serum",
    price: 1200,
    image: productSerum,
    images: [productSerum, productMoisturizer, productToner],
    tag: "New",
    category: "Skincare",
    description: "A potent 20% Vitamin C serum that brightens dull skin, fades dark spots, and evens out skin tone. Enriched with ferulic acid for enhanced antioxidant protection against environmental damage.",
    ingredients: "Ascorbic Acid (Vitamin C) 20%, Ferulic Acid, Vitamin E, Hyaluronic Acid, Purified Water, Ethoxydiglycol.",
    howToUse: "Apply 3-4 drops to clean face before moisturizer. Use in the morning for best antioxidant protection. Always follow with SPF.",
    size: "30ml",
    rating: 4.9,
    reviews: 189,
  },
  {
    id: 3,
    name: "Gentle Foam Cleanser",
    price: 550,
    image: productCleanser,
    images: [productCleanser, productToner, productFacemask],
    category: "Cleanser",
    description: "A gentle, pH-balanced foaming cleanser that removes impurities and makeup without stripping your skin's natural moisture barrier. Infused with chamomile and green tea extracts for a soothing cleanse.",
    ingredients: "Aqua, Cocamidopropyl Betaine, Chamomile Extract, Green Tea Extract, Glycerin, Sodium Cocoyl Isethionate, Allantoin.",
    howToUse: "Pump a small amount onto wet hands, lather, and massage onto damp face. Rinse thoroughly with lukewarm water. Use twice daily.",
    size: "150ml",
    rating: 4.6,
    reviews: 156,
  },
  {
    id: 4,
    name: "SPF 50+ Sunscreen",
    price: 750,
    originalPrice: 950,
    image: productSunscreen,
    images: [productSunscreen, productMoisturizer, productSerum],
    category: "Skincare",
    description: "A broad-spectrum SPF 50+ sunscreen with a lightweight, non-greasy formula that blends seamlessly into all skin tones. Provides superior UVA/UVB protection while keeping your skin hydrated all day.",
    ingredients: "Zinc Oxide, Titanium Dioxide, Niacinamide, Hyaluronic Acid, Vitamin E, Aloe Vera, Aqua, Cyclopentasiloxane.",
    howToUse: "Apply generously to face and neck 15 minutes before sun exposure. Reapply every 2 hours or after swimming/sweating.",
    size: "60ml",
    rating: 4.7,
    reviews: 312,
  },
  {
    id: 5,
    name: "Rose Tint Lip Balm",
    price: 350,
    image: productLipcare,
    images: [productLipcare, productFacemask, productEyecream],
    tag: "Popular",
    category: "Makeup",
    description: "A nourishing tinted lip balm that delivers a sheer wash of rose color while deeply moisturizing your lips. Made with organic rosehip oil and beeswax for long-lasting hydration and a natural, healthy glow.",
    ingredients: "Beeswax, Rosehip Oil, Shea Butter, Vitamin E, Jojoba Oil, Natural Rose Pigment, Coconut Oil.",
    howToUse: "Apply directly to lips as needed. Can be layered for a more intense color. Perfect for everyday wear.",
    size: "4.5g",
    rating: 4.5,
    reviews: 98,
  },
  {
    id: 6,
    name: "Anti-Aging Eye Cream",
    price: 980,
    image: productEyecream,
    images: [productEyecream, productSerum, productMoisturizer],
    category: "Skincare",
    description: "A rich yet lightweight eye cream that targets fine lines, wrinkles, and dark circles. Powered by retinol and peptide complex, it firms the delicate under-eye area and reduces puffiness for a youthful, refreshed look.",
    ingredients: "Retinol, Peptide Complex, Caffeine, Hyaluronic Acid, Vitamin K, Squalane, Aqua, Cetyl Alcohol.",
    howToUse: "Gently pat a small amount around the eye area using your ring finger. Use every evening after serum. Avoid direct contact with eyes.",
    size: "15ml",
    rating: 4.7,
    reviews: 145,
  },
  {
    id: 7,
    name: "Hydrating Face Mask",
    price: 450,
    image: productFacemask,
    images: [productFacemask, productCleanser, productToner],
    tag: "New",
    category: "Skincare",
    description: "An intensive hydrating sheet mask infused with hyaluronic acid and aloe vera that delivers a surge of moisture in just 15 minutes. Leaves skin feeling refreshed, plump, and deeply nourished.",
    ingredients: "Hyaluronic Acid, Aloe Vera Extract, Glycerin, Panthenol, Centella Asiatica, Purified Water, Butylene Glycol.",
    howToUse: "Unfold mask and apply to clean face. Leave on for 15-20 minutes. Remove and gently pat remaining essence into skin. No need to rinse.",
    size: "5 sheets",
    rating: 4.4,
    reviews: 87,
  },
  {
    id: 8,
    name: "Balancing Toner",
    price: 680,
    image: productToner,
    images: [productToner, productCleanser, productSerum],
    category: "Skincare",
    description: "A balancing toner that gently exfoliates and preps your skin for better absorption of serums and moisturizers. Formulated with witch hazel and salicylic acid to minimize pores and control excess oil.",
    ingredients: "Witch Hazel, Salicylic Acid 0.5%, Niacinamide, Green Tea Extract, Rose Water, Glycerin, Aqua.",
    howToUse: "After cleansing, pour a small amount onto a cotton pad and sweep across face and neck. Follow with serum and moisturizer.",
    size: "200ml",
    rating: 4.6,
    reviews: 203,
  },
];

export const getProductById = (id: number): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === slug);
};

export const getProductSlug = (product: { name: string }): string => {
  return product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};
