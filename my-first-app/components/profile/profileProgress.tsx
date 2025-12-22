import Card from "../other/card";
import { Text } from "react-native";
import { styles } from "./styles";
import { useStreak } from "./useStreak";

export default function ProfileProgress(
  { decksCount, cardsCount }: { decksCount: number; cardsCount: number }
) {
  const streak = useStreak();

  return (
    <Card>
      <Text style={styles.title}>Your progress</Text>
      <Text style={styles.stat}>📚 Decks: {decksCount}</Text>
      <Text style={styles.stat}>🃏 Cards: {cardsCount}</Text>
      <Text style={styles.stat}>🔥 Streak: {streak} {streak === 1 ? "day" : "days"}</Text>
    </Card>
  );
}
