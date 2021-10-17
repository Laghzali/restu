

import { FontAwesome } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import React, { useState , useCallback, useEffect } from "react";
import { StyleSheet,RefreshControl ,ImageBackground , ScrollView, Dimensions, TouchableOpacity ,FlatList,Text, View } from 'react-native';
import Header from '../header'
import AsyncStorage from '@react-native-async-storage/async-storage';
const windowHeight = Dimensions.get('window').height;
AsyncStorage.getItem('count').then( count => console.log(count))
  const StarRender = ({many}) => {
          let array = []
          let max = 5
          for (let x = 0 ;  x<many ; x++) {
            array.push(<FontAwesome key={x+new Date()} name="star" size={18} color="#68D25F" />)
          }
          for(let y = 0 ; y < max-many ; y++) {
            array.push(<Feather key={y} name="star" size={18} color="#68D25F" />)
          }
          return array
    }
  const Item = ({phone, name, image , stars , address ,navigation , rid }) => {

    return (
    <View>

      <TouchableOpacity onPress={() => navigation.navigate('RestuView' , 
            { rid : rid ,
            phone : phone, 
            name : name , 
            image : image , 
            stars : stars , 
            address : address  })}  style={styles.item}>
             <ImageBackground 
                resizeMode = 'cover'
                style={styles.itemImage}
                source={{
                uri: image.length < 1 ? 'https://icons.iconarchive.com/icons/graphicloads/colorful-long-shadow/256/Restaurant-icon.png' : decodeURI(image),
                }}
            >
              <LinearGradient 
                start= {{ x : 1 , y : 1}} 
                end={{x : 0.6 , y : 0.5}}
                colors={['rgba(39, 33, 33, 0.8)' , 'rgba(39, 33, 33, 0.41)']} 
                style={styles.overlay}>  
                <View style={{ flexDirection:'column', flex:3}}>
                  <Text style={styles.titleName}>{name}</Text>
                  <Text style={styles.titleAddress}>{address}</Text>
                </View>

                <View style={{
                  flexDirection:'row' , 
                  flex:1 , 
                  justifyContent:'center' , 
                  alignItems :'center' , 
                  marginRight:'5%'}}>
                  <StarRender many={stars}></StarRender>
                    
                </View>
              </LinearGradient>  
            </ImageBackground >
      </TouchableOpacity>      
    </View> 
    )}
  
  
const Home = props => {

  const [refreshing, setRefreshing] = useState(false);
  const [refreshData , setRefreshData] = useState(true)
  const [data , setData] = useState({})
  const [count , setCount] = useState(0);
  const refreshFlatList = () => {
    setRefreshData(!refreshData)
  }
  const getData = () => {
    
    AsyncStorage.getItem('mid').then(mid => { 
      console.log('fetching')
      fetch("http://192.168.0.88:8000/api/retrive/toreview?mid=" + mid)
      .then(response => response.json())
      .then(json => {
        setData(json)
        setCount(json.length)
        setRefreshing(false)
      })
  
    } )

  }

  useEffect(  () =>  
{

  onRefresh() 

}, [] ) 

 const onRefresh = useCallback(async () => {
      setRefreshing(true);
      getData()
      }, [refreshing]);
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
        return (<Item
           id={item.rid}
           navigation={props.navigation}
           rid={item.rid} stars={item.stars} 
           phone={item.phone} 
           image={item.pic} 
           address={item.address}
           name={item.name} />)
      }

   return <View style={styles.container}>
            <Header navigation={props.navigation} count={count}/>
            <View style={styles.body}>
                <View style={styles.bodyNav}>
                  <TouchableOpacity  onPress={onPressActive} style={{ 
                    borderColor : "#CBCBCB",
                    borderRadius : 4 ,  
                    borderBottomWidth : active.elm0 ? 3 : 0}}>
                      <Text style={styles.dashboard}>Review list</Text>
                  </TouchableOpacity> 
                  <TouchableOpacity onPress={onPressActive} style={{ 
                    borderColor : "#CBCBCB", 
                    borderRadius : 4 ,  
                    borderBottomWidth : active.elm1 ? 3 : 0}}>
                    <Text style={styles.dashboard}>Reviewed</Text>
                  </TouchableOpacity>   
                </View>
                 { 
                 data.length > 0 ?
                <FlatList
                    extraData={refreshFlatList}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => {Math.floor(Math.random() * index+1)}}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                /> : <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                <Text style={{justifyContent:'center' ,alignSelf : 'center', textAlign : 'center' , color:'white' , fontWeight : 'bold', padding:59 ,alignItems:'center'}}> You have nothing to review right now. Pull down to refresh</Text>
              </ScrollView>
              }
            </View>
        </View>

}

const styles = StyleSheet.create({

    container : {
                maxHeight:windowHeight,
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
    },
    scrollView: {
      flex: 1,

      alignItems: 'center',
      justifyContent: 'center',
    },

    
})

export default Home
