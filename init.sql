-- 1. CATEGORIES (Self-referencing for infinite subcategories)
CREATE TABLE categories (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INT REFERENCES categories(id) ON DELETE RESTRICT
);

-- 2. BRANDS
CREATE TABLE brands (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- 3. BUSINESS LOCATIONS
CREATE TABLE business_locations (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT
);

-- 4. PRODUCTS (The Umbrella Data & Fallback Image)
CREATE TABLE products (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product_type VARCHAR(50) DEFAULT 'Variable', 
    barcode_type VARCHAR(50),                    
    unit VARCHAR(50),                            
    brand_id INT REFERENCES brands(id) ON DELETE RESTRICT,
    category_id INT REFERENCES categories(id) ON DELETE RESTRICT,
    warranty VARCHAR(100),                       
    tax VARCHAR(100),                            
    manage_stock BOOLEAN DEFAULT TRUE,           
    alert_quantity INT DEFAULT 0,                
    description TEXT,                            
    image_url TEXT,                              
    brochure_url TEXT                            
);

-- 5. PRODUCT VARIATIONS (The Specific SKUs & Variant Image)
CREATE TABLE product_variations (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL UNIQUE,            
    purchase_price DECIMAL(12, 2) NOT NULL,      
    selling_price DECIMAL(12, 2) NOT NULL,       
    attributes JSONB DEFAULT '{}'::jsonb,
    image_url TEXT
);

-- 6. LOCATION STOCK (Multi-Store Inventory Tracking)
CREATE TABLE location_stock (
    variation_id INT REFERENCES product_variations(id) ON DELETE CASCADE,
    location_id INT REFERENCES business_locations(id) ON DELETE RESTRICT,
    current_stock INT DEFAULT 0,
    PRIMARY KEY (variation_id, location_id),
    CONSTRAINT check_stock_positive CHECK (current_stock >= 0)
);

-- 7. SERIAL NUMBERS (IMEI Tracking for Physical Devices)
CREATE TABLE serial_numbers (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    variation_id INT NOT NULL REFERENCES product_variations(id) ON DELETE CASCADE,
    imei VARCHAR(100) NOT NULL UNIQUE,           
    is_sold BOOLEAN DEFAULT FALSE
);