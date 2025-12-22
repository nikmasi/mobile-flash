import { Pressable, Text } from "react-native";
import Spacer from "../other/spacer";
import { styles } from "./styles";

type Props = {
  showAnswer: boolean;
  card: {
    question: string;
    answer: string;
  };
  onPress: () => void;
};

export default function OneCard({ showAnswer, card, onPress }: Props) {
  return (
    
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.text}>
        {showAnswer ? card.answer : card.question}
      </Text>

      <Spacer size={13} />

      <Text style={styles.Smalltext}>
        {showAnswer ? "Tap for question" : "Tap for answer"}
      </Text>
    </Pressable>
  );
}
