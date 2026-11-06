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
    const db = await getDatabase(); //open the database

    await db.runAsync( //add the movie type if it does not already exist
        'INSERT OR IGNORE INTO MediaType (type_name) VALUES (?);',
        'Movie'
    );

    const mediaType = await db.getFirstAsync( //get the movie type's id
        'SELECT type_id FROM MediaType WHERE type_name = ?;',
        'Movie'
    );

    await db.runAsync( //add the dvd format for movies if it does not already exist
        'INSERT OR IGNORE INTO MediaFormat (type_id, format_name) VALUES (?, ?);',
        mediaType.type_id,
        'DVD'
    );

    const mediaFormat = await db.getFirstAsync( //get the dvd format's id
        'SELECT format_id FROM MediaFormat WHERE type_id = ? AND format_name = ?;',
        mediaType.type_id,
        'DVD'
    );

    const result = await db.runAsync( //insert the sample movie into the database
        `INSERT INTO MediaItem (type_id, title, genre, releaseYear, format_id)
         VALUES (?, ?, ?, ?, ?);`,
        mediaType.type_id, //use the movie type's id
        'The Lion King', //set the movie title
        'Animation', //set the genre
        1994, //set the release year
        mediaFormat.format_id //use the dvd format's id
    );

    return result.lastInsertRowId; //return the new item's id so we can retrieve it
}

// TODO (Jaydine): Create a retrieval function to pull the saved sample item
// Verify its information perfectly matches the inserted data
export async function retrieveSampleItem(id) {
    const db = await getDatabase(); //open the database

    const item = await db.getFirstAsync( //get the media item with the matching id
        'SELECT * FROM MediaItem WHERE id = ?;',
        id //use the id passed into the function
    );

    return item; //return the saved item or null if it was not found
}