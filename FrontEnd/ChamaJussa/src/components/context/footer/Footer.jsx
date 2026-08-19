import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Footer({ abaAtiva = "lista", onTrocarAba }) {
  const menus = [
    { id: "lista", label: "Minhas OS", icone: "clipboard" },
    { id: "criar", label: "Criar OS", icone: "plus-circle" },
    { id: "notificacoes", label: "Notificações", icone: "bell" },
    { id: "perfil", label: "Perfil", icone: "user" },
  ];

  return (
    <View style={styles.menuContainer}>
      <View style={styles.menu}>
        {menus.map((item) => {
          const ativo =
            abaAtiva === item.id ||
            (abaAtiva === "detalhes" && item.id === "lista");
          const corIcone = ativo ? "#A31F0A" : "#64748B";

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => onTrocarAba && onTrocarAba(item.id)}
              activeOpacity={0.7}
            >
              <Feather name={item.icone} size={22} color={corIcone} />
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
    ...Platform.select({
      web: { boxShadow: "0px -3px 6px rgba(0, 0, 0, 0.05)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 8,
      },
    }),
  },
  menu: {
    height: 64,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 8,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 6,
  },
  texto: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "500",
  },
  textoAtivo: {
    color: "#A31F0A",
    fontWeight: "700",
  },
});

