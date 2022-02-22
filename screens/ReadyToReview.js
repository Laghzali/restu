import React , {useState ,useEffect} from 'react';
import {View, TouchableOpacity, Text  ,ScrollView, Image, Button,TextInput  } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';


const ReadyToReview = () => {
    const [keyword , setKeyword] = useState("")
    const [page , setPage] = useState(0)
    const [resturants ,  setResturants] = useState()
    const getData = () => {

        let url='https://restuapi.orderaid.com.au/api/readytoreview?mid=8&token=2&page='+page
        if(keyword.length>=3) {
            url='https://restuapi.orderaid.com.au/api/readytoreview?mid=8&token=2&keyword='+keyword+'&page='+page
        }
        fetch(url)
        .then(resp => resp.json())
        .then(json => {
            console.log(json)
            setResturants(json)
        })
    }
    useEffect( ()=> {
        getData()
    }, [page, keyword])


    const Resturant = ({data }) => {
        return (
            
        <View  style={{backgroundColor:'rgba(232, 236, 241, 0.2)', marginRight:5, flexDirection:'row' , marginBottom:5}}>    
          
            <View style={{flexDirection:'row' , alignItems:'center'}}>
                <View style={{flexDirection:'column',padding:10,alignItems:'center'}}>
                    <Text style={{fontSize:25, fontWeight:'bold', color:'yellow'}}>{data.stars}</Text>
                    <FontAwesome name="star" size={10} color="#68D25F" />
                </View>
            
                <View style={{padding:10 , width:320, maxWidth:320, flexWrap: 'wrap'}}>
                    <Text style={{fontSize:15, fontWeight:'bold',color:'white'}}>{data.rname}</Text>
                    <Text style={{fontSize:10, fontWeight:'bold',color:'white'}}>{data.address}</Text>
                    <Text style={{fontSize:8, fontWeight:'bold',color:'white'}}>{data.phone}</Text>
                </View>
            </View>

        </View>
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

    return (<>
             <View style={{flexDirection:'row'}}>
            <TextInput  placeholder='Search by name or zip' onChangeText={(keyword) => { keyword.length > 2 ? setKeyword(keyword) : setKeyword("")}} style={{backgroundColor :'white' , padding:5,borderRadius:5, borderWidth:1, color:'grey', height:35, borderColor:'purple' ,width:'20%',margin:20,justifyContent:'center'}} type="Outlined"  label='Search members by name'></TextInput>
            <TouchableOpacity onPress={() => {setKeyword("");setPage(0)}} style={{alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'white',fontWeight:600}}>Reset</Text>
            </TouchableOpacity>
        </View>
    
        <View style={{margin: 20 , marginBottom:5}}>
                <Text style={{fontWeight:'bold',fontSize:25,color:'white'}}>Ready to view list</Text>

        </View>
        <View style={{flexDirection:'row' , margin:20,marginBottom:0, justifyContent:''}}>
            <TouchableOpacity onPress={() => page-1 > 0 ? setPage(page-1) : setPage(0)} style={{marginRight:5}}><Text style={{color:'white', fontWeight:600}}>Prev</Text></TouchableOpacity>
            <Text style={{color:'white', fontWeight:500}}>.... {page} .... </Text>
            <TouchableOpacity onPress={() => setPage(page+1)}><Text style={{color:'white',fontWeight:600}}>Next</Text></TouchableOpacity>
        </View>
        <ScrollView>
            <View style={{margin: 20,flexDirection:'row' , flexWrap : 'wrap'}}>

                <RenderResturant/>
            </View>
        </ScrollView> </>)
 }

export default ReadyToReview