import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function Header({ usuario = "", cargo = "Cliente", titulo = "Minhas OS's", onNovaOS }) {
  const isADM = cargo === "ADM";

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
          <View style={styles.userRow}>
            <Text style={styles.ola}>{usuario ? `Olá, ${usuario}` : "Olá!"}</Text>
            <View style={[styles.badgeCargo, isADM ? styles.badgeADM : styles.badgeCliente]}>
              <Text style={[styles.txtBadge, isADM ? styles.txtBadgeADM : styles.txtBadgeCliente]}>
                {isADM ? "ADM" : "Cliente"}
              </Text>
            </View>
          </View>
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
    marginRight: 6,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeCargo: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeADM: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
  badgeCliente: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  txtBadge: {
    fontSize: 10,
    fontWeight: "800",
  },
  txtBadgeADM: {
    color: "#991B1B",
  },
  txtBadgeCliente: {
    color: "#1E40AF",
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
