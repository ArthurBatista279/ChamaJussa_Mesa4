import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Notificacoes({ notificacoes = [] }) {
  const getIcone = (tipo) => {
    switch (tipo) {
      case "criar":
        return { name: "plus-circle", color: "#2563EB", bg: "#EFF6FF" };
      case "editar":
        return { name: "edit-3", color: "#D97706", bg: "#FFFBEB" };
      case "status":
        return { name: "refresh-cw", color: "#059669", bg: "#ECFDF5" };
      case "excluir":
        return { name: "trash-2", color: "#DC2626", bg: "#FEF2F2" };
      default:
        return { name: "bell", color: "#A31F0A", bg: "#FFF5F5" };
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Título da Tela */}
      <Text style={styles.tituloHeader}>Notificações</Text>

      {/* Lista de Notificações */}
      {notificacoes.length > 0 ? (
        notificacoes.map((item) => {
          const iconeConfig = getIcone(item.tipo);
          return (
            <View key={item.id} style={styles.card}>
              <View style={[styles.iconeBox, { backgroundColor: iconeConfig.bg }]}>
                <Feather name={iconeConfig.name} size={20} color={iconeConfig.color} />
              </View>
              <View style={styles.conteudoBox}>
                <Text style={styles.tituloNotif}>{item.titulo}</Text>
                <Text style={styles.mensagem}>{item.mensagem}</Text>
                <Text style={styles.dataHora}>
                  {item.data} • {item.hora}
                </Text>
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.vazioContainer}>
          <View style={styles.vazioIconeCircle}>
            <Feather name="bell-off" size={32} color="#94A3B8" />
          </View>
          <Text style={styles.vazioTitulo}>Nenhuma notificação</Text>
          <Text style={styles.vazioSub}>
            As notificações de criação, atualização e alteração de status de Ordens de Serviço aparecerão aqui.
          </Text>
        </View>
      )}
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
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconeBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  conteudoBox: {
    flex: 1,
  },
  tituloNotif: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  mensagem: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 6,
  },
  dataHora: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
    textAlign: "right",
  },
  vazioContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 10,
  },
  vazioIconeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  vazioTitulo: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 6,
  },
  vazioSub: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
});
