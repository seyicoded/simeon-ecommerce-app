import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import Constant from '../../constants/collection/list'
import Color from '../colors'

type Props = {
    navigation: any;
    name: string;
}

const HeaderTwo = ({navigation, name}: Props) => {

    return (
        <View style={styles.container}>
            <View>
                <FontAwesome onPress={()=>{
                    navigation.goBack()
                }} name="chevron-left" size={24} color="grey" />
            </View>
            <Text style={styles.HeaderTitle}>{name}</Text>
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

export default HeaderTwo