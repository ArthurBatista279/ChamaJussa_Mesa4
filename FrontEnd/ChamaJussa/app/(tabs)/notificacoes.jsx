import React from "react";
import Notificacoes from "../../src/components/context/notificacoes/Notificacoes";
import { useApp } from "../../src/context/AppContext";

export default function NotificacoesTab() {
  const { notificacoes } = useApp();

  return <Notificacoes notificacoes={notificacoes} />;
}
