import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { styles } from "@/components/decks/styles";
import { Text, TextInput, Pressable } from "react-native";
import React from "react";

type Props = {
  bottomSheetRef: any;
  snapPoints: string[];
  question: string;
  setQuestion: (text: string) => void;
  answer: string;
  setAnswer: (text: string) => void;
  saveCard: () => void;
  editing: boolean;
  questionInputRef: React.RefObject<TextInput | null>;
};

export default function BottomSheetDecks({
  bottomSheetRef,
  snapPoints,
  question,
  setQuestion,
  answer,
  setAnswer,
  saveCard,
  editing,
  questionInputRef,
}: Props) {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={{ padding: 16 }}>
        <Text style={styles.addTitle}>
          {editing ? "Edit card" : "Add new card"}
        </Text>

        <TextInput
          ref={questionInputRef}
          placeholder="Question"
          value={question}
          onChangeText={setQuestion}
          style={styles.input}
        />

        <TextInput
          placeholder="Answer"
          value={answer}
          onChangeText={setAnswer}
          style={[styles.input, { height: 80 }]}
          multiline
        />

        <Pressable style={styles.button} onPress={saveCard}>
          <Text style={styles.buttonText}>
            {editing ? "Update Card" : "Save Card"}
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
    
  );
}
