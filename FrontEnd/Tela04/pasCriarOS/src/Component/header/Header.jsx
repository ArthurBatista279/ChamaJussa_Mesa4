import React from "react";
import { View, Text } from "react-native";
import { HeaderStyle } from "./HeaderStyle";

export const Header = () => {
  return (
    <View style={HeaderStyle.header}>
      <Text style={HeaderStyle.headerText}>
        Criar OS
      </Text>
    </View>
  );
};