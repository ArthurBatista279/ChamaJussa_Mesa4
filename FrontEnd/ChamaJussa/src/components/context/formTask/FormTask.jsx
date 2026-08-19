import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

export default function FormTask({ onTaskCreated, onCancel }) {
  const [titulo, setTitulo] = useState("");
  const [equipamento, setEquipamento] = useState("");
  const [setor, setSetor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");

  const handleAbrirOS = () => {
    if (!titulo.trim() || !descricao.trim()) {
      if (typeof window !== "undefined") {
        window.alert("Por favor, preencha todos os campos obrigatórios.");
      } else {
        Alert.alert("Atenção", "Preencha os campos obrigatórios (*).");
      }
      return;
    }

    const novaOS = {
      id: String(Date.now()),
      codigo: `OS - ${Math.floor(Math.random() * 9000 + 1000)}`,
      status: "Aberta",
      titulo,
      equipamento: equipamento || "Equipamento Geral",
      local: setor || "Bloco Principal",
      solicitante: "Késsia Milena",
      descricao,
      imagem: imagem || require("../../../../assets/image 4.jpg"),
      data: new Date().toLocaleDateString("pt-BR"),
    };

    if (onTaskCreated) {
      onTaskCreated(novaOS);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Título da Tela */}
      <Text style={styles.tituloHeader}>Criar ordem de serviço</Text>

      <View style={styles.cardForm}>
        {/* Título do problema */}
        <View style={styles.grupoInput}>
          <Text style={styles.label}>
            Título do problema <Text style={styles.asterisco}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Vazamento da pia"
            placeholderTextColor="#94A3B8"
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        {/* Máquina / Equipamento */}
        <View style={styles.grupoInput}>
          <Text style={styles.label}>
            Máquina / Equipamento <Text style={styles.asterisco}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Vazamento da pia"
            placeholderTextColor="#94A3B8"
            value={equipamento}
            onChangeText={setEquipamento}
          />
        </View>

        {/* Local / Setor */}
        <View style={styles.grupoInput}>
          <Text style={styles.label}>
            Local / Setor <Text style={styles.asterisco}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Vazamento da pia"
            placeholderTextColor="#94A3B8"
            value={setor}
            onChangeText={setSetor}
          />
        </View>

        {/* Descrição do problema */}
        <View style={styles.grupoInput}>
          <Text style={styles.label}>
            Descrição do problema <Text style={styles.asterisco}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ex: Vazamento da pia"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        {/* Imagem / Foto do problema */}
        <View style={styles.grupoInput}>
          <Text style={styles.label}>
            Imagem / Foto do problema <Text style={styles.asterisco}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Insira imagem"
            placeholderTextColor="#94A3B8"
            value={imagem}
            onChangeText={setImagem}
          />
        </View>

        {/* Botão Abrir Ordem de Serviço */}
        <TouchableOpacity style={styles.btnAbrirOS} onPress={handleAbrirOS} activeOpacity={0.85}>
          <Text style={styles.txtAbrirOS}>Abrir Ordem de Serviço</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  tituloHeader: {
    fontSize: 22,
    fontWeight: "800",
    color: "#A31F0A",
    textAlign: "center",
    marginBottom: 16,
  },
  cardForm: {
    backgroundColor: "#CCCCCC",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#B0B0B0",
  },
  grupoInput: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 6,
  },
  asterisco: {
    color: "#A31F0A",
    fontWeight: "800",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  btnAbrirOS: {
    width: "100%",
    height: 48,
    backgroundColor: "#A31F0A",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  txtAbrirOS: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
