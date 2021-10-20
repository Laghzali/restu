

import { FontAwesome } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import React, { useState , useCallback, useEffect } from "react";
import { StyleSheet,RefreshControl ,ImageBackground , ScrollView, Dimensions, TouchableOpacity ,FlatList,Text, View } from 'react-native';
import Header from '../header'
import * as SecureStore from 'expo-secure-store';
const windowHeight = Dimensions.get('window').height;

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
                uri: image ? image : 'https://icons.iconarchive.com/icons/graphicloads/colorful-long-shadow/256/Restaurant-icon.png',
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
  
  
const Home = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshData , setRefreshData] = useState(true)
  const [data , setData] = useState({})
  const [count , setCount] = useState(0);
  const [active, setActive] = useState({ elm0 : true,elm1 : false});
  const refreshFlatList = () => {
    setRefreshData(!refreshData)
  }
  const getData = async (grabReviewed) => {
      let token = await SecureStore.getItemAsync('token')
      setRefreshing(true)
      await  SecureStore.getItemAsync('mid').then(mid => { 
      fetch(`http://restuapi.orderaid.com.au/api/retrive/toreview?reviewed=${grabReviewed}&token=${token}&mid=` + mid)
      .then(response => response.json())
      .then(json => {
        setData(json)
        grabReviewed == 0 ? setCount(json.length) : ''
        setRefreshing(false)
      }).catch(e => console.log(e))
  
    } ).catch(e => console.log(e))
  }

 const onRefresh = useCallback(async () => {
      setRefreshing(true);
      setActive({elm0 : true , elm1 : false})
      getData(0)
      }, [refreshing]);


useEffect(  () => { onRefresh() }, [] )    

  const onPressActive = (elm) => {

        if(elm == 0) {
          setActive({elm0 : true , elm1 : false})

          getData(0)
          
        } else {
          setActive({elm0 : false , elm1 : true})
          getData(1)
        }
    
  }

    const renderItem = ({ item }) => {
        return (<Item
           id={item.rid}
           navigation={navigation}
           rid={item.rid} stars={item.stars} 
           phone={item.phone} 
           image={item.pic} 
           address={item.address}
           name={item.name} />)
      }

   return <View style={styles.container}>
            <Header navigation={navigation} count={count}/>
            <View style={styles.body}>
                <View style={styles.bodyNav}>
                  <TouchableOpacity  onPress={() => onPressActive(0)} style={{ 
                    borderColor : "#CBCBCB",
                    borderRadius : 4 ,  
                    borderBottomWidth : active.elm0 ? 3 : 0}}>
                      <Text style={styles.dashboard}>Review list</Text>
                  </TouchableOpacity> 
                  <TouchableOpacity onPress={() => onPressActive(1)} style={{ 
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
                    keyExtractor={item => item.rid.toString()}
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
