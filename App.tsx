import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Index from './src';
import {Provider} from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'

export default function App() {
  return (
    <Provider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Index />
        </NavigationContainer>
      </View>
    </Provider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
