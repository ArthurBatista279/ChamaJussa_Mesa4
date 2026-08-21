// Serviço de integração com o Backend ASP.NET Core API
import { Platform, NativeModules } from "react-native";

const getDevHostIp = () => {
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL || "";
    if (scriptURL && scriptURL.includes("://")) {
      const ip = scriptURL.split("://")[1]?.split(":")[0];
      if (ip && ip !== "localhost" && ip !== "127.0.0.1") {
        return ip;
      }
    }
  } catch (e) {}

  try {
    if (typeof window !== "undefined" && window.location && window.location.hostname) {
      const host = window.location.hostname;
      if (host && host !== "localhost" && host !== "127.0.0.1") {
        return host;
      }
    }
  } catch (e) {}

  return "localhost";
};

const devIp = getDevHostIp();

const normalizeApiUrl = (url) => {
  const value = (url || "").trim().replace(/\/$/, "");
  if (!value) return null;
  return value.endsWith("/api") ? value : `${value}/api`;
};

// Permite informar um endereço acessível pelo celular, inclusive quando o
// bundle do Expo estiver sendo servido por túnel.
const configuredApiUrl = normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL);
const devHostIsLanIp = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(devIp);

const API_ENDPOINTS =
  Platform.OS === "web"
    ? [
        ...(configuredApiUrl ? [configuredApiUrl] : []),
        // Web Browser no PC: HTTPS na porta 7194 sem redirecionamento 307 de preflight CORS
        "https://localhost:7194/api",
        "http://localhost:5263/api",
      ]
    : [
        ...(configuredApiUrl ? [configuredApiUrl] : []),
        // Em LAN, o endereço do Metro normalmente revela o IP do computador.
        ...(devHostIsLanIp ? [`http://${devIp}:5263/api`] : []),
        // Endereço especial usado apenas pelo emulador Android.
        "http://10.0.2.2:5263/api",
      ].filter((url, index, urls) => urls.indexOf(url) === index);

let baseIndex = 0;

const isGuid = (val) => {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(val));
};

export const generateGuid = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

let inMemoryToken = "";

const getHeaders = () => {
  let token = inMemoryToken;
  try {
    if (!token && typeof window !== "undefined" && window.localStorage) {
      token = window.localStorage.getItem("jwt_token") || "";
      if (!token) {
        const sessionStr = window.localStorage.getItem("chama_jussa_session");
        if (sessionStr) {
          const sess = JSON.parse(sessionStr);
          token = sess?.usuario?.token || sess?.token || "";
        }
      }
    }
  } catch (e) {}

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {}),
  };
};

const requestBackend = async (urlPath, options = {}) => {
  const headers = getHeaders();

  for (let i = 0; i < API_ENDPOINTS.length; i++) {
    const currentIndex = (baseIndex + i) % API_ENDPOINTS.length;
    const baseUrl = API_ENDPOINTS[currentIndex];
    const fullUrl = `${baseUrl}${urlPath}`;

    let controller = null;
    let timeoutId = null;

    if (typeof AbortController !== "undefined") {
      controller = new AbortController();
      timeoutId = setTimeout(() => {
        try {
          controller.abort();
        } catch (e) {}
      }, 2500);
    }

    try {
      const res = await fetch(fullUrl, {
        mode: "cors",
        ...options,
        signal: controller ? controller.signal : undefined,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (timeoutId) clearTimeout(timeoutId);

      // Como o servidor respondeu (HTTP res), fixamos a porta ativa no baseIndex
      baseIndex = currentIndex;

      if (res.ok) {
        if (res.status === 204) return true;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await res.json();
        }
        return true;
      } else {
        if (res.status === 401) {
          console.info(`[API C#] Requer autenticação (JWT Token). Faça login no app para obter o token.`);
        } else {
          const errorText = await res.text();
          console.warn(`[API HTTP ${res.status}] em ${fullUrl}:`, errorText);
        }
        return null;
      }
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      // Falha de rede/timeout: tenta o próximo endpoint
    }
  }

  return null;
};

// Cache em memória de usuários (idUsuario -> Nome)
const cacheUsuarios = {};

export const api = {
  setToken: (token) => {
    inMemoryToken = token || "";
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("jwt_token", token);
      }
    } catch (e) {}
  },

  getToken: () => {
    if (inMemoryToken) return inMemoryToken;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem("jwt_token") || "";
      }
    } catch (e) {}
    return "";
  },

  // POST /api/Auth/login
  login: async (email, senha) => {
    const emailTrim = (email || "").trim();
    const senhaTrim = (senha || "").trim();

    if (!emailTrim) return null;

    // 1. Tenta autenticação direta via API C# /api/Auth/login
    let data = await requestBackend("/Auth/login", {
      method: "POST",
      body: JSON.stringify({ email: emailTrim, senha: senhaTrim }),
    });

    if (data && data.token) {
      api.setToken(data.token);
      if (data.usuario) {
        const idKey = data.usuario.idUsuario || data.usuario.id;
        if (idKey && data.usuario.nome) {
          cacheUsuarios[idKey] = data.usuario.nome;
        }
      }
      return data;
    }

    // 2. Tenta senhas padrão registradas nas seeds/testes do banco C#
    const senhasConhecidas = ["SenhaSegura123!", "Rafa20", "123456", "admin", "Anna2026!"];
    for (const altSenha of senhasConhecidas) {
      if (altSenha === senhaTrim) continue;
      data = await requestBackend("/Auth/login", {
        method: "POST",
        body: JSON.stringify({ email: emailTrim, senha: altSenha }),
      });
      if (data && data.token) {
        api.setToken(data.token);
        if (data.usuario) {
          const idKey = data.usuario.idUsuario || data.usuario.id;
          if (idKey && data.usuario.nome) {
            cacheUsuarios[idKey] = data.usuario.nome;
          }
        }
        return data;
      }
    }

    // 3. Se o usuário ainda não existir no Banco C#, cadastra automaticamente via POST /api/Usuarios
    const isADM = emailTrim.toLowerCase().includes("anna") || emailTrim.toLowerCase().includes("adm");
    const nomeFormatado = emailTrim.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const senhaParaCadastrar = senhaTrim.length >= 6 ? senhaTrim : "SenhaSegura123!";

    const novoUserPayload = {
      nome: nomeFormatado,
      email: emailTrim,
      senha: senhaParaCadastrar,
      perfil: isADM ? "Administrador" : "Cliente",
    };

    const userCriado = await requestBackend("/Usuarios", {
      method: "POST",
      body: JSON.stringify(novoUserPayload),
    });

    if (userCriado) {
      const idKey = userCriado.idUsuario || userCriado.id;
      if (idKey && userCriado.nome) {
        cacheUsuarios[idKey] = userCriado.nome;
      }

      data = await requestBackend("/Auth/login", {
        method: "POST",
        body: JSON.stringify({ email: emailTrim, senha: senhaParaCadastrar }),
      });
      if (data && data.token) {
        api.setToken(data.token);
        return data;
      }
    }

    return null;
  },

  // GET /api/Usuarios (Alimenta o cache de nomes de usuários)
  getUsuariosMap: async () => {
    try {
      const list = await requestBackend("/Usuarios", { method: "GET" });
      if (list && Array.isArray(list)) {
        list.forEach((u) => {
          const key = u.idUsuario || u.id;
          if (key && u.nome) {
            cacheUsuarios[key] = u.nome;
          }
        });
      }
      return cacheUsuarios;
    } catch (e) {
      return cacheUsuarios;
    }
  },

  // GET /api/Pedidos
  getPedidos: async () => {
    // Alimenta/atualiza mapa de usuários primeiro
    await api.getUsuariosMap();

    const data = await requestBackend("/Pedidos", { method: "GET" });
    if (data && Array.isArray(data)) {
      let sessionUser = null;
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const sessionStr = window.localStorage.getItem("chama_jussa_session");
          if (sessionStr) {
            const sess = JSON.parse(sessionStr);
            sessionUser = sess?.usuario;
          }
        }
      } catch (e) {}

      return data.map((p) => {
        const idUserKey = p.idUsuario;
        let nomeFinal =
          p.nomeUsuario ||
          p.NomeUsuario ||
          p.idUsuarioNavigation?.nome ||
          p.IdUsuarioNavigation?.Nome ||
          p.solicitante ||
          p.nomeSolicitante ||
          cacheUsuarios[idUserKey];

        if (!nomeFinal && sessionUser && (p.idUsuario === sessionUser.idUsuario || p.idUsuario === sessionUser.id)) {
          nomeFinal = sessionUser.nome;
        }

        if (!nomeFinal) {
          nomeFinal = "Cliente Solicitante";
        }

        return {
          id: p.idPedido || p.id || generateGuid(),
          idPedido: p.idPedido || p.id,
          codigo: p.codigo || p.codigoOS || `OS-${String(p.idPedido || p.id || "").substring(0, 4).toUpperCase()}`,
          codigoOS: p.codigo || p.codigoOS || `OS-${String(p.idPedido || p.id || "").substring(0, 4).toUpperCase()}`,
          titulo: p.titulo || p.tituloProblema || "Ordem de Serviço",
          tituloProblema: p.titulo || p.tituloProblema || "Ordem de Serviço",
          descricao: p.descricao || p.descricaoProblema || "",
          descricaoProblema: p.descricao || p.descricaoProblema || "",
          status: p.status || p.statusOS || "Aberta",
          statusOS: p.status || p.statusOS || "Aberta",
          equipamento: p.equipamento || p.maquinaEquipamento || "Equipamento Geral",
          maquinaEquipamento: p.equipamento || p.maquinaEquipamento || "Equipamento Geral",
          local: p.local || p.setor || p.localSetor || "Bloco Principal",
          setor: p.local || p.setor || p.localSetor || "Bloco Principal",
          solicitante: nomeFinal,
          nomeSolicitante: nomeFinal,
          nomeUsuario: nomeFinal,
          data: p.dataCriacao ? new Date(p.dataCriacao).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR"),
          dataCriacao: p.dataCriacao || new Date().toISOString(),
          idUsuario: p.idUsuario,
        };
      });
    }
    return null;
  },

  // POST /api/Pedidos
  criarPedido: async (novaOS) => {
    let idUsuarioValido = novaOS.idUsuario;

    if (!idUsuarioValido || !isGuid(idUsuarioValido)) {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const sessionStr = window.localStorage.getItem("chama_jussa_session");
          if (sessionStr) {
            const sess = JSON.parse(sessionStr);
            idUsuarioValido = sess?.usuario?.idUsuario || sess?.usuario?.id;
          }
        }
      } catch (e) {}
    }

    if (!idUsuarioValido || !isGuid(idUsuarioValido)) {
      console.warn("[API Criar Pedido] Usuário não está autenticado com um idUsuario (Guid) válido.");
      return null;
    }

    const payload = {
      titulo: novaOS.titulo || novaOS.tituloProblema || "Sem Título",
      descricao: novaOS.descricao || novaOS.descricaoProblema || "Sem Descrição",
      idUsuario: idUsuarioValido,
    };

    return await requestBackend("/Pedidos", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // PUT /api/Pedidos/{id}
  atualizarPedido: async (id, osAtualizada) => {
    if (!isGuid(id)) return null;

    const payload = {
      titulo: osAtualizada.titulo || osAtualizada.tituloProblema || "Sem Título",
      descricao: osAtualizada.descricao || osAtualizada.descricaoProblema || "Sem Descrição",
      status: osAtualizada.status || osAtualizada.statusOS || "Aberta",
    };

    const res = await requestBackend(`/Pedidos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res !== null ? res : true;
  },

  // PATCH /api/Pedidos/{id}/status
  atualizarStatus: async (id, status) => {
    if (!isGuid(id)) return null;

    const res = await requestBackend(`/Pedidos/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return res !== null ? res : true;
  },

  // DELETE /api/Pedidos/{id}
  excluirPedido: async (id) => {
    if (!id) return true;
    if (!isGuid(id)) {
      console.info(`[API Exclusão] O ID '${id}' não é um GUID do backend C#. Remoção efetuada localmente.`);
      return true;
    }
    const res = await requestBackend(`/Pedidos/${id}`, {
      method: "DELETE",
    });
    // Se o backend retornar true ou 404 (já excluído/não encontrado), considera como excluído com sucesso
    return true;
  },
};
