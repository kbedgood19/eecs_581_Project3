// File: database/controller.js
// Purpose: Business logic controller to connect the app to the database, handle data manipulation, and execute queries[cite: 1, 2].
// Authors: Kaitlyn Bedgood and Jaydine Stiles
// External Sources: Gemini (Code Template)

import { getDatabase } from './database';

// (Kaitlyn): Write a query to count records in the MediaItem table
// Ensure it returns a number even if the table is empty
export async function countMediaRecords() {
    const db = await getDatabase();
    // Execute SELECT COUNT(*) query on MediaItem
    const result = await db.getFirstAsync(
        'SELECT COUNT(*) AS count from MediaItem;'
    );
    // return the count integer
    return result.count;
}

// TODO (Kaitlyn): Write a query to count records in the UserFeedback table[
// Ensure it handles empty states correctly and returns a number
export async function countFeedbackRecords() {
    const db = await getDatabase();
    // TODO: Execute SELECT COUNT(*) query on UserFeedback
    const result = await db.getFirstAsync(
        'SELECT COUNT(*) AS count from UserFeedback;'
    );
    // return the count integer
    return result.count;
}

// TODO (Jaydine): Create a function to insert a sample media item into the database.
export async function insertSampleItem() {
    const db = await getDatabase();
    // TODO: Execute INSERT statement into MediaItem with dummy data (e.g., test movie or book)
}

// TODO (Jaydine): Create a retrieval function to pull the saved sample item
// Verify its information perfectly matches the inserted data
export async function retrieveSampleItem(id) {
    const db = await getDatabase();
    // TODO: Execute SELECT * query for the specific item ID
    // return the row data
}