import React from "react";
import { useRouter } from "expo-router";
import PasPerfil from "../../src/components/context/perfil/PasPerfil";
import { useApp } from "../../src/context/AppContext";

export default function PerfilTab() {
  const { usuario, handleLogout, handleUpdateUsuario } = useApp();
  const router = useRouter();

  const onLogoutPressed = () => {
    handleLogout();
    router.replace("/login");
  };

  return (
    <PasPerfil
      usuario={usuario}
      onLogout={onLogoutPressed}
      onUpdateUsuario={handleUpdateUsuario}
    />
  );
}
