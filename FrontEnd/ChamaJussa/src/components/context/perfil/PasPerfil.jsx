import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { api } from "../../../services/api";

export default function PasPerfil({ usuario, onLogout, onUpdateUsuario }) {
  const [nome, setNome] = useState(usuario?.nome || "");
  const [token, setToken] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem("jwt_token") || "";
      }
    } catch (e) {}
    return "";
  });
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (usuario?.nome !== undefined) {
      setNome(usuario.nome);
    }
  }, [usuario]);

  const handleSalvar = () => {
    if (onUpdateUsuario) {
      onUpdateUsuario({ nome });
    }

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("usuario_nome", nome);
        if (token) {
          window.localStorage.setItem("jwt_token", token.trim());
          api.setToken(token.trim());
        }
      }
    } catch (e) {
      console.log(e);
    }

    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
    }, 3000);
  };

  const dados = usuario || {
    email: "kessia@email.com",
    avatar: require("../../../../assets/image 6.png"),
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Card do Perfil */}
      <View style={styles.cardPerfil}>
        {/* Foto de Perfil Circular */}
        <View style={styles.avatarBox}>
          {dados.avatar && typeof dados.avatar === "string" && !dados.avatar.includes("image") ? (
            <Image
              source={{ uri: dados.avatar }}
              style={styles.avatarImg}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Feather name="user" size={50} color="#A31F0A" />
            </View>
          )}
        </View>

        {/* E-mail (Vindo do Banco/Login) */}
        <Text style={styles.email}>{dados.email || "usuario@email.com"}</Text>

        {/* Cargo / Função do Usuário (Definido no cadastro) */}
        <View style={styles.cargoBox}>
          <Text style={styles.label}>Função / Perfil do Usuário:</Text>
          <View
            style={[
              styles.badgeCargo,
              dados.cargo === "ADM" ? styles.badgeADM : styles.badgeCliente,
            ]}
          >
            <Feather
              name={dados.cargo === "ADM" ? "shield" : "user"}
              size={14}
              color={dados.cargo === "ADM" ? "#991B1B" : "#1E40AF"}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.txtCargoBadge,
                dados.cargo === "ADM" ? styles.txtADM : styles.txtCliente,
              ]}
            >
              {dados.cargo === "ADM" ? "Administrador (ADM)" : "Cliente"}
            </Text>
          </View>
        </View>

        {/* Campo do Nome (Editável pelo usuário) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.inputNome}
            placeholder="Digite seu nome..."
            placeholderTextColor="#94A3B8"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        {/* Token JWT do Swagger (Para autenticar requisições na API C#) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Token Bearer JWT (Swagger / API C#):</Text>
          <TextInput
            style={[styles.inputNome, styles.inputToken]}
            placeholder="Cole aqui o Token do Swagger (Bearer eyJhbGci...)"
            placeholderTextColor="#94A3B8"
            value={token}
            onChangeText={setToken}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Mensagem de sucesso ao salvar */}
        {sucesso && (
          <View style={styles.msgSucesso}>
            <Feather name="check-circle" size={16} color="#166534" style={{ marginRight: 6 }} />
            <Text style={styles.txtSucesso}>Perfil e Token salvos com sucesso!</Text>
          </View>
        )}

        {/* Botão Salvar Perfil */}
        <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar} activeOpacity={0.85}>
          <Text style={styles.txtSalvar}>Salvar Dados e Token</Text>
        </TouchableOpacity>

        {/* Botão Sair da Conta */}
        <TouchableOpacity style={styles.btnSair} onPress={onLogout} activeOpacity={0.85}>
          <Text style={styles.txtSair}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    paddingTop: 10,
    alignItems: "center",
  },
  cardPerfil: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#F8FAFC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  email: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
    fontWeight: "500",
  },
  cargoBox: {
    width: "100%",
    marginBottom: 18,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  badgeCargo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  badgeADM: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
  badgeCliente: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  txtCargoBadge: {
    fontSize: 12,
    fontWeight: "700",
  },
  txtADM: {
    color: "#991B1B",
  },
  txtCliente: {
    color: "#1E40AF",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  inputNome: {
    width: "100%",
    height: 46,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  inputToken: {
    height: 65,
    fontSize: 12,
    fontWeight: "400",
    textAlignVertical: "top",
    paddingVertical: 8,
  },
  msgSucesso: {
    width: "100%",
    backgroundColor: "#DCFCE7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#86EFAC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  txtSucesso: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  btnSalvar: {
    width: "100%",
    height: 48,
    backgroundColor: "#0F172A",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  txtSalvar: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  btnSair: {
    width: "100%",
    height: 48,
    backgroundColor: "#A31F0A",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  txtSair: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

