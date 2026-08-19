import { StyleSheet } from "react-native";

export default StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    height: 68,

    backgroundColor: "#D0D0CE",

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  item: {
    alignItems: "center",
    justifyContent: "center",
  },

  icone: {
    fontSize: 22,
    color: "#fff",
  },

  iconeAtivo: {
    fontSize: 22,
    color: "#A92D13",
  },

  texto: {
    color: "#fff",
    fontSize: 10,
    marginTop: 2,
  },

  textoAtivo: {
    color: "#A92D13",
    fontSize: 10,
    marginTop: 2,
  },
});