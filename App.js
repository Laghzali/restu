import { StatusBar } from 'expo-status-bar';
import React , {useState , useRef , useEffect} from 'react';
import Splash from './screens/splash/splash'
import SignUp from './screens/signup/signup'
import Login from './screens/login/login'
import RestuView from './screens/home/restuview'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Landing from './screens/landing'
import Admin from './screens/admin'
import SelectMemebers from './screens/SelectMemebers'
const Stack  = createStackNavigator();
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const BACKGROUND_FETCH_TASK = 'background-fetch';


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

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'New resturants available !',
      body: 'Open the app and submit your review',
      data: { someData: 'goes here' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }



    useEffect(() => {

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
    
  }, []);

  const send = async () => {

    await sendPushNotification(expoPushToken);
}
  
  const updateMyCount = (newCount) => {
    AsyncStorage.setItem('count', String(newCount))
  }
  TaskManager.defineTask('fetch', async () => {
    AsyncStorage.getItem('mid').then( mid => {
    fetch('http://192.168.0.88:8000/api/notifications?mid=' +mid)
    .then( response => response.json())
    .then( json => {
      AsyncStorage.getItem('count').then( localcount => {
        console.log('localcount => ' + localcount)
        console.log('newcount => ' + json.count)
        if(json.count > localcount) {
          send()
          updateMyCount(json.count)
        }
      })
    })})
    return BackgroundFetch.Result.NewData;
  });
  async function registerBackgroundFetchAsync() {

    return BackgroundFetch.registerTaskAsync('fetch', {
      minimumInterval: 1, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }


 let registerTask = async () => await registerBackgroundFetchAsync();
      registerTask().catch(e => console.log(e))
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
          name="RestuView"
          component={RestuView}
          // Hiding header for Navigation Drawer
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

