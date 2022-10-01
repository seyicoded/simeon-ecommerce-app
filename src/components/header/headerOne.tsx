import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import Constant from '../../constants/collection/list'
import Color from '../colors'

type Props = {
    cartItemCount: number;
    navigation: any;
}

const HeaderOne = ({cartItemCount, navigation}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.HeaderTitle}>{Constant.APP_CONFIG.NAME}</Text>
      <View style={{ flexDirection: 'row' }}>
        {
            ((cartItemCount !== 0) && (
                <Text style={styles.cartIcon}>{cartItemCount}</Text>
            ))
        }
        <FontAwesome onPress={()=>{
          navigation.navigate("SearchMain")
        }} name="search" size={32} color="grey" style={{ marginRight: 10 }} />
        <FontAwesome name="shopping-cart" size={32} color="grey" />
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
        paddingBottom: 12,
        paddingRight: 24,
        borderBottomColor: 'rgba(0, 0, 0, 0.24)',
        borderBottomWidth: 0.3,
        backgroundColor: 'white'
    },
    HeaderTitle: {
      fontWeight: 'bold'
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