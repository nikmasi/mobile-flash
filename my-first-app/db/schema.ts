import { SQLiteDatabase } from 'expo-sqlite';

export async function initDb(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS study_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      correct_count INTEGER NOT NULL,
      wrong_count INTEGER NOT NULL,
      last_reviewed INTEGER
    );

    CREATE TABLE IF NOT EXISTS decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deck_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      study_progress_id INTEGER NOT NULL,
      FOREIGN KEY (deck_id) REFERENCES decks(id),
      FOREIGN KEY (study_progress_id) REFERENCES study_progress(id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at TEXT NOT NULL,
      duration INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL,
      value TEXT NOT NULL
    );
  `);
}
