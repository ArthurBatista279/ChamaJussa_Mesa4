import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function PasPerfil({ usuario, onLogout, onUpdateUsuario }) {
  const [avatarUri, setAvatarUri] = useState(usuario?.avatar || null);

  useEffect(() => {
    if (usuario?.avatar !== undefined) {
      setAvatarUri(usuario.avatar);
    }
  }, [usuario]);

  const handlePickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissão Necessária", "É necessária a permissão para acessar a galeria de fotos.");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions ? ImagePicker.MediaTypeOptions.Images : "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newAvatar = result.assets[0].uri;
        setAvatarUri(newAvatar);
        if (onUpdateUsuario) {
          onUpdateUsuario({ avatar: newAvatar });
        }
      }
    } catch (err) {
      console.log("Erro ao selecionar imagem:", err);
    }
  };

  const dados = usuario || {
    nome: "Usuário",
    email: "usuario@email.com",
    avatar: require("../../../../assets/image 6.png"),
  };

  const currentAvatar = avatarUri || dados.avatar;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Card do Perfil */}
      <View style={styles.cardPerfil}>
        {/* Foto de Perfil Circular com Botão de Alteração */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handlePickImage}
          activeOpacity={0.8}
        >
          <View style={styles.avatarBox}>
            {currentAvatar && (typeof currentAvatar === "string" || typeof currentAvatar === "number") ? (
              <Image
                source={typeof currentAvatar === "string" ? { uri: currentAvatar } : currentAvatar}
                style={styles.avatarImg}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Feather name="user" size={50} color="#A31F0A" />
              </View>
            )}
            <View style={styles.avatarBadge}>
              <Feather name="camera" size={16} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.txtAlterarFoto}>Alterar Foto de Perfil</Text>
        </TouchableOpacity>

        {/* Nome do Usuário (Carregado automaticamente do Banco/Login) */}
        <Text style={styles.nomeUsuario}>{dados.nome || "Usuário"}</Text>

        {/* E-mail (Carregado do Banco/Login) */}
        <Text style={styles.email}>{dados.email || "usuario@email.com"}</Text>

        {/* Botão Sair da Conta */}
        <TouchableOpacity style={styles.btnSair} onPress={onLogout} activeOpacity={0.85}>
          <Feather name="log-out" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
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
    ...Platform.select({
      web: { boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.06)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    position: "relative",
    borderWidth: 3,
    borderColor: "#F8FAFC",
    ...Platform.select({
      web: { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
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
  avatarBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#A31F0A",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  txtAlterarFoto: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A31F0A",
    marginTop: 8,
  },
  nomeUsuario: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
    textAlign: "center",
  },
  email: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 24,
    fontWeight: "500",
    textAlign: "center",
  },
  btnSair: {
    width: "100%",
    height: 48,
    backgroundColor: "#A31F0A",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  txtSair: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
