import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import React from 'react'
import HeaderTwo from '../../../components/header/headerTwo';
import { Button } from 'react-native-paper';
import colors from '../../../components/colors';
import AppContext from "../../../context"
import { useContext } from 'react';
import CartItem from '../../../components/cart/item';
import { useState } from 'react';
import { useEffect } from 'react';
import { getUser } from '../../../storage';
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { formatMoney } from '../../../util/functions';
import Constant from '../../../constants/collection/list';
import Toast from 'react-native-toast-message'
import { Linking } from 'react-native';

type Props = {
    navigation: any;
    route: any;
}

const CartScreen = ({navigation, route}: Props) => {
    const context = useContext(AppContext)
    const db = getFirestore();
    const [userData, setuserData] = useState<any>({})
    const [totalCost, settotalCost] = useState(0)

    useEffect(()=>{
        (async()=>{
            // @ts-ignore
            const _userData = JSON.parse(await getUser());
            setuserData(_userData)
            // const userEmail = _userData.email;
        })()
    }, [])

    // get total
    useEffect(()=>{
        let total = 0;
        (context[0].allCarts).map((_item, index)=>{
            
            // loop for product id
            const product = ((context[0].allProducts).filter(val => (val.id === _item.productId)))[0]
            total += (parseInt(product.data.price) * parseInt(_item.quantity));
        })

        settotalCost(total)
    }, [context[0].allCarts])

    const proceed = async ()=>{
        context[1].setIsLoading(true);
        try{
            const orderCode = (new Date()).getTime();
            const by = userData.email;
            const cartItems = context[0].allCarts;
            const status = "pending-payment";

            const data = {
                by,
                orderCode,
                cartItems,
                total: totalCost,
                status,
                timestamp: Timestamp.fromDate(new Date()),
                updateTimestamp: Timestamp.fromDate(new Date())
            }

            const collRef = collection(db, Constant.COLLECTION.ORDER)
            const res = await addDoc(collRef, data);

            // ...
            // cartItems
            // reduce item count on all properties
            for (let i = 0; i < cartItems.length; i++) {
                const __productId = cartItems[i].productId;
                const __doc = doc(db, Constant.COLLECTION.PRODUCT, __productId);

                // get stockCount
                const __productData = (await getDoc(__doc)).data();
                const stockCount = parseInt(__productData.stockCount) - (parseInt(cartItems[i].quantity) * 1);

                const data = {
                    stockCount: `${stockCount}`
                }

                await updateDoc(__doc, data)
            }

            // clear cart

            const docRef = doc(db, Constant.COLLECTION.CART, by)
            await setDoc(docRef, {
                cartItems: []
            })

            // done, so auto goback
            navigation.goBack();
            // show success
            Toast.show({
                type: 'success',
                text1: 'Order Created'
            })

            // open whatsup to user
            Linking.openURL(`https://wa.me/${Constant.APP_CONFIG.WHATSAPP_NUMBER}?text=Hello%2C%20i%20recently%20placed%20an%20order%2C%20my%20other%20code%20is%3A%20${res.id}`)

        }catch(e){
            console.log(e)
        }
        context[1].setIsLoading(false);
    }

    return (
        <View style={styles.container}>
            <HeaderTwo name='Cart' navigation={navigation} />
            
            <ScrollView style={{ flex: 1, padding: 20 }}>
                <Text style={styles.textDescHead}>
                    below are the list of items presently in your carts
                </Text>

                {
                    (context[0].allCarts).map((_item, index)=>{
                        return (
                            <CartItem db={db} userData={userData} item={_item} index={index} context={context} />
                        )
                    })
                }

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                    <Text style={styles.totalTitle}>Total Cost</Text>
                    <Text style={styles.totalValue}>{"NGN "+formatMoney(totalCost)}</Text>
                </View>

                <Button onPress={()=>{
                    Alert.alert(
                        "Are you Sure",
                        "after processing, you won't be able to alter this presently cart item and it would be processed as an order",
                        [
                            {
                                text: "Proceed Order",
                                style: "default",
                                onPress: proceed
                            },
                            {
                                text: "Cancel/Abort",
                                style: "cancel"
                            }
                        ]);
                }} color={colors.PRIMARY_COLOR}>PROCESS</Button>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    textDescHead: {
        fontSize: 11,
        color: 'grey',
        paddingBottom: 10
    },
    totalTitle: {
        fontWeight: '600'
    },
    totalValue: {
        fontWeight: '800',
        fontSize: 20
    }
})

export default CartScreen