import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Login from "../src/components/context/login/Login";
import { useApp } from "../src/context/AppContext";

export default function LoginScreen() {
  const { handleLogin } = useApp();
  const router = useRouter();

  const onLoginSuccess = (dadosUsuario) => {
    handleLogin(dadosUsuario);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Login onLogin={onLoginSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    width: "100%",
  },
});
