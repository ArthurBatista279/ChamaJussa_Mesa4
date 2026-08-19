import { StyleSheet } from "react-native";


export const ChamaFormStyle = StyleSheet.create({

    chamaFormBox: {
        width: "100%",
        height: "90%",
        backgroundColor: "white",
        marginTop: 30,
        marginBottom: 30,
        borderRadius: 5,
        backgroundColor: "#fff",
        borderRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,

    },

    textJussa: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
    },

    textSub: {
        fontSize: 16,
        textAlign: "center",
        paddingTop: 5,
        opacity: 0.5,
        marginBottom: 30
    },

    textBox: {
        fontSize: 16,
        textAlign: "left",
        fontWeight: "600",
        paddingLeft: 30,
        marginTop: 5,
    },

    textInput: {
        width: "80%",
        height: 45,
        padding: 10,
        backgroundColor: "#F3F4F6",
        borderRadius: 5,
        alignSelf: "center",
        marginTop: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,

    },

    chamaButton: {
        width: "80%",
        height: 50,
        backgroundColor: "#9B2308",
        borderRadius: 5,

        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        marginTop: 50,
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,

    },

    chamaText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "white"
    }




})