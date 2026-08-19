import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.ola}>Olá, Késsia</Text>
            <Text style={styles.titulo}>Minhas OS's</Text>
          </View>

          <TouchableOpacity style={styles.botaoNova}>
            <Text style={styles.textoBotao}>Nova OS</Text>
          </TouchableOpacity>
        </View>

        {/* Filtros */}
        <View style={styles.filtros}>
          <TouchableOpacity style={[styles.filtro, styles.filtroAtivo]}>
            <Text style={styles.textoFiltroAtivo}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filtro}>
            <Text style={styles.textoFiltro}>Abertas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filtro}>
            <Text style={styles.textoFiltro}>Em Andamento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filtro}>
            <Text style={styles.textoFiltro}>Concluídas</Text>
          </TouchableOpacity>
        </View>

        {/* OS */}
        <View style={styles.card}>
          <View style={styles.cardTopo}>
            <Text style={styles.codigo}>OS - 001</Text>

            <View style={styles.status}>
              <Text style={styles.statusTexto}>Aberta</Text>
            </View>
          </View>

          <Text style={styles.nomeOS}>
            Vazamento hidráulico no Bloco B
          </Text>

          <Text style={styles.descricao}>
            Há um vazamento constante de água por baixo da pia do banheiro
            masculino do segundo andar do Bloco B...
          </Text>
        </View>
      </ScrollView>

      {/* Menu inferior */}
      <View style={styles.menu}>
        <View style={styles.itemMenu}>
          <Text style={styles.iconeAtivo}>▣</Text>
          <Text style={styles.textoMenuAtivo}>Minhas OS</Text>
        </View>

        <View style={styles.itemMenu}>
          <Text style={styles.icone}>⊕</Text>
          <Text style={styles.textoMenu}>Criar OS</Text>
        </View>

        <View style={styles.itemMenu}>
          <Text style={styles.icone}>♧</Text>
          <Text style={styles.textoMenu}>Notificações</Text>
        </View>

        <View style={styles.itemMenu}>
          <Text style={styles.icone}>♙</Text>
          <Text style={styles.textoMenu}>Perfil</Text>
        </View>
      </View>
    </View>
  );
}

