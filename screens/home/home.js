
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Header from '../header'
import React, { useState , useRef} from "react";
import { StyleSheet,ImageBackground , TouchableOpacity ,FlatList,Text, View } from 'react-native';
const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba5',
      title: 'First Item',
      stars : 3,
      phone: '510347844',
      image : 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f634',
      phone: '510347844',
      stars : 2,
      title: 'Second Item',
      image : 'https://media.gettyimages.com/photos/cozy-restaurant-for-gathering-with-friends-picture-id1159992039?s=612x612'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d723',
      phone: '510347844',
      title: 'Third Item',
      stars : 2,
      image : 'https://marinercompass.org/wp-content/uploads/2021/04/menu-restaurant-vintage-table.jpg'
    },    {
        id: '58694a0f-3da1-471f-bd96-145571e293722',
        stars : 5,
      phone: '510347844',
      title: 'Third Item',
        image : 'https://marinercompass.org/wp-content/uploads/2021/04/menu-restaurant-vintage-table.jpg'
      },    {
        id: '58694a0f-3da1-471f-bd96-145571e2xd721',
        stars : 1,
      phone: '510347844',
      title: 'Third Item',
        image : 'https://marinercompass.org/wp-content/uploads/2021/04/menu-restaurant-vintage-table.jpg'
      },
  ];




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
  const Item = ({phone, title, image , stars , navigation }) => {

    return (
    <View>

      <TouchableOpacity onPress={() => navigation.navigate('RestuView' , { phone : phone, title : title , image : image , stars : stars  })}  style={styles.item}>
             <ImageBackground 
                resizeMode = 'cover'
                style={styles.itemImage}
                source={{
                uri: image,
                }}
            >
              <LinearGradient start= {{ x : 1 , y : 1}} end={{x : 0.6 , y : 0.5}} colors={['rgba(39, 33, 33, 0.8)' , 'rgba(39, 33, 33, 0.41)']} style={styles.overlay}>  
                <View style={{ flexDirection:'column', flex:3}}>
                  <Text style={styles.titleName}>{title}</Text>
                  <Text style={styles.titleAddress}>{phone}</Text>
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

        return (<Item navigation={navigation} stars={item.stars} phone={item.phone} image={item.image} title={item.title} />)
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
                    data={DATA}
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
