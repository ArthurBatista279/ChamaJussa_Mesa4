import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleEntrar = () => {
    const emailLimpo = email.trim();

    if (!emailLimpo) {
      if (typeof window !== "undefined") {
        window.alert("Por favor, insira o seu e-mail para continuar.");
      }
      return;
    }

    const isADM =
      emailLimpo.toLowerCase().includes("anna") ||
      emailLimpo.toLowerCase().includes("adm");

    const handleEmail = emailLimpo.split("@")[0] || "Usuário";
    const nomeFormatado = handleEmail
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    if (onLogin) {
      onLogin({
        email: emailLimpo,
        nome: nomeFormatado,
        cargo: isADM ? "ADM" : "Cliente",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardLogin}>
          {/* Ícone Central Estilizado (Figma) */}
          <View style={styles.avatarBox}>
            <View style={styles.iconCircle}>
              <Feather name="clipboard" size={44} color="#A31F0A" />
            </View>
          </View>

          {/* Título e Subtítulo */}
          <Text style={styles.titulo}>Chama Jussa</Text>
          <Text style={styles.subtitulo}>Gerenciamento de Ordens de Serviço</Text>

          {/* Formulário */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="email@email.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#94A3B8"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          {/* Botão de Acesso */}
          <TouchableOpacity style={styles.botaoEntrar} onPress={handleEntrar} activeOpacity={0.85}>
            <Text style={styles.textoBotao}>Acessar o sistema</Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <Text style={styles.footerText}>2026, Chama Jussa - Todos os direitos reservados</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%",
  },
  cardLogin: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  avatarBox: {
    width: 90,
    height: 90,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 18,
  },
  labelCargo: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  cargoSelector: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
    marginBottom: 18,
  },
  btnCargo: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnCargoAtivo: {
    backgroundColor: "#2563EB",
    borderColor: "#1D4ED8",
  },
  btnCargoAtivoADM: {
    backgroundColor: "#A31F0A",
    borderColor: "#7F1D1D",
  },
  txtCargo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  txtCargoAtivo: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  formGroup: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 46,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  botaoEntrar: {
    width: "100%",
    height: 48,
    backgroundColor: "#A31F0A",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#A31F0A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  footerText: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
  },
});
