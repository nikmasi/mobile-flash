import Card from "../other/card";
import { Text } from "react-native";
import { styles } from "./styles";
import { useTodayStats } from "./useTodayStats";

export default function ProfileToday() {
  const { cardsToday, studyTime } = useTodayStats();

  const minutes = Math.floor(studyTime / 60);
  const seconds = studyTime % 60;

  return (
    <Card>
      <Text style={styles.title}>Today</Text>
      <Text style={styles.stat}>📚 Studied: {minutes} min {seconds} sec</Text>
      <Text style={styles.stat}>🃏 Cards: {cardsToday}</Text>
    </Card>
  );
}
