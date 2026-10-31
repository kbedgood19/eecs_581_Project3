
import * as SQLite from 'expo-sqlite';

// Opens the SQLite database.
// If the database does not exist, SQLite creates it.
export async function getDatabase() {
    const db = await SQLite.openDatabaseAsync('media_collection.db');
    await db.execAsync('PRAGMA foreign_keys = ON;');
    return db;
}
