import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Notificacoes() {
  const listaNotificacoes = [
    {
      id: "1",
      titulo: "Ordem de Serviço finalizada",
      mensagem: "Sua OS foi finalizada, logo ela voltará para sua sala.",
      data: "22/06/2026",
      hora: "16:03",
    },
    {
      id: "2",
      titulo: "Ordem de Serviço finalizada",
      mensagem: "Sua OS foi finalizada, logo ela voltará para sua sala.",
      data: "22/06/2026",
      hora: "16:03",
    },
    {
      id: "3",
      titulo: "Ordem de Serviço finalizada",
      mensagem: "Sua OS foi finalizada, logo ela voltará para sua sala.",
      data: "22/06/2026",
      hora: "16:03",
    },
    {
      id: "4",
      titulo: "Ordem de Serviço finalizada",
      mensagem: "Sua OS foi finalizada, logo ela voltará para sua sala.",
      data: "22/06/2026",
      hora: "16:03",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Título da Tela */}
      <Text style={styles.tituloHeader}>Notificações</Text>

      {/* Lista de Notificações */}
      {listaNotificacoes.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.iconeBox}>
            <Text style={styles.iconeTxt}>📣</Text>
          </View>
          <View style={styles.conteudoBox}>
            <Text style={styles.tituloNotif}>{item.titulo}</Text>
            <Text style={styles.mensagem}>{item.mensagem}</Text>
            <Text style={styles.dataHora}>
              {item.data} {item.hora}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  tituloHeader: {
    fontSize: 22,
    fontWeight: "800",
    color: "#A31F0A",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#EBECEE",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconeBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#A31F0A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconeTxt: {
    fontSize: 20,
  },
  conteudoBox: {
    flex: 1,
  },
  tituloNotif: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  mensagem: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
    marginBottom: 6,
  },
  dataHora: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "right",
  },
});
