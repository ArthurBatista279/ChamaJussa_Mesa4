import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AppContext = createContext({});

export function AppProvider({ children }) {
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

  const [osSelecionada, setOsSelecionada] = useState(null);
  const [osEmEdicao, setOsEmEdicao] = useState(null);

  const [usuario, setUsuario] = useState(() => {
    let savedNome = "";
    let savedAvatar = null;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const sessionStr = window.localStorage.getItem("chama_jussa_session");
        if (sessionStr) {
          const sess = JSON.parse(sessionStr);
          if (sess?.usuario) return sess.usuario;
        }
        savedNome = window.localStorage.getItem("usuario_nome") || "";
        savedAvatar = window.localStorage.getItem("usuario_avatar") || null;
      }
    } catch (e) {}

    return {
      nome: savedNome,
      email: "usuario@email.com",
      cargo: "Cliente",
      avatar: savedAvatar || require("../../assets/image 6.png"),
    };
  });

  const [listaOS, setListaOS] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const osStr = window.localStorage.getItem("chama_jussa_lista_os");
        if (osStr) return JSON.parse(osStr);
      }
    } catch (e) {}
    return [];
  });

  const [notificacoes, setNotificacoes] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const notifStr = window.localStorage.getItem("chama_jussa_notificacoes");
        if (notifStr) return JSON.parse(notifStr);
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("chama_jussa_lista_os", JSON.stringify(listaOS));
      }
    } catch (e) {}
  }, [listaOS]);

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

  useEffect(() => {
    if (autenticado) {
      api.getPedidos().then((dadosBackend) => {
        if (dadosBackend && Array.isArray(dadosBackend) && dadosBackend.length > 0) {
          setListaOS(dadosBackend);
        }
      });
    }
  }, [autenticado]);

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
    let savedAvatar = null;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        savedNome = window.localStorage.getItem("usuario_nome") || "";
        savedAvatar = window.localStorage.getItem("usuario_avatar") || null;
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
      avatar: dadosUsuario?.avatar || usuario?.avatar || savedAvatar || require("../../assets/image 6.png"),
    };

    setUsuario(usuarioAtualizado);
    setAutenticado(true);

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(
          "chama_jussa_session",
          JSON.stringify({ autenticado: true, usuario: usuarioAtualizado })
        );
      }
    } catch (e) {}

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
          if (atualizado.avatar !== undefined && typeof atualizado.avatar === "string") {
            window.localStorage.setItem("usuario_avatar", atualizado.avatar);
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
    setListaOS((prev) => [novaOS, ...prev]);
    setOsEmEdicao(null);

    adicionarNotificacao(
      "Nova OS Criada",
      `A Ordem de Serviço '${novaOS.titulo}' (${novaOS.codigo}) foi aberta com sucesso.`,
      "criar"
    );

    api.criarPedido(novaOS).then((resposta) => {
      if (resposta && (resposta.idPedido || resposta.id)) {
        const idReal = resposta.idPedido || resposta.id;
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
      }
    });
  };

  const handleAtualizarOS = (osAtualizada) => {
    setListaOS((prev) =>
      prev.map((item) => (item.id === osAtualizada.id ? osAtualizada : item))
    );
    setOsSelecionada(osAtualizada);
    setOsEmEdicao(null);

    adicionarNotificacao(
      "OS Atualizada",
      `A Ordem de Serviço '${osAtualizada.titulo}' (${osAtualizada.codigo}) foi alterada com sucesso.`,
      "editar"
    );

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

  return (
    <AppContext.Provider
      value={{
        autenticado,
        usuario,
        listaOS,
        notificacoes,
        osSelecionada,
        osEmEdicao,
        setOsSelecionada,
        setOsEmEdicao,
        handleLogin,
        handleLogout,
        handleUpdateUsuario,
        handleCriarOS,
        handleAtualizarOS,
        handleMudarStatusOS,
        handleExcluirOS,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
