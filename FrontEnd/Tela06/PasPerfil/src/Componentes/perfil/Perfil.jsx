import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import { PerfilStyle } from "./PerfilStyle";

export const Perfil = () => {
  return (
    <View style={PerfilStyle.container}>

     

      <View style={PerfilStyle.content}>

        {/* TÍTULO */}
        <View style={PerfilStyle.tituloContainer}>
          <Text style={PerfilStyle.titulo}>
            Perfil
          </Text>
        </View>


        
        <View style={PerfilStyle.card}>

    
          <Image
            source={require("../../../assets/Ellipse 1.png")}
            style={PerfilStyle.foto}
          />

          <Text style={PerfilStyle.nome}>
            Késsia Milena
          </Text>

          
          <Text style={PerfilStyle.email}>
            kessia@emai.com
          </Text>

        </View>


        
        <TouchableOpacity style={PerfilStyle.botao}>
          <Text style={PerfilStyle.botaoTexto}>
            Sair da Conta
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};