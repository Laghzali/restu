
import React , {useState , useEffect} from 'react';
import {View , Text , Image , TouchableOpacity} from 'react-native'
import Home from './home/home';
import * as SecureStore from 'expo-secure-store';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

const Landing = ({navigation}) => {

  const Drawer = createDrawerNavigator();
  const [mData, setMdata] = useState({})
  const getData = async () => {
    let token = await SecureStore.getItemAsync('token')
    let mid = await SecureStore.getItemAsync('mid')
      const url = 'https://restuapi.orderaid.com.au/api/members?mid='+mid+"&token="+token

      await fetch(url)
      .then(response => response.json())
      .then(json => {
        
          setMdata(json[0])
      })

  }
  useEffect(  () =>  {getData()} , [])

  const CustomDrawer = props => {

    return (
      
      <View style={{ flex: 1 }}>
        
        <DrawerContentScrollView {...props}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              backgroundColor: '#f6f6f6',
              marginBottom: 20,
            }}
          >
            <View>
              <Text style={{fontWeight:'bold'}}>{mData.name}</Text>
              <Text>{mData.user}</Text>
            </View>
            <Image
              source={{
                uri: 'https://restuapi.orderaid.com.au/storage/user.png',
              }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
          </View>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
        <TouchableOpacity
    
          onPress={() =>  {
            SecureStore.deleteItemAsync('isAdmin')
            SecureStore.deleteItemAsync('mid');
            SecureStore.deleteItemAsync('token');
            props.navigation.navigate('Auth')
             
            }}
          style={{
            position: 'absolute',
            right: 0,
            left: 0,
            bottom: 50,
            backgroundColor: '#f6f6f6',
            padding: 20,
          }}
        >
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const HomeScreen = (props) => {return <Home  {...props}/>}
  
    return (
       
            <Drawer.Navigator screenOptions={{

              headerShown: false,
              headerStyle: {
                backgroundColor: '#272121',
                elevation: 0,
                shadowOpacity: 0,
              }
            }}
              drawerContent={props => <CustomDrawer {...props} />}
              initialRouteName="Home">
              <Drawer.Screen  name="Home" component={Home}/>
             

            </Drawer.Navigator>
    )
}

export default Landing