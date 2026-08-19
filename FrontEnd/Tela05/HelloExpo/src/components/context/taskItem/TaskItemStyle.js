import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#C9C9C7",
    borderRadius: 7,
    padding: 16,
    marginTop: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    elevation: 3,
  },

  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  codigo: {
    color: "#A92D13",
    fontSize: 14,
    fontWeight: "bold",
  },

  status: {
    backgroundColor: "#D8AAA0",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  statusTexto: {
    color: "#A92D13",
    fontSize: 11,
  },

  titulo: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#222",
    marginTop: 12,
  },

  descricao: {
    fontSize: 11,
    color: "#666",
    marginTop: 7,
    lineHeight: 15,
  },
});