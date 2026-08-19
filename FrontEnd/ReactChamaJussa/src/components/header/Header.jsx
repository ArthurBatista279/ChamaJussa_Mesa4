import { View, Image } from "react-native"
import { HeaderStyle } from "./HeaderStyle"


export const Header = () => {
    return (
        <View style={HeaderStyle.header}>
            <Image
                source={require("../../../assets/logo.png")}
                style={HeaderStyle.logo}
            />
        </View>
    )
}