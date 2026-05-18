-- Supabase Database Schema for SkyBeauty Shop
-- Paste this script into your Supabase SQL Editor to initialize all tables, RLS policies, and seed mock data!

-- -------------------------------------------------------------
-- 1. Create Tables
-- -------------------------------------------------------------

-- Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    image TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    tag VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT,
    how_to_use TEXT NOT NULL,
    size VARCHAR(50) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 0.0,
    reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    area_zone VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cod' NOT NULL,
    shipping_cost NUMERIC(10, 2) DEFAULT 60.00 NOT NULL,
    grand_total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER CHECK (quantity > 0) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- -------------------------------------------------------------
-- 2. Row Level Security (RLS) Configuration
-- -------------------------------------------------------------

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products Policies: Public Read, Authenticated Write (Admin)
CREATE POLICY "Allow public read-only access to products" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admin users to manage products" 
ON public.products FOR ALL USING (auth.role() = 'authenticated');

-- Reviews Policies: Public Read, Authenticated Insert
CREATE POLICY "Allow public read-only access to reviews" 
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to write reviews" 
ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Orders & Items Policies: Restrict read to authenticated owner, allow public inserts (anonymous checkouts)
CREATE POLICY "Allow public checkout order creations" 
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public checkout order items creations" 
ON public.order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view their own orders" 
ON public.orders FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- -------------------------------------------------------------
-- 3. Seed Mock Products Data
-- -------------------------------------------------------------

INSERT INTO public.products 
    (id, name, price, original_price, image, images, tag, category, description, how_to_use, size, rating, reviews) 
VALUES
    (
        1, 
        'Hydra Glow Moisturizer', 
        850.00, 
        1200.00, 
        'product-moisturizer.jpg', 
        ARRAY['product-moisturizer.jpg', 'product-serum.jpg', 'product-cleanser.jpg'], 
        'Bestseller', 
        'Skincare', 
        'A lightweight, deeply hydrating moisturizer that locks in moisture for up to 72 hours. Formulated with hyaluronic acid and vitamin E, it leaves your skin plump, dewy, and radiantly healthy. Perfect for all skin types.', 
        'Apply a small amount to clean, dry face and neck. Gently massage in upward circular motions. Use morning and evening for best results.', 
        '50ml', 
        4.8, 
        234
    ),
    (
        2, 
        'Vitamin C Serum', 
        1200.00, 
        NULL, 
        'product-serum.jpg', 
        ARRAY['product-serum.jpg', 'product-moisturizer.jpg', 'product-toner.jpg'], 
        'New', 
        'Skincare', 
        'A potent 20% Vitamin C serum that brightens dull skin, fades dark spots, and evens out skin tone. Enriched with ferulic acid for enhanced antioxidant protection against environmental damage.', 
        'Apply 3-4 drops to clean face before moisturizer. Use in the morning for best antioxidant protection. Always follow with SPF.', 
        '30ml', 
        4.9, 
        189
    ),
    (
        3, 
        'Gentle Foam Cleanser', 
        550.00, 
        NULL, 
        'product-cleanser.jpg', 
        ARRAY['product-cleanser.jpg', 'product-toner.jpg', 'product-facemask.jpg'], 
        NULL, 
        'Cleanser', 
        'A gentle, pH-balanced foaming cleanser that removes impurities and makeup without stripping your skin''s natural moisture barrier. Infused with chamomile and green tea extracts for a soothing cleanse.', 
        'Pump a small amount onto wet hands, lather, and massage onto damp face. Rinse thoroughly with lukewarm water. Use twice daily.', 
        '150ml', 
        4.6, 
        156
    ),
    (
        4, 
        'SPF 50+ Sunscreen', 
        750.00, 
        950.00, 
        'product-sunscreen.jpg', 
        ARRAY['product-sunscreen.jpg', 'product-moisturizer.jpg', 'product-serum.jpg'], 
        NULL, 
        'Skincare', 
        'A broad-spectrum SPF 50+ sunscreen with a lightweight, non-greasy formula that blends seamlessly into all skin tones. Provides superior UVA/UVB protection while keeping your skin hydrated all day.', 
        'Apply generously to face and neck 15 minutes before sun exposure. Reapply every 2 hours or after swimming/sweating.', 
        '60ml', 
        4.7, 
        312
    ),
    (
        5, 
        'Rose Tint Lip Balm', 
        350.00, 
        NULL, 
        'product-lipcare.jpg', 
        ARRAY['product-lipcare.jpg', 'product-facemask.jpg', 'product-eyecream.jpg'], 
        'Popular', 
        'Makeup', 
        'A nourishing tinted lip balm that delivers a sheer wash of rose color while deeply moisturizing your lips. Made with organic rosehip oil and beeswax for long-lasting hydration and a natural, healthy glow.', 
        'Apply directly to lips as needed. Can be layered for a more intense color. Perfect for everyday wear.', 
        '4.5g', 
        4.5, 
        98
    ),
    (
        6, 
        'Anti-Aging Eye Cream', 
        980.00, 
        NULL, 
        'product-eyecream.jpg', 
        ARRAY['product-eyecream.jpg', 'product-serum.jpg', 'product-moisturizer.jpg'], 
        NULL, 
        'Skincare', 
        'A rich yet lightweight eye cream that targets fine lines, wrinkles, and dark circles. Powered by retinol and peptide complex, it firms the delicate under-eye area and reduces puffiness for a youthful, refreshed look.', 
        'Gently pat a small amount around the eye area using your ring finger. Use every evening after serum. Avoid direct contact with eyes.', 
        '15ml', 
        4.7, 
        145
    ),
    (
        7, 
        'Hydrating Face Mask', 
        450.00, 
        NULL, 
        'product-facemask.jpg', 
        ARRAY['product-facemask.jpg', 'product-cleanser.jpg', 'product-toner.jpg'], 
        'New', 
        'Skincare', 
        'An intensive hydrating sheet mask infused with hyaluronic acid and aloe vera that delivers a surge of moisture in just 15 minutes. Leaves skin feeling refreshed, plump, and deeply nourished.', 
        'Unfold mask and apply to clean face. Leave on for 15-20 minutes. Remove and gently pat remaining essence into skin. No need to rinse.', 
        '5 sheets', 
        4.4, 
        87
    ),
    (
        8, 
        'Balancing Toner', 
        680.00, 
        NULL, 
        'product-toner.jpg', 
        ARRAY['product-toner.jpg', 'product-cleanser.jpg', 'product-serum.jpg'], 
        NULL, 
        'Skincare', 
        'A balancing toner that gently exfoliates and preps your skin for better absorption of serums and moisturizers. Formulated with witch hazel and salicylic acid to minimize pores and control excess oil.', 
        'After cleansing, pour a small amount onto a cotton pad and sweep across face and neck. Follow with serum and moisturizer.', 
        '200ml', 
        4.6, 
        203
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    image = EXCLUDED.image,
    images = EXCLUDED.images,
    tag = EXCLUDED.tag,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    how_to_use = EXCLUDED.how_to_use,
    size = EXCLUDED.size,
    rating = EXCLUDED.rating,
    reviews = EXCLUDED.reviews;
