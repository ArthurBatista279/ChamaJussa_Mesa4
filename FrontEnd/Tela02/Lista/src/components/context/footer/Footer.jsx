import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.menu}>
      <View style={styles.item}>
        <Text style={styles.iconeAtivo}>▣</Text>
        <Text style={styles.textoAtivo}>Minhas OS</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.icone}>⊕</Text>
        <Text style={styles.texto}>Criar OS</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.icone}>♧</Text>
        <Text style={styles.texto}>Notificações</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.icone}>♙</Text>
        <Text style={styles.texto}>Perfil</Text>
      </View>
    </View>
  );
}

