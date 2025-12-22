import Divider from "@/components/other/divider";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, TouchableOpacity} from "react-native";
import { styles } from "../../components/index/styles";
import HomeInfo from "@/components/index/homeInfo";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

type Deck = {
  id: number;
  title: string;
  description: string;
  created_at: number;
};

type Setting = {
  value: string;
  key: string;
};

export default function Home() {
  const database = useSQLiteContext();
  const router = useRouter();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [sett, setSett] = useState<Setting[]>([]);
  const [cardsToday, setCardsToday] = useState(0);
  const [studyTime, setStudyTime] = useState(0); 

  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  useFocusEffect(
    useCallback(() => {
      loadDecks();
      loadSettings();
      loadStats();
    }, [])
  );

  const loadDecks = async () => {
    const result = await database.getAllAsync<Deck>(
      "SELECT * FROM decks ORDER BY created_at DESC"
    );
    setDecks(result);
  };

  const loadSettings = async () => {
    const result = await database.getAllAsync<Setting>(
      "SELECT * FROM settings"
    );
    setSett(result);
  };

  const loadStats = async () => {
    try {
      const dateNumber = Number(todayStr.replace(/-/g, ''));
      const cardsTodayResult = await database.getFirstAsync<{ total: number }>(
        `SELECT SUM(correct_count + wrong_count) as total
         FROM study_progress_logs
         WHERE date = ?`,
        [dateNumber]
      );
      setCardsToday(cardsTodayResult?.total || 0);

      const session = await database.getFirstAsync<{ duration: number }>(
        `SELECT duration FROM sessions WHERE started_at = ?`,
        [todayStr]
      );
      setStudyTime(session?.duration || 0);
    } catch (err) {
      setCardsToday(0);
      setStudyTime(0);
    }
  };

  const addDeck = async () => {
    if (!title.trim()) return;

    await database.runAsync(
      "INSERT INTO decks (title, description, created_at) VALUES (?, ?, ?)",
      [title, description, Date.now()]
    );

    setTitle("");
    setDescription("");
    loadDecks();
  };

  const openDeck = (deckId: number) => {
    router.push({
      pathname: "/decks",
      params: { id: deckId.toString() },
    });
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["35%"], ["40%"]);

  const openAddDeckSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <ScrollView style={styles.page}
      contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false} >

      <HomeInfo cardNumber={cardsToday} 
        studyTime={` ${Math.floor(studyTime / 60)} min ${studyTime % 60} sec`}
      />

      <Divider />
      <Text style={styles.sectionTitle}>Your decks</Text>

      {decks.length === 0 && (
        <Text style={styles.emptyText}>No decks yet 🌱</Text>
      )}

      {decks.map((deck) => (
        <TouchableOpacity
          key={deck.id}
          onPress={() => openDeck(deck.id)}
          activeOpacity={0.85}
          style={styles.deckCard}
        >
          <View>
            <Text style={styles.deckTitle}>{deck.title}</Text>
            <Text style={styles.deckDesc}> {deck.description || "No description"} </Text>
          </View>
          <Text style={styles.deckArrow}>›</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.addSection}>
        <Pressable onPress={openAddDeckSheet} style={styles.addButton}>
          <Text style={styles.addButtonText}>＋ Add Deck</Text>
        </Pressable>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetView style={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Add new deck</Text>

          <TextInput
            placeholder="Deck title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { height: 80 }]}
            multiline
          />

          <Pressable
            onPress={async () => {
              await addDeck();
              bottomSheetRef.current?.close();
            }}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Save deck</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>

    </ScrollView>
  );
}