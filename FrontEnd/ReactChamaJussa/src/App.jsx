import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Styles';
import { ChamaForm } from './components/chamaform/ChamaForm';
import { LinearGradient } from 'expo-linear-gradient';
import { Footer } from './components/footer/Footer';

export default function App() {
    return (
        <SafeAreaProvider>
           
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <ChamaForm />
                        <StatusBar style="auto" />
                    </View>
                </SafeAreaView>
        </SafeAreaProvider>
    );
}