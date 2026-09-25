import pool from "../config/db.js";

// 1. RECEIVE STOCK (Add Inventory + IMEIs)

export const receiveStockService = async (variationId, locationId, quantity, imeis = []) => {
    const client = await pool.connect();
    
    try {
        await client.query("BEGIN");

        const stockQuery = `
            INSERT INTO location_stock (variation_id, location_id, current_stock)
            VALUES ($1, $2, $3)
            ON CONFLICT (variation_id, location_id) 
            DO UPDATE SET current_stock = location_stock.current_stock + $3
            RETURNING *;
        `;
        const stockResult = await client.query(stockQuery, [variationId, locationId, quantity]);
        const updatedStock = stockResult.rows[0];

        const insertedImeis = [];
        if (imeis.length > 0) {
            const imeiQuery = `
                INSERT INTO serial_numbers (variation_id, imei, is_sold)
                VALUES ($1, $2, FALSE)
                RETURNING *;
            `;
            for (const imei of imeis) {
                const imeiResult = await client.query(imeiQuery, [variationId, imei]);
                insertedImeis.push(imeiResult.rows[0]);
            }
        }

        await client.query("COMMIT");

        return {
            stock: updatedStock,
            added_imeis: insertedImeis
        };
        
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

// 2. GET AVAILABLE IMEIS (For the Checkout Screen)

export const getAvailableImeisService = async (variationId) => {
    const query = `
        SELECT id, imei 
        FROM serial_numbers 
        WHERE variation_id = $1 AND is_sold = FALSE
        ORDER BY id ASC;
    `;
    const result = await pool.query(query, [variationId]);
    return result.rows;
};

// 3. PROCESS SALE (Deduct Stock + Mark IMEI Sold)

export const processSaleService = async (variationId, locationId, quantity, imeis = []) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Deduct the stock count
        const stockQuery = `
            UPDATE location_stock
            SET current_stock = current_stock - $1
            WHERE variation_id = $2 AND location_id = $3
            RETURNING *;
        `;
        const stockResult = await client.query(stockQuery, [quantity, variationId, locationId]);
        const updatedStock = stockResult.rows[0];

        let soldImeis = [];
        if (imeis.length > 0) {
            const imeiQuery = `
                UPDATE serial_numbers
                SET is_sold = TRUE
                WHERE variation_id = $1 AND imei = ANY($2::text[])
                RETURNING *;
            `;
            const imeiResult = await client.query(imeiQuery, [variationId, imeis]);
            soldImeis = imeiResult.rows;
        }

        await client.query("COMMIT");

        return {
            stock: updatedStock,
            sold_imeis: soldImeis
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};