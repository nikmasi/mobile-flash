import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { View, Text, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import { styles } from "@/components/cards/styles";
import OneCard from "@/components/cards/card";

type CardType = {
  id: number;
  deck_id: number;
  question: string;
  answer: string;
  study_progress_id: number;
};

type StudyProgress = {
  id: number;
  correct_count: number;
  wrong_count: number;
  last_reviewed: number | null;
};

type Session = {
  id: number;
  started_at: string; // YYYY-MM-DD
  duration: number; // in sec
};

type Log = {
  id: number;
  card_id: number;
  date: number; // YYYYMMDD
  correct_count: number;
  wrong_count: number;
};

export default function CardsScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const router = useRouter();
  const database = useSQLiteContext();

  const [cards, setCards] = useState<CardType[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const result = await database.getAllAsync<CardType>(
      "SELECT * FROM cards WHERE deck_id = ?",
      [Number(deckId)]
    );
    setCards(result);
  };

  if (cards.length === 0) {
    return <Text style={{ padding: 20 }}>No cards in this deck</Text>;
  }

  const card = cards[index];

  const getTodayStr = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const getDateNumber = () => Number(getTodayStr().replace(/-/g, '')); // YYYYMMDD

  const handleAnswer = async (correct: boolean) => {
    try {
      const todayStr = getTodayStr();
      const dateNumber = getDateNumber();

      const progress = await database.getFirstAsync<StudyProgress>(
        "SELECT * FROM study_progress WHERE id = ?",
        [card.study_progress_id]
      );

      if (!progress) throw new Error("Progress not found");

      await database.runAsync(
        "UPDATE study_progress SET correct_count = ?, wrong_count = ?, last_reviewed = ? WHERE id = ?",
        [
          progress.correct_count + (correct ? 1 : 0),
          progress.wrong_count + (correct ? 0 : 1),
          Date.now(),
          progress.id,
        ]
      );

      const logExists = await database.getFirstAsync<Log>(
        "SELECT * FROM study_progress_logs WHERE card_id = ? AND date = ?",
        [card.id, dateNumber]
      );

      if (logExists) {
        await database.runAsync(
          "UPDATE study_progress_logs SET correct_count = correct_count + ?, wrong_count = wrong_count + ? WHERE id = ?",
          [correct ? 1 : 0, correct ? 0 : 1, logExists.id]
        );
      } else {
        await database.runAsync(
          "INSERT INTO study_progress_logs (card_id, date, correct_count, wrong_count) VALUES (?, ?, ?, ?)",
          [card.id, dateNumber, correct ? 1 : 0, correct ? 0 : 1]
        );
      }

      let session = await database.getFirstAsync<Session>(
        "SELECT * FROM sessions WHERE started_at = ?",
        [todayStr]
      );

      const now = Math.floor(Date.now() / 1000); // seconds

      if (session) {
        await database.runAsync(
          "UPDATE sessions SET duration = duration + ? WHERE id = ?",
          [5, session.id] 
        );
      } else {
        await database.runAsync(
          "INSERT INTO sessions (started_at, duration) VALUES (?, ?)",
          [todayStr, 5]
        );
      }

      if (index < cards.length - 1) {
        setIndex(i => i + 1);
        setShowAnswer(false);
      } else {
        Alert.alert("Done", "You've completed all cards in this deck!", [
          {
            text: "OK",
            onPress: () => router.push("/"),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while updating progress.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>
        {index + 1} / {cards.length}
      </Text>

      <OneCard
        card={card}
        showAnswer={showAnswer}
        onPress={() => setShowAnswer(prev => !prev)}
      />

      <View style={styles.buttons}>
        <Pressable
          style={[styles.action, { backgroundColor: "#ffb3b3" }]}
          onPress={() => handleAnswer(false)}
        >
          <Text>Wrong</Text>
        </Pressable>

        <Pressable
          style={[styles.action, { backgroundColor: "#b3ffd9" }]}
          onPress={() => handleAnswer(true)}
        >
          <Text>Correct</Text>
        </Pressable>
      </View>
    </View>
  );
}