import React , {useState ,useEffect , useReducer} from 'react';
import {View, TouchableOpacity, Text  ,ScrollView, Image, Button,TextInput  } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';

const ManageRestu = ({navigation}) => {

    const [resturants, setResturants] = useState();
    const [selectedRestu , setSelectedRestu] =  useState(0)
    const [selectedRestuData , setSelectedRestuData] =  useState()
    const [Reviews , setReviews] = useState()
    const [page, setPage] = useState(0)
    const [keyword , setKeyword] = useState("")
    const [items , setItems] = useState([])
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);
    const GetReview = async  (rid) => {
       
       await fetch("https://restuapi.orderaid.com.au/api/reviews?rid="+rid)
        .then(response => response.json())
        .then(json => {
            setReviews(json);
            console.log(json)
            setSelectedRestu(rid);
        })
        
    }
    const forceRerender = () => {
        setSelectedRestu(0)
    }
    const getResturants = async () => {
        console.log("getting")
        let url
        if(keyword.length>=3) {
            url='https://restuapi.orderaid.com.au/api/resturants?method=any&mid=8&token=2&keyword='+keyword+'&page='+page

        } else {
            url = "https://restuapi.orderaid.com.au/api/resturants?mid=8&token=2&page="+page
        }

       await fetch(url)
        .then(response => response.json())
        .then(json => {

            setResturants(json)


        })
        
    }
    useEffect( () => {
        
        getResturants()
    },[page, keyword])

    const sendTomembers = () => {
        let tosend = items.map( item=> {
            return item.id
        })
        console.log(tosend)
        if(tosend.length>0) {
            navigation.navigate('SelectMembers', {selectedResturants : tosend , dURL : 1})
        } else {
            alert("Please select atleast 1 item from the list")
        }
       

    }


    const handlePress =  (rid) => {
        let previtems = items;
        let itshere = false;

            previtems.forEach((item) => {

                if(item.id == rid && itshere == false ) {
                    item.isSelected = !item.isSelected
                    console.log('itshere')
                    itshere = true
                }
            })

            if(!itshere) {
                previtems.push({id : rid , isSelected : true})

            } else {
            }

        setItems(previtems)
        forceUpdate()
    }
    if(!resturants) {
        return (<AppLoading></AppLoading>)
    }
    const Resturant = ({data , disabled}) => {
        let isSelected;
        items.forEach(item => {
            if(item.id == data.id && item.isSelected) {
                isSelected = true
            }
        })
        return (
        <TouchableOpacity  disabled={disabled} onPress={() => {handlePress(data.id)}} style={isSelected ? {backgroundColor:'rgba(232, 236, 241, 0.5)', marginRight:5, flexDirection:'row' , marginBottom:5} : {backgroundColor:'rgba(232, 236, 241, 0.2)', marginRight:5, flexDirection:'row' , marginBottom:5}}>    
          
            <View style={{flexDirection:'row' , alignItems:'center'}}>
                <View style={{flexDirection:'column',padding:10,alignItems:'center'}}>
                    <Text style={{fontSize:25, fontWeight:'bold', color:'yellow'}}>{data.stars}</Text>
                    <FontAwesome name="star" size={10} color="#68D25F" />
                </View>
            
                <View style={{padding:10 , width:320, maxWidth:320, flexWrap: 'wrap'}}>
                    <Text style={{fontSize:15, fontWeight:'bold',color:'white'}}>{data.name}</Text>
                    <Text style={{fontSize:10, fontWeight:'bold',color:'white'}}>{data.address}</Text>
                    <Text style={{fontSize:8, fontWeight:'bold',color:'white'}}>{data.phone}</Text>
                </View>
            </View>
            {disabled ? <></> : 
            <View style={{justifyContent:'flex-end'}}>
                     <TouchableOpacity onPress={() => {setSelectedRestuData(data);GetReview(data.id)}} style={{padding:10}}><AntDesign name="eye" size={21} color="#68D25F" /></TouchableOpacity>
            </View> }
        </TouchableOpacity>
        )
        
    }

    const RenderReview = ({data}) => {

        return data.map((data , index) => {
            return (
                <View>
                    
                    <View key={'key'+index} style={{flexDirection: 'row', marginTop:15, alignItems:'center'}}>
                        <Image style={{borderColor:'rgba(104, 210, 95,0.5)',borderWidth:1,width:35,height:35,borderRadius:50}} source={{
                                uri:'https://restuapi.orderaid.com.au/storage/user.png'}}>
                        </Image>
                        <TouchableOpacity>
                            <Text style={{padding:5,
                            flexGrow:1,
                                width:'100%',color:'#CBCBCB', 
                                backgroundColor:'rgba(196, 196, 196, 0.11)', 
                                borderWidth:1,borderRadius:3,marginLeft:5 , borderColor:'rgba(104, 210, 95, 0.22)'}}>{data.note}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>         
            )})
    
    }
let rest = resturants
    return (<>
        {  selectedRestu == 0 ? 
        <>
         <View style={{flexDirection:'row'}}>
            <TextInput  placeholder='Search by name or zip/city' onChangeText={(keyword) => { if(keyword.length > 2) {setKeyword(keyword)}}} style={{backgroundColor :'white' , padding:5,borderRadius:5, borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'20%',margin:20,justifyContent:'center'}} type="Outlined"  label='Search members by name'></TextInput>
            <TouchableOpacity onPress={() => {setKeyword("");setPage(0)}} style={{alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'white',fontWeight:600}}>Reset</Text>
            </TouchableOpacity>
        </View>
    
        <View style={{margin: 20 , marginBottom:5}}>
                <Text style={{fontWeight:'bold',fontSize:25,color:'white'}}>Resturants list</Text>

        </View>
        <View style={{flexDirection:'row' , margin:20,marginBottom:0, justifyContent:''}}>
            <TouchableOpacity onPress={() => page-1 > 0 ? setPage(page-1) : setPage(0)} style={{marginRight:5}}><Text style={{color:'white', fontWeight:600}}>Prev</Text></TouchableOpacity>
            <Text style={{color:'white', fontWeight:500}}>.... {page} .... </Text>
            <TouchableOpacity onPress={() => setPage(page+1)}><Text style={{color:'white',fontWeight:600}}>Next</Text></TouchableOpacity>
            <TouchableOpacity style={{marginLeft:20}} onPress={() => sendTomembers()}><FontAwesome name="send" size={22} color="#68D25F" /></TouchableOpacity>
        </View>
        <ScrollView style={{marginBottom:20}}>
            <View style={{margin: 20,marginBottom:20,flexDirection:'row' , flexWrap : 'wrap'}}>

                {rest.map(item => {

                    return (<Resturant key={Math.random().toString()} data={item}></Resturant>)
                  })
                }
            </View>
        </ScrollView> </>
        : <View style={{padding:50}}>
            <TouchableOpacity onPress={() => {console.log(selectedRestu); forceRerender() ; console.log(selectedRestu);}}><AntDesign  style={{ marginRight:'auto'}}name="arrowleft" size={30} color="#68D25F" /></TouchableOpacity>
            <Text style={{fontWeight:'bold',fontSize:20,color:'white', paddingBottom:10}}>Resturant reviews : </Text>
            <View >
            <Resturant disabled={true} data={selectedRestuData}/>
            <RenderReview data={Reviews}/>
            </View>
        </View>}
            </>)

}
export default ManageRestu;