import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Footer({ abaAtiva = "lista", onTrocarAba }) {
  const menus = [
    { id: "lista", label: "Minhas OS", icone: "📋" },
    { id: "criar", label: "Criar OS", icone: "➕" },
    { id: "notificacoes", label: "Notificações", icone: "🔔" },
    { id: "perfil", label: "Perfil", icone: "👤" },
  ];

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menu}>
        {menus.map((item) => {
          const ativo = abaAtiva === item.id || (abaAtiva === "detalhes" && item.id === "lista");
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => onTrocarAba && onTrocarAba(item.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.icone, ativo && styles.iconeAtivo]}>
                {item.icone}
              </Text>
              <Text style={[styles.texto, ativo && styles.textoAtivo]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  menu: {
    height: 62,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  icone: {
    fontSize: 18,
    color: "#94A3B8",
  },
  iconeAtivo: {
    color: "#A31F0A",
  },
  texto: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  textoAtivo: {
    color: "#A31F0A",
    fontWeight: "700",
  },
});
