import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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

  const getCacheImagens = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const str = window.localStorage.getItem("chama_jussa_images_cache");
        if (str) return JSON.parse(str);
      }
    } catch (e) {}
    return {};
  };

  const salvarCacheImagem = (key, imagemUri) => {
    if (!key || !imagemUri) return;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const cache = getCacheImagens();
        const normKey = String(key).trim().toLowerCase();
        cache[normKey] = imagemUri;
        window.localStorage.setItem("chama_jussa_images_cache", JSON.stringify(cache));
      }
    } catch (e) {}
  };

  const buscarImagemCache = (item, cacheImg, itemLocal) => {
    if (itemLocal && itemLocal.imagem) {
      if (typeof itemLocal.imagem === "string" && itemLocal.imagem.length > 10) {
        return itemLocal.imagem;
      }
      if (typeof itemLocal.imagem === "number") {
        return itemLocal.imagem;
      }
    }

    const chaves = [
      item.id,
      item.idPedido,
      item.codigo,
      item.codigoOS,
      item.titulo,
      item.tituloProblema,
    ];

    for (const k of chaves) {
      if (k) {
        const norm = String(k).trim().toLowerCase();
        if (cacheImg[norm]) return cacheImg[norm];
      }
    }

    return item.imagem || null;
  };

  const [carregandoSync, setCarregandoSync] = useState(false);

  const sincronizarComBackend = async () => {
    if (!autenticado) return;
    setCarregandoSync(true);
    try {
      const dadosBackend = await api.getPedidos();
      if (dadosBackend && Array.isArray(dadosBackend)) {
        setListaOS((prevLocal) => {
          const mapLocal = {};
          prevLocal.forEach((item) => {
            if (item.id) mapLocal[String(item.id).toLowerCase()] = item;
            if (item.idPedido) mapLocal[String(item.idPedido).toLowerCase()] = item;
          });

          const idsBackend = new Set(dadosBackend.map((b) => String(b.id || b.idPedido).toLowerCase()));
          const cacheImg = getCacheImagens();

          const novosItens = dadosBackend.map((b) => {
            const idKey = String(b.id || b.idPedido).toLowerCase();
            const itemLocal = mapLocal[idKey];

            const imgSalva = buscarImagemCache(b, cacheImg, itemLocal);

            return {
              ...b,
              imagem: imgSalva || require("./assets/image 4.jpg"),
              imagemUrl: typeof imgSalva === "string" ? imgSalva : b.imagemUrl || "",
              fotoUrl: typeof imgSalva === "string" ? imgSalva : b.fotoUrl || "",
            };
          });

          // Atualiza a OS selecionada caso esteja sendo visualizada em Detalhes
          setOsSelecionada((prevSelected) => {
            if (!prevSelected) return null;
            const targetId = String(prevSelected.id || prevSelected.idPedido).toLowerCase();
            const itemAtualizado = novosItens.find(
              (it) =>
                String(it.id || it.idPedido).toLowerCase() === targetId ||
                (it.titulo && prevSelected.titulo && it.titulo.toLowerCase() === prevSelected.titulo.toLowerCase())
            );
            return itemAtualizado || prevSelected;
          });

          const itensSomenteLocais = prevLocal.filter(
            (p) => p.id && !idsBackend.has(String(p.id).toLowerCase()) && !idsBackend.has(String(p.idPedido).toLowerCase())
          );

          return [...itensSomenteLocais, ...novosItens];
        });
      }
    } catch (e) {
      console.warn("Erro na sincronização:", e);
    } finally {
      setCarregandoSync(false);
    }
  };

  // Buscar pedidos do backend ao autenticar e iniciar polling automático a cada 5 segundos
  useEffect(() => {
    if (!autenticado) return;

    sincronizarComBackend();

    const intervalId = setInterval(() => {
      sincronizarComBackend();
    }, 5000);

    return () => clearInterval(intervalId);
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

    // Recarrega os pedidos da API C# sincronizando o mapa de usuários em tempo real
    api.getPedidos().then((dadosBackend) => {
      if (dadosBackend && Array.isArray(dadosBackend)) {
        setListaOS(dadosBackend);
      }
    });
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
        window.localStorage.removeItem("chama_jussa_lista_os");
      }
    } catch (e) {}
  };

  const handleCriarOS = (novaOS) => {
    if (novaOS.imagem) {
      if (novaOS.id) salvarCacheImagem(novaOS.id, novaOS.imagem);
      if (novaOS.idPedido) salvarCacheImagem(novaOS.idPedido, novaOS.imagem);
      if (novaOS.titulo) salvarCacheImagem(novaOS.titulo, novaOS.imagem);
    }

    setListaOS((prev) => [novaOS, ...prev]);
    setOsEmEdicao(null);
    setAbaAtiva("lista");

    adicionarNotificacao(
      "Nova OS Criada",
      `A Ordem de Serviço '${novaOS.titulo}' (${novaOS.codigo}) foi aberta com sucesso.`,
      "criar"
    );

    // Envia POST para a API do backend (/api/Pedidos) e atualiza com o idPedido real do Banco de Dados
    api.criarPedido(novaOS).then((resposta) => {
      if (resposta && (resposta.idPedido || resposta.id)) {
        const idReal = resposta.idPedido || resposta.id;
        if (novaOS.imagem) {
          salvarCacheImagem(idReal, novaOS.imagem);
        }

        const nomeFinal =
          resposta.nomeUsuario ||
          resposta.NomeUsuario ||
          novaOS.solicitante ||
          novaOS.nomeSolicitante ||
          novaOS.nomeUsuario ||
          (novaOS.idUsuario === usuario?.idUsuario || novaOS.idUsuario === usuario?.id ? usuario?.nome : null) ||
          "Cliente Solicitante";

        const osSincronizada = {
          ...novaOS,
          id: idReal,
          idPedido: idReal,
          solicitante: nomeFinal,
          nomeSolicitante: nomeFinal,
          nomeUsuario: nomeFinal,
          codigo: resposta.codigo || `OS-${String(idReal).substring(0, 4).toUpperCase()}`,
          codigoOS: resposta.codigo || `OS-${String(idReal).substring(0, 4).toUpperCase()}`,
        };

        setListaOS((prev) =>
          prev.map((item) => (item.id === novaOS.id ? osSincronizada : item))
        );
        console.log("OS sincronizada com ID real da API C#:", idReal);
      }
    });
  };

  const handleAtualizarOS = (osAtualizada) => {
    if (osAtualizada.imagem) {
      if (osAtualizada.id) salvarCacheImagem(osAtualizada.id, osAtualizada.imagem);
      if (osAtualizada.idPedido) salvarCacheImagem(osAtualizada.idPedido, osAtualizada.imagem);
      if (osAtualizada.titulo) salvarCacheImagem(osAtualizada.titulo, osAtualizada.imagem);
    }

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
        if (item.id === osId || item.idPedido === osId) {
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
        `O status da ${osAlvo.codigo || osAlvo.id} foi alterado para '${novoStatus}'.`,
        "status"
      );

      // Envia PATCH ou PUT para a API do backend (/api/Pedidos/{id}/status)
      const targetId = osAlvo.idPedido || osAlvo.id || osId;
      api.atualizarStatus(targetId, novoStatus);
    }
  };

  const handleExcluirOS = async (osId) => {
    const idParaExcluir = osId || osSelecionada?.id;
    const osExcluida = listaOS.find(
      (item) => item.id === idParaExcluir || item.idPedido === idParaExcluir
    );

    setListaOS((prev) =>
      prev.filter((item) => item.id !== idParaExcluir && item.idPedido !== idParaExcluir)
    );
    setOsSelecionada(null);
    setAbaAtiva("lista");

    if (osExcluida) {
      adicionarNotificacao(
        "OS Excluída",
        `A Ordem de Serviço ${osExcluida.codigo || osExcluida.id} (${osExcluida.titulo}) foi excluída.`,
        "excluir"
      );
    }

    if (idParaExcluir) {
      await api.excluirPedido(idParaExcluir);
    }
  };

  const handleSelecionarOS = (os) => {
    setOsSelecionada(os);
    setAbaAtiva("detalhes");
  };

  const handleUpdateOSDireto = (osAtualizada) => {
    if (osAtualizada.imagem) {
      if (osAtualizada.id) salvarCacheImagem(osAtualizada.id, osAtualizada.imagem);
      if (osAtualizada.idPedido) salvarCacheImagem(osAtualizada.idPedido, osAtualizada.imagem);
      if (osAtualizada.titulo) salvarCacheImagem(osAtualizada.titulo, osAtualizada.imagem);
    }

    setListaOS((prev) =>
      prev.map((item) =>
        item.id === osAtualizada.id || item.idPedido === osAtualizada.id ? osAtualizada : item
      )
    );
    setOsSelecionada(osAtualizada);
    adicionarNotificacao(
      "Foto Atualizada",
      `A foto da Ordem de Serviço '${osAtualizada.titulo || "OS"}' foi atualizada.`,
      "editar"
    );
  };

  return (
    <SafeAreaProvider>
      {!autenticado ? (
        <View style={styles.appContainer}>
          <StatusBar style="dark" />
          <Login onLogin={handleLogin} />
        </View>
      ) : (
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
                    titulo="Minhas OS's"
                    onNovaOS={() => {
                      setOsEmEdicao(null);
                      setAbaAtiva("criar");
                    }}
                  />
                  <TaskList
                    listaOS={listaOS}
                    onSelectOS={handleSelecionarOS}
                    onRefresh={sincronizarComBackend}
                    carregando={carregandoSync}
                  />
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
                  onUpdateOS={handleUpdateOSDireto}
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
      )}
    </SafeAreaProvider>
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
