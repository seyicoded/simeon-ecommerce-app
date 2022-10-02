import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import HeaderTwo from '../../../components/header/headerTwo'
import AppContext from '../../../context'
import ViewItem from '../../../components/order/ViewItem'

type Props = {
    navigation: any;
    route: any;
}

const OrderScreen = ({navigation, route}: Props) => {
    const context = useContext(AppContext);
    // console.log(context[0].allOrders)

    return (
        <View style={styles.container}>
            <HeaderTwo name='My Orders' navigation={navigation} />
            
            <FlatList
                data={context[0].allOrders}
                style={{ 
                    flex: 1,
                    padding: 20
                 }}
                renderItem={({item, index})=>{
                    // return <></>
                    return (<ViewItem item={item} index={index} context={context} />)
                }}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})

export default OrderScreen