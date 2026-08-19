import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  
} from "react-native";
import { CriarOSStyle } from "./CriarOSStyle";

export const CriarOS = () => {

  return (
    <View style={CriarOSStyle.container}>
      <ScrollView
        style={CriarOSStyle.scroll}
        contentContainerStyle={CriarOSStyle.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <Text style={CriarOSStyle.titulo}>
          Criar ordem de serviço
        </Text>

        <View style={CriarOSStyle.form}>

          {/* TÍTULO */}
          <Text style={CriarOSStyle.label}>
            Título do problema{" "}
            <Text style={CriarOSStyle.vermelho}>*</Text>
          </Text>

          <TextInput
            style={CriarOSStyle.input}
            placeholder="Ex: Vazamento da pia"
            placeholderTextColor="#999"
            value={titulo}
            onChangeText={setTitulo}
          />

          {/* EQUIPAMENTO */}
          <Text style={CriarOSStyle.label}>
            Máquina /{" "}
            <Text style={CriarOSStyle.vermelho}>
              Equipamento
            </Text>{" "}
            <Text style={CriarOSStyle.vermelho}>*</Text>
          </Text>

          <TextInput
            style={CriarOSStyle.input}
            placeholder="Ex: Vazamento da pia"
            placeholderTextColor="#999"
            value={equipamento}
            onChangeText={setEquipamento}
          />

          {/* SETOR */}
          <Text style={CriarOSStyle.label}>
            Local /{" "}
            <Text style={CriarOSStyle.vermelho}>
              Setor
            </Text>{" "}
            <Text style={CriarOSStyle.vermelho}>*</Text>
          </Text>

          <TextInput
            style={CriarOSStyle.input}
            placeholder="Ex: Vazamento da pia"
            placeholderTextColor="#999"
            value={setor}
            onChangeText={setSetor}
          />

          {/* DESCRIÇÃO */}
          <Text style={CriarOSStyle.label}>
            Descrição do problema{" "}
            <Text style={CriarOSStyle.vermelho}>*</Text>
          </Text>

          <TextInput
            style={CriarOSStyle.descricao}
            placeholder="Ex: Vazamento da pia"
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            value={descricao}
            onChangeText={setDescricao}
          />

          {/* IMAGEM */}
          <Text style={CriarOSStyle.label}>
            Imagem /{" "}
            <Text style={CriarOSStyle.vermelho}>
              Foto do problema
            </Text>{" "}
            <Text style={CriarOSStyle.vermelho}>*</Text>
          </Text>

          <TextInput
            style={CriarOSStyle.input}
            placeholder="Insira imagem"
            placeholderTextColor="#999"
            value={imagem}
            onChangeText={setImagem}
          />

          {/* BOTÃO */}
          <TouchableOpacity
            style={CriarOSStyle.botao}
            onPress={abrirOS}
          >
            <Text style={CriarOSStyle.textoBotao}>
              Abrir Ordem de Serviço
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>



    </View>
  );
};