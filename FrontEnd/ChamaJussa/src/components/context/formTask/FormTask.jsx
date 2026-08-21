import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { generateGuid } from "../../../services/api";

export default function FormTask({
  usuario,
  taskToEdit,
  onTaskCreated,
  onTaskUpdated,
  onCancel,
}) {
  const isEditing = Boolean(taskToEdit);

  const [titulo, setTitulo] = useState(taskToEdit?.titulo || "");
  const [equipamento, setEquipamento] = useState(taskToEdit?.equipamento || "");
  const [setor, setSetor] = useState(taskToEdit?.local || "");
  const [solicitante, setSolicitante] = useState(
    taskToEdit?.solicitante || usuario?.nome || ""
  );
  const [descricao, setDescricao] = useState(taskToEdit?.descricao || "");
  const [imagem, setImagem] = useState(
    typeof taskToEdit?.imagem === "string" ? taskToEdit.imagem : ""
  );

  useEffect(() => {
    if (taskToEdit) {
      setTitulo(taskToEdit.titulo || taskToEdit.tituloProblema || "");
      setEquipamento(taskToEdit.equipamento || taskToEdit.maquinaEquipamento || "");
      setSetor(taskToEdit.local || taskToEdit.setor || taskToEdit.localSetor || "");
      setSolicitante(taskToEdit.solicitante || taskToEdit.nomeSolicitante || usuario?.nome || "");
      setDescricao(taskToEdit.descricao || taskToEdit.descricaoProblema || "");
      setImagem(
        typeof taskToEdit.imagem === "string"
          ? taskToEdit.imagem
          : taskToEdit.imagemUrl || taskToEdit.fotoUrl || ""
      );
    } else {
      setTitulo("");
      setEquipamento("");
      setSetor("");
      setSolicitante(usuario?.nome || "");
      setDescricao("");
      setImagem("");
    }
  }, [taskToEdit, usuario]);

  const handleSalvarOS = () => {
    if (!titulo.trim() || !descricao.trim()) {
      if (typeof window !== "undefined") {
        window.alert("Por favor, preencha todos os campos obrigatórios.");
      } else {
        Alert.alert("Atenção", "Preencha os campos obrigatórios (*).");
      }
      return;
    }

    const dataAtual = new Date().toLocaleDateString("pt-BR");

    if (isEditing) {
      const osAtualizada = {
        ...taskToEdit,
        titulo: titulo.trim(),
        tituloProblema: titulo.trim(),
        equipamento: equipamento.trim() || "Equipamento Geral",
        maquinaEquipamento: equipamento.trim() || "Equipamento Geral",
        local: setor.trim() || "Bloco Principal",
        setor: setor.trim() || "Bloco Principal",
        localSetor: setor.trim() || "Bloco Principal",
        solicitante: solicitante.trim() || usuario?.nome || "Solicitante",
        nomeSolicitante: solicitante.trim() || usuario?.nome || "Solicitante",
        descricao: descricao.trim(),
        descricaoProblema: descricao.trim(),
        imagem: imagem.trim() || taskToEdit.imagem || require("../../../../assets/image 4.jpg"),
        imagemUrl: imagem.trim() || taskToEdit.imagemUrl || "",
        fotoUrl: imagem.trim() || taskToEdit.fotoUrl || "",
      };
      if (onTaskUpdated) {
        onTaskUpdated(osAtualizada);
      }
    } else {
      const nomeCriador = solicitante.trim() || usuario?.nome || "Cliente Solicitante";
      const novoId = generateGuid();
      const codigoGerado = `OS-${novoId.substring(0, 4).toUpperCase()}`;
      const novaOS = {
        id: novoId,
        idPedido: novoId,
        codigo: codigoGerado,
        codigoOS: codigoGerado,
        status: "Aberta",
        statusOS: "Aberta",
        titulo: titulo.trim(),
        tituloProblema: titulo.trim(),
        equipamento: equipamento.trim() || "Equipamento Geral",
        maquinaEquipamento: equipamento.trim() || "Equipamento Geral",
        local: setor.trim() || "Bloco Principal",
        setor: setor.trim() || "Bloco Principal",
        localSetor: setor.trim() || "Bloco Principal",
        solicitante: nomeCriador,
        nomeSolicitante: nomeCriador,
        nomeUsuario: nomeCriador,
        descricao: descricao.trim(),
        descricaoProblema: descricao.trim(),
        imagem: imagem.trim() || require("../../../../assets/image 4.jpg"),
        imagemUrl: imagem.trim() || "",
        fotoUrl: imagem.trim() || "",
        data: dataAtual,
        dataCriacao: dataAtual,
        createdAt: new Date().toISOString(),
        idUsuario: usuario?.idUsuario || usuario?.id,
      };
      if (onTaskCreated) {
        onTaskCreated(novaOS);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Título da Tela */}
      <Text style={styles.tituloHeader}>
        {isEditing ? "Edição de Ordem de Serviço" : "Criar ordem de serviço"}
      </Text>

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
            placeholder="Ex: Banheiro Masculino"
            placeholderTextColor="#94A3B8"
            value={setor}
            onChangeText={setSetor}
          />
        </View>

        {/* Nome do Solicitante */}
        <View style={styles.grupoInput}>
          <Text style={styles.label}>
            Nome do Solicitante <Text style={styles.asterisco}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do solicitante"
            placeholderTextColor="#94A3B8"
            value={solicitante}
            onChangeText={setSolicitante}
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

        {/* Botão Salvar / Abrir Ordem de Serviço */}
        <TouchableOpacity style={styles.btnAbrirOS} onPress={handleSalvarOS} activeOpacity={0.85}>
          <Text style={styles.txtAbrirOS}>
            {isEditing ? "Salvar Alterações" : "Abrir Ordem de Serviço"}
          </Text>
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
