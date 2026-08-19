import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";

import Login from "./src/components/context/login/Login";
import Header from "./src/components/context/header/Header";
import TaskList from "./src/components/context/taskList/TaskList";
import DetalhesOS from "./src/components/context/detalhesOS/DetalhesOS";
import FormTask from "./src/components/context/formTask/FormTask";
import Notificacoes from "./src/components/context/notificacoes/Notificacoes";
import PasPerfil from "./src/components/context/perfil/PasPerfil";
import Footer from "./src/components/context/footer/Footer";

export default function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("lista");
  const [osSelecionada, setOsSelecionada] = useState(null);
  const [usuario, setUsuario] = useState({
    nome: "Késsia Milena",
    email: "kessia@email.com",
    avatar: require("./assets/image 6.png"),
  });

  const [listaOS, setListaOS] = useState([
    {
      id: "1001",
      codigo: "OS-1001",
      status: "Aberta",
      prioridade: "Alta",
      titulo: "Vazamento hidráulico",
      equipamento: "Tubulação/Sifão da Pia",
      local: "Banheiro Masculino - Bloco B - 2º Andar",
      solicitante: "Késsia Milena",
      descricao:
        "Há um vazamento constante de água por baixo da pia do banheiro masculino do segundo andar do Bloco B. Está alagando o chão e causando risco de queda.",
      data: "17/06/2026",
      imagem: require("./assets/image 4.jpg"),
    },
    {
      id: "1002",
      codigo: "OS-1002",
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
      id: "1003",
      codigo: "OS-1003",
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
  ]);

  const handleLogin = (dadosUsuario) => {
    setUsuario((prev) => ({ ...prev, ...dadosUsuario }));
    setAutenticado(true);
    setAbaAtiva("lista");
  };

  const handleLogout = () => {
    setAutenticado(false);
    setAbaAtiva("lista");
    setOsSelecionada(null);
  };

  const handleCriarOS = (novaOS) => {
    setListaOS([novaOS, ...listaOS]);
    setAbaAtiva("lista");
  };

  const handleSelecionarOS = (os) => {
    setOsSelecionada(os);
    setAbaAtiva("detalhes");
  };

  const getTituloAba = () => {
    switch (abaAtiva) {
      case "lista":
        return "Minhas OS's";
      case "detalhes":
        return "Detalhes da OS";
      case "criar":
        return "Criar Nova OS";
      case "notificacoes":
        return "Notificações";
      case "perfil":
        return "Perfil";
      default:
        return "Minhas OS's";
    }
  };

  // Se não estiver autenticado, exibe a Tela 1 (Login)
  if (!autenticado) {
    return (
      <View style={styles.appContainer}>
        <StatusBar style="dark" />
        <Login onLogin={handleLogin} />
      </View>
    );
  }

  // Telas internas autenticadas (Telas 02 a 06)
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appContainer}>
        <StatusBar style="dark" />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {abaAtiva === "lista" && (
            <>
              <Header
                usuario={usuario.nome}
                titulo="Minhas OS's"
                onNovaOS={() => setAbaAtiva("criar")}
              />
              <TaskList listaOS={listaOS} onSelectOS={handleSelecionarOS} />
            </>
          )}

          {abaAtiva === "detalhes" && (
            <DetalhesOS
              os={osSelecionada || listaOS[0]}
              onVoltar={() => setAbaAtiva("lista")}
              onEditar={() => setAbaAtiva("criar")}
            />
          )}

          {abaAtiva === "criar" && (
            <FormTask
              onTaskCreated={handleCriarOS}
              onCancel={() => setAbaAtiva("lista")}
            />
          )}

          {abaAtiva === "notificacoes" && <Notificacoes />}

          {abaAtiva === "perfil" && (
            <PasPerfil usuario={usuario} onLogout={handleLogout} />
          )}
        </ScrollView>

        <Footer abaAtiva={abaAtiva} onTrocarAba={setAbaAtiva} />
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
  content: {
    width: "100%",
    maxWidth: 600,
    padding: 20,
    paddingBottom: 85,
  },
});
