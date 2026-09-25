import pool from "../config/db.js";

export const getBrandsService = async () => {
    const query = `SELECT * FROM brands ORDER BY id;`;
    const result = await pool.query(query);
    return result.rows;
};

export const getBrandByIDService = async (id) => {
    const query = `SELECT * FROM brands WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};

export const createBrandService = async (name) => {
    const query = `
        INSERT INTO brands (name) 
        VALUES ($1) 
        RETURNING *;
    `;
    const result = await pool.query(query, [name]);
    return result.rows[0];
};

export const updateBrandByIDService = async (id, name) => {
    const query = `
        UPDATE brands 
        SET name = COALESCE($1, name)
        WHERE id = $2 
        RETURNING *;
    `;
    const result = await pool.query(query, [name, id]);
    return result.rows[0] || null;
};

export const deleteBrandByIDService = async (id) => {
    const query = `DELETE FROM brands WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};