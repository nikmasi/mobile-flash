import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

export function useStreak() {
  const database = useSQLiteContext();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!database) return;

    const calculateStreak = async () => {
      try {
        const sessions: { started_at: number }[] = await database.getAllAsync(
          "SELECT started_at FROM sessions ORDER BY started_at ASC"
        );

        if (!sessions.length) {
          setStreak(0);
          return;
        }

        const dates = sessions.map(s =>
          new Date(s.started_at).toISOString().slice(0, 10)
        );

        const uniqueDates = Array.from(new Set(dates));

        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < uniqueDates.length; i++) {
          const prev = new Date(uniqueDates[i - 1]);
          const curr = new Date(uniqueDates[i]);

          const diffDays =
            (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

          if (diffDays === 1) {
            currentStreak += 1;
          } else {
            currentStreak = 1;
          }

          if (currentStreak > maxStreak) maxStreak = currentStreak;
        }

        setStreak(maxStreak);
      } catch (error) {
        console.error("Error calculating streak:", error);
        setStreak(0);
      }
    };

    calculateStreak();
  }, [database]);

  return streak;
}
