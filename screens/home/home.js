
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import React, { useState , useEffect } from "react";
import { StyleSheet,ImageBackground , TouchableOpacity ,FlatList,Text, View } from 'react-native';

  const StarRender = ({many}) => {
          let array = []
          let max = 5
          for (let x = 0 ;  x<many ; x++) {
            array.push(<FontAwesome name="star" size={18} color="yellow" />)
          }
          for(let y = 0 ; y < max-many ; y++) {
            array.push(<Feather name="star" size={18} color="yellow" />)
          }
          return array
    }
  const Item = ({phone, name, image , stars , address ,navigation }) => {

    return (
    <View>

      <TouchableOpacity onPress={() => navigation.navigate('RestuView' , { phone : phone, name : name , image : image , stars : stars , address : address  })}  style={styles.item}>
             <ImageBackground 
                resizeMode = 'cover'
                style={styles.itemImage}
                source={{
                uri: decodeURI(image),
                }}
            >
              <LinearGradient start= {{ x : 1 , y : 1}} end={{x : 0.6 , y : 0.5}} colors={['rgba(39, 33, 33, 0.8)' , 'rgba(39, 33, 33, 0.41)']} style={styles.overlay}>  
                <View style={{ flexDirection:'column', flex:3}}>
                  <Text style={styles.titleName}>{name}</Text>
                  <Text style={styles.titleAddress}>{address}</Text>
                </View>

                <View style={{flexDirection:'row' , flex:1 , justifyContent:'center' , alignItems :'center' , marginRight:'5%'}}>
                  <StarRender many={stars}></StarRender>
                    
                </View>
              </LinearGradient>  
            </ImageBackground >
      </TouchableOpacity>      
    </View> 
    )}
  
  
const Home =({navigation}) => {
  const [data , setData] = useState()

  useEffect(() => {
    fetch("http://192.168.0.88:8000/api/resturants")
      .then(response => response.json())
      .then(json => {
        setData(json);
      });
  }, [])

  console.log(data)
  
  const [active, setActive] = useState({
    elm0 : true,
    elm1 : false
  });
  const onPressActive = () => {
    if (active.elm0 == true) {
      setActive({elm0 : false , elm1 : true})
    }
    else {
      setActive({elm0 : true , elm1 : false})
    }

  }

    const renderItem = ({ item }) => {

        return (<Item navigation={navigation} stars={item.stars} phone={item.phone} image={item.pic} address={item.address} name={item.name} />)
      }

   return <View style={styles.container}>

            <View style={styles.body}>
                <View style={styles.bodyNav}>
                  <TouchableOpacity  onPress={onPressActive} style={{ borderColor : "#CBCBCB", borderRadius : 4 ,  borderBottomWidth : active.elm0 ? 3 : 0}}>
                      <Text style={styles.dashboard}>Review list</Text>
                  </TouchableOpacity> 
                  <TouchableOpacity onPress={onPressActive} style={{ borderColor : "#CBCBCB", borderRadius : 4 ,  borderBottomWidth : active.elm1 ? 3 : 0}}>
                    <Text style={styles.dashboard}>Reviewed</Text>
                  </TouchableOpacity>   
                </View>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>

}

const styles = StyleSheet.create({

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
        fontSize:18
    },
    body : {
        flex: 1,
    },
    bodyNav : {
        
        padding : 15,
        flexDirection : 'row',
        justifyContent :'space-around'
    },
    itemImage : {
        width : '100%',
        height: 240
    },
    item : {
        justifyContent : 'center',
        alignItems : 'center',
        padding:15,
        paddingBottom: 5
    }, 
    overlay : {
      flexDirection : 'row',
      width : '100%',
      backgroundColor : 'rgba(0, 0, 0, 0.59)',
      padding:5
    },
    titleAddress : {
      color : '#CBCBCB',
      fontSize : 12
    },
    titleName : {
      color : '#CBCBCB',
      fontWeight:'bold'
    }

    
})

export default Home
