import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff5f8",
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#ff7aa2",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    avatarText: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "700",
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
    },
    subtitle: {
        color: "#777",
        fontSize: 14,
    },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  subText: {
    fontSize: 14,
    color: "#777",
  },

  on: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff7aa2", // roze akcenat 💗
  },

  stat: {
    fontSize: 15,
    color: "#555",
    marginTop: 6,
  },

  statNumber: {
    fontWeight: "700",
    color: "#000",
  },
});