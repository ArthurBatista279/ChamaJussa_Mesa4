import { StyleSheet } from "react-native";

export const FooterStyle = StyleSheet.create({

  footer: {
    height: 80,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#A92B0D",

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  item: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  icone: {
    fontSize: 27,
    color: "#777777",
    marginBottom: 3,
  },

  iconeAtivo: {
    fontSize: 29,
    color: "#A92B0D",
    marginBottom: 2,
  },

  texto: {
    fontSize: 12,
    color: "#777777",
  },

  textoAtivo: {
    fontSize: 12,
    color: "#A92B0D",
    fontWeight: "600",
  },

});