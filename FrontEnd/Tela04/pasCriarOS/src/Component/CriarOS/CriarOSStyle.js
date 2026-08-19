import { StyleSheet } from "react-native";

export const CriarOSStyle = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 34,
    paddingBottom: 25,
  },

  titulo: {
    color: "#A92B0D",
    fontSize: 21,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 25,
    marginBottom: 22,
  },

  form: {
    backgroundColor: "#C7C7C4",
    borderRadius: 9,
    paddingHorizontal: 25,
    paddingTop: 36,
    paddingBottom: 38,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 8,
  },

  vermelho: {
    color: "#A92B0D",
  },

  input: {
    width: "100%",
    height: 36,
    backgroundColor: "#F5F5F7",
    borderRadius: 5,
    paddingHorizontal: 13,
    fontSize: 13,
    color: "#222222",
    marginBottom: 9,
  },

  descricao: {
    width: "100%",
    height: 93,
    backgroundColor: "#F5F5F7",
    borderRadius: 5,
    paddingHorizontal: 13,
    paddingTop: 10,
    fontSize: 13,
    color: "#222222",
    marginBottom: 15,
  },

  botao: {
    height: 40,
    width: "100%",
    backgroundColor: "#A92B0D",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,

    elevation: 4,
  },

  textoBotao: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

});