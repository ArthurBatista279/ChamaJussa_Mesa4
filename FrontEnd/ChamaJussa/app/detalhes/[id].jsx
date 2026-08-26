import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import DetalhesOS from "../../src/components/context/detalhesOS/DetalhesOS";
import { useApp } from "../../src/context/AppContext";

export default function DetalhesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const {
    usuario,
    listaOS,
    osSelecionada,
    setOsEmEdicao,
    handleMudarStatusOS,
    handleExcluirOS,
  } = useApp();

  const currentOS =
    (osSelecionada && (osSelecionada.id === id || osSelecionada.idPedido === id))
      ? osSelecionada
      : listaOS.find((item) => String(item.id) === String(id) || String(item.idPedido) === String(id)) ||
        listaOS[0] ||
        null;

  const handleVoltar = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleEditar = (osParaEditar) => {
    setOsEmEdicao(osParaEditar);
    router.push("/criar");
  };

  const handleExcluir = async (osId) => {
    await handleExcluirOS(osId);
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appContainer}>
        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <DetalhesOS
            os={currentOS}
            usuario={usuario}
            onVoltar={handleVoltar}
            onEditar={handleEditar}
            onMudarStatus={handleMudarStatusOS}
            onExcluir={handleExcluir}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  appContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    width: "100%",
  },
  mainScrollView: {
    width: "100%",
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 600,
    padding: 20,
    paddingBottom: 30,
    alignSelf: "center",
    flexGrow: 1,
  },
});
