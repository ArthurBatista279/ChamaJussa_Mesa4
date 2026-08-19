import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import TaskItem from "../taskItem/TaskItem";

export default function TaskList({ listaOS = [], onSelectOS }) {
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  const dadosPadrao = [
    {
      id: "001",
      codigo: "OS - 1001",
      status: "Aberta",
      prioridade: "Alta",
      titulo: "Vazamento hidráulico",
      equipamento: "Tubulação/Sifão da Pia",
      local: "Banheiro Masculino - Bloco B - 2º Andar",
      solicitante: "Késsia Milena",
      descricao:
        "Há um vazamento constante de água por baixo da pia do banheiro masculino do segundo andar do Bloco B. Está alagando o chão e causando risco de queda.",
      data: "17/06/2026",
      imagem: require("../../../../assets/image 4.jpg"),
    },
    {
      id: "002",
      codigo: "OS - 1002",
      status: "Em Andamento",
      prioridade: "Média",
      titulo: "Troca de lâmpadas no Auditório",
      equipamento: "Lâmpadas LED 50W",
      local: "Auditório Central - Setor 03",
      solicitante: "Carlos Eduardo",
      descricao:
        "Três lâmpadas de LED do setor central do auditório estão queimadas necessitando troca urgente antes do evento.",
      data: "18/06/2026",
    },
    {
      id: "003",
      codigo: "OS - 1003",
      status: "Concluída",
      prioridade: "Baixa",
      titulo: "Manutenção no Ar Condicionado",
      equipamento: "Split Inverter 18000 BTUs",
      local: "Sala 204 - Bloco A",
      solicitante: "Mariana Souza",
      descricao:
        "Limpeza de filtros e higienização do aparelho de ar condicionado da Sala 204 finalizadas com sucesso.",
      data: "15/06/2026",
    },
  ];

  const osLista = listaOS.length > 0 ? listaOS : dadosPadrao;

  const osFiltradas = osLista.filter((os) => {
    const atendeFiltro =
      filtro === "Todos"
        ? true
        : os.status.toLowerCase() === filtro.toLowerCase();

    const atendeBusca =
      os.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      os.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      os.descricao.toLowerCase().includes(busca.toLowerCase());

    return atendeFiltro && atendeBusca;
  });

  return (
    <View style={styles.container}>
      {/* Campo de Busca */}
      <View style={styles.buscaContainer}>
        <Text style={styles.iconeBusca}>🔍</Text>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por código, título ou descrição..."
          placeholderTextColor="#94A3B8"
          value={busca}
          onChangeText={setBusca}
        />
        {busca ? (
          <TouchableOpacity onPress={() => setBusca("")}>
            <Text style={styles.limparBusca}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtros}
      >
        {["Todos", "Abertas", "Em Andamento", "Concluídas"].map((cat) => {
          const catFiltro = cat === "Abertas" ? "Aberta" : cat === "Concluídas" ? "Concluída" : cat;
          const ativo = filtro === catFiltro || (filtro === "Todos" && cat === "Todos");

          return (
            <TouchableOpacity
              key={cat}
              style={[styles.filtro, ativo && styles.filtroAtivo]}
              onPress={() => setFiltro(catFiltro)}
              activeOpacity={0.7}
            >
              <Text style={[styles.textoFiltro, ativo && styles.textoFiltroAtivo]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Resumo/Contador */}
      <View style={styles.contadorContainer}>
        <Text style={styles.textoContador}>
          Exibindo <Text style={styles.destaqueContador}>{osFiltradas.length}</Text> ordem(ns) de serviço
        </Text>
      </View>

      {/* Lista de Itens */}
      <View style={styles.lista}>
        {osFiltradas.length > 0 ? (
          osFiltradas.map((os) => (
            <TaskItem key={os.id || os.codigo} os={os} onPress={onSelectOS} />
          ))
        ) : (
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioIcone}>📋</Text>
            <Text style={styles.vazioTitulo}>Nenhuma OS encontrada</Text>
            <Text style={styles.vazioSub}>
              Tente alterar o filtro ou os termos da busca.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  iconeBusca: {
    fontSize: 16,
    marginRight: 8,
  },
  inputBusca: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    padding: 0,
  },
  limparBusca: {
    fontSize: 14,
    color: "#94A3B8",
    paddingHorizontal: 6,
  },
  filtros: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 12,
  },
  filtro: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  filtroAtivo: {
    backgroundColor: "#A92D13",
    borderColor: "#A92D13",
  },
  textoFiltro: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  textoFiltroAtivo: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  contadorContainer: {
    marginBottom: 12,
  },
  textoContador: {
    fontSize: 12,
    color: "#64748B",
  },
  destaqueContador: {
    fontWeight: "700",
    color: "#A92D13",
  },
  lista: {
    marginTop: 4,
  },
  vazioContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 10,
  },
  vazioIcone: {
    fontSize: 36,
    marginBottom: 8,
  },
  vazioTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },
  vazioSub: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
    textAlign: "center",
  },
});
