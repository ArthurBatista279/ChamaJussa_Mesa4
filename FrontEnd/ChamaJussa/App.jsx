import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Login from "./src/components/context/login/Login";
import Header from "./src/components/context/header/Header";
import TaskList from "./src/components/context/taskList/TaskList";
import DetalhesOS from "./src/components/context/detalhesOS/DetalhesOS";
import FormTask from "./src/components/context/formTask/FormTask";
import Notificacoes from "./src/components/context/notificacoes/Notificacoes";
import PasPerfil from "./src/components/context/perfil/PasPerfil";
import Footer from "./src/components/context/footer/Footer";
import { api } from "./src/services/api";

export default function App() {
  const [autenticado, setAutenticado] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const sessionStr = window.localStorage.getItem("chama_jussa_session");
        if (sessionStr) {
          const sess = JSON.parse(sessionStr);
          return Boolean(sess?.autenticado);
        }
      }
    } catch (e) {}
    return false;
  });

  const [abaAtiva, setAbaAtiva] = useState("lista");
  const [osSelecionada, setOsSelecionada] = useState(null);
  const [osEmEdicao, setOsEmEdicao] = useState(null);

  const [usuario, setUsuario] = useState(() => {
    let savedNome = "";
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const sessionStr = window.localStorage.getItem("chama_jussa_session");
        if (sessionStr) {
          const sess = JSON.parse(sessionStr);
          if (sess?.usuario) return sess.usuario;
        }
        savedNome = window.localStorage.getItem("usuario_nome") || "";
      }
    } catch (e) {}

    return {
      nome: savedNome,
      email: "usuario@email.com",
      cargo: "Cliente",
      avatar: require("./assets/image 6.png"),
    };
  });

  // Lista de OS persistida e sincronizada
  const [listaOS, setListaOS] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const osStr = window.localStorage.getItem("chama_jussa_lista_os");
        if (osStr) return JSON.parse(osStr);
      }
    } catch (e) {}
    return [];
  });

  // Notificações persistidas e sincronizadas
  const [notificacoes, setNotificacoes] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const notifStr = window.localStorage.getItem("chama_jussa_notificacoes");
        if (notifStr) return JSON.parse(notifStr);
      }
    } catch (e) {}
    return [];
  });

  // Salva Lista de OS no localStorage sempre que alterada
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("chama_jussa_lista_os", JSON.stringify(listaOS));
      }
    } catch (e) {}
  }, [listaOS]);

  // Salva Notificações no localStorage sempre que alterada
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(
          "chama_jussa_notificacoes",
          JSON.stringify(notificacoes)
        );
      }
    } catch (e) {}
  }, [notificacoes]);

  // Listener para sincronizar abas diferentes em tempo real
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.addEventListener !== "function") return;

    const handleStorageChange = (e) => {
      if (e.key === "chama_jussa_lista_os") {
        try {
          const novasOS = e.newValue ? JSON.parse(e.newValue) : [];
          setListaOS(novasOS);
        } catch (err) {}
      }
      if (e.key === "chama_jussa_notificacoes") {
        try {
          const novasNotifs = e.newValue ? JSON.parse(e.newValue) : [];
          setNotificacoes(novasNotifs);
        } catch (err) {}
      }
      if (e.key === "chama_jussa_session") {
        try {
          if (!e.newValue) {
            setAutenticado(false);
          } else {
            const sess = JSON.parse(e.newValue);
            if (sess?.usuario) setUsuario(sess.usuario);
            setAutenticado(Boolean(sess?.autenticado));
          }
        } catch (err) {}
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Buscar pedidos/OS do backend ao autenticar/iniciar o app
  useEffect(() => {
    if (autenticado) {
      api.getPedidos().then((dadosBackend) => {
        if (dadosBackend && Array.isArray(dadosBackend) && dadosBackend.length > 0) {
          setListaOS(dadosBackend);
        }
      });
    }
  }, [autenticado]);

  // Função auxiliar para gerar notificações dinâmicas
  const adicionarNotificacao = (titulo, mensagem, tipo = "info") => {
    const novaNotif = {
      id: String(Date.now() + Math.random()),
      titulo,
      mensagem,
      tipo,
      data: new Date().toLocaleDateString("pt-BR"),
      hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setNotificacoes((prev) => [novaNotif, ...prev]);
  };

  const handleLogin = (dadosUsuario) => {
    let savedNome = "";
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        savedNome = window.localStorage.getItem("usuario_nome") || "";
      }
    } catch (e) {}

    const nomeFinal =
      dadosUsuario?.nome !== undefined && dadosUsuario?.nome !== ""
        ? dadosUsuario.nome
        : savedNome;

    const usuarioAtualizado = {
      ...usuario,
      ...dadosUsuario,
      nome: nomeFinal,
    };

    setUsuario(usuarioAtualizado);
    setAutenticado(true);
    setAbaAtiva("lista");

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(
          "chama_jussa_session",
          JSON.stringify({ autenticado: true, usuario: usuarioAtualizado })
        );
      }
    } catch (e) {}
  };

  const handleUpdateUsuario = (novosDados) => {
    setUsuario((prev) => {
      const atualizado = { ...prev, ...novosDados };
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          if (atualizado.nome !== undefined) {
            window.localStorage.setItem("usuario_nome", atualizado.nome);
          }
          window.localStorage.setItem(
            "chama_jussa_session",
            JSON.stringify({ autenticado: true, usuario: atualizado })
          );
        }
      } catch (e) {}
      return atualizado;
    });
  };

  const handleLogout = () => {
    setAutenticado(false);
    setAbaAtiva("lista");
    setOsSelecionada(null);
    setOsEmEdicao(null);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("chama_jussa_session");
      }
    } catch (e) {}
  };

  const handleCriarOS = (novaOS) => {
    setListaOS([novaOS, ...listaOS]);
    setOsEmEdicao(null);
    setAbaAtiva("lista");

    adicionarNotificacao(
      "Nova OS Criada",
      `A Ordem de Serviço '${novaOS.titulo}' (${novaOS.codigo}) foi aberta com sucesso.`,
      "criar"
    );

    // Envia POST para a API do backend (/api/Pedidos) para gravar no Banco de Dados
    api.criarPedido(novaOS).then((resposta) => {
      if (resposta) {
        console.log("Pedido salvo com sucesso na API/Banco de Dados:", resposta);
      }
    });
  };

  const handleAtualizarOS = (osAtualizada) => {
    setListaOS((prev) =>
      prev.map((item) => (item.id === osAtualizada.id ? osAtualizada : item))
    );
    setOsSelecionada(osAtualizada);
    setOsEmEdicao(null);
    setAbaAtiva("detalhes");

    adicionarNotificacao(
      "OS Atualizada",
      `A Ordem de Serviço '${osAtualizada.titulo}' (${osAtualizada.codigo}) foi alterada com sucesso.`,
      "editar"
    );

    // Envia PUT para a API do backend (/api/Pedidos/{id})
    api.atualizarPedido(osAtualizada.id, osAtualizada);
  };

  const handleMudarStatusOS = (osId, novoStatus) => {
    let osAlvo = null;
    setListaOS((prev) =>
      prev.map((item) => {
        if (item.id === osId) {
          osAlvo = { ...item, status: novoStatus, statusOS: novoStatus };
          return osAlvo;
        }
        return item;
      })
    );
    if (osAlvo) {
      setOsSelecionada(osAlvo);
      adicionarNotificacao(
        "Status Alterado",
        `O status da ${osAlvo.codigo} foi alterado para '${novoStatus}'.`,
        "status"
      );

      // Envia PUT para a API do backend (/api/Pedidos/{id})
      api.atualizarPedido(osId, osAlvo);
    }
  };

  const handleExcluirOS = (osId) => {
    const osExcluida = listaOS.find((item) => item.id === osId);
    setListaOS((prev) => prev.filter((item) => item.id !== osId));
    setOsSelecionada(null);
    setAbaAtiva("lista");

    if (osExcluida) {
      adicionarNotificacao(
        "OS Excluída",
        `A Ordem de Serviço ${osExcluida.codigo} (${osExcluida.titulo}) foi excluída.`,
        "excluir"
      );

      // Envia DELETE para a API do backend (/api/Pedidos/{id})
      api.excluirPedido(osId);
    }
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
        return osEmEdicao ? "Edição de OS" : "Criar Nova OS";
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
          style={styles.mainScrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {abaAtiva === "lista" && (
            <>
              <Header
                usuario={usuario.nome}
                cargo={usuario.cargo}
                titulo="Minhas OS's"
                onNovaOS={() => {
                  setOsEmEdicao(null);
                  setAbaAtiva("criar");
                }}
              />
              <TaskList listaOS={listaOS} onSelectOS={handleSelecionarOS} />
            </>
          )}

          {abaAtiva === "detalhes" && (
            <DetalhesOS
              os={osSelecionada || (listaOS.length > 0 ? listaOS[0] : null)}
              usuario={usuario}
              onVoltar={() => setAbaAtiva("lista")}
              onEditar={(osParaEditar) => {
                setOsEmEdicao(osParaEditar);
                setAbaAtiva("criar");
              }}
              onMudarStatus={handleMudarStatusOS}
              onExcluir={handleExcluirOS}
            />
          )}

          {abaAtiva === "criar" && (
            <FormTask
              usuario={usuario}
              taskToEdit={osEmEdicao}
              onTaskCreated={handleCriarOS}
              onTaskUpdated={handleAtualizarOS}
              onCancel={() => {
                setOsEmEdicao(null);
                setAbaAtiva("lista");
              }}
            />
          )}

          {abaAtiva === "notificacoes" && <Notificacoes notificacoes={notificacoes} />}

          {abaAtiva === "perfil" && (
            <PasPerfil
              usuario={usuario}
              onLogout={handleLogout}
              onUpdateUsuario={handleUpdateUsuario}
            />
          )}
        </ScrollView>

        <Footer
          abaAtiva={abaAtiva}
          onTrocarAba={(novaAba) => {
            if (novaAba === "criar") {
              setOsEmEdicao(null);
            }
            setAbaAtiva(novaAba);
          }}
        />
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
    paddingBottom: 95,
    alignSelf: "center",
    flexGrow: 1,
  },
});
