import { StyleSheet } from "react-native";

export default StyleSheet.create({
  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },

  filtro: {
    borderWidth: 1,
    borderColor: "#C56B58",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },

  filtroAtivo: {
    backgroundColor: "#A92D13",
  },

  texto: {
    color: "#B0B0B0",
    fontSize: 12,
  },

  textoAtivo: {
    color: "#fff",
    fontSize: 12,
  },
});