import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TaskItem from "../taskItem/TaskItem";
import styles from "./TaskListStyle";

export default function TaskList() {
  return (
    <View>
      <View style={styles.filtros}>

        <TouchableOpacity style={[styles.filtro, styles.filtroAtivo]}>
          <Text style={styles.textoAtivo}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filtro}>
          <Text style={styles.texto}>Abertas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filtro}>
          <Text style={styles.texto}>Em Andamento</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filtro}>
          <Text style={styles.texto}>Concluídas</Text>
        </TouchableOpacity>

      </View>

      <TaskItem />
    </View>
  );
}