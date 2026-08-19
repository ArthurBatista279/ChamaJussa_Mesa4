import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './context/Style';
import { Footer } from './components/footer/FooterStyle';
import { Header } from './components/header/HeaderStyle';
import { Form } from './components/jussaForm/Form';
import { TaskList } from './components/taskList/TaskList';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.Container}>
        <View style={styles.container}>

          <Header />
          <Form />
          <TaskList />
          <Footer />
          
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}