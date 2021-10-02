import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Home from './home/home'
import RestuView from './home/restuview'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';



const Drawer = createDrawerNavigator();
const Landing = () => {
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