const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  content: {
    padding: 25,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ola: {
    fontSize: 14,
    color: "#333",
  },

  titulo: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#111",
    marginTop: 3,
  },

  botaoNova: {
    backgroundColor: "#A92D13",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 5,
  },

  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },

  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 25,
  },

  filtro: {
    borderWidth: 1,
    borderColor: "#C56B58",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },

  filtroAtivo: {
    backgroundColor: "#A92D13",
  },

  textoFiltro: {
    color: "#AAA",
    fontSize: 12,
  },

  textoFiltroAtivo: {
    color: "#FFF",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#C9C9C7",
    borderRadius: 7,
    padding: 16,
    marginTop: 18,
    elevation: 3,
  },

  cardTopo: {
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
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },

  statusTexto: {
    color: "#A92D13",
    fontSize: 11,
  },

  nomeOS: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 12,
    color: "#222",
  },

  descricao: {
    fontSize: 11,
    color: "#666",
    marginTop: 7,
    lineHeight: 15,
  },

  menu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#D0D0CE",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  itemMenu: {
    alignItems: "center",
    justifyContent: "center",
  },

  icone: {
    fontSize: 22,
    color: "#FFF",
  },

  iconeAtivo: {
    fontSize: 22,
    color: "#A92D13",
  },

  textoMenu: {
    fontSize: 10,
    color: "#FFF",
    marginTop: 2,
  },

  textoMenuAtivo: {
    fontSize: 10,
    color: "#A92D13",
    marginTop: 2,
  },
});