import Divider from "@/components/other/divider";
import ProfileHeader from "@/components/profile/profileHeader";
import ProfileProgress from "@/components/profile/profileProgress";
import ProfileReset from "@/components/profile/profileReset";
import ProfileSettings from "@/components/profile/profileSettings";
import ProfileToday from "@/components/profile/profileToday";
import { useTheme } from "@/components/other/theme";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { View } from "react-native";

export default function Profile() {
    const database = useSQLiteContext()
        
    const [data, setData] = React.useState<
        { cnt_decks: number; cnt_cards: number; }[]
    >([]);
    

    const [settings, setSettings] = React.useState<
        { reminder: string; mode: string; }[]
    >([]);
    
    useFocusEffect(
        useCallback(() => {
            loadData(); 
            loadSettings();
        }, [])
    );
    
    const loadData = async () => {
        const result = await database.getAllAsync<{
            cnt_decks: number;    
            cnt_cards: number;
        }>(`
            SELECT
            (SELECT COUNT(*) FROM decks) AS cnt_decks,
            (SELECT COUNT(*) FROM cards) AS cnt_cards
        `);
        setData(result);
    };
    const decksCount = data[0]?.cnt_decks ?? 0;
    const cardsCount = data[0]?.cnt_cards ?? 0;

    
    const loadSettings = async () => {
        const result = await database.getAllAsync<{
            reminder: string;    
            mode: string;
        }>(`SELECT
            (SELECT value FROM settings where key=='reminder') AS reminder,
            (SELECT value FROM settings where key=='mode') AS mode
        `);
        setSettings(result);
    };

  const { theme, toggleTheme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme === "dark" ? "#aaaaaaff" : "#fff5f8", padding: 16 }}>
        <ProfileHeader />
        <Divider />

        <ProfileProgress  decksCount={decksCount} cardsCount ={cardsCount}/>
        <ProfileToday />      
        <ProfileSettings onToggleMode={toggleTheme} mode={settings[0]?.mode ?? "OFF"} />

        <Divider />

        <ProfileReset />
    </View>
  );
}