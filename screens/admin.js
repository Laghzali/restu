
import React , {useState ,useRef , useEffect} from 'react';
import {View, TouchableOpacity, Text ,Modal , StyleSheet ,ScrollView, Image, FlatList,Dimensions,TextInput , Platform } from 'react-native'
import {Button } from 'react-native-paper';
import { Feather } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import * as DocumentPicker from 'expo-document-picker';
import XLSX from 'xlsx';
import styles from './admin.css';
import ManageRestu from './ManageRestu';
import XlsxPopulate from "xlsx-populate";
import { saveAs } from "file-saver";
import ReadyToReview from './ReadyToReview';
import { AntDesign } from '@expo/vector-icons'; 
import { Foundation } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import UserReviews from './UserReviews';
const Admin = ({navigation}) => {

    const [disabled , setDisabled] = useState({ button : null , disabled : false})
    const [searchMethod , setSearchMethod] = useState('name')
    const [loading , setLoading] = useState(false)
    const [resturant , setResturants] = useState()
    const [users , setUsers] = useState(0)
    const [usersCount , setUsersCount] = useState(0);
    const [page , setPage] = useState(3);
    const [editID, setEditID] = useState();
    const [SearchFrom , setSearchFrom] = useState(0);
    const [UserID , setUserID] = useState({ id : 0 , action: ''})
    const [newUser , setNewUser] = useState(false)
    const selectedResturants = resturant 
    const searchBy = (method , button) => {
        setSearchMethod(method)
        setDisabled({button : button , disabled : !disabled})
    }
    const getUsers = async () => await fetch('https://restuapi.orderaid.com.au/api/getusers').then(response => response.json()).then(json => {
        setUsers(json) 
    })

    const getData = async ( keyword ) => {
        let token;
        let mid;

        if(Platform.OS != 'web') {
            token = await SecureStore.getItemAsync('token')
            mid = await SecureStore.getItemAsync('mid')
        } else {
            token = 2;
            mid = 8;

        }

            let url;
            if(SearchFrom == 1) {
                url = "https://restuapi.orderaid.com.au/api/scratch?method=" + searchMethod + "&keyword="+keyword+"&mid="+mid+"&token="+token
            } else {
                url = "https://restuapi.orderaid.com.au/api/resturants?method=" + searchMethod + "&keyword="+keyword+"&mid="+mid+"&token="+token
            }
            if (keyword.length > 2 ) {
            
            fetch(url)
            .then(response => response.json())
            .then(json => {

            setResturants(json);
            setLoading(false)
            }).catch(e => console.log(e)) }
    }

    function getSheetData(data, header) {
        var fields = Object.keys(data[0]);
        var sheetData = data.map(function (row) {
          return fields.map(function (fieldName) {
            return row[fieldName] ? row[fieldName] : "";
          });
        });
        sheetData.unshift(header);
        return sheetData;
      }
      const Reviews2Excel = (uid) => {
          console.log("called" + uid)
          let headers = ["name", "note", "rate" , "user" , "created_at" , "image"]
            let url = 'https://restuapi.orderaid.com.au/api/reviews2excel'
            if(uid) {
                url = 'https://restuapi.orderaid.com.au/api/reviews2excel?uid='+uid
            }
          fetch(url)
          .then(resp => resp.json())
          .then( json => {
            XlsxPopulate.fromBlankAsync().then(async (workbook) => {
                const sheet1 = workbook.sheet(0);
                const sheetData = getSheetData(json, headers);
                const totalColumns = sheetData[0].length;
          
                sheet1.cell("A1").value(sheetData);
                const range = sheet1.usedRange();
                const endColumn = String.fromCharCode(64 + totalColumns);
                sheet1.row(1).style("bold", true);
                sheet1.range("A1:" + endColumn + "1").style("fill", "BFBFBF");
                range.style("border", true);
                return workbook.outputAsync().then((res) => {
                    
                  saveAs(res, "Reviews_"+Date.now()+"_restu.xlsx");
                });
              });


          })
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
            /* DO SOMETHING WITH workbook HERE */
            var count = Object.entries(json).length
            let formdata = new FormData()
            formdata.append('data' , JSON.stringify(json))
            formdata.append('mid' , 8)
            formdata.append('token' , 2)
            setLoading(true)
            await fetch(
                'https://restuapi.orderaid.com.au/api/resturants/new',
                {
                  method: 'post',

                  body: formdata,
                  
                }
              ).catch(e => alert("invalid excel file"))

            await fetch('https://restuapi.orderaid.com.au/api/retrivecount?count='+count).then(response => response.json())
            .then(json => {
                setResturants(json);
                setSearchFrom(1)
                setLoading(false) 
            })

          });
       }

    }
    const sendResturantsToMemebers = () => {
        const toSend = []
        resturant.map((item) => {
            if(item.isSelected) {

                    toSend.push(item.id)

            }
        })
        navigation.navigate('SelectMembers', {selectedResturants : toSend , dURL : 1})
        
    }

    const deleteUser = async (id) => {
        if(confirm("Are you sure you want to delete this user?")) {
            await fetch('https://restuapi.orderaid.com.au/api/deleteuser?id=' + id).then(response => response.json()).then( json => {
                if(json.status = 200) { getUsers();alert("user has been deleted")}
         })
        }
    } 

    const RenderUserCards = () => {
        var arr = []
        if(users) {
            
            users.forEach(item => {

                arr.push(<UserCard key={Math.random().toString()} data={item}></UserCard>)
            })
            
        } 
        setUsersCount(users.length)
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
                <AddUser></AddUser>
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
        if(confirm("Are you sure you want to edit this user?")) {
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
        <View style={{justifyContent:'space-around',margin:20,flexDirection:'row'}}> 
                <TouchableOpacity onPress={() => {updateUser(data.id , UserName ,UserUser)}}> <Ionicons name="checkmark" size={20} color="green" /></TouchableOpacity>
                <TouchableOpacity onPress={() => {deleteUser(data.id)}}><AntDesign name="deleteuser" size={20} color="red" /></TouchableOpacity>
        </View>
        </>)
    }
    const UserCard = ({data}) => {
        if(UserID.action.length > 2) { setUserID({id : 0 , action: ''})}
        return <View style={styles.UserCard}>
        {data.id == editID ? <EditUser data={data}></EditUser> : <>
        <View style={{alignItems:'center',height:'85%'}}>
            <Text style={{fontWeight:'bold' , fontSize:23,margin:5,marginBottom:5}}>{data.name.split(" ")[0]}</Text>
            <Text style={{fontWeight:'200',color:'grey'}}>{data.user}</Text>
            <Image style={{marginTop:12,borderRadius:50}} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' , width:50,height:50}}></Image>
        </View>    
        <View style={{justifyContent:'space-around',flexDirection:'row'}}> 
        <TouchableOpacity onPress={() => {setEditID(data.id)}}><Feather name="edit" size={20} color="green" /></TouchableOpacity>
        <TouchableOpacity onPress={() => {deleteUser(data.id)}}><AntDesign name="deleteuser" size={20} color="red" /></TouchableOpacity>
        <TouchableOpacity onPress={() => { setPage(-1);setUserID({id : data.id , action : 'ready'}) }}><Foundation name="list-bullet" size={20} color="yellow" /></TouchableOpacity>
        <TouchableOpacity onPress={() => {Reviews2Excel(data.id)}}><AntDesign name="clouddownload" size={20} color="purple" /></TouchableOpacity>
        
        </View>
        </> }
    </View>
    }
    const AddUserCall = (name , user , pass , phone) => {

        fetch('https://restuapi.orderaid.com.au/api/register?'+ new URLSearchParams({
            name : name,
            user : user,
            pass : pass,
            phone : phone
        }).toString())
        .then(resp => resp.json)
        .then(json => {
            console.log(json)
            setNewUser(false)
            getUsers()
        })

    }
    const AddUser = () => {
        let UserName;
        let UserUser
        let Email 
        let Password
        let Phone
        if(newUser) {
            return<View style={styles.AddUser}>
         <View style={{margin:10,borderRadius:5,flexDirection:'column'}}>

            <TextInput  onChangeText={(input) => UserName = input } placeholder={"Full Name"} style={{backgroundColor :'white' , padding:5,borderRadius:5, marginBottom:10, borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'100%',justifyContent:'center'}} type="flat"  label='Name'></TextInput>
            <TextInput  onChangeText={(input) => UserUser = input }  placeholder={"User Name"} style={{backgroundColor :'white' , padding:5,borderRadius:5,marginBottom:10, borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'100%',justifyContent:'center'}} type="flat"  label='Email'></TextInput>
            <TextInput  onChangeText={(input) => Email = input }  placeholder={"Email"} style={{backgroundColor :'white' , padding:5,borderRadius:5, marginBottom:10,borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'100%',justifyContent:'center'}} type="flat"  label='Email'></TextInput>
            <TextInput  onChangeText={(input) => Phone = input }  placeholder={"Phone"} style={{backgroundColor :'white' , padding:5,borderRadius:5, marginBottom:10,borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'100%',justifyContent:'center'}} type="flat"  label='Email'></TextInput>
            <TextInput  onChangeText={(input) => Password = input }  placeholder={"Password"} style={{backgroundColor :'white' , padding:5,borderRadius:5, borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'100%',justifyContent:'center'}} type="flat"  label='Email'></TextInput>

        </View>
        <View style={{justifyContent:'space-around',margin:20,flexDirection:'row'}}> 
            <TouchableOpacity onPress={() => AddUserCall(UserName , UserUser , Password , Phone)}> <Ionicons name="person-add" size={24} color="green" /></TouchableOpacity>
        </View>
        </View>  
        }

        return<View style={styles.UserCard}>
        <View style={{alignItems:'center',height:'85%'}}>
            <Text style={{fontWeight:'bold' , fontSize:23,margin:5,marginBottom:'20%'}}>Add new user</Text>
            <TouchableOpacity onPress={() => setNewUser(true)}> <Ionicons name="ios-add-circle-outline" size={70} color="green" /> </TouchableOpacity>
        </View>
        </View>  
 
    }
    const handlePress =  (rid) => {
        let arr = selectedResturants.map((rest) => {                    
                    if(rest.id == rid) {                        
                        rest.isSelected = rest.isSelected ? false : true 
                    } return rest
        })
        
       setResturants(arr)        
    }

    const Restu = ({data}) => { 
        console.log('rendering')
        return ( 
             <View style={{ flexDirection: 'row', justifyContent:'space-between' , backgroundColor: data.isSelected ? 'black' : 'none'}}>
                <TouchableOpacity style={styles.restuButton} onPress={() => handlePress(data.id)} ><Text style={{ fontSize:16,color:'white',fontWeight:'bold'}} >{data.name}</Text></TouchableOpacity>
                 <Feather style={{ paddingTop:10 , paddingRight:10}} name="check" size={data.isSelected ? 20 : 0} color="white" />
            </View>)
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
                 <TouchableOpacity onPress={() => {setPage(1) ;setUserID({id : 0 , action: ''}) }} style={[styles.sendButton , {marginBottom:5}]}><Text>New review list</Text></TouchableOpacity>
                 <TouchableOpacity onPress={() => {setPage(2); setUserID({id : 0 , action: ''});getUsers()}} style={[styles.sendButton , {marginBottom:5}]}><Text>Manage users</Text></TouchableOpacity>
                 <TouchableOpacity onPress={() => {setPage(3) ; setUserID({id : 0 , action: ''}) }} style={[styles.sendButton , {marginBottom:5}]}><Text>Manage resturants</Text></TouchableOpacity>
                 <TouchableOpacity onPress={() => {Reviews2Excel() ; setUserID({id : 0 , action: ''})}} style={[styles.sendButton , {marginBottom:5}]}><Text>Extract Review list</Text></TouchableOpacity>
                 <TouchableOpacity onPress={() => {setPage(4) ; setUserID({id : 0 , action: ''})}} style={[styles.sendButton , {marginBottom:5}]}><Text>Ready to review</Text></TouchableOpacity>

                </View>
                <TouchableOpacity style={styles.sendButton}><Text>Logout</Text></TouchableOpacity>
            </View>
            <View style={page == 1 ? [styles.AdminBody , {alignItems : 'center'}] : styles.AdminBody }>

            {page == 1 ? <>
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
                        {loading ? <Text style={{fontSize:30 , fontWeight:'bold' , color:'white'}}>loading...</Text> : <FlatList
                            data={resturant}
                            renderItem={({item}) => <Restu data={item}></Restu>}
                            keyExtractor={item => item.id.toString()}
                            />}
                    </View>
                    <View style={styles.sendButtons}>
                                <CheckPlatform/>
                        <TouchableOpacity onPress={sendResturantsToMemebers} style={styles.sendButton}><Text>Select Members</Text></TouchableOpacity>
                    </View>
 </> : <></>}

            {page == 2 ? <><View style={{flexDirection:'row'}}><TextInput placeholder='Search by name or email' onChangeText={(keyword) => {getMembers(keyword)}} style={{backgroundColor :'white' , padding:5,borderRadius:5, borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'20%',margin:20,justifyContent:'center'}} type="Outlined"  label='Search members by name'></TextInput><TouchableOpacity onPress={() => getUsers()} style={{alignItems:'center',justifyContent:'center'}}><Text style={{color:'white',fontWeight:600}}>Reset</Text></TouchableOpacity></View><UsersAdmin></UsersAdmin></> : <></>}
            
            {page == 3 ? <>
                <ManageRestu navigation={navigation} reset={0}/>
                </> : <></>}
                {page == 4 ? <>
                <ReadyToReview/>
                </> : <></>}
                {UserID.action === 'ready' ? <UserReviews uid={UserID.id}></UserReviews> : <></>}
                {UserID.action === 'reviews' ? <UserReviews uid={UserID.id}></UserReviews> : <></>}
            
            </View>
        </View>
    )
}
export default Admin