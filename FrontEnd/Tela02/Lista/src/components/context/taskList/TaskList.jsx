import React from "react";
import { View, StyleSheet } from "react-native";
import TaskItem from "../taskItem/TaskItem";

export default function TaskList() {
  return (
    <View style={styles.lista}>
      <TaskItem />
    </View>
  );
}

