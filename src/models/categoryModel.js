import pool from "../config/db.js";

// ==========================================
// MAIN CATEGORIES
// ==========================================

// Fetches ONLY top-level categories (where parent_id is empty)
export const getCategoriesService = async () => {
    const query = `
        SELECT * FROM categories 
        WHERE parent_id IS NULL 
        ORDER BY id;
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const createCategoryService = async (name) => {
    const query = `
        INSERT INTO categories (name, parent_id) 
        VALUES ($1, NULL) 
        RETURNING *;
    `;
    const result = await pool.query(query, [name]);
    return result.rows[0];
};

// SINGLE CATEGORY OPERATIONS

export const getCategoryByIDService = async (id) => {
    const query = `SELECT * FROM categories WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};

export const updateCategoryByIDService = async (id, name, parentID) => {
    const query = `
        UPDATE categories 
        SET 
            name = COALESCE($1, name), 
            parent_id = COALESCE($2, parent_id)
        WHERE id = $3 
        RETURNING *;
    `;
    const result = await pool.query(query, [name, parentID, id]);
    return result.rows[0] || null;
};

export const deleteCategoryByIDService = async (id) => {
    const query = `DELETE FROM categories WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};

// SUBCATEGORIES

export const getSubCategoriesByIDService = async (parentId) => {
    const query = `
        SELECT * FROM categories 
        WHERE parent_id = $1 
        ORDER BY id;
    `;
    const result = await pool.query(query, [parentId]);
    return result.rows;
};

export const addSubcategoryByIDService = async (parentId, name) => {
    const query = `
        INSERT INTO categories (name, parent_id) 
        VALUES ($1, $2) 
        RETURNING *;
    `;
    const result = await pool.query(query, [name, parentId]);
    return result.rows[0];
};