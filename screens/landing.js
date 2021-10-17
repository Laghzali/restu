
import React , {useState , useEffect} from 'react';
import {View , Text , Image , TouchableOpacity} from 'react-native'
import Home from './home/home'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Header from './header'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

const Landing = ({navigation}) => {
  const Drawer = createDrawerNavigator();
  const [mData, setMdata] = useState({})
  const getData = () => {
    AsyncStorage.getItem('mid').then( mid => {
      fetch('http://192.168.0.88:8000/api/members?mid='+mid)
      .then(response => response.json())
      .then(json => {
        
          setMdata(json[0])
      })
    })
  }
  useEffect(() => getData() , [])
  console.log(String(mData.pic).length)
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
              <Text>{mData.name}</Text>
              <Text>{mData.user}</Text>
            </View>
            <Image
              source={{
                uri: 'http://192.168.0.88:8000/storage/user.png',
              }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
          </View>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
        <TouchableOpacity
    
          onPress={() => {AsyncStorage.clear(); props.navigation.replace('Auth')}}
          style={{
            position: 'absolute',
            right: 0,
            left: 0,
            bottom: 50,
            backgroundColor: '#f6f6f6',
            padding: 20,
          }}
        >
          <Text>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const HomeScreen = (props) => {return <Home  {...props}/>}

    return (
       
            <Drawer.Navigator screenOptions={{

              headerShown: false,
              headerStyle: {
                backgroundColor: 'transparent',
                elevation: 0,
                shadowOpacity: 0,
              }
            }}
              drawerContent={props => <CustomDrawer {...props} />}
              initialRouteName="Home">
              <Drawer.Screen  name="Home" component={HomeScreen}/>

            </Drawer.Navigator>
    )
}

export default Landing