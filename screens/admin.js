
import React , {useState ,useRef , useEffect} from 'react';
import {View, TouchableOpacity, Text ,Modal , StyleSheet ,ScrollView, Image, FlatList,Dimensions,TextInput , Platform } from 'react-native'
import {Button } from 'react-native-paper';
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
    const [users , setUsers] = useState(0)
    const [usersCount , setUsersCount] = useState(0);
    const [page , setPage] = useState();
    const [editID, setEditID] = useState();
    const [UserName , setUserName] = useState("")
    const [UserUser , setUserUser] = useState("")
    const selectedResturants = resturant 
    const searchBy = (method , button) => {
        setSearchMethod(method)
        setDisabled({button : button , disabled : !disabled})
    }
    const getUsers = async () => await fetch('http://restuapi.orderaid.com.au/api/getusers').then(response => response.json()).then(json => {
        console.log("ggg")
        setUsers(json) 
    })

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

    const deleteUser = async (id) => {

        await fetch('http://restuapi.orderaid.com.au/api/deleteuser?id=' + id).then(response => response.json()).then( json => {
            if(json.status = 200) { getUsers();alert("user has been deleted")}
        })

    } 

    const AddReviewList =  () => {
        return <>
                    <Text style={styles.panelText}>Add new items to review list</Text>
                    <View style={styles.searchView}>
                        <TextInput onChangeText={(keyword) => {getData(keyword)}} underlineColor="green" style={styles.searchField} placeholder='Search resturants'></TextInput>
                        <View style={styles.searchOptions}>
                            <Text style={{fontWeight:'bold'}}>Search by : </Text>
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

        </>
    }
    const RenderUserCards = () => {
        var arr = []
        if(users) {
            setUsersCount(users.length)
            users.forEach(item => {

                arr.push(<UserCard key={Math.random().toString()} data={item}></UserCard>)
            })
            
        } 
        return arr

    }
    const getMembers = (keyword) => {
        if (keyword.length > 2 ) {
            const url = "https://restuapi.orderaid.com.au/api/searchmemebers?keyword=" + keyword
            fetch(url)
            .then(response => response.json())
            .then(json => {
                setUsers(json) 
            }).catch(e => console.log(e))
         }

    }
    const UsersAdmin = () => {

        return (<><View style={{margin: 20}}>
                    <Text style={{fontWeight:'bold',fontSize:25,color:'white'}}>Memebers list</Text>
                    <Text style={{fontWeight:'bold',fontSize:15,color:'white',marginTop:15}}>Memebers({usersCount})</Text>
                </View>
                <ScrollView>
                <View style={{margin: 20,flex:1,flexDirection:'row',flexWrap:'wrap'}}>
                <RenderUserCards/>
                </View>
                </ScrollView></>)

    }
    const updateUser = async (id , name , user) => {

        let data = new FormData();
        data.append('id' , id)
        data.append('name' , name)
        data.append('user' , user)
        let url = 'https://restuapi.orderaid.com.au/api/updatemember'
        await fetch(url, {
            method: 'post',
            body : data
         }).then(response => response.json()).then(json => {
             if(json.status == 200) {
                 alert("User has been updated")
                 getUsers()
                 setEditID(null)
                 
             }
          })

    }
    const EditUser = ({data}) => {
       let mydata = data
        let UserName = data.name ;
        let UserUser = data.user;
      return  (<>
        <View style={{margin:10,borderRadius:5,flexDirection:'column'}}>

            <TextInput  onChangeText={(input) => UserName = input } placeholder={mydata.name} style={{backgroundColor :'white' , padding:5,borderRadius:5, marginBottom:5, borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'100%',justifyContent:'center'}} type="flat"  label='Name'></TextInput>
            <TextInput  onChangeText={(input) => UserUser = input }  placeholder={mydata.user} style={{backgroundColor :'white' , padding:5,borderRadius:5, borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'100%',justifyContent:'center'}} type="flat"  label='Email'></TextInput>

        </View>
        <View style={{justifyContent:'space-between',margin:20,flexDirection:'row'}}> 
                <TouchableOpacity onPress={() => {updateUser(data.id , UserName ,UserUser)}}> <Text style={{margin:5,fontWeight:'600'}}>✅</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => {deleteUser(data.id)}}><Text style={{margin:5,fontWeight:'600'}}>❌</Text></TouchableOpacity>
        </View>
        </>)
    }
    const UserCard = ({data}) => {
        
        return <View style={styles.UserCard}>
        {data.id == editID ? <EditUser data={data}></EditUser> : <>
        <View style={{alignItems:'center',height:'85%'}}>
            <Text style={{fontWeight:'bold' , fontSize:23,margin:10,marginBottom:10}}>{data.name}</Text>
            <Text style={{fontWeight:'200',color:'grey'}}>{data.user}</Text>
            <Image style={{marginTop:20,borderRadius:50}} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' , width:50,height:50}}></Image>
        </View>    
        <View style={{justifyContent:'space-between',flexDirection:'row'}}> 
        <TouchableOpacity onPress={() => {setEditID(data.id)}}> <Text style={{margin:5,fontWeight:'600'}}>Edit</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => {deleteUser(data.id)}}><Text style={{margin:5,fontWeight:'600'}}>❌</Text></TouchableOpacity>
        </View>
        </> }
    </View>
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
            <View style={styles.sidebar}>
                <View style={styles.navbar}>
                 <TouchableOpacity onPress={() => setPage(1)} style={[styles.sendButton , {marginBottom:5}]}><Text>New review list</Text></TouchableOpacity>
                 <TouchableOpacity onPress={() => {setPage(2); getUsers()}} style={[styles.sendButton , {marginBottom:5}]}><Text>Manage users</Text></TouchableOpacity>
                 <TouchableOpacity style={[styles.sendButton , {marginBottom:5}]}><Text>Manage resturants</Text></TouchableOpacity>
                 <TouchableOpacity style={[styles.sendButton , {marginBottom:5}]}><Text>Extract Review list</Text></TouchableOpacity>

                </View>
                <TouchableOpacity style={styles.sendButton}><Text>Logout</Text></TouchableOpacity>
            </View>
            <View style={page == 1 ? [styles.AdminBody , {alignItems : 'center'}] : styles.AdminBody }>

            {page == 1 ? <AddReviewList></AddReviewList> : <></>}

            {page == 2 ? <><View style={{flexDirection:'row'}}><TextInput placeholder='Search by name or email' onChangeText={(keyword) => {getMembers(keyword)}} style={{backgroundColor :'white' , padding:5,borderRadius:5, borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'20%',margin:20,justifyContent:'center'}} type="Outlined"  label='Search members by name'></TextInput><TouchableOpacity onPress={() => getUsers()} style={{alignItems:'center',justifyContent:'center'}}><Text style={{color:'white',fontWeight:600}}>Reset</Text></TouchableOpacity></View><UsersAdmin></UsersAdmin></> : <></>}
            
            
            
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    UserCard : {

        backgroundColor:'white',
        width:190,
        height:200,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        margin:10,
        elevation: 24,
        borderRadius:5,
    },
    container : {
        maxHeight : Dimensions.get('screen').height - navHeight,
        flex:1,
        flexDirection : 'row',
        width:'100%',
    },
    AdminBody : {
        flex:10,        
        backgroundColor : '#272121',

    },
    navbar : {
        marginTop:50,
        height:'90%',
        padding:5
        
    },
    sidebar : {
        flex:1,
        backgroundColor : '#272442',

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