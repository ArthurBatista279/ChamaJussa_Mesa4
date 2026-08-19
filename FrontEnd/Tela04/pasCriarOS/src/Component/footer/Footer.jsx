import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { FooterStyle } from "./FooterStyle";

export const Footer = () => {

  return (
    <View style={FooterStyle.footer}>

      <TouchableOpacity style={FooterStyle.item}>
        <Text style={FooterStyle.icone}>
          ▣
        </Text>

        <Text style={FooterStyle.texto}>
          Minhas OS
        </Text>
      </TouchableOpacity>


      <TouchableOpacity style={FooterStyle.item}>
        <Text style={FooterStyle.iconeAtivo}>
          ⊕
        </Text>

        <Text style={FooterStyle.textoAtivo}>
          Criar OS
        </Text>
      </TouchableOpacity>


      <TouchableOpacity style={FooterStyle.item}>
        <Text style={FooterStyle.icone}>
          ♧
        </Text>

        <Text style={FooterStyle.texto}>
          Notificações
        </Text>
      </TouchableOpacity>


      <TouchableOpacity style={FooterStyle.item}>
        <Text style={FooterStyle.icone}>
          ♙
        </Text>

        <Text style={FooterStyle.texto}>
          Perfil
        </Text>
      </TouchableOpacity>

    </View>
  );
};