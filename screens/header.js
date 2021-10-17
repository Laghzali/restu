import React, { useState , useEffect} from "react";
import { StyleSheet,Text,View , TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = ({count,  navigation}) => {
   
    const [newCount , setCount] = useState(count)
    const openDrawer = () => {
        navigation.openDrawer()

    }
    useEffect( () =>{
        AsyncStorage.getItem('count').then(count => setCount(count))
    }, [navigation])

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={openDrawer}>
                <Entypo name="menu" size={33} color="#68D25F" />
            </TouchableOpacity>
            <MaterialIcons name="food-bank" size={40} color="#68D25F" />
            <View style={{flexDirection : 'row'}}>
            <Text style={{color:'red', fontSize:18, fontWeight:'bold'}}>{count}</Text>
            <FontAwesome name="bell-o" size={22} style={{paddingTop:10}} color="#68D25F" />

            </View>
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    header : {
        backgroundColor:'#272121',
        alignItems : 'center',
        padding : 15,
        justifyContent: 'space-between',
        flexDirection : 'row',
    
    },
    dashboard : {
        color : '#CBCBCB',
        fontWeight : 'bold',
        fontSize:24,
    
    }
})
export default Header