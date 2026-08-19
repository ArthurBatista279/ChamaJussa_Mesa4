import React from "react";
import { View, Text } from "react-native";
import styles from "./FooterStyle";

export default function Footer() {
  return (
    <View style={styles.footer}>

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