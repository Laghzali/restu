
import React , {useState , useEffect} from 'react';
import {View, TouchableOpacity, Text  , StyleSheet ,  FlatList, Dimensions, Platform } from 'react-native'
import { TextInput , Button, BottomNavigation } from 'react-native-paper';
import { Feather } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import * as DocumentPicker from 'expo-document-picker';
import XLSX from 'xlsx';
const navHeight = Dimensions.get('screen').height - Dimensions.get('window').height
const Admin = ({navigation}) => {
    const [file, setFile] = useState(null);
    const [disabled , setDisabled] = useState({ button : null , disabled : false})
    const [searchMethod , setSearchMethod] = useState('name')
    const [loading , setLoading] = useState(false)
    const [resturant , setResturants] = useState()
    const selectedResturants = resturant 
    const searchBy = (method , button) => {
        setSearchMethod(method)
        setDisabled({button : button , disabled : !disabled})
    }
    const getData = async ( keyword) => {
        let token;
        let mid;
        if(Platform.OS != 'web') {
            token = await SecureStore.getItemAsync('token')
            mid = await SecureStore.getItemAsync('mid')
        } else {
            token = 2;
            mid = 8;

        }

            if (keyword.length > 2 ) {
            const url = "https://restuapi.orderaid.com.au/api/resturants?method=" + searchMethod + "&keyword="+keyword+"&mid="+mid+"&token="+token
            console.log(url)
            setLoading(true)
            fetch(url)
            .then(response => response.json())
            .then(json => {

            setResturants(json);
            setLoading(false)
            }).catch(e => console.log(e)) }
    }

      const pickExcel = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
       if(result.type != 'cancel') {
           
        fetch(result.uri).then(function(res) {
            /* get the data as a Blob */
            if(!res.ok) throw new Error("fetch failed");
            return res.arrayBuffer();
          }).then(async function(ab) {
            /* parse the data when it is received */
            var data = new Uint8Array(ab);
            var workbook = XLSX.read(data, {type:"array"});
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            console.log(json);
            /* DO SOMETHING WITH workbook HERE */
            var count = 0;
            for (const [key, value] of Object.entries(json)) {
                
                count = count+1;
                const data = new FormData();
                data.append('name', value.name);
                data.append('token', 2);
                data.append('mid', 8);
                data.append('address', value.address);
                data.append('zip', value.zip);
                data.append('phone', value.phone);
                let res = await fetch(
                  'https://restuapi.orderaid.com.au/api/resturants/new',
                  {
                    method: 'post',
                    body: data,
                    
                  }
                ).catch(e => alert("invalid excel file"))
            }
            setLoading(true)
            await fetch('https://restuapi.orderaid.com.au/api/retrivecount?count='+count).then(response => response.json())
            .then(json => {
            setResturants(json);
            setLoading(false) })
            console.log(count);
          });
       }
       console.log(result.type)
    }
    const sendResturantsToMemebers = () => {
        const toSend = []
        resturant.map((item) => {
            if(item.isSelected) {

                    toSend.push(item.id)

            }
        })
        navigation.navigate('SelectMembers', {selectedResturants : toSend})
        
    }
    const Restu = ({data}) => { 
        const handlePress = (rid) => {
           let arr = selectedResturants.map((rest) => {                    
                       if(rest.id == rid) {                        
                           rest.isSelected = rest.isSelected ? false : true 
                       } return rest
           })
           setResturants(arr)          
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
    const CheckPlatform = () => {
        if(Platform.OS == 'web') {
            return <TouchableOpacity   onPress={pickExcel} style={styles.sendButton}><Text>Upload EXCEL</Text></TouchableOpacity>
        }
        return (<></>);
    }
    return (
        <View style={styles.container}>
            <Text style={styles.panelText}>ADMIN PANEL</Text>
            <TouchableOpacity style={{padding:5}}onPress={() => {SecureStore.deleteItemAsync('token');SecureStore.deleteItemAsync('mid'); navigation.replace('Auth')}}><Text style={{fontWeight:'bold' , color:'white'}}>Logout</Text></TouchableOpacity>
            <View style={styles.searchView}>
                <TextInput onChangeText={(keyword) => {getData(keyword)}} underlineColor="green" style={styles.searchField} placeholder='Search resturants'></TextInput>
                <View style={styles.searchOptions}>
                    <Text>Search by : </Text>
                    <Button disabled={disabled.button == 1 ? true : false } mode="contained" onPress={() => {searchBy('name' , 1)}} style={{backgroundColor:'rgba(46, 138, 138, 1)'}}>Name</Button>
                    <Button disabled={disabled.button == 2 ? true : false } mode="contained" onPress={() => {searchBy('zip', 2)}}style={{backgroundColor:'rgba(46, 138, 138, 1)'}}>Zip</Button>
                </View>
            </View>
            <View style={styles.resturants}>
                {loading ? <Text>loading...</Text> : <FlatList
                    data={resturant}
                    renderItem={RenderRestu}
                    keyExtractor={item => item.id.toString()}
                    />}
            </View>
            <View style={styles.sendButtons}>
                        <CheckPlatform/>
                <TouchableOpacity onPress={sendResturantsToMemebers} style={styles.sendButton}><Text>Select Members</Text></TouchableOpacity>
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
export default Admin