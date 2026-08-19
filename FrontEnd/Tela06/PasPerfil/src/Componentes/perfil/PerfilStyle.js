import { StyleSheet } from "react-native";

export const PerfilStyle = StyleSheet.create({
//
  container: {
    flex: 1,
    backgroundColor: "#F4F5F6",
  },
//
  content: {
    flex: 1,
    paddingHorizontal: 39,
  },
//
  tituloContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 35,
  },
//
  titulo: {
    fontSize: 21,
    fontWeight: "700",
    color: "#A92B0D",
  },


//
  card: {
    width: "100%",
    height: 273,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.20,
    shadowRadius: 3,

    elevation: 5,
  },
//
  foto: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 27,
  },
//
  nome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
  },
//
  email: {
    fontSize: 15,
    color: "#777777",
  },
//
  botao: {
    width: "100%",
    height: 40,

    backgroundColor: "#A92B0D",
    borderRadius: 7,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 34,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,

    elevation: 4,
  },
//
  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

});