import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

export default function PasPerfil({ usuario, onLogout }) {
  const dados = usuario || {
    nome: "Késsia Milena",
    email: "kessia@email.com",
    avatar: require("../../../../assets/image 6.png"),
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Card do Perfil */}
      <View style={styles.cardPerfil}>
        {/* Foto de Perfil Circular */}
        <View style={styles.avatarBox}>
          <Image
            source={
              typeof dados.avatar === "string"
                ? { uri: dados.avatar }
                : dados.avatar || require("../../../../assets/image 6.png")
            }
            style={styles.avatarImg}
            resizeMode="cover"
          />
        </View>

        {/* Nome e E-mail */}
        <Text style={styles.nome}>{dados.nome || "Késsia Milena"}</Text>
        <Text style={styles.email}>{dados.email || "kessia@email.com"}</Text>

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
  nome: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 24,
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
