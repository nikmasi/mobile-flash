import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SQLiteDatabase, SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { ThemeProvider } from "../components/other/theme";

export const DATABASE_NAME = 'my_app_db';

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
     <ThemeProvider>
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={createDbIfNeeded} >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="decks" options={{ title: "Deck Details" }} />
        <Stack.Screen name="cards" options={{ title: "Cards Details" }} />
      </Stack>
    </SQLiteProvider>
    </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const createDbIfNeeded = (db: SQLiteDatabase) => {
  console.log("Creating database with Promises");
return db.execAsync(`PRAGMA foreign_keys = ON;`)
  .then(() => {
    console.log("PRAGMA set");
    return db.execAsync(`
      CREATE TABLE IF NOT EXISTS study_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        correct_count INTEGER NOT NULL,
        wrong_count INTEGER NOT NULL,
        last_reviewed INTEGER
      );
    `);
  })
  .then(() => {
    console.log("study_progress created");
    return db.execAsync(`
      CREATE TABLE IF NOT EXISTS decks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
  })
  .then(() => {
    console.log("decks created");
    return db.execAsync(`
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
  })
  .then(() => {
    console.log("cards created");
    return db.execAsync(`
      CREATE TABLE IF NOT EXISTS study_progress_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_id INTEGER NOT NULL,
        date INTEGER NOT NULL,           -- format YYYYMMDD
        correct_count INTEGER NOT NULL,
        wrong_count INTEGER NOT NULL,
        FOREIGN KEY (card_id) REFERENCES cards(id)
      );
    `);
  })
  .then(() => {
    console.log("study_progress_logs created");
    return db.execAsync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        started_at TEXT NOT NULL,
        duration INTEGER NOT NULL
      );
    `);
  })
  .then(() => {
    console.log("sessions created");
    return db.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL
      );
    `);
  })
  .then(() => {
    console.log("settings created");
    return db.execAsync(`INSERT OR IGNORE INTO settings (key, value) VALUES ('reminder', 'OFF');`);
  })
  .then(() => {
    console.log("reminder default set");
    return db.execAsync(`INSERT OR IGNORE INTO settings (key, value) VALUES ('mode', 'OFF');`);
  })
  .then(() => {
    console.log("mode default set");
    console.log("Database created successfully with Promises");
  })
  .catch((error) => {
    console.error("Error creating database:", error);
  });
};