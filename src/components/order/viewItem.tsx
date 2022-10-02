import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Image } from 'react-native-elements'
import { formatMoney } from '../../util/functions';
import colors from '../colors';

type Props = {
    item: any;
    index: any;
    context: any;
}

const ViewItem = ({context, index, item}: Props) => {

    const [isOpen, setIsOpen] = useState(false)
    return (
        <TouchableOpacity key={index} onPress={()=>{
            setIsOpen(!isOpen)
        }} style={{ marginBottom: 20 }}>
            <View style={styles.container}>
                <Text style={styles.orderCode}>Order: {item.data.orderCode}</Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.title}>Amount</Text>
                        <Text style={{  }}>NGN {formatMoney(item.data.total)}</Text>
                    </View>

                    <View>
                        <Text style={styles.title}>Status</Text>
                        <Text style={{ color: colors.PRIMARY_COLOR }}>{item.data.status}</Text>
                    </View>
                </View>

                <View>
                    <Text style={{ textAlign: 'right', marginVertical: 10 }}>{ (new Date(item.data.timestamp.seconds * 1000)).toDateString() }</Text>
                </View>

                {
                    (isOpen && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.orderCode}>products purchased: </Text>

                            {
                                (item.data.cartItems).map((_item, _index)=>{
                                    const product = ((context[0].allProducts).filter(val => (val.id === _item.productId)))[0];

                                    return (
                                        <View style={[ styles.container, { flexDirection: 'row', marginTop: 10 }]}>
                                            <Image source={{ uri: product.data.mainImageUrl}} PlaceholderContent={<ActivityIndicator />} style={{ width: 120, height: 120, borderRadius: 8 }} />
                                            <View style={{ flex: 1, padding: 20 }}>
                                                <Text style={styles.title}>PRODUCT NAME: {'\n'} {product.data.name}</Text>
                                                <Text />
                                                <Text style={{ color: 'grey', fontSize: 11 }}>QUANTITY: {_item.quantity}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    ))
                }

            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.67)',
        borderWidth: 0.67,
        padding: 10
    },
    orderCode: {
        fontSize: 18,
        fontWeight: '700',
        color: 'grey',
        marginVertical: 8
    },
    title: {
        fontWeight: '600',
        marginVertical: 4
    }
})

export default ViewItem