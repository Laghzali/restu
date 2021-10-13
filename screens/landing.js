
import React , {useState , useEffect} from 'react';
import Home from './home/home'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Header from './header'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = ({navigation}) => {
  AsyncStorage.clear()
  return (<>{navigation.replace('Auth')}</>)
}

const Drawer = createDrawerNavigator();

const Landing = ({route, navigation}) => {
 
  const [data , setData] = useState("")
  const [isLoading , setLoading] = useState(true)
  const HomeScreen = () => <Home data={data} loading={isLoading} navigation={navigation}></Home>
  useEffect(() => { AsyncStorage.getItem('mid').then( mid => {
  
  fetch("http://192.168.0.88:8000/api/retrive/toreview?mid=" + mid)
    .then(response => response.json())
    .then(json => {
      setData(json);
      setLoading(false)
    });
  
}) }, [])
    return (
       
            <Drawer.Navigator screenOptions={{
              header : Header,
              drawerStyle: {
                color : 'brown',
                width: 240,
                          },
                }} 
              initialRouteName="Home">
              <Drawer.Screen  name="Home" component={HomeScreen} />
              <Drawer.Screen  name="Logout" component={Logout} />
            </Drawer.Navigator>
    )
}

export default Landing