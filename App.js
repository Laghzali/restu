import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Splash from './screens/splash/splash'
import SignUp from './screens/signup/signup'
import Home from './screens/home/home'
import Login from './screens/login/login'
import RestuView from './screens/home/restuview'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Header from './screens/header'

const Stack  = createStackNavigator();
const Drawer = createDrawerNavigator();
const Auth = () => {

  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUp}
        options={{headerShown: false}}
      />      
     </Stack.Navigator> 
  )
}
export default function App() {
  return ( <>
  <StatusBar hidden/>
    <NavigationContainer >
      <Drawer.Navigator screenOptions={{
        header : Header,
        drawerStyle: {
          color : 'white',
          width: 240,
                    },
          }} 
        initialRouteName="Home">
        <Drawer.Screen  name="Home" component={Home} />
        <Drawer.Screen name="RestuView" component={RestuView} />
      </Drawer.Navigator>
    </NavigationContainer>
    </>
  )
}

