import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TaskItem() {
  return (
    <View style={styles.card}>
      <View style={styles.topo}>
        <Text style={styles.codigo}>OS - 001</Text>

        <View style={styles.status}>
          <Text style={styles.statusTexto}>Aberta</Text>
        </View>
      </View>

      <Text style={styles.titulo}>
        Vazamento hidráulico no Bloco B
      </Text>

      <Text style={styles.descricao}>
        Há um vazamento constante de água por baixo da pia do banheiro
        masculino do segundo andar do Bloco B...
      </Text>
    </View>
  );
}

