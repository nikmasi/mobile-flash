import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff5f8",
  },

  container: {
    padding: 16,
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    paddingHorizontal: 16,
  },

  emptyText: {
    paddingHorizontal: 16,
    marginTop: 8,
    color: "#888",
    fontStyle: "italic",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  smallCard: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },

  cardStat: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff7aa2",
    marginTop: 4,
  },

  /* DECK CARD */
  deckCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  deckTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  deckDesc: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },

  deckArrow: {
    fontSize: 22,
    color: "#ff7aa2",
    fontWeight: "600",
  },

  /* ADD SECTION */
  addSection: {
    marginTop: 32,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },

  addButton: {
    backgroundColor: "#ff7aa2",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  addButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});