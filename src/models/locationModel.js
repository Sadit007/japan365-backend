import pool from "../config/db.js";

export const getLocationsService = async () => {
    const query = `SELECT * FROM business_locations ORDER BY id;`;
    const result = await pool.query(query);
    return result.rows;
};

export const getLocationByIDService = async (id) => {
    const query = `SELECT * FROM business_locations WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};

export const createLocationService = async (name, address) => {
    const query = `
        INSERT INTO business_locations (name, address) 
        VALUES ($1, $2) 
        RETURNING *;
    `;
    const result = await pool.query(query, [name, address]);
    return result.rows[0];
};

export const updateLocationByIDService = async (id, name, address) => {
    const query = `
        UPDATE business_locations 
        SET 
            name = COALESCE($1, name), 
            address = COALESCE($2, address)
        WHERE id = $3 
        RETURNING *;
    `;
    const result = await pool.query(query, [name, address, id]);
    return result.rows[0] || null;
};

export const deleteLocationByIDService = async (id) => {
    const query = `DELETE FROM business_locations WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};