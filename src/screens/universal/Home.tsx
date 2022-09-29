import { View, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import Dashboard from './bottomNav/dashboard';

type Props = {}

const Tab = createBottomTabNavigator();

const Home = (props: Props) => {
  return (
    <Tab.Navigator>
        <Tab.Screen name='DashBoardScreen' component={Dashboard} />
    </Tab.Navigator>
  )
}

export default Home