import { StyleSheet ,Dimensions } from 'react-native'

const navHeight = Dimensions.get('screen').height - Dimensions.get('window').height
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

export default styles;