import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff5f8",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222"
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 16,
  },
  cardItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  question: {
    fontWeight: "700",
    fontSize: 16,
    color: "#222",
  },
  answer: {
    marginTop: 6,
    color: "#555",
  },
  addTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#ff7aa2",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});