import pool from "../config/db.js";

export const getAllProductsService = async () => {
    const query = `
        SELECT
            p.*,
            b.name AS brand_name,
            c.name AS category_name,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', pv.id,
                        'sku', pv.sku,
                        'purchase_price', pv.purchase_price,
                        'selling_price', pv.selling_price,
                        'attributes', pv.attributes,
                        'image_url', pv.image_url,
                        'current_stock', COALESCE(ls.current_stock, 0)
                    )
                ) FILTER (WHERE pv.id IS NOT NULL),
                '[]'
            ) AS variations
        FROM products p
        LEFT JOIN brands b ON b.id = p.brand_id
        LEFT JOIN categories c ON c.id = p.category_id
        LEFT JOIN product_variations pv ON pv.product_id = p.id
        LEFT JOIN location_stock ls ON ls.variation_id = pv.id
        GROUP BY p.id, b.name, c.name
        ORDER BY p.id;
    `;

    const result = await pool.query(query);
    return result.rows;
};

export const getProductByIDService = async (id) => {
    const query = `
        SELECT
            p.*,
            b.name AS brand_name,
            c.name AS category_name,
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', pv.id,
                        'sku', pv.sku,
                        'purchase_price', pv.purchase_price,
                        'selling_price', pv.selling_price,
                        'attributes', pv.attributes,
                        'image_url', pv.image_url,
                        'current_stock', COALESCE(ls.current_stock, 0)
                    )
                ) FILTER (WHERE pv.id IS NOT NULL),
                '[]'
            ) AS variations
        FROM products p
        LEFT JOIN brands b ON b.id = p.brand_id
        LEFT JOIN categories c ON c.id = p.category_id
        LEFT JOIN product_variations pv ON pv.product_id = p.id
        LEFT JOIN location_stock ls ON ls.variation_id = pv.id
        WHERE p.id = $1
        GROUP BY p.id, b.name, c.name;
    `;

    const result = await pool.query(query);
    return result.rows[0] || null;
};

export const addProductService = async (product, variations = []) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const productQuery = `
            INSERT INTO products (
                name, product_type, barcode_type, unit, brand_id, category_id,
                warranty, tax, manage_stock, alert_quantity, description, image_url
            )
            VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12
            )
            RETURNING *;
        `;

        const productValues = [
            product.name,
            product.product_type || "Variable",
            product.barcode_type || null,
            product.unit || null,
            product.brand_id || null,
            product.category_id || null,
            product.warranty || null,
            product.tax || null,
            product.manage_stock ?? true,
            product.alert_quantity ?? 0,
            product.description || null,
            product.image_url || null
        ];

        const productResult = await client.query(productQuery, productValues);
        const createdProduct = productResult.rows[0];
        const createdVariations = [];

        for (const variation of variations) {
            // 1. Insert the variation
            const variationQuery = `
                INSERT INTO product_variations (
                    product_id, sku, purchase_price, selling_price, attributes, image_url
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const variationResult = await client.query(variationQuery, [
                createdProduct.id,
                variation.sku,
                variation.purchase_price,
                variation.selling_price,
                variation.attributes || {},
                variation.image_url || null
            ]);
            
            const newVariation = variationResult.rows[0];

            // 2. Insert the opening stock (if provided by the frontend)
            if (variation.opening_stock !== undefined && variation.location_id) {
                const stockQuery = `
                    INSERT INTO location_stock (variation_id, location_id, current_stock)
                    VALUES ($1, $2, $3)
                `;
                await client.query(stockQuery, [
                    newVariation.id, 
                    variation.location_id, 
                    variation.opening_stock
                ]);
                
                // Append it to the return object so the frontend sees it immediately
                newVariation.current_stock = variation.opening_stock;
                newVariation.location_id = variation.location_id;
            } else {
                newVariation.current_stock = 0;
            }

            createdVariations.push(newVariation);
        }

        await client.query("COMMIT");

        return {
            ...createdProduct,
            variations: createdVariations
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const addProductVariationService = async (productId, variation) => {
    const client = await pool.connect();
    
    try {
        await client.query("BEGIN");
        
        const query = `
            INSERT INTO product_variations (
                product_id, sku, purchase_price, selling_price, attributes, image_url
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        
        const result = await client.query(query, [
            productId,
            variation.sku,
            variation.purchase_price,
            variation.selling_price,
            variation.attributes || {},
            variation.image_url || null
        ]);
        
        const newVariation = result.rows[0];
        
        // Also handle stock here, in case they add stock when adding a new SKU
        if (variation.opening_stock !== undefined && variation.location_id) {
            const stockQuery = `
                INSERT INTO location_stock (variation_id, location_id, current_stock)
                VALUES ($1, $2, $3)
            `;
            await client.query(stockQuery, [
                newVariation.id, 
                variation.location_id, 
                variation.opening_stock
            ]);
            newVariation.current_stock = variation.opening_stock;
        }

        await client.query("COMMIT");
        return newVariation;
        
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const updateVariationByIDService = async (variationId, updates) => {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = ['sku', 'purchase_price', 'selling_price', 'attributes', 'image_url'];

    for (const field of allowedFields) {
        if (updates[field] !== undefined) {
            fields.push(`${field} = $${paramIndex}`);
            values.push(updates[field]);
            paramIndex++;
        }
    }

    if (fields.length === 0) return null;

    values.push(variationId);

    const query = `
        UPDATE product_variations
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
};

export const deleteProductByIDService = async (id) => {
    const query = `DELETE FROM products WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};

export const deleteVariationService = async (variationId) => {
    const query = `DELETE FROM product_variations WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [variationId]);
    return result.rows[0] || null;
};