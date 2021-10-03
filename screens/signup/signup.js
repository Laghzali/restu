import React, { useState } from "react";
import { StyleSheet,Text ,CheckBox , Button, View ,TextInput, TouchableOpacity } from 'react-native';
import LoginBg from './loginBg';
import { AntDesign } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import {
    useFonts,
    Inter_900Black,
    Roboto_100Thin
  } from '@expo-google-fonts/inter';

const SignUp =() => {
    const [isSelected, setSelection] = useState(false);
    let [fontsLoaded] = useFonts({
        Inter_900Black
      });
    
   return <View style={{flex : 1,  backgroundColor:'white'}}>
       
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
                      <View style={styles.inputContainer}>
                      <Ionicons name="person-outline" size={18} color="#68D25F" /> 
                        <TextInput
                        style={styles.input}
                            placeholder="Name"
                        />
                      </View>  
                      <View style={styles.inputContainer}>
                        <AntDesign name="mobile1" size={18} color="#68D25F" /> 
                        <TextInput
                        style={styles.input}
                            placeholder="Phone"
                        />
                      </View>  
                      <View style={{flexDirection: 'row' ,paddingBottom : 5 , alignItems:'center'}}>
                        <CheckBox 
                            value={isSelected}
                            onValueChange={setSelection}
                        />
                            <Text style={{paddingLeft: 5}}>Accept terms of service?</Text>
                      </View>


                        <Button
                            title="Sign Up"
                            color="#68D25F"
                        />
                    </View>
                </View>
         </View>
        
}

export default SignUp

const styles = StyleSheet.create({
            forgetPass : {
                marginLeft:'auto',
                margin:10
            },
            loginView : {
                marginTop : '2%',
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
            inputContainer :  {width:'100%', flexDirection: 'row' , alignItems : 'center', marginBottom : 12, }

})