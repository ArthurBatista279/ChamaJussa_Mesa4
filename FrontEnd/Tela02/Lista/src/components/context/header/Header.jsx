import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.ola}>Olá, Késsia</Text>
        <Text style={styles.titulo}>Minhas OS's</Text>
      </View>

      <TouchableOpacity style={styles.botao}>
        <Text style={styles.botaoTexto}>Nova OS</Text>
      </TouchableOpacity>
    </View>
  );
}

