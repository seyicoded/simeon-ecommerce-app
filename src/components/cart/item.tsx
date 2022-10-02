import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { Image } from 'react-native-elements'
import { formatMoney } from '../../util/functions';
import { FontAwesome } from '@expo/vector-icons';
import { doc, setDoc } from 'firebase/firestore';
import Constant from '../../constants/collection/list';
import Toast from 'react-native-toast-message'

type Props = {
    item: any;
    index: any;
    context: any;
    userData: any;
    db: any;
}

const CartItem = ({item, index, context, db, userData}: Props) => {

    // get products
    const product = ((context[0].allProducts).filter(val => (val.id === item.productId)))[0]
    // console.log(item, product)

    const removeFromCart = async()=>{
        try{
            context[1].setIsLoading(true);

            const allCart = context[0].allCarts;
            const temp = allCart.filter(val => (val.productId !== item.productId));

            // update fcm records
            const userEmail = userData.email;
            const docRef = doc(db, Constant.COLLECTION.CART, userEmail);
            const __data = {
                cartItems: temp
            }

            await setDoc(docRef, __data);
            Toast.show({
                type: "success",
                text1: "Removed Successfully"
            })
            
        }catch(e){
            console.log(e)
        }
        context[1].setIsLoading(false);
        
    }

    const removeQuantity = async()=>{

        // check if item won't be zero
        if(item.quantity == 1){
            await removeFromCart();
            return
        }
        try{
            context[1].setIsLoading(true);

            const allCart = context[0].allCarts;
            const temp = allCart.map(val => {
                if(val.productId === item.productId){
                    val.quantity = val.quantity - 1;
                }

                return val
            });

            // update fcm records
            const userEmail = userData.email;
            const docRef = doc(db, Constant.COLLECTION.CART, userEmail);
            const __data = {
                cartItems: temp
            }

            await setDoc(docRef, __data);
            Toast.show({
                type: "success",
                text1: "Removed Successfully"
            })
            
        }catch(e){
            console.log(e)
        }
        context[1].setIsLoading(false);
    }
    const addQuantity = async()=>{
        try{
            context[1].setIsLoading(true);

            const allCart = context[0].allCarts;
            const temp = allCart.map(val => {
                if(val.productId === item.productId){
                    val.quantity = val.quantity + 1;
                }

                return val
            });

            // update fcm records
            const userEmail = userData.email;
            const docRef = doc(db, Constant.COLLECTION.CART, userEmail);
            const __data = {
                cartItems: temp
            }

            await setDoc(docRef, __data);
            Toast.show({
                type: "success",
                text1: "Removed Successfully"
            })
            
        }catch(e){
            console.log(e)
        }
        context[1].setIsLoading(false);
    }

    // display cart item
    return (
        <View key={index} style={styles.container}>
            
            <View>
                <Image style={styles.image} source={{ uri: product.data.mainImageUrl }} PlaceholderContent={<ActivityIndicator />} />
            </View>
            
            <View style={{ flex: 1, flexDirection: 'row', padding: 20 }}>
                <View>
                    <Text style={styles.title}>{product.data.name}</Text>
                    <Text style={styles.desc}>{product.data.currency} {formatMoney(product.data.price)}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <FontAwesome onPress={removeQuantity} name="minus" size={24} color="grey" />
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <FontAwesome onPress={addQuantity} name="plus" size={24} color="grey" />
                </View>
            </View>

            <FontAwesome onPress={()=>{
                removeFromCart()
            }} name="close" size={24} color="grey" style={styles.close} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 10,
        borderWidth: 0.61,
        borderColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 4
    },
    image: {
        width: 120,
        height: 120,
    },
    title: {
        fontWeight: '800',
        fontSize: 15,
        color: 'rgba(0, 0, 0, 0.7)'
    },
    desc: {
        color: 'grey',
        fontWeight: '500',
        fontSize: 18
    },
    quantity: {
        marginHorizontal: 12,
        fontSize: 22,
        fontWeight: '800'
    },
    close: {
        position: 'absolute',
        right: 10,
        top: 5,
        fontSize: 18
    }
})

export default CartItem