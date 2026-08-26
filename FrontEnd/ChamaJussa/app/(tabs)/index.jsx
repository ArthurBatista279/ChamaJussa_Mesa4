import React from "react";
import { useRouter } from "expo-router";
import Header from "../../src/components/context/header/Header";
import TaskList from "../../src/components/context/taskList/TaskList";
import { useApp } from "../../src/context/AppContext";

export default function IndexTab() {
  const { usuario, listaOS, setOsSelecionada, setOsEmEdicao } = useApp();
  const router = useRouter();

  const handleSelectOS = (os) => {
    setOsSelecionada(os);
    const targetId = os.id || os.idPedido || "0";
    router.push(`/detalhes/${targetId}`);
  };

  const handleNovaOS = () => {
    setOsEmEdicao(null);
    router.push("/criar");
  };

  return (
    <>
      <Header
        usuario={usuario?.nome}
        titulo="Minhas OS's"
        onNovaOS={handleNovaOS}
      />
      <TaskList listaOS={listaOS} onSelectOS={handleSelectOS} />
    </>
  );
}
