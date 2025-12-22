import React from "react";
import { View, Text, StyleSheet } from "react-native";

type CardProps = {
  title?: string;
};

export default function WeekCard({ title }: CardProps) {
  const today = new Date();
  const dayIndex = (today.getDay() + 6) % 7; // Monday = 0
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  const week = dayLabels.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - dayIndex + index);

    return {
      day,
      date: date.getDate(),
      isToday: index === dayIndex,
    };
  });


  return (
    <View style={styles.card}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.weekContainer}>
        {week.map((item, index) => (
          <View key={index} style={styles.dayContainer}>
            <View style={[
          styles.circle,
          { backgroundColor: item.isToday ? "#ff7aa2" : "#eee" },
        ]} >
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <Text style={styles.dayLabel}>{item.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayContainer: {
    alignItems: "center",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
