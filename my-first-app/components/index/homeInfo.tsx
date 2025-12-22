import Card from "../other/card";
import WeekCard from "../other/weekCard";
import { Text, View } from "react-native";
import { styles } from "./styles";


export default function HomeInfo({cardNumber, studyTime}:{cardNumber:number, studyTime:string}) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>

      <WeekCard />

      <View style={styles.statsRow}>
        <Card >
          <Text style={styles.cardTitle}>Cards today</Text>
          <Text style={styles.cardStat}>{cardNumber} cards</Text>
        </Card>

        <Card >
          <Text style={styles.cardTitle}>Study time today</Text>
          <Text style={styles.cardStat}>{studyTime}</Text>
        </Card>

        
      </View>
    </View>
  );
}