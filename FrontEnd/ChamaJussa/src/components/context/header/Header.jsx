import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function Header({ usuario = "Késsia", titulo = "Minhas OS's", onNovaOS }) {
  return (
    <View style={styles.headerContainer}>
      {/* Top Logo */}
      <View style={styles.topLogoRow}>
        <Image
          source={require("../../../../assets/logo.png")}
          style={styles.logoImg}
          resizeMode="contain"
        />
      </View>

      {/* Main Header Content */}
      <View style={styles.header}>
        <View style={styles.greetingBox}>
          <Text style={styles.ola}>Olá, {usuario}</Text>
          <Text style={styles.titulo}>{titulo}</Text>
        </View>

        {onNovaOS && (
          <TouchableOpacity style={styles.botaoNova} onPress={onNovaOS} activeOpacity={0.85}>
            <Text style={styles.textoBotao}>Nova OS</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 16,
    width: "100%",
  },
  topLogoRow: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  logoImg: {
    width: 80,
    height: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingBox: {
    flex: 1,
  },
  ola: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },
  botaoNova: {
    backgroundColor: "#A31F0A",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
});
