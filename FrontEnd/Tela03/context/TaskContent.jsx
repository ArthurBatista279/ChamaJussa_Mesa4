import axios from "axios";
import { createContext, useState } from "react";

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
    const [listaTarefas, setListaTarefas] = useState([])


    const getTasks = async () => {
        try {
            const APIReturn = await axios.get("mudar ak")
            const APIData = await APIReturn.data
            setListaTarefas(APIData)
        } catch (error) {
            console.log("Erro ao buscar os dados da api");
            console.log(error);
        }
    }


 return (
        <TaskContext.Provider
            value={{ listaTarefas, setListaTarefas}}
        >
            {children}
        </TaskContext.Provider>
    )
}