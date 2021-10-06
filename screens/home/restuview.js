import React, { useState , useEffect} from "react";
import { StyleSheet,Text,Image,Dimensions, TextInput ,Button,SafeAreaView,ScrollView,ImageBackground, View } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Progress from 'react-native-progress';

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

const RenderReview = ({data}) => {

    let review = []
    for(var item in data) {
        console.log(item)
        review.push(
            <View style={{flexDirection: 'row', marginTop:15, alignItems:'center'}}>
            <Image style={{width:35,height:35,borderRadius:50}}source={{
                    uri: data[item].pic,
                    }}></Image>
            <Text style={{padding:5,width:'75%',color:'#CBCBCB', backgroundColor:'rgba(196, 196, 196, 0.31)', borderWidth:1,borderRadius:3,marginLeft:5,height:'auto'}}>{data[item].note}</Text>
            <TouchableOpacity><Entypo name="arrow-bold-up" size={24} color="#68D25F" /></TouchableOpacity>
            <TouchableOpacity><Entypo name="arrow-bold-down" size={24} color="#68D25F" /></TouchableOpacity>
        </View>
        )
    }
    return review
}

const RestuView = ({route, navigation}) => {
    const [data , setData] = useState()
    const [loading , setLoading] = useState(true)
    useEffect(() => {
      fetch("http://192.168.0.88:8000/api/reviews?rid="+route.params.rid)
        .then(response => response.json())
        .then(json => {
          setData(json);
          setLoading(false)
        });
    }, [])

    return <SafeAreaView style={styles.container}>

    <View style={styles.body}>
        <View style={{ justifyContent: 'space-between' ,flexDirection: 'row',  alignItems :'center' ,marginBottom:5}}>
            <TouchableOpacity style={{left:0}} onPress={(props) => {navigation.goBack(null) }}>
                <AntDesign  style={{ marginRight:'auto'}}name="arrowleft" size={30} color="#68D25F" />
            </TouchableOpacity>
            <Text style={styles.restuname}>{route.params.title}</Text>  
        </View>

        {/*SCROLL */}

        
        <View style={{flexGrow:1}}>
        <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <ImageBackground 
                resizeMode = 'cover'
                style={styles.itemImage}
                source={{
                uri: route.params.image
                }}
            >
            </ImageBackground > 
            <View style={styles.restuInfoContainer}>
                <View style={styles.restuInfo}>
                    <Text style={styles.restuInfoText}>{route.params.name}</Text>
                    <Text style={styles.restuInfoText}>{route.params.phone}</Text>
                </View>
                <View style={styles.stars}> 
                    <StarRender many={route.params.stars}></StarRender>
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
                {loading ? <View style={{flex:1 , alignItems:'center' , justifyContent:'center'}}><Progress.Circle color="#68D25F" size={30} indeterminate={true} /><Text style={{color: '#68D25F'}}>Loading reviews..</Text></View> : <RenderReview data={data}></RenderReview>}
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

