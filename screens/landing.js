
import React from 'react';
import Home from './home/home'
import RestuView from './home/restuview'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Header from './header'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = ({navigation}) => {
  AsyncStorage.clear()
  return (<>{navigation.replace('Auth')}</>)
}
const Drawer = createDrawerNavigator();
const Landing = ({navigation}) => {
    return (
       
            <Drawer.Navigator screenOptions={{
              header : Header,
              drawerStyle: {
                color : 'white',
                width: 240,
                          },
                }} 
              initialRouteName="Home">
              <Drawer.Screen  name="Home" component={() => <Home navigation={navigation}/>} />
              <Drawer.Screen  name="Logout" component={() => <Logout navigation={navigation}/>} />
            </Drawer.Navigator>
    )
}

export default Landing