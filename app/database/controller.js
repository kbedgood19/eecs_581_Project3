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

   const result = await db.runAsync( 
        `INSERT INTO MediaItem (type_id, title, genre, releaseYear, format_id, user_id)
         VALUES (?, ?, ?, ?, ?, ?);`,
        mediaType.type_id, 
        'The Lion King', 
        'Animation', 
        1994, 
        mediaFormat.format_id,
        'test-user-123' // Dummy user ID to satisfy the NOT NULL constraint
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
// (Kaitlyn): Save a media item entered by the user, including subtypes and new sprint features.
export async function addMediaItem(title, mediaType, genre, releaseYear, subtypeData, userId, photoUri = null, rating = null, review = null, copyNumber = 1) {
    const db = await getDatabase();

    // Add the media type if it does not already exist.
    await db.runAsync('INSERT OR IGNORE INTO MediaType (type_name) VALUES (?);', mediaType);
    const type = await db.getFirstAsync('SELECT type_id FROM MediaType WHERE type_name = ?;', mediaType);

    // Add a default format for the media item.
    await db.runAsync('INSERT OR IGNORE INTO MediaFormat (type_id, format_name) VALUES (?, ?);', type.type_id, 'Unspecified');
    const format = await db.getFirstAsync('SELECT format_id FROM MediaFormat WHERE type_id = ? AND format_name = ?;', type.type_id, 'Unspecified');

    // Insert the main media item into SQLite with new columns.
    const result = await db.runAsync(
        `INSERT INTO MediaItem (type_id, title, genre, releaseYear, format_id, user_id, photo_uri, rating, review, copy_number) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        type.type_id, title, genre, releaseYear, format.format_id, userId, photoUri, rating, review, copyNumber
    );

    const newId = result.lastInsertRowId;

    // Marie: Insert into the specific subtype table based on mediaType
    if (mediaType === 'Movie' && subtypeData?.director) {
        await db.runAsync(`INSERT INTO Movie (media_id, director) VALUES (?, ?);`, newId, subtypeData.director);
    } else if (mediaType === 'Book' && subtypeData?.author) {
        await db.runAsync(`INSERT INTO Book (media_id, author) VALUES (?, ?);`, newId, subtypeData.author);
    } else if (mediaType === 'Music' && subtypeData?.artist) {
        await db.runAsync(`INSERT INTO Music (media_id, artist) VALUES (?, ?);`, newId, subtypeData.artist);
    } else if (mediaType === 'VideoGame' && subtypeData?.developer) {
        await db.runAsync(`INSERT INTO VideoGame (media_id, developer) VALUES (?, ?);`, newId, subtypeData.developer);
    }

    // Sabelli: Insert initial rating/review if provided during creation
    if (rating !== null || review !== null) {
        await db.runAsync(
            `INSERT INTO UserFeedback (media_id, score, reviewText, dateModified) 
             VALUES (?, ?, ?, CURRENT_DATE);`,
            newId, rating, review
        );
    }

    return newId;
}

// Marie: added to join MediaItem and MediaType tables dynamically for search/filtering
// Dynamically join tables for search/filtering, including UserFeedback
export async function getMediaCatalog(userId, searchQuery = '', filterType = 'All', sortBy = 'title_asc', formatFilter = 'All') {
    const db = await getDatabase();
    
    let query = `
        SELECT m.id, m.title, m.genre, m.releaseYear, m.photo_uri, t.type_name, mf.format_name, f.score AS rating
        FROM MediaItem m
        JOIN MediaType t ON m.type_id = t.type_id
        LEFT JOIN MediaFormat mf ON m.format_id = mf.format_id
        LEFT JOIN UserFeedback f ON m.id = f.media_id
        WHERE m.user_id = ?
    `;
    const params = [userId];

    if (searchQuery.trim() !== '') {
        query += ` AND m.title LIKE ?`;
        params.push(`%${searchQuery}%`);
    }

    if (filterType !== 'All') {
        let dbType = filterType;
        if (filterType === 'Movies') dbType = 'Movie';
        if (filterType === 'Books') dbType = 'Book';
        if (filterType === 'Video Games') dbType = 'VideoGame'; 
        query += ` AND t.type_name = ?`;
        params.push(dbType);
    }

    // Greeshma: Sorting Logic for CollectionScreen
    if (sortBy === 'title_asc') query += ` ORDER BY m.title ASC;`;
    else if (sortBy === 'date_added') query += ` ORDER BY m.id DESC;`;
    else if (sortBy === 'rating_desc') query += ` ORDER BY f.score DESC;`; // Targets the joined table
    else query += ` ORDER BY m.title ASC;`; 
    
    const results = await db.getAllAsync(query, params);
    return results;
}

// Marie: added for editing and retrieving item information
// Retrieve a single media item and its subtype details for editing
export async function getMediaItemById(id) {
    const db = await getDatabase();
    const item = await db.getFirstAsync(
        `SELECT m.id, m.title, m.genre, m.releaseYear, m.photo_uri, m.copy_number, t.type_name,
                mo.director, b.author, mu.artist, v.developer,
                f.score AS rating, f.reviewText AS review
         FROM MediaItem m
         JOIN MediaType t ON m.type_id = t.type_id
         LEFT JOIN Movie mo ON m.id = mo.media_id
         LEFT JOIN Book b ON m.id = b.media_id
         LEFT JOIN Music mu ON m.id = mu.media_id
         LEFT JOIN VideoGame v ON m.id = v.media_id
         LEFT JOIN UserFeedback f ON m.id = f.media_id
         WHERE m.id = ?;`,
        id
    );
    return item;
}

// Marie: Update an existing media item, its subtype, and user feedback
export async function updateMediaItem(id, title, genre, releaseYear, typeName, subtypeData, photoUri, rating, review) {
    const db = await getDatabase();
    
    // 1. Update the main MediaItem table (Notice rating/review are NOT here)
    await db.runAsync(
        `UPDATE MediaItem 
         SET title = ?, genre = ?, releaseYear = ?, photo_uri = ?
         WHERE id = ?;`,
        title, genre, releaseYear, photoUri, id
    );

    // 2. Use INSERT OR REPLACE. If the item was originally created without 
    // an author/director, this guarantees the row is created now instead of failing.
    if (typeName === 'Movie') {
        await db.runAsync(`INSERT OR REPLACE INTO Movie (media_id, director) VALUES (?, ?);`, id, subtypeData.director || '');
    } else if (typeName === 'Book') {
        await db.runAsync(`INSERT OR REPLACE INTO Book (media_id, author) VALUES (?, ?);`, id, subtypeData.author || '');
    } else if (typeName === 'Music') {
        await db.runAsync(`INSERT OR REPLACE INTO Music (media_id, artist) VALUES (?, ?);`, id, subtypeData.artist || '');
    } else if (typeName === 'VideoGame') {
        await db.runAsync(`INSERT OR REPLACE INTO VideoGame (media_id, developer) VALUES (?, ?);`, id, subtypeData.developer || '');
    }

    // Using INSERT OR REPLACE requires the UNIQUE constraint on media_id added to schema.js
    if (rating !== null || review !== null) {
        await db.runAsync(
            `INSERT OR REPLACE INTO UserFeedback (media_id, score, reviewText, dateModified) 
             VALUES (?, ?, ?, CURRENT_DATE);`,
            id, rating, review
        );
    }

}


// Marie: added for deleting a MediaItem
// Delete a media item and all associated subtype records
export async function deleteMediaItem(id) {
    const db = await getDatabase();
    
    // 1. Delete from subtype tables first to clear foreign key references
    await db.runAsync(`DELETE FROM Movie WHERE media_id = ?;`, id);
    await db.runAsync(`DELETE FROM Book WHERE media_id = ?;`, id);
    await db.runAsync(`DELETE FROM Music WHERE media_id = ?;`, id);
    await db.runAsync(`DELETE FROM VideoGame WHERE media_id = ?;`, id);
    await db.runAsync(`DELETE FROM UserFeedback WHERE media_id = ?;`, id);
    
    // 2. Delete the main media item
    await db.runAsync(`DELETE FROM MediaItem WHERE id = ?;`, id);
}


// Ximena: Helper function to check for existing duplicates before saving
export async function checkDuplicateMedia(userId, title, typeName) {
    const db = await getDatabase();
    
    // Uses LOWER() and TRIM() to ensure case-insensitive and space-insensitive matching
    const result = await db.getFirstAsync(
        `SELECT m.id, m.copy_number 
         FROM MediaItem m
         JOIN MediaType t ON m.type_id = t.type_id
         WHERE m.user_id = ? AND LOWER(TRIM(m.title)) = LOWER(TRIM(?)) AND t.type_name = ?
         ORDER BY m.copy_number DESC;`,
        userId, title, typeName
    );
    
    // Returns the record with the highest copy_number if a duplicate exists, otherwise null
    return result; 
}