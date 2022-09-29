import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import OnBoard from './screens/guest/onBoard'
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { Navigator, Screen } = createStackNavigator()

export default function Index() {
  return (
    <Navigator>
        <Screen name='OnBoard' component={OnBoard} options={{ headerShown: false, cardStyle: {paddingTop: getStatusBarHeight(true)} }} />
    </Navigator>
  )
}