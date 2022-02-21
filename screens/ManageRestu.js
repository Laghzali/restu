import React , {useState ,useEffect} from 'react';
import {View, TouchableOpacity, Text  ,ScrollView, Image, Dimensions,TextInput  } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
const ManageRestu = () => {
    const [restCount , setRestCount] = useState(0)
    const [resturants, setResturants] = useState();
    const [selectedRestu , setSelectedRestu] =  useState(0)
    const [selectedRestuData , setSelectedRestuData] =  useState()
    const [Reviews , setReviews] = useState()

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
    const getResturants = async (keyword) => {
        let url
        if(keyword) {
            url='https://restuapi.orderaid.com.au/api/resturants?method=any&mid=8&token=2&keyword='+keyword
        } else {
            url = "https://restuapi.orderaid.com.au/api/resturants?mid=8&token=2"
        }

       await fetch(url)
        .then(response => response.json())
        .then(json => {

            setResturants(json)
            setRestCount(Object.entries(json).length)

        })
        
    }
    useEffect( () => {
        
        getResturants()
    },[])


    const Resturant = ({data}) => {
        return (
        <TouchableOpacity onPress={() => {setSelectedRestuData(data);GetReview(data.id)}} style={{backgroundColor:'rgba(232, 236, 241, 0.2)', marginRight:5, marginBottom:5}}>    
            <View style={{flexDirection:'row' , alignItems:'center'}}>
                <View style={{flexDirection:'column',padding:10,alignItems:'center'}}>
                    <Text style={{fontSize:25, fontWeight:'bold', color:'yellow'}}>{data.stars}</Text>
                    <FontAwesome name="star" size={10} color="#68D25F" />
                </View>
            
                <View style={{padding:10 , width:350, maxWidth:350, flexWrap: 'wrap'}}>
                    <Text style={{fontSize:15, fontWeight:'bold',color:'white'}}>{data.name}</Text>
                    <Text style={{fontSize:10, fontWeight:'bold',color:'white'}}>{data.address}</Text>
                    <Text style={{fontSize:8, fontWeight:'bold',color:'white'}}>{data.phone}</Text>
                </View>  
            </View>
        </TouchableOpacity>
        )
        
    }

    const RenderResturant = () => {
        var arr = []
        if(resturants) {

            resturants.forEach(item => {

                arr.push(<Resturant  key={Math.random().toString()} data={item}></Resturant>)
            })
            
        } 
        return arr

    }

    const RenderReview = ({data}) => {

        return data.map((data , index) => {
            return (
                <View>
                    
                    <View key={'key'+index} style={{flexDirection: 'row', marginTop:15, alignItems:'center'}}>
                        <Image style={{borderColor:'rgba(104, 210, 95,0.5)',borderWidth:1,width:35,height:35,borderRadius:50}} source={{
                                uri:'https://restuapi.orderaid.com.au/storage/user.png'}}>
                        </Image>
                        <TouchableOpacity style={{width:'85%'}}>
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

    return (<>
        {  selectedRestu == 0 ? 
        <>
         <View style={{flexDirection:'row'}}>
            <TextInput placeholder='Search by name or zip' onChangeText={(keyword) => {getResturants(keyword)}} style={{backgroundColor :'white' , padding:5,borderRadius:5, borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'20%',margin:20,justifyContent:'center'}} type="Outlined"  label='Search members by name'></TextInput>
            <TouchableOpacity onPress={() => getResturants()} style={{alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'white',fontWeight:600}}>Reset</Text>
            </TouchableOpacity>
        </View>
    
        <View style={{margin: 20}}>
                <Text style={{fontWeight:'bold',fontSize:25,color:'white'}}>Resturants list</Text>
                <Text style={{fontWeight:'bold',fontSize:15,color:'white',marginTop:15}}>resturants({restCount})</Text>
        </View>
        <ScrollView>
            <View style={{margin: 20,flexDirection:'row' , flexWrap : 'wrap'}}>
                <RenderResturant/>
            </View>
        </ScrollView> </>
        : <View style={{padding:50}}>
            <TouchableOpacity onPress={() => {console.log(selectedRestu); forceRerender() ; console.log(selectedRestu);}}><AntDesign  style={{ marginRight:'auto'}}name="arrowleft" size={30} color="#68D25F" /></TouchableOpacity>
            <Text style={{fontWeight:'bold',fontSize:20,color:'white', paddingBottom:10}}>Resturant reviews : </Text>
            <View style={{width:'50%' ,maxWidth:'50%'}}>
            <Resturant data={selectedRestuData}/>
            <RenderReview data={Reviews}/>
            </View>
       
        </View>}
            </>)

}
export default ManageRestu;