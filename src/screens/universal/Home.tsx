import { View, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import AnimatedTabBar from '@gorhom/animated-tabbar';
import React from 'react'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Dashboard from './bottomNav/dashboard';
import COLOR from "../../components/colors"
import Setting from './bottomNav/setting';

type Props = {}

const tabs: any = {
  BDashBoardScreen: {
    icon: {
      component: <FontAwesome name="home" size={24} color="black" />,
      color: 'rgba(255,255,255,1)',
      inactiveColor: 'black'
    },
    ripple: {
      color: '#5B37B7',
      inactiveColor: 'black'
    },
    background: {
      inactiveColor: 'white'
    }
  },
  };

const Tab = createBottomTabNavigator();

const Home = (props: Props) => {
  return (
    <Tab.Navigator
    // tabBar={props => (
    //   <AnimatedTabBar
    //     tabs={tabs}
    //     {...props}
    //   />
    // )}
    screenOptions={{ 
      tabBarActiveTintColor: COLOR.PRIMARY_COLOR
     }}
    >
        <Tab.Screen
          name='BDashBoardScreen'
          options={{ 
            headerShown: false,
            tabBarIcon: ({color, focused, size})=> (<FontAwesome name="home" size={size} color={color} />),
            title: "Home",
           }}
          component={Dashboard} />
          
        <Tab.Screen
          name='BSettingScreen'
          options={{ 
            // headerShown: false,
            // headerTitleAlign: 'left',
            // headerTitleContainerStyle: {backgroundColor: 'red', padding: 0},
            tabBarIcon: ({color, focused, size})=> (<MaterialCommunityIcons name="account" size={size} color={color} />),
            title: "Setting"
           }}
          component={Setting} />
    </Tab.Navigator>
  )
}

export default Home