import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Index from './src';
import {Provider} from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { initializeApp } from 'firebase/app';
import AppContext from './src/context'
import { useContext, useEffect, useState } from 'react';
import Color from './src/components/colors';

const firebaseConfig = {
  apiKey: "AIzaSyDBv6cc8cl-7x6JLbUTdjSgO3y1oaY0yaY",
  authDomain: "simeon-enterprise.firebaseapp.com",
  projectId: "simeon-enterprise",
  storageBucket: "simeon-enterprise.appspot.com",
  messagingSenderId: "595988627302",
  appId: "1:595988627302:web:2c61dcba6a6dbe154b12a7",
  measurementId: "G-KESQC2CNLC"
};


export default function App() {
  let myApp = initializeApp(firebaseConfig);

  const [allCategory, setAllCategory] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [allCarts, setAllCarts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [Quick, setQuick] = useState(false)

  const [contextVal, setContextVal] = useState([
    {
      allCategory,
      allProducts,
      allCarts,
      isLoading
    },
    {
      setAllCategory: (val)=> setAllCategory(val),
      setAllProducts: (val)=> setAllProducts(val),
      setAllCarts: (val)=> setAllCarts(val),
      setIsLoading: (val)=> setIsLoading(val)
    }
  ])
  // console.log(initializeApp)

  useEffect(() => {
    setQuick(!Quick);
    // console.log(allCategory, allProducts, allCarts, isLoading)
    // update context manually
    setContextVal([
      {
        allCategory,
        allProducts,
        allCarts,
        isLoading
      },
      {
        setAllCategory: (val)=> setAllCategory(val),
        setAllProducts: (val)=> setAllProducts(val),
        setAllCarts: (val)=> setAllCarts(val),
        setIsLoading: (val)=> setIsLoading(val)
      }
    ])
  }, [isLoading, allCategory, allProducts, allCarts])
  

  return (
    <Provider>
      <AppContext.Provider value={contextVal}>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <NavigationContainer>
            <Index />
          </NavigationContainer>

          {
            (isLoading && (
              <View style={{ position: 'absolute', flex: 1, zIndex: 999, justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                <ActivityIndicator color={Color.PRIMARY_COLOR} />
              </View>
            ))
          }
        </View>
      </AppContext.Provider>
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
