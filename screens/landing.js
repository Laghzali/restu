
import React from 'react';
import Home from './home/home'
import Login from './login/login'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Header from './header'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = () => {
  return (<></>)
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
              <Drawer.Screen  name="Home" component={Home} />
              <Drawer.Screen name="Logout" component={Logout} listeners={({ navigation }) => ({ 
                  state: (e) => {
                    if (e.data.state.index === 1) {
                        // THIS IS SO DUMB , LEARN HOW PROPS WORK PLS
                        navigation.replace("Auth")
                        AsyncStorage.clear()
                    }
                  }
              })}/>
            </Drawer.Navigator>
    )
}

export default Landing