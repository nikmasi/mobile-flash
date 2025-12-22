import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

export function useTodayStats() {
  const database = useSQLiteContext();
  const [cardsToday, setCardsToday] = useState(0);
  const [studyTime, setStudyTime] = useState(0); 

  useEffect(() => {
    if (!database) return;

    const loadTodayStats = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowTimestamp = tomorrow.getTime();
        
        
        const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        const sessions = await database.getAllAsync<{ duration: number }>(
          "SELECT duration FROM sessions WHERE started_at = ?",
          [todayStr]
        );

        const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
        setStudyTime(totalTime);

        const cards = await database.getAllAsync<{ id: number }>(
          "SELECT id FROM study_progress WHERE last_reviewed >= ? AND last_reviewed < ?",
          [todayTimestamp, tomorrowTimestamp]
        );

        setCardsToday(cards.length);
      } catch (error) {
        console.error("Error loading today stats:", error);
        setStudyTime(0);
        setCardsToday(0);
      }
    };

    loadTodayStats();
  }, [database]);

  return { cardsToday, studyTime };
}
