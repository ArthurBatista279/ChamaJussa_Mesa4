import { StyleSheet } from "react-native";

export default StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  ola: {
    fontSize: 14,
    color: "#333",
  },

  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    marginTop: 2,
  },

  botaoNova: {
    backgroundColor: "#A92D13",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});