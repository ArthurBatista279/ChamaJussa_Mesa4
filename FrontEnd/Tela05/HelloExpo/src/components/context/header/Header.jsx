import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./HeaderStyle";

export default function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.ola}>Olá, Késsia</Text>
        <Text style={styles.titulo}>Minhas OS's</Text>
      </View>

      <TouchableOpacity style={styles.botaoNova}>
        <Text style={styles.textoBotao}>Nova OS</Text>
      </TouchableOpacity>
    </View>
  );
}