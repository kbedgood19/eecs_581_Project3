
import { getDatabase } from './database';

// Creates the database tables if they do not already exist.
export async function createTables() {
    const db = await getDatabase();

    // Stores the different categories of media.
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS MediaType (
            type_id INTEGER PRIMARY KEY,
            type_name TEXT NOT NULL UNIQUE
        );
    `);

    // Stores the physical formats for each media type.
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS MediaFormat (
            format_id INTEGER PRIMARY KEY,
            type_id INTEGER NOT NULL,
            format_name TEXT NOT NULL,

            FOREIGN KEY (type_id) REFERENCES MediaType(type_id),
            UNIQUE (type_id, format_name)
        );
    `);

    // Stores information shared by all physical media items.
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS MediaItem (
            id INTEGER PRIMARY KEY,
            type_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            genre TEXT,
            releaseYear INTEGER,
            dateAdded TEXT DEFAULT CURRENT_DATE,
            format_id INTEGER NOT NULL,

            FOREIGN KEY (type_id) REFERENCES MediaType(type_id),
            FOREIGN KEY (format_id) REFERENCES MediaFormat(format_id)
        );
    `);

    // Stores information specific to movies.
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Movie (
            media_id INTEGER PRIMARY KEY,
            director TEXT,

            FOREIGN KEY (media_id) REFERENCES MediaItem(id)
        );
    `);

    // Stores information specific to music.
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Music (
            media_id INTEGER PRIMARY KEY,
            artist TEXT,

            FOREIGN KEY (media_id) REFERENCES MediaItem(id)
        );
    `);

    // Stores information specific to video games.
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS VideoGame (
            media_id INTEGER PRIMARY KEY,
            developer TEXT,

            FOREIGN KEY (media_id) REFERENCES MediaItem(id)
        );
    `);

    // Stores ratings and reviews for media items.
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS UserFeedback (
            feedback_id INTEGER PRIMARY KEY,
            media_id INTEGER NOT NULL,
            score INTEGER CHECK (score BETWEEN 1 AND 5),
            reviewText TEXT,
            dateModified TEXT DEFAULT CURRENT_DATE,

            FOREIGN KEY (media_id) REFERENCES MediaItem(id)
        );
    `);


    // Stores information specific to books.
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Book (
            media_id INTEGER PRIMARY KEY,
            author TEXT,

            FOREIGN KEY (media_id) REFERENCES MediaItem(id)
        );
    `);


    return db;
}
