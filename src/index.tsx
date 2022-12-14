import { View, Text, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import OnBoard from './screens/guest/onBoard'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { getOnBoardState } from './storage';
import Home from './screens/universal/Home';
import CategoryProductList from './screens/universal/category/list';
import SearchMain from './screens/universal/search';
import ProductViewer from './screens/universal/products';
import CartScreen from './screens/universal/cart';
import OrderScreen from './screens/universal/order';

const { Navigator, Screen } = createStackNavigator()

export default function Index() {

  const [isLoaded, setIsLoaded] = useState(false)
  const [firstTime, setfirstTime] = useState(false)

  useEffect(()=>{
    (async()=>{
      const _res = await getOnBoardState();
      if(_res){
        // not first time
        setfirstTime(false)
        setIsLoaded(true)
      }else{
        setfirstTime(true)
        setIsLoaded(true)
      }
    })()
  }, [])

  if(!isLoaded){
    return (<></>)
  }

  const height = (Platform.OS == 'ios') ? getStatusBarHeight(true): getStatusBarHeight(true) + 20;

  return (
    <Navigator initialRouteName={firstTime ? 'OnBoard' : 'Home'}>
        <Screen name='OnBoard' component={OnBoard} options={{ headerShown: false, cardStyle: {paddingTop: height} }} />
        <Screen name='Home' component={Home} options={{ headerShown: false, cardStyle: {paddingTop: height, backgroundColor: 'white'} }} />
        <Screen name="CategoryProductList" component={CategoryProductList} options={{ headerShown: false, cardStyle: {paddingTop: height, backgroundColor: 'white'} }} />
        <Screen name="SearchMain" component={SearchMain} options={{ headerShown: false, cardStyle: {paddingTop: height, backgroundColor: 'white'} }} />
        <Screen name="ProductViewer" component={ProductViewer} options={{ headerShown: false, cardStyle: {paddingTop: height, backgroundColor: 'white'} }} />
        <Screen name="CartScreen" component={CartScreen} options={{ headerShown: false, cardStyle: {paddingTop: height, backgroundColor: 'white'} }} />
        <Screen name="OrderScreen" component={OrderScreen} options={{ headerShown: false, cardStyle: {paddingTop: height, backgroundColor: 'white'} }} />
    </Navigator>
  )
}