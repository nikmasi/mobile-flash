import Divider from "@/components/other/divider";
import BottomSheet from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Keyboard, Alert} from "react-native";
import { styles } from "@/components/decks/styles";
import BottomSheetDecks from "@/components/decks/bottomSheet";
import Spacer from "@/components/other/spacer";
import { Image } from "react-native";

type CardType = {
  id: number;
  question: string;
  answer: string;
};

export default function Decks() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const database = useSQLiteContext();
  const router = useRouter();
  const deckId = Number(id);

  const [deckTitle, setDeckTitle] = useState("");
  const [cards, setCards] = useState<CardType[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingCardId, setEditingCardId] = useState<number | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const questionInputRef = useRef<TextInput>(null);

  const snapPoints = useMemo(() => ["75%", "85%"], []);

  useEffect(() => {
    loadDeck();
    loadCards();
  }, []);

  const loadDeck = async () => {
    const result = await database.getFirstAsync<{ title: string }>(
      "SELECT title FROM decks WHERE id = ?",
      [deckId]
    );
    if (result) setDeckTitle(result.title);
  };

  const loadCards = async () => {
    const result = await database.getAllAsync<CardType>(
      "SELECT * FROM cards WHERE deck_id = ?",
      [deckId]
    );
    setCards(result);
  };

  const openCards = () => {
    router.push({
      pathname: "/cards",
      params: { deckId: deckId.toString() },
    });
  };

  //add ili update
  const saveCard = async () => {
    if (!question.trim() || !answer.trim()) return;

    if (editingCardId) {
      await database.runAsync(
        "UPDATE cards SET question = ?, answer = ? WHERE id = ?",
        [question, answer, editingCardId]
      );
    } else {
      const progress = await database.runAsync(
        "INSERT INTO study_progress (correct_count, wrong_count) VALUES (0, 0)"
      );

      await database.runAsync(
        `INSERT INTO cards (deck_id, question, answer, study_progress_id)
         VALUES (?, ?, ?, ?)`,
        [deckId, question, answer, progress.lastInsertRowId]
      );
    }

    Keyboard.dismiss();
    setTimeout(() => bottomSheetRef.current?.close(), 120);

    setQuestion("");
    setAnswer("");
    setEditingCardId(null);
    loadCards();
  };

  const editCard = (card: CardType) => {
    setQuestion(card.question);
    setAnswer(card.answer);
    setEditingCardId(card.id);

    bottomSheetRef.current?.snapToIndex(0);
    setTimeout(() => questionInputRef.current?.focus(), 120);
  };

  const deleteCard = (cardId: number) => {
    Alert.alert(
      "Delete card",
      "Are you sure you want to delete this card?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
             await database.runAsync("DELETE FROM cards WHERE id = ?", [cardId]);
              await database.runAsync(
  `DELETE FROM study_progress 
   WHERE id NOT IN (SELECT study_progress_id FROM cards)`
);

            loadCards();
          },
        },
      ]
    );
  };
  

  const openAddCardSheet = () => {
    setQuestion("");
    setAnswer("");
    setEditingCardId(null);

    bottomSheetRef.current?.snapToIndex(0);
    setTimeout(() => questionInputRef.current?.focus(), 120);
  };

  // keyboard resize
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      bottomSheetRef.current?.snapToIndex(1)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      bottomSheetRef.current?.snapToIndex(0)
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{deckTitle}</Text>
        <Text style={styles.subtitle}>🃏 {cards.length} cards</Text>

        <Pressable style={styles.button} onPress={openCards}>
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>

        <Spacer size={16} />
        <Divider />
        <Spacer size={16} />

        <Text style={styles.title}>Cards</Text>
        <Spacer size={16} />

        {cards.length === 0 ? (
          <Text style={styles.subtitle}>No cards yet.</Text>
        ) : (
          cards.map((card) => (
            <View
              key={card.id}
              style={{
                ...styles.cardItem,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.question}>{card.question}</Text>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <Pressable onPress={() => editCard(card)}>
                  <Image
                  source={require("@/assets/images/pen.png")}
                  style={{ width: 18, height: 18 }}
                  resizeMode="contain"
                />
                </Pressable>
                
              <Pressable onPress={() => deleteCard(card.id)}>
                <Image
                  source={require("@/assets/images/delete.png")}
                  style={{ width: 18, height: 18 }}
                  resizeMode="contain"
                />
              </Pressable>

              </View>
            </View>
          ))
        )}

        <Spacer size={24} />

        <Pressable style={styles.button} onPress={openAddCardSheet}>
          <Text style={styles.buttonText}>＋ Add Card</Text>
        </Pressable>
        <Spacer size={16} />
         <Divider />
      <Spacer size={46} />
      </ScrollView>
      
     
      <BottomSheetDecks
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
        question={question}
        setQuestion={setQuestion}
        answer={answer}
        setAnswer={setAnswer}
        saveCard={saveCard}
        editing={!!editingCardId}
        questionInputRef={questionInputRef}
      />
    </View>
  );
}
