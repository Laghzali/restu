import React, { useState , useRef,  useEffect} from "react";
import { StyleSheet,Text,Image,SafeAreaView,Dimensions , ScrollView,ImageBackground, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import {Platform} from 'react-native';
import {Overlay } from 'react-native-elements';
import { IconButton } from 'react-native-paper';

const windowHeight = Dimensions.get('window').height;
const screenHeight = Dimensions.get('screen').height;
const navbarHeight = screenHeight - windowHeight
const mid = 1;

const RestuView = ({route, navigation}) => {
    
    
    const [visible , setVisible] = useState({id : null , visible : false})
    const toggle = (id) => {
        setVisible({id : id , visible : !!visible})
    }

    const RenderReview = ({data}) => {
        return data.map((data , index) => {

            return (
                <View key={'key'+index} style={{flexDirection: 'row', marginTop:15, alignItems:'center'}}>
                <Image style={{borderColor:'rgba(104, 210, 95,0.5)',borderWidth:1,width:35,height:35,borderRadius:50}}source={{
                        uri: data.mpic,
                        }}></Image>
                <TouchableOpacity style={{width:'88%'}} onPress={() => toggle(data.id)}>
                    <Text style={{padding:5,
                    flexGrow:1,
                        width:'100%',color:'#CBCBCB', 
                        backgroundColor:'rgba(196, 196, 196, 0.11)', 
                        borderWidth:1,borderRadius:3,marginLeft:5 , borderColor:'rgba(104, 210, 95, 0.22)'}}>{data.note}
                    </Text>
                </TouchableOpacity>
                <Overlay  onBackdropPress={toggle}  isVisible={visible.id == data.id ? visible.visible : false}>
                 <Image  style={{width: Dimensions .get('window').width - 50 ,height:320}} source={{uri : data.pic , scale :1}}></Image>
                </Overlay>   
                </View>         
            )})
    
    }
    const [file , setFile] = useState( { isSet : false , name : null , uri : null , type : null})
    const [note , setNote] = useState(null)
    const [stars , setStars] = useState(0)

    const RatingHandler = (x) => {
            let rating = x          
            setStars(rating)
    }
    const StarRender = ({many}) => {
        let array = []
        let max = 5
        for (let x = 1 ;  x<=max ; x++) {
            if(x >= stars+1) {
                array.push(<TouchableOpacity key={'key'+x} onPress={() => RatingHandler(x)}><Feather name="star" size={22} color="#68D25F" /></TouchableOpacity>)
                
            } else {
                array.push(<TouchableOpacity key={x} onPress={() => RatingHandler(x)}><FontAwesome name="star" size={22} color="#68D25F" /></TouchableOpacity>)


            }
        }

        return array
    }

    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);

  

    const pickFile = async () => {
       
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          type : 'image',
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        }).then(rez => {
            if(!rez.cancelled){

            
            let localUri = rez.uri;
            let filename = localUri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            setFile({ name : filename , uri : localUri , type : type , isSet : true})
             }
        
        });

      };

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

    let uploadImage = async () => {
        //Check if any file is selected or not

        if (file != null && stars > 0 && note.length > 0) {
            
            setLoading(true)
          //If file selected then create FormData
          const data = new FormData();
          data.append('note', note);
          data.append('mid', mid);
          data.append('rid', route.params.rid);
          data.append('pic', { name : file.name , uri : file.uri , type : file.type});
          data.append('rate', stars);
          let res = await fetch(
            'http://192.168.0.88:8000/api/review/new',
            {
              method: 'post',
              body: data,
              headers: {
                'Content-Type': 'multipart/form-data; ',
              }
            }
          );

          let responseJson = await res.json();
          
          if (responseJson.status == 200) {
            fetch("http://192.168.0.88:8000/api/reviews?rid="+route.params.rid)
                .then(response => response.json())
                .then(json => {
                setData(json);
                setFile({isSet : false , name : null , uri : null , type : null})
                setLoading(false)
        });
          }
        } else {
          //if no file selected the show alert
          alert('Please check your review');
        }
    };


    return <SafeAreaView style={styles.container}>

    <View style={styles.body}>
        <View style={{ justifyContent: 'space-between' ,flexDirection: 'row',  alignItems :'center' ,marginBottom:navbarHeight}}>
            <TouchableOpacity style={{left:0}} onPress={(props) => {navigation.goBack(null) }}>
                <AntDesign  style={{ marginRight:'auto'}}name="arrowleft" size={30} color="#68D25F" />
            </TouchableOpacity>
            <Text style={styles.restuname}>{route.params.title}</Text>  
        </View>

        {/*SCROLL */}

        
        <View style={{flexGrow:1 }}>
        <ScrollView contentContainerStyle={{marginVertical:40, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
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

                    <TextInput underlineColor = 'green' onChangeText={(note) =>setNote(note)}  style={styles.inputarea} multiline placeholder="Please write a review" />
            </View> 
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <TouchableOpacity onPress={pickFile}>
                     <Entypo name="camera" size={25} color={ file.isSet ? "red" : "#68D25F"} />
                    </TouchableOpacity>

                    <IconButton
                     style ={{backgroundColor:'transparent'  ,height:25 , borderRadius:5}}
                     onPress={uploadImage} color='#68D25F' icon="send"></IconButton>
                </View>
         
            <View style={{marginTop:12,flex:1 , marginBottom : navbarHeight}}>
                <Text style={{fontSize:18, fontWeight:'bold', color:'#CBCBCB'}}>Other Reviews</Text>
                {loading ? <View style={{flex:1 , alignItems:'center' , justifyContent:'center'}}>
                    <Progress.Circle color="#68D25F" size={30} indeterminate={true} />
                    <Text style={{color: '#68D25F'}}>Loading reviews..</Text>
                    </View> : <RenderReview  data={data}></RenderReview>}
            </View> 
            <View style={{marginBottom:10}}/>
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
    color : '#68D25F',

    fontSize : 12
}
})
export default RestuView 

