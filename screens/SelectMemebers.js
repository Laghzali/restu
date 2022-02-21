
import React , {useState , useEffect} from 'react';
import {View, TouchableOpacity, Text  ,Platform , StyleSheet ,  FlatList, Dimensions } from 'react-native'
import { TextInput , Button, BottomNavigation } from 'react-native-paper';
import { Feather } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import { AntDesign } from '@expo/vector-icons';

const navHeight = Dimensions.get('screen').height - Dimensions.get('window').height
const SelectMemebers = ({route , navigation}) => {
    const selectedResturants = route.params.selectedResturants
    const [disabled , setDisabled] = useState()
    const [searchMethod , setSearchMethod] = useState('name')
    const [loading , setLoading] = useState(false)
    const [members , setMembers] = useState()
    const selectedMembers = members 
    const searchBy = (method , button) => {
        setSearchMethod(method)
        setDisabled(button)
    }
    const sendResturants = async () => {
        let token;
        let mid;
        if(Platform.OS != 'web') {
            token = await SecureStore.getItemAsync('token')
            mid = await SecureStore.getItemAsync('mid')
        } else {
            token = 2;
            mid = 8;

        }
        const data = []
        members.map((member) => {
            if(member.isSelected) {
            let arr = {mid : member.id , rids : Object.assign({}, selectedResturants)}
            data.push(arr)
            }
            
        })
        const dataObg = {'mid' : mid , 'token' : token ,'data' : data }
        fetch('https://restuapi.orderaid.com.au/api/toreview', {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObg),
          })
          .then(response => response.json())
          .then(data => {
            if(data.status== 200){
                alert('Data sent succesfully')
            }
          })
          .catch((error) => {
            console.log(error);
          });

    }
    const getData = async (keyword) => {
        let token;
        let mid;
        if(Platform.OS != 'web') {
            token = await SecureStore.getItemAsync('token')
            mid = await SecureStore.getItemAsync('mid')
        } else {
            token = 2;
            mid = 8;

        }
            const url = "https://restuapi.orderaid.com.au/api/members?method=" + searchMethod + "&keyword="+keyword+"&mid="+mid+"&token="+token
            if (keyword.length > 2 ) {
            setLoading(true)
            fetch(url)
            .then(response => response.json())
            .then(json => {
            setMembers(json);
            setLoading(false)
            }) }
    }
    const Restu = ({data}) => { 
        const handlePress = (rid) => {
           let arr = selectedMembers.map((rest) => {                    
                       if(rest.id == rid) {                        
                           rest.isSelected = rest.isSelected ? false : true 
                       } return rest
           })
           setMembers(arr)          
            }
        return ( 
             <View style={{ flexDirection: 'row', justifyContent:'space-between' , backgroundColor: data.isSelected ? 'black' : 'none'}}>
                <TouchableOpacity style={styles.restuButton} onPress={() => handlePress(data.id)} ><Text style={{ fontSize:16,color:'white',fontWeight:'bold'}} >{data.name}</Text></TouchableOpacity>
                 <Feather style={{ paddingTop:10 , paddingRight:10}} name="check" size={data.isSelected ? 20 : 0} color="white" />
            </View>)
    }
    const RenderRestu = ({item}) => {
        return (<Restu data={item}></Restu>)
    }
    return (
        <View style={styles.container}>
            
            <View style={{flexDirection:'column', width:'100%' , justifyContent : 'space-around' , alignItems :'center' }}>
                
            <Text style={styles.panelText}>ADMIN PANEL</Text>
            <TouchableOpacity style={{padding:5}}onPress={() => {SecureStore.deleteItemAsync('token');SecureStore.deleteItemAsync('mid'); navigation.replace('Auth')}}><Text style={{fontWeight:'bold' , color:'white'}}>Logout</Text></TouchableOpacity>

            </View>
            
            <TouchableOpacity onPress={() => navigation.goBack()}><AntDesign  style={{ marginRight:'auto' , padding:10,}}name="arrowleft" size={30} color="#68D25F" ></AntDesign></TouchableOpacity>
            
            <View style={styles.searchView}>
                <TextInput onChangeText={(keyword) => {getData( keyword)}} underlineColor="green" style={styles.searchField} placeholder='Search Members'></TextInput>
                <View style={styles.searchOptions}>
                    <Text>Search by : </Text>
                    <Button disabled={disabled == 1 ? true : false} mode="contained" onPress={() => {searchBy('name' , 1)}} style={{backgroundColor:'rgba(46, 138, 138, 1)'}}>Name</Button>
                    <Button disabled={disabled == 2 ? true : false} mode="contained" onPress={() => {searchBy('email' , 2)}}style={{backgroundColor:'rgba(46, 138, 138, 1)'}}>Email</Button>
                </View>
            </View>
            <View style={styles.resturants}>
                {loading ? <Text>loading...</Text> : <FlatList
                    data={members}
                    renderItem={RenderRestu}
                    keyExtractor={(item) => item.id}
                    />}
            </View>
            <View style={styles.sendButtons}>
                <TouchableOpacity style={styles.sendButton}><Text>Send to all</Text></TouchableOpacity>
                <TouchableOpacity onPress={sendResturants} style={styles.sendButton}><Text>Send</Text></TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container : {
        maxHeight : Dimensions.get('screen').height - navHeight,
        flex:1,
        alignItems : 'center',
        backgroundColor : '#272121'
    },
    panelText : {

        paddingTop:'10%',
        fontSize : 20,
        fontWeight: 'bold',
        color : 'white',
    } , 
    searchView : {
        paddingTop:'5%',
        width:'100%',
        alignItems:'center'
    },
    searchField : {
        padding:5,
        width : '80%',
        backgroundColor:'rgba(255,255,255 , 0.2)',
        borderRadius:5,
        borderWidth:1,
        height:50,
        borderColor:'rgba(46, 138, 138, 1)',
        borderBottomWidth : 0,
        borderBottomRightRadius : 0,
        borderBottomLeftRadius : 0,

    }, 
    searchOptions : {
        padding:10,
        flexDirection : 'row',
        borderTopWidth : 0,
        width : '80%',
        backgroundColor:'rgba(255,255,255 , 0.2)',
        borderRadius:5,
        borderTopLeftRadius : 0,
        borderTopRightRadius : 0,
        borderWidth:1,
        justifyContent : 'space-around',
        alignItems : 'center',
        borderColor:'rgba(46, 138, 138, 1)'
    },
    resturants : {
        flexDirection :'column',
        marginTop:5,
        width:'80%',
        flex:1,
        backgroundColor:'rgba(255,255,255 , 0.2)',
        borderRadius:5,
        borderWidth:1,
        borderColor:'rgba(46, 138, 138, 1)'
    },
    restuButton : {
        width:'100%',
        flex:1,
        padding:10,

      
    },
    checkbox : {



    },
    sendButtons : {
        width:'80%',
        padding:10,
        flexDirection:'row',
        justifyContent : 'space-between'
    } ,
    sendButton : {
        borderWidth : 1,
        borderRadius : 5,
        backgroundColor:'white',
        padding:5
    }
})
export default SelectMemebers