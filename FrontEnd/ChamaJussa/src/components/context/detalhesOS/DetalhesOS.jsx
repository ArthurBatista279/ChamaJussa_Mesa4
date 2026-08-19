import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

export default function DetalhesOS({ os, onVoltar, onEditar }) {
  const dados = os || {
    id: "001",
    codigo: "OS-1001",
    titulo: "Vazamento hidráulico",
    data: "17/06/2026, 11:29:58",
    equipamento: "Tubulação/Sifão da Pia",
    local: "Banheiro Masculino - Bloco B - 2º Andar",
    solicitante: "Késsia Milena",
    descricao:
      "Há um vazamento constante de água por baixo da pia do banheiro masculino do segundo andar do Bloco B. Está alagando o chão e causando risco de queda.",
    imagem: require("../../../../assets/image 4.jpg"),
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Botão de Voltar e Título */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.btnVoltar} onPress={onVoltar}>
          <Text style={styles.txtVoltar}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.tituloHeader}>Detalhes da {dados.codigo || "OS-1001"}</Text>
      </View>

      {/* Card Principal */}
      <View style={styles.card}>
        <Text style={styles.tituloOS}>{dados.titulo}</Text>
        <Text style={styles.dataOS}>Criada em {dados.data || "17/06/2026, 11:29:58"}</Text>

        {/* Linhas de Informações com Ícones */}
        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <Text style={styles.icone}>🔧</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Máquina / Equipamento</Text>
              <Text style={styles.infoValor}>{dados.equipamento || "Tubulação/Sifão da Pia"}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icone}>📍</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Local / Setor</Text>
              <Text style={styles.infoValor}>
                {dados.local || "Banheiro Masculino - Bloco B - 2º Andar"}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icone}>👤</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Solicitante</Text>
              <Text style={styles.infoValorRed}>{dados.solicitante || "Késsia Milena"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Descrição do Problema */}
        <Text style={styles.secaoTituloRed}>Descrição do Problema</Text>
        <Text style={styles.descricaoTexto}>
          {dados.descricao ||
            "Há um vazamento constante de água por baixo da pia do banheiro masculino do segundo andar do Bloco B. Está alagando o chão e causando risco de queda."}
        </Text>

        {/* Foto do Problema */}
        <Text style={styles.secaoTituloRed}>Foto do Problema</Text>
        <View style={styles.imagemBox}>
          <Image
            source={
              typeof dados.imagem === "string"
                ? { uri: dados.imagem }
                : dados.imagem || require("../../../../assets/image 4.jpg")
            }
            style={styles.imagemOS}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Botão Editar Solicitação */}
      <TouchableOpacity
        style={styles.btnEditar}
        onPress={() => onEditar && onEditar(dados)}
        activeOpacity={0.8}
      >
        <Text style={styles.txtEditar}>Editar Solicitação</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  btnVoltar: {
    paddingVertical: 6,
    paddingRight: 12,
  },
  txtVoltar: {
    fontSize: 14,
    color: "#A31F0A",
    fontWeight: "700",
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  tituloOS: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  dataOS: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 18,
  },
  infoGroup: {
    gap: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icone: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  infoValor: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 1,
  },
  infoValorRed: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A31F0A",
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 18,
  },
  secaoTituloRed: {
    fontSize: 15,
    fontWeight: "800",
    color: "#A31F0A",
    marginBottom: 8,
    marginTop: 6,
  },
  descricaoTexto: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 16,
  },
  imagemBox: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  imagemOS: {
    width: "100%",
    height: "100%",
  },
  btnEditar: {
    width: "100%",
    height: 48,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  txtEditar: {
    color: "#A31F0A",
    fontSize: 15,
    fontWeight: "700",
  },
});
