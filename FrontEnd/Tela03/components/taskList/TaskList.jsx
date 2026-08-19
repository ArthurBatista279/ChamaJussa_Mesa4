import { View, Text } from "react-native"


import { TaskItem } from "../taskitem/TaskItem"
import { ScrollView } from "react-native"
import { TaskItemStyle } from "./TaskListStyle"
import { useContext, useEffect, useState } from "react"
import { TaskContext } from "../../context/TaskContext"

export const TaskList = () => {
   const {listaTarefas,getTasks} = useContext(TaskContext)
       
    useEffect(()=>{
        getTasks()
    }, [])
    return(
        <ScrollView style={TaskItemStyle.taskListContainer}>
            {listaTarefas.map( (tarefa) => {
             return(

                <TaskItem
                key={tarefa.id}
                id={tarefa.id}
                descricao={tarefa.descricao}
                />
             )


            })}
     
        </ScrollView>   
    )
}