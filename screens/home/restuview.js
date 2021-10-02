import React, { useState} from "react";
import { StyleSheet,Text,Image,Dimensions, TextInput ,Button,SafeAreaView,ScrollView,ImageBackground, View } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";
import Header from '../header'
const StarRender = ({many}) => {
    let array = []
    let max = 5
    for (let x = 0 ;  x<many ; x++) {
      array.push(<TouchableOpacity><FontAwesome name="star" size={22} color="yellow" /></TouchableOpacity>)
    }
    for(let y = 0 ; y < max-many ; y++) {
      array.push(<TouchableOpacity><Feather name="star" size={22} color="yellow" /></TouchableOpacity>)
    }
    return array
}

const RenderReview = ({}) => {
    let review = []
    review.push(
        <View style={{flexDirection: 'row', marginTop:15, alignItems:'center'}}>
        <Image style={{width:35,height:35,borderRadius:50}}source={{
                uri: 'https://scontent-waw1-1.xx.fbcdn.net/v/t39.30808-6/244318308_920940505297987_843937583073049225_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=ojCqFj6BtfIAX8JIsnY&_nc_ht=scontent-waw1-1.xx&oh=f7542e39d0541000952fa3bc82436fb6&oe=615B50D3',
                }}></Image>
        <Text style={{padding:5,width:'75%',color:'#CBCBCB', backgroundColor:'rgba(196, 196, 196, 0.31)', borderWidth:1,borderRadius:3,marginLeft:5,height:50}}>review</Text>
        <TouchableOpacity><Entypo name="arrow-bold-up" size={24} color="#68D25F" /></TouchableOpacity>
        <TouchableOpacity><Entypo name="arrow-bold-down" size={24} color="#68D25F" /></TouchableOpacity>
    </View>
    )
    return review
}

const RestuView = ({navigation}) => {


    return <SafeAreaView style={styles.container}>

    <View style={styles.body}>
        
        <View style={{ justifyContent: 'space-between' ,flexDirection: 'row',  alignItems :'center' ,marginBottom:5}}>
            <TouchableOpacity style={{left:0}} onPress={(props) => {navigation.goBack(null) }}>
                <AntDesign  style={{ marginRight:'auto'}}name="arrowleft" size={30} color="#68D25F" />
            </TouchableOpacity>
            <Text style={styles.restuname}>xxxxxxxx</Text>  
        </View>

        {/*SCROLL */}

        
        <View style={{flexGrow:1}}>
        <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <ImageBackground 
                resizeMode = 'cover'
                style={styles.itemImage}
                source={{
                uri: 'https://marinercompass.org/wp-content/uploads/2021/04/menu-restaurant-vintage-table.jpg',
                }}
            >
            </ImageBackground > 
            <View style={styles.restuInfoContainer}>
                <View style={styles.restuInfo}>
                    <Text style={styles.restuInfoText}>Some address , 22 2293</Text>
                    <Text style={styles.restuInfoText}>+48 51943873</Text>
                </View>
                <View style={styles.stars}> 
                    <StarRender many={3}></StarRender>
                </View>      
            </View>

            <View style={styles.inputContainer}>
                    <TextInput style={styles.inputarea} multiline placeholder="Please write a review" />
            </View> 
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <TouchableOpacity>
                     <Entypo name="camera" size={30} color="#68D25F" />
                    </TouchableOpacity>

                    <Button color='#68D25F' title="Submit"></Button>
                </View>
         
            <View style={{marginTop:12,flex:1}}>
                <Text style={{fontSize:18, fontWeight:'bold', color:'#CBCBCB'}}>Other Reviews</Text>
                <RenderReview></RenderReview>
            </View> 
        </ScrollView>   
        </View>
                  
    </View>
</SafeAreaView>

}
const styles = StyleSheet.create({
    inputContainer : {
        marginTop:10,
        height:'15%',
        marginBottom:5    
    }   ,
inputarea : {
    color: '#CBCBCB',
        borderRadius:3,
        padding:10,
        height:'100%',
        textAlignVertical: 'top',
        backgroundColor:'rgba(196, 196, 196, 0.31)'
},    
container : {
    flex: 1,
    backgroundColor : '#272121'     
},
header : {
    alignItems : 'center',
    padding : 15,
    justifyContent: 'space-between',
    flexDirection : 'row',

},
dashboard : {
    color : '#CBCBCB',
    fontWeight : 'bold',
    fontSize:24,

},
restuname : {
    color : '#CBCBCB',
    fontWeight : 'bold',
    fontSize:20,
},
body : {
    height:'auto',
    padding:10,
    flex:1
}, 
itemImage : {
    width : '100%',
    height: 240
},
restuInfoContainer : {

    flexDirection : 'row'
},
restuInfo : {
    marginTop:10,
    flexDirection : 'column',

}, 
restuInfoText : {
     color : '#CBCBCB',
     fontSize : 14,

},
stars : {
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    flex:1,
    color : '#CBCBCB',

    fontSize : 12
}
})
export default RestuView 

