import { StatusBar } from 'expo-status-bar';
import React , {useState , useRef , useEffect} from 'react';
import Splash from './screens/splash/splash'
import SignUp from './screens/signup/signup'
import Login from './screens/login/login'
import RestuView from './screens/home/restuview'

import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Landing from './screens/landing'

const Stack  = createStackNavigator();

const Auth = ({navigation}) => {

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

  return ( 
    
    <NavigationContainer>
       <StatusBar hidden/>
      <Stack.Navigator initialRouteName="Splash">
        {/* SplashScreen which will come once for 5 Seconds */}
        <Stack.Screen
          name="SplashScreen"
          component={Splash}
          // Hiding header for Splash Screen
          options={{headerShown: false}}
        />
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        {/* Navigation Drawer as a landing page */}
        <Stack.Screen
          name="Landing"
          component={Landing}
          // Hiding header for Navigation Drawer
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="RestuView"
          component={RestuView}
          // Hiding header for Navigation Drawer
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

