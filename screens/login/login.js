
import React, {useState } from 'react';
import { StyleSheet,Text ,  TextInput, Button, View } from 'react-native';
import LoginBg from './loginBg';
import { AntDesign } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import * as yup from 'yup';

import {
    useFonts,
    Inter_900Black,
    Roboto_100Thin
  } from '@expo-google-fonts/inter';

  async function secureStore(key , value) {
    await SecureStore.setItemAsync(key, value.toString());
  }

const Login =({navigation}) => {

    let schema = yup.object().shape({
      email: yup.string().email().required(),
      password : yup.string().required()
    });

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPass] = useState('');

    const validateLogin = () => {
            schema
            .isValid({
              email: userEmail,
              password: userPassword
            })
            .then(function (valid) {
              if(valid == true) {
                getLogin()
              } else {alert("invalid email or password")}
            });
    }
    const getLogin =  () => {
         fetch('https://restuapi.orderaid.com.au/api/login', {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({'user' : userEmail , 'pass' : userPassword }),
          })
          .then(response => response.json())
          .then(data => {
              if(data.status == 'admin') {
                secureStore('mid', data.mid);
                secureStore('isAdmin', 1);
                secureStore('token', data.token);
                navigation.replace('Admin' , {mid : data.mid});
              }
              if(data.status==200) {
                secureStore('mid', data.mid.toString());
                secureStore('isAdmin', 0);
                secureStore('token', data.token);

                navigation.replace('Landing' , {mid : data.mid});
              }
              if(data.status == 500) {
                  alert('wrong email or pass')
              }
          })
          .catch((error) => {
            console.error('Error:', error);
            alert('error')

          });

    }
    let [fontsLoaded] = useFonts({
        Inter_900Black
      });
    
   return <View style={{flex : 1,backgroundColor:'rgb(255,255,255)'}}>
            <LoginBg>

            </LoginBg>
            <View style={styles.loginView}>
                    <View style={styles.inputFields}>
                       <View style={styles.inputContainer}>
                        <AntDesign name="user" size={18} color="#68D25F" />    
                        <TextInput mode="outlined" outlineColor="green"
                        onChangeText={(UserEmail) =>
                            setUserEmail(UserEmail)
                          }
                        style={styles.input}
                            placeholder="Email"
                        />
                      </View>   

                      <View style={styles.inputContainer}>
                      <Feather name="hash" size={18} color="#68D25F" />
                        <TextInput mode="outlined" outlineColor="green"
                        onChangeText={(UserPass) =>
                        setUserPass(UserPass)
                        }
                        style={styles.input}
                            placeholder="Password"
                        />
                      </View>   
                    <View style={styles.forgetPass}>
                        <Text style={{color:'#68D25F' , fontFamily: 'Inter_900Black'}}>Forget password?</Text>
                    </View>

                    <Button 
                        onPress={validateLogin}
                        title="Sign in"
                        color="#68D25F"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <Text style={{marginLeft:'auto', marginRight:'auto' ,fontFamily: 'Inter_900Black' ,margin:10}}>Or</Text>
                    <Button
                        onPress={() => {navigation.navigate('SignUpScreen')}}
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
                alignItems : 'center',
                backgroundColor:'rgb(255,255,255)'
            },
            input : {
                borderWidth : 0,
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