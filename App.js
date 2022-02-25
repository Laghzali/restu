import { StatusBar } from 'expo-status-bar';
import React , {useState , useRef , useEffect} from 'react';
import Splash from './screens/splash/splash'
import Login from './screens/login/login'
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Admin from './screens/admin'
import SelectMemebers from './screens/SelectMemebers'
import ManageRestu from './screens/ManageRestu';
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
 const AdminScreen = props => {return (<Admin {...props}/>)}
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
        
        <Stack.Screen
          name="Admin"
          component={Admin}
          // Hiding header for Navigation Drawer
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SelectMembers"
          component={SelectMemebers}
          // Hiding header for Navigation Drawer
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ManageRestu"
          component={ManageRestu}
          // Hiding header for Navigation Drawer
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

