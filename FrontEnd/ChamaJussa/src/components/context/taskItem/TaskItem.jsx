import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function TaskItem({ os, onPress }) {
  const item = os || {
    id: "001",
    codigo: "OS - 001",
    status: "Aberta",
    prioridade: "Alta",
    titulo: "Vazamento hidráulico no Bloco B",
    descricao:
      "Há um vazamento constante de água por baixo da pia do banheiro masculino do segundo andar do Bloco B...",
    local: "Bloco B - Banheiro Masculino (2º Andar)",
    data: "19/08/2026",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Aberta":
        return { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" };
      case "Em Andamento":
        return { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" };
      case "Concluída":
      case "Concluida":
        return { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" };
      default:
        return { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
    }
  };

  const statusColors = getStatusColor(item.status);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress && onPress(item)}
    >
      <View style={styles.topo}>
        <View style={styles.codigoTag}>
          <Text style={styles.codigo}>{item.codigo}</Text>
        </View>

        <View
          style={[
            styles.status,
            { backgroundColor: statusColors.bg, borderColor: statusColors.border },
          ]}
        >
          <Text style={[styles.statusTexto, { color: statusColors.text }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.titulo}>{item.titulo}</Text>

      <Text style={styles.descricao} numberOfLines={3}>
        {item.descricao}
      </Text>

      <View style={styles.rodapeCard}>
        <Text style={styles.infoLocal}>📍 {item.local || "Bloco Principal"}</Text>
        <Text style={styles.infoData}>📅 {item.data || "Hoje"}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  codigoTag: {
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  codigo: {
    color: "#A92D13",
    fontSize: 13,
    fontWeight: "700",
  },
  status: {
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  statusTexto: {
    fontSize: 11,
    fontWeight: "700",
  },
  titulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
  },
  descricao: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 12,
  },
  rodapeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  infoLocal: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
  },
  infoData: {
    fontSize: 11,
    color: "#94A3B8",
  },
});
