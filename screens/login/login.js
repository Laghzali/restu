
import React from 'react';
import { StyleSheet,Text , Button, View ,TextInput } from 'react-native';
import LoginBg from './loginBg';
import { AntDesign } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import {
    useFonts,
    Inter_900Black,
    Roboto_100Thin
  } from '@expo-google-fonts/inter';

const Login =() => {
    let [fontsLoaded] = useFonts({
        Inter_900Black
      });
    
   return <View style={{flex : 1}}>
            <LoginBg style={styles.background}>

            </LoginBg>
            <View style={styles.loginView}>
                    <View style={styles.inputFields}>
                       <View style={styles.inputContainer}>
                        <AntDesign name="user" size={18} color="#68D25F" />    
                        <TextInput
                        style={styles.input}
                            placeholder="Email"
                        />
                      </View>   

                      <View style={styles.inputContainer}>
                      <Feather name="hash" size={18} color="#68D25F" />
                        <TextInput
                        style={styles.input}
                            placeholder="Password"
                        />
                      </View>   
                    <View style={styles.forgetPass}>
                        <Text style={{color:'#68D25F' , fontFamily: 'Inter_900Black'}}>Forget password?</Text>
                    </View>

                    <Button

                        title="Sign in"
                        color="#68D25F"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <Text style={{marginLeft:'auto', marginRight:'auto' ,fontFamily: 'Inter_900Black' ,margin:10}}>Or</Text>
                    <Button

                        title="Sign up"
                        color="#68D25F"

                    />
                      
                    </View>
                </View>
         </View>
        
}

export default Login

const styles = StyleSheet.create({
            forgetPass : {
                marginLeft:'auto',
                margin:10
            },
            loginView : {
                marginTop : '6%',
                flex:1,
                justifyContent: 'center',
                alignItems : 'center'
            },
            input : {

                fontFamily: 'sans-serif',
                width : '100%',
                height : 30,
                borderBottomWidth : 1,
                borderColor : '#68D25F'
            }, 
            inputFields : {

                flex:1,
                width: '70%',
            },
            inputContainer :  {width:'100%', flexDirection: 'row' , alignItems : 'center', marginBottom : 20, }

})