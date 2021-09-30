import React from 'react';
import { ImageBackground , View , Text , StyleSheet } from 'react-native';

const Login = () => (
    <View style={styles.container}>
      <ImageBackground source={require("./SPLASH.png")}style={styles.image}>
      
      </ImageBackground>
    </View>
  );
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: "center"
    }
  });
  
  export default Login;