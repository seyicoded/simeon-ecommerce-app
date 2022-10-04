import 'react-native-gesture-handler';
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, LogBox, Text, View, ActivityIndicator, Platform, Alert } from 'react-native';
import Index from './src';
import {Provider} from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { initializeApp } from 'firebase/app';
import AppContext from './src/context'
import { useContext, useEffect, useState } from 'react';
import Color from './src/components/colors';
import { getUser } from './src/storage';
import Toast from 'react-native-toast-message'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import Constant from './src/constants/collection/list';
import * as Sentry from 'sentry-expo'
import SentryNative from '@sentry/react-native'

// import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDBv6cc8cl-7x6JLbUTdjSgO3y1oaY0yaY",
  authDomain: "simeon-enterprise.firebaseapp.com",
  projectId: "simeon-enterprise",
  storageBucket: "simeon-enterprise.appspot.com",
  messagingSenderId: "595988627302",
  appId: "1:595988627302:web:2c61dcba6a6dbe154b12a7",
  measurementId: "G-KESQC2CNLC"
};

Sentry.init({
  dsn: "https://97214d559ffe45e7a97b5ab873c400f7@o4503924351369216.ingest.sentry.io/4503924354646016",
  enableInExpoDevelopment: true,
  debug: true,
  tracesSampleRate: 1.0,
});

// LogBox.ignoreAllLogs(true)

function App() {
  let myApp = initializeApp(firebaseConfig);

  const db = getFirestore();

  const [allCategory, setAllCategory] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [allCarts, setAllCarts] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [Quick, setQuick] = useState(false)

  const [contextVal, setContextVal] = useState([
    {
      allCategory,
      allProducts,
      allCarts,
      allOrders,
      isSignedIn,
      isLoading
    },
    {
      setAllCategory: (val)=> setAllCategory(val),
      setAllProducts: (val)=> setAllProducts(val),
      setAllCarts: (val)=> setAllCarts(val),
      setAllOrders: (val)=> setAllOrders(val),
      setIsSignedIn: (val)=> setIsSignedIn(val),
      setIsLoading: (val)=> setIsLoading(val)
    }
  ])
  // console.log(initializeApp)
  
  useEffect(() => {
    // AsyncStorage.clear()
    setQuick(!Quick);
    // console.log(allCategory, allProducts, allCarts, isLoading)
    // update context manually
    setContextVal([
      {
        allCategory,
        allProducts,
        allCarts,
        allOrders,
        isSignedIn,
        isLoading
      },
      {
        setAllCategory: (val)=> setAllCategory(val),
        setAllProducts: (val)=> setAllProducts(val),
        setAllCarts: (val)=> setAllCarts(val),
        setAllOrders: (val)=> setAllOrders(val),
        setIsSignedIn: (val)=> setIsSignedIn(val),
        setIsLoading: (val)=> setIsLoading(val)
      }
    ])
  }, [isLoading, allOrders, isSignedIn, allCategory, allProducts, allCarts])

  useEffect(()=>{
    (async()=>{
      const isLogged = await getUser()

      if(isLogged !== false){
        setIsSignedIn(true)
      }
    })()
  }, [])


  // handle push notification :: start
  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      // update fcm push notification entry
      // @ts-ignore
      const userData = JSON.parse(await getUser());
      const userEmail = userData.email;
      console.log(token);

      const docRef = doc(db, Constant.COLLECTION.PUSH_NOTIFICATION, userEmail);
      await setDoc(docRef, {
        token
      })
      // this.setState({ expoPushToken: token });
    } else {
      // Alert.alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  useEffect(()=>{
    if(!isSignedIn){
      return
    }

    // process login
    registerForPushNotificationsAsync()
    
  }, [isSignedIn])
  // handle push notification :: stop
  

  return (
    <Provider>
      <AppContext.Provider value={contextVal}>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <NavigationContainer>
            <Index />
          </NavigationContainer>

          <Toast />

          {
            (isLoading && (
              <View style={{ position: 'absolute', flex: 1, zIndex: 999, justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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

const Wrapper = ()=>{
  try{
    return <App />
  }catch(e){
    Sentry.Native.captureException(e)
  }
}

export default Wrapper;
// export default (App);
// export default Sentry.wrap(App);