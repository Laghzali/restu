import React ,  {useEffect, useState} from 'react';
import { ImageBackground , View , Text , StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';


const Splash = ({navigation}) => {
   //State for ActivityIndicator animation
   const [animating, setAnimating] = useState(true);

   useEffect(() => {
     setTimeout( async () => {
       setAnimating(false);
       //Check if user_id is set or not
       //If not then send for Authentication
       //else send to Home Screen
      let isAdmin = await SecureStore.getItemAsync('isAdmin')
       SecureStore.getItemAsync('mid').then((value) =>
        { 
          if(isAdmin === '1') {
            navigation.replace('Admin')
          } else {
            navigation.replace(value === null ? 'Auth' : 'Landing'
         )}
        
        },
       );
     }, 1000);
   }, []);
  return(
    <View style={styles.container}>
      <ImageBackground source={require("./SPLASH.png")}style={styles.image}>
      
      </ImageBackground>
    </View>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: "center"
    }
  });
  export default Splash;