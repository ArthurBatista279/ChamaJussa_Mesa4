import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleEntrar = () => {
    if (onLogin) {
      onLogin({ email: email || "kessia@email.com", nome: "Késsia Milena" });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo Superior Direita */}
        <View style={styles.topLogoContainer}>
          <Image
            source={require("../../../../assets/logo.png")}
            style={styles.topLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.cardLogin}>
          {/* Mascote / Logo Central */}
          <View style={styles.avatarBox}>
            <Image
              source={require("../../../../assets/image 5.png")}
              style={styles.avatarImg}
              resizeMode="contain"
            />
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
  topLogoContainer: {
    width: "100%",
    maxWidth: 420,
    alignItems: "flex-end",
    marginBottom: 10,
  },
  topLogo: {
    width: 90,
    height: 35,
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
    width: 110,
    height: 140,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
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
    marginBottom: 24,
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
    fontSize: 15,
    fontWeight: "700",
  },
  footerText: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
  },
});
