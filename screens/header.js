import React, { useState} from "react";
import { StyleSheet,Text,View , TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
const Header = ({navigation}) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => {navigation.openDrawer()}}>
                <Entypo name="menu" size={33} color="#68D25F" />
            </TouchableOpacity>
            <Text style={styles.dashboard}>DASHBOARD</Text>
            <FontAwesome name="bell-o" size={33} color="#68D25F" />
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