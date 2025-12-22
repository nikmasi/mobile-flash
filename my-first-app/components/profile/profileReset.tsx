import { SQLiteDatabase, openDatabaseSync } from "expo-sqlite";
import Card from "../other/card";
import { Text, TouchableOpacity, Alert } from "react-native";

const db: SQLiteDatabase = openDatabaseSync('my_app_db');

export default function ProfileReset() {

    const handleReset = async () => {
        try {
            await dropTables(db);
            await createDbIfNeeded(db);

            Alert.alert("Success", "All progress has been reset!");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not reset database.");
        }
    }

    return (
        <TouchableOpacity onPress={handleReset}>
            <Card>
                <Text style={{ color: "red", fontWeight: "600" }}>
                    Reset all progress
                </Text>
            </Card>
        </TouchableOpacity>
    )
}

const dropTables = async (db: SQLiteDatabase) => {
    try {
        await db.execAsync(`DROP TABLE IF EXISTS study_progress_logs;`);
        await db.execAsync(`DROP TABLE IF EXISTS cards;`);
        await db.execAsync(`DROP TABLE IF EXISTS decks;`);
        await db.execAsync(`DROP TABLE IF EXISTS study_progress;`);
        await db.execAsync(`DROP TABLE IF EXISTS sessions;`);
        await db.execAsync(`DROP TABLE IF EXISTS settings;`);
        console.log("All tables dropped successfully");
    } catch (error) {
        console.error("Error dropping tables:", error);
        throw error;
    }
}

const createDbIfNeeded = async (db: SQLiteDatabase) => {
    console.log("Creating database");
    try {
        await db.execAsync(`PRAGMA foreign_keys = ON;`);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS study_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            correct_count INTEGER NOT NULL,
            wrong_count INTEGER NOT NULL,
            last_reviewed INTEGER
          );
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS decks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at INTEGER NOT NULL
          );
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deck_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            study_progress_id INTEGER NOT NULL,
            FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
            FOREIGN KEY (study_progress_id) REFERENCES study_progress(id) ON DELETE CASCADE
          );
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS study_progress_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_id INTEGER NOT NULL,
            date INTEGER NOT NULL,          -- format YYYYMMDD
            correct_count INTEGER NOT NULL,
            wrong_count INTEGER NOT NULL,
            FOREIGN KEY (card_id) REFERENCES cards(id)
          );
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            started_at TEXT NOT NULL,
            duration INTEGER NOT NULL
          );
        `);

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL UNIQUE,
            value TEXT NOT NULL
          );
        `);

        await db.execAsync(`INSERT OR IGNORE INTO settings (key, value) VALUES ('reminder', 'OFF');`);
        await db.execAsync(`INSERT OR IGNORE INTO settings (key, value) VALUES ('mode', 'OFF');`);

        console.log("Database created successfully");
    } catch (error) {
        console.error("Error creating database:", error);
        throw error;
    }
}