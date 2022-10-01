import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import OnBoard from './screens/guest/onBoard'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { getOnBoardState } from './storage';
import Home from './screens/universal/Home';
import CategoryProductList from './screens/universal/category/list';
import SearchMain from './screens/universal/search';

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

  return (
    <Navigator initialRouteName={firstTime ? 'OnBoard' : 'Home'}>
        <Screen name='OnBoard' component={OnBoard} options={{ headerShown: false, cardStyle: {paddingTop: getStatusBarHeight(true)} }} />
        <Screen name='Home' component={Home} options={{ headerShown: false, cardStyle: {paddingTop: getStatusBarHeight(true), backgroundColor: 'white'} }} />
        <Screen name="CategoryProductList" component={CategoryProductList} options={{ headerShown: false, cardStyle: {paddingTop: getStatusBarHeight(true), backgroundColor: 'white'} }} />
        <Screen name="SearchMain" component={SearchMain} options={{ headerShown: false, cardStyle: {paddingTop: getStatusBarHeight(true), backgroundColor: 'white'} }} />
    </Navigator>
  )
}