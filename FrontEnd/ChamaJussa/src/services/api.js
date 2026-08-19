// Serviço de integração com o Backend ASP.NET Core API (https://localhost:7194/api)

const API_ENDPOINTS = [
  "https://localhost:7194/api",
  "http://localhost:7194/api",
  "http://localhost:5263/api",
  "http://localhost:5194/api",
];

let baseIndex = 0;

const getHeaders = () => {
  let token = "";
  try {
    if (typeof window !== "undefined" && window.localStorage) {
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

// Requisição com tentativa em HTTPS e HTTP
const requestBackend = async (urlPath, options = {}) => {
  const method = options.method || "GET";
  const headers = getHeaders();

  for (let i = 0; i < API_ENDPOINTS.length; i++) {
    const baseUrl = API_ENDPOINTS[(baseIndex + i) % API_ENDPOINTS.length];
    const fullUrl = `${baseUrl}${urlPath}`;

    try {
      const res = await fetch(fullUrl, {
        mode: "cors",
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (res.ok) {
        baseIndex = (baseIndex + i) % API_ENDPOINTS.length;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await res.json();
        }
        return true;
      } else {
        const errorText = await res.text();
        console.error(`[API ERRO ${res.status}] ${res.statusText} em ${fullUrl}:`, errorText);

        if (res.status === 401) {
          console.warn(
            "⚠️ O endpoint da API do Swagger requer Token de Autorização Bearer (JWT)."
          );
        }
      }
    } catch (err) {
      if (i === 0) {
        console.warn(`[API Conexão Bloqueada] ${fullUrl}: Verifique o CORS no backend C# e se o certificado HTTPS local foi aceito no navegador.`);
      }
    }
  }

  return null;
};

export const api = {
  // Configurar Token Bearer JWT vindo do Swagger/Login
  setToken: (token) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("jwt_token", token);
      }
    } catch (e) {}
  },

  // GET /api/Pedidos
  getPedidos: async () => {
    const data = await requestBackend("/Pedidos", { method: "GET" });
    if (data && Array.isArray(data)) {
      return data;
    }
    return null;
  },

  // POST /api/Pedidos
  criarPedido: async (novaOS) => {
    const payload = {
      id: novaOS.id,
      codigo: novaOS.codigo,
      codigoOS: novaOS.codigo,
      titulo: novaOS.titulo,
      tituloProblema: novaOS.titulo,
      equipamento: novaOS.equipamento,
      maquinaEquipamento: novaOS.equipamento,
      local: novaOS.local,
      setor: novaOS.local,
      localSetor: novaOS.local,
      solicitante: novaOS.solicitante,
      nomeSolicitante: novaOS.solicitante,
      descricao: novaOS.descricao,
      descricaoProblema: novaOS.descricao,
      status: novaOS.status || "Aberta",
      statusOS: novaOS.status || "Aberta",
      imagem: typeof novaOS.imagem === "string" ? novaOS.imagem : "",
      imagemUrl: typeof novaOS.imagem === "string" ? novaOS.imagem : "",
      fotoUrl: typeof novaOS.imagem === "string" ? novaOS.imagem : "",
      data: novaOS.data || new Date().toLocaleDateString("pt-BR"),
      dataCriacao: novaOS.data || new Date().toLocaleDateString("pt-BR"),
    };

    return await requestBackend("/Pedidos", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // PUT /api/Pedidos/{id}
  atualizarPedido: async (id, osAtualizada) => {
    return await requestBackend(`/Pedidos/${id}`, {
      method: "PUT",
      body: JSON.stringify(osAtualizada),
    });
  },

  // DELETE /api/Pedidos/{id}
  excluirPedido: async (id) => {
    return await requestBackend(`/Pedidos/${id}`, {
      method: "DELETE",
    });
  },
};
