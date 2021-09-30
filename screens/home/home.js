
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 

import React from 'react';
import { StyleSheet, Image,FlatList,Text, View } from 'react-native';
const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
      image : 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
      image : 'https://media.gettyimages.com/photos/cozy-restaurant-for-gathering-with-friends-picture-id1159992039?s=612x612'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
      image : 'https://marinercompass.org/wp-content/uploads/2021/04/menu-restaurant-vintage-table.jpg'
    },    {
        id: '58694a0f-3da1-471f-bd96-145571e29372',
        title: 'Third Item',
        image : 'https://marinercompass.org/wp-content/uploads/2021/04/menu-restaurant-vintage-table.jpg'
      },    {
        id: '58694a0f-3da1-471f-bd96-145571e2xd72',
        title: 'Third Item',
        image : 'https://marinercompass.org/wp-content/uploads/2021/04/menu-restaurant-vintage-table.jpg'
      },
  ];

  const Item = ({ title, image }) => (
    <View style={styles.item}>
             <Image
                resizeMode = 'cover'
                style={styles.itemImage}
                source={{
                uri: image,
                }}
            />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  
  
const Home =() => {

    const renderItem = ({ item }) => (
        <Item  image={item.image} title={item.title} />
      );

   return <View style={styles.container}>
            <View style={styles.header}>
               <Entypo name="menu" size={33} color="#68D25F" />
               <Text style={styles.dashboard}>DASHBOARD</Text>
               <FontAwesome name="bell-o" size={33} color="#68D25F" />
            </View>
            <View style={styles.body}>
                <View style={styles.bodyNav}>
                    <Text style={styles.dashboard}>Review list</Text>
                    <Text style={styles.dashboard}>Reviewed</Text>
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
        fontSize:24
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
        width : '98%',
        height: 240
    },
    item : {

        alignItems : 'center',
        padding:15,
        paddingBottom: 5
    }

    
})

export default Home
