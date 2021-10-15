
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
  const [data, setData] = useState({ data : null , count : null , isLoading : true})

  const fetchData =  () => {

        AsyncStorage.getItem('mid').then(mid => { 
        //fix this contuniously fetching...
        fetch("http://192.168.0.88:8000/api/retrive/toreview?mid=" + mid)
        .then(response => response.json())
        .then(json => setData({data : json , count : json.length , isLoading : false}))
    
      } )

  }
  useEffect(  () =>  fetchData() , [] ) 

  const Head = ({navigation}) => {  
    return (<Header navigation={navigation} count={data.count} />)
  }
  const HomeScreen = () => <Home data={data.data} isLoading={data.isLoading} navigation={navigation}></Home>

    return (
       
            <Drawer.Navigator screenOptions={{
              header : Head,
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