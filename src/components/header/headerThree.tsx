import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import Constant from '../../constants/collection/list'
import Color from '../colors'
import { TextInput } from 'react-native-paper'
import colors from '../colors';
import { useState } from 'react';

type Props = {
    navigation: any;
    onSearch: any;
}

const HeaderThree = ({navigation, onSearch}: Props) => {
    const [search, setSearch] = useState("")
    return (
        <View style={styles.container}>
            <View>
                <FontAwesome onPress={()=>{
                    navigation.goBack()
                }} name="chevron-left" size={24} color="grey" />
            </View>
            {/* <Text style={styles.HeaderTitle}>{name}</Text> */}
            <TextInput dense={true} clearButtonMode='while-editing' value={search} onChangeText={val => {setSearch(val), onSearch(val)}} mode='outlined' placeholder='Enter Text to Search' activeOutlineColor={colors.PRIMARY_COLOR} style={styles.HeaderTitle} />
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
      fontWeight: 'bold',
      flex: 1,
      marginLeft: 20
    },
})

export default HeaderThree