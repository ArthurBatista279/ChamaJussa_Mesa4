import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../../src/components/context/footer/Footer";

export default function TabsLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appContainer}>
        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Slot />
        </ScrollView>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  appContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    width: "100%",
  },
  mainScrollView: {
    width: "100%",
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 600,
    padding: 20,
    paddingBottom: 95,
    alignSelf: "center",
    flexGrow: 1,
  },
});
