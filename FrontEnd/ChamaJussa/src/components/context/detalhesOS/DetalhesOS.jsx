import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function DetalhesOS({
  os,
  usuario,
  onVoltar,
  onEditar,
  onMudarStatus,
  onExcluir,
}) {
  const rawData = os || {};

  const dados = {
    id: rawData.id || "001",
    codigo: rawData.codigo || rawData.codigoOS || "OS-1001",
    status: rawData.status || rawData.statusOS || "Aberta",
    titulo: rawData.titulo || rawData.tituloProblema || "Ordem de Serviço",
    data: rawData.data || rawData.dataCriacao || rawData.createdAt || "Hoje",
    equipamento: rawData.equipamento || rawData.maquinaEquipamento || "Equipamento Geral",
    local: rawData.local || rawData.setor || rawData.localSetor || "Bloco Principal",
    solicitante: rawData.solicitante || rawData.nomeSolicitante || "Não informado",
    descricao: rawData.descricao || rawData.descricaoProblema || "Sem descrição informada.",
    imagem: rawData.imagem || rawData.imagemUrl || rawData.fotoUrl || require("../../../../assets/image 4.jpg"),
  };

  const isADM = usuario?.cargo === "ADM";
  const statusAtual = dados.status || "Aberta";

  const handleExcluir = () => {
    if (typeof window !== "undefined") {
      if (window.confirm(`Tem certeza que deseja excluir a ${dados.codigo}?`)) {
        if (onExcluir) onExcluir(dados.id);
      }
    } else {
      if (onExcluir) onExcluir(dados.id);
    }
  };

  const isConcluida = statusAtual === "Concluída" || statusAtual === "Concluida";
  const isAndamento = statusAtual === "Em Andamento";

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Barra Superior de Navegação */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.btnVoltar} onPress={onVoltar} activeOpacity={0.7}>
          <Feather name="arrow-left" size={18} color="#A31F0A" />
          <Text style={styles.txtVoltar}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da OS</Text>
      </View>

      {/* Card Principal de Informações da OS */}
      <View style={styles.card}>
        {/* Cabeçalho com Código e Status */}
        <View style={styles.codigoStatusRow}>
          <View style={styles.codigoBadge}>
            <Feather name="file-text" size={13} color="#A31F0A" style={{ marginRight: 4 }} />
            <Text style={styles.txtCodigo}>{dados.codigo || "OS-1001"}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              isConcluida
                ? styles.bgConcluida
                : isAndamento
                ? styles.bgAndamento
                : styles.bgAberta,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                isConcluida
                  ? styles.dotConcluida
                  : isAndamento
                  ? styles.dotAndamento
                  : styles.dotAberta,
              ]}
            />
            <Text
              style={[
                styles.txtStatusBadge,
                isConcluida
                  ? styles.txtConcluida
                  : isAndamento
                  ? styles.txtAndamento
                  : styles.txtAberta,
              ]}
            >
              {statusAtual}
            </Text>
          </View>
        </View>

        {/* Título Principal */}
        <Text style={styles.tituloOS}>{dados.titulo}</Text>
        
        {/* Data de Criação */}
        <View style={styles.dataRow}>
          <Feather name="calendar" size={13} color="#94A3B8" style={{ marginRight: 5 }} />
          <Text style={styles.dataOS}>Criada em {dados.data || "Hoje"}</Text>
        </View>

        <View style={styles.divider} />

        {/* Mini Cards de Informações Relevantes */}
        <View style={styles.infoCardsGrid}>
          {/* Equipamento */}
          <View style={styles.miniCard}>
            <View style={styles.iconCircle}>
              <Feather name="tool" size={16} color="#A31F0A" />
            </View>
            <View style={styles.miniCardText}>
              <Text style={styles.miniCardLabel}>Equipamento</Text>
              <Text style={styles.miniCardValue}>{dados.equipamento || "Equipamento Geral"}</Text>
            </View>
          </View>

          {/* Local / Setor */}
          <View style={styles.miniCard}>
            <View style={styles.iconCircle}>
              <Feather name="map-pin" size={16} color="#2563EB" />
            </View>
            <View style={styles.miniCardText}>
              <Text style={styles.miniCardLabel}>Local / Setor</Text>
              <Text style={styles.miniCardValue}>{dados.local || "Bloco Principal"}</Text>
            </View>
          </View>

          {/* Solicitante */}
          <View style={styles.miniCard}>
            <View style={styles.iconCircle}>
              <Feather name="user" size={16} color="#059669" />
            </View>
            <View style={styles.miniCardText}>
              <Text style={styles.miniCardLabel}>Solicitante</Text>
              <Text style={[styles.miniCardValue, { color: "#0F172A", fontWeight: "700" }]}>
                {dados.solicitante || "Não informado"}
              </Text>
            </View>
          </View>
        </View>

        {/* Descrição do Problema */}
        <View style={styles.secaoHeader}>
          <Feather name="align-left" size={16} color="#A31F0A" style={{ marginRight: 6 }} />
          <Text style={styles.secaoTitulo}>Descrição do Problema</Text>
        </View>
        <View style={styles.descricaoBox}>
          <Text style={styles.descricaoTexto}>{dados.descricao}</Text>
        </View>

        {/* Foto do Problema */}
        <View style={styles.secaoHeader}>
          <Feather name="image" size={16} color="#A31F0A" style={{ marginRight: 6 }} />
          <Text style={styles.secaoTitulo}>Foto Anexada</Text>
        </View>
        <View style={styles.imagemContainer}>
          <Image
            source={
              typeof dados.imagem === "string"
                ? { uri: dados.imagem }
                : dados.imagem || require("../../../../assets/image 4.jpg")
            }
            style={styles.imagemOS}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Painel Exclusivo do Modo Administrador (ADM) */}
      {isADM && (
        <View style={styles.cardADM}>
          <View style={styles.headerADM}>
            <Feather name="shield" size={18} color="#A31F0A" style={{ marginRight: 6 }} />
            <Text style={styles.tituloPainelADM}>Painel de Gestão ADM</Text>
          </View>
          
          <Text style={styles.subtituloPainelADM}>
            Altere o status ou exclua a ordem de serviço conforme necessário.
          </Text>

          <View style={styles.gridAcoesADM}>
            {!isAndamento && (
              <TouchableOpacity
                style={styles.btnAndamento}
                onPress={() => onMudarStatus && onMudarStatus(dados.id, "Em Andamento")}
                activeOpacity={0.85}
              >
                <Feather name="clock" size={16} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={styles.txtAndamento}>Em Andamento</Text>
              </TouchableOpacity>
            )}

            {!isConcluida && (
              <TouchableOpacity
                style={styles.btnConcluir}
                onPress={() => onMudarStatus && onMudarStatus(dados.id, "Concluída")}
                activeOpacity={0.85}
              >
                <Feather name="check-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.txtConcluir}>Concluir OS</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.btnExcluir}
              onPress={handleExcluir}
              activeOpacity={0.85}
            >
              <Feather name="trash-2" size={16} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.txtExcluir}>Excluir OS</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Botão Principal de Edição */}
      <TouchableOpacity
        style={styles.btnEditar}
        onPress={() => onEditar && onEditar(dados)}
        activeOpacity={0.85}
      >
        <Feather name="edit-3" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.txtEditar}>Editar Solicitação</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  btnVoltar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  txtVoltar: {
    fontSize: 13,
    color: "#A31F0A",
    fontWeight: "700",
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  codigoStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  codigoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  txtCodigo: {
    fontSize: 12,
    fontWeight: "800",
    color: "#A31F0A",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  bgAberta: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  bgAndamento: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  bgConcluida: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotAberta: {
    backgroundColor: "#DC2626",
  },
  dotAndamento: {
    backgroundColor: "#D97706",
  },
  dotConcluida: {
    backgroundColor: "#059669",
  },
  txtStatusBadge: {
    fontSize: 11,
    fontWeight: "800",
  },
  txtAberta: {
    color: "#991B1B",
  },
  txtAndamento: {
    color: "#92400E",
  },
  txtConcluida: {
    color: "#065F46",
  },
  tituloOS: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 26,
    marginBottom: 4,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dataOS: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
  },
  infoCardsGrid: {
    gap: 10,
    marginBottom: 20,
  },
  miniCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  miniCardText: {
    flex: 1,
  },
  miniCardLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  miniCardValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  secaoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4,
  },
  secaoTitulo: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  descricaoBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  descricaoTexto: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 20,
  },
  imagemContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  imagemOS: {
    width: "100%",
    height: "100%",
  },
  cardADM: {
    backgroundColor: "#FFF5F5",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 16,
  },
  headerADM: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tituloPainelADM: {
    fontSize: 15,
    fontWeight: "800",
    color: "#A31F0A",
  },
  subtituloPainelADM: {
    fontSize: 12,
    color: "#7F1D1D",
    marginBottom: 14,
  },
  gridAcoesADM: {
    gap: 10,
  },
  btnAndamento: {
    height: 44,
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  txtAndamento: {
    color: "#92400E",
    fontSize: 14,
    fontWeight: "700",
  },
  btnConcluir: {
    height: 44,
    backgroundColor: "#059669",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  txtConcluir: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  btnExcluir: {
    height: 44,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  txtExcluir: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "700",
  },
  btnEditar: {
    width: "100%",
    height: 48,
    backgroundColor: "#A31F0A",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A31F0A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  txtEditar: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
