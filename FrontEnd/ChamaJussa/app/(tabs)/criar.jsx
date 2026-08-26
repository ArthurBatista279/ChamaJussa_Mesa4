import React from "react";
import { useRouter } from "expo-router";
import FormTask from "../../src/components/context/formTask/FormTask";
import { useApp } from "../../src/context/AppContext";

export default function CriarTab() {
  const { usuario, osEmEdicao, setOsEmEdicao, handleCriarOS, handleAtualizarOS } = useApp();
  const router = useRouter();

  const onTaskCreated = (novaOS) => {
    handleCriarOS(novaOS);
    router.push("/");
  };

  const onTaskUpdated = (osAtualizada) => {
    handleAtualizarOS(osAtualizada);
    router.push("/");
  };

  const onCancel = () => {
    setOsEmEdicao(null);
    router.push("/");
  };

  return (
    <FormTask
      usuario={usuario}
      taskToEdit={osEmEdicao}
      onTaskCreated={onTaskCreated}
      onTaskUpdated={onTaskUpdated}
      onCancel={onCancel}
    />
  );
}
