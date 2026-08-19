import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
} from "react-native";

import Header from "./src/components/context/header/Header";
import TaskList from "./src/components/context/taskList/TaskList";
import Footer from "./src/components/context/footer/Footer";

export default function App() {
  return (
    <View style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <TaskList />
      </ScrollView>

      <Footer />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  conteudo: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});