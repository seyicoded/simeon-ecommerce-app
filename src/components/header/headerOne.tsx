import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Constant from '../../constants/collection/list'
import Color from '../colors'
import Toast from 'react-native-toast-message'

type Props = {
    cartItemCount: number;
    navigation: any;
}

const HeaderOne = ({cartItemCount, navigation}: Props) => {
  // console.log(cartItemCount, 'cartItemCount')
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name='menu' size={32} color="black" onPress={()=>{
          navigation.openDrawer();
        }} />
        {/* <Text style={styles.HeaderTitle}>{Constant.APP_CONFIG.NAME}</Text> */}
        <Image source={Constant.APP_CONFIG.HEAD_LOGO} style={{ height: 42, width: 42, resizeMode: 'contain', zIndex: -1, left: 10, borderRadius: 9 }} />
      </View>
      
      <View style={{ flexDirection: 'row' }}>
        {
            ((cartItemCount !== 0) && (
                <Text style={styles.cartIcon}>{cartItemCount}</Text>
            ))
        }
        <FontAwesome onPress={()=>{
          navigation.navigate("SearchMain")
        }} name="search" size={24} color="black" style={{ marginRight: 14 }} />
        <FontAwesome onPress={()=>{ 
          if(!((cartItemCount !== 0) && (cartItemCount > 0))){
            Toast.show({
              type: "error",
              text1: "No Item In Carts"
            })
            return
          }
          // check if item is in cart
          navigation.navigate("CartScreen")
         }} name="shopping-cart" size={24} color="black" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        // height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 26,
        paddingBottom: 10,
        paddingRight: 24,
        borderBottomColor: 'rgba(0, 0, 0, 0.24)',
        borderBottomWidth: 0.3,
        backgroundColor: 'white'
    },
    HeaderTitle: {
      fontWeight: 'bold',
      marginLeft: 8
    },
    cartIcon: {
        backgroundColor: Color.PRIMARY_COLOR,
        textAlign: 'center',
        color: 'white',
        overflow: 'hidden',
        borderRadius: 8.2,
        fontSize: 11.6,
        paddingVertical: 1,
        width: 18,
        position: 'absolute',
        zIndex: 99,
        right: -4,
        top: -5
    }
})

export default HeaderOne