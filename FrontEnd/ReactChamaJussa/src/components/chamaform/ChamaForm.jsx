import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { ChamaFormStyle } from "./ChamaFormStyle"
import { Header } from "../header/Header"
import { Footer } from "../footer/Footer"


export const ChamaForm = () => {
    return (
        <View style={ChamaFormStyle.chamaFormBox}>
            <Header />

            <Text style={ChamaFormStyle.textJussa}> Chama Jussa </Text>
            <Text style={ChamaFormStyle.textSub}> Gerenciamento de Ordens de Serviço </Text>
            <Text style={ChamaFormStyle.textBox}> E-mail</Text>

            <TextInput
                style={ChamaFormStyle.textInput}
            />

            <Text style={ChamaFormStyle.textBox}> Senha </Text>

            <TextInput
                style={ChamaFormStyle.textInput}
            />


            <TouchableOpacity
                style={ChamaFormStyle.chamaButton}
            >
                <Text style={ChamaFormStyle.chamaText}> Acessar o sistema </Text>
            </TouchableOpacity>

            <Footer/>
        </View>
    )
}