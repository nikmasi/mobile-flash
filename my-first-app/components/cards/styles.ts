import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff5f8",
    justifyContent: "center",
  },
  counter: {
    textAlign: "center",
    marginBottom: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
  Smalltext: {
    fontSize: 12,
    textAlign: "center",
    color:"gray"
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  action: {
    flex: 1,
    padding: 14,
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: "center",
  },
});
