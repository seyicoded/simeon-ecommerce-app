import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useContext } from 'react'
import colors from '../colors';
import { Image } from 'react-native-elements'
import { formatMoney } from '../../util/functions';
import { Button } from 'react-native-paper'
import axios from 'axios'

import AppContext from '../../context'

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

import { getUser, setUser } from '../../storage';
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import Constant from '../../constants/collection/list';
import Toast from 'react-native-toast-message'

type Props = {
    data: array;
    navigation: any;
}

const ProductRenderer = ({data, navigation}: Props) => {
    const context = useContext(AppContext);
    const db = getFirestore();

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '595988627302-21farsd2j0hsodl0k6qe7edg5c6lsgig.apps.googleusercontent.com',
        // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
        // androidClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
        // webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    });

    const addToCart = async(item)=>{
        // check if user is logged in
        const userMockData = await getUser();
        if(!userMockData){
            // logged user
            promptAsync()
        }else{
            context[1].setIsLoading(true);
            const userData = JSON.parse(userMockData);
            const userEmail = userData.email;

            // get items if exist
            const docRef = doc(db, Constant.COLLECTION.CART, userEmail);
            const oldCart = await getDoc(docRef);
            // console.log(oldCart.exists())
            if(oldCart.exists()){
                // add item to cart
                const _oldCartItem = oldCart.data();
                let didEdit = false;

                const temp = (_oldCartItem.cartItems).map(_item=>{
                    if(_item.productId == item.id){
                        _item.quantity = _item.quantity + 1;
                        didEdit = true;
                    }

                    return _item;

                })

                if(!didEdit){
                    // so it's actually a add
                    temp.push({
                        productId: item.id,
                        quantity: 1
                    })
                }

                const __data = {
                    cartItems: temp
                }

                await setDoc(docRef, __data);
                Toast.show({
                    type: "success",
                    text1: "Updated Successfully"
                })
                context[1].setIsLoading(false);
            }else{
                // create item to cart
                const __data = {
                    cartItems: [
                        {
                            productId: item.id,
                            quantity: 1
                        }
                    ]
                }

                await setDoc(docRef, __data);
                Toast.show({
                    type: "success",
                    text1: "Added Successfully"
                })
            }
            context[1].setIsLoading(false);

        }
    }

    React.useEffect(() => {
        if (response?.type === 'success') {
          const { authentication } = response;

            //   console.log(response)
            // const { id_token } = response.params;
            (async()=>{
                try{
                    context[1].setIsLoading(true);
                    const _res = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${authentication.accessToken}`);

                    // update store
                    await setUser(_res.data)

                    // update/create entry into firebase
                    const email = _res.data.email;

                    const docRef = doc(db, Constant.COLLECTION.USER, email);
                    await setDoc(docRef, _res.data)

                    context[1].setIsLoading(false);
                    context[1].setIsSignedIn(true);
                    Toast.show({
                        type: 'success',
                        text1: "Login Succesful",
                        text2: "Click on Add to Cart Again to reflex order"
                    })
                }catch(e){
                    console.log(authentication.accessToken)
                    console.log(e)
                }
            })();
            
        }
    }, [response]);

  return (
    <FlatList
        data={data}
        renderItem={({item, index})=>{
            // console.log(item)
            if((item.data.status) !== 1){
                return (<></>)
            }

            return (
                <View key={item.id} style={styles.catContent}>
                    <View>
                        <Image onPress={()=>{
                            navigation.navigate("ProductViewer", {item})
                        }} PlaceholderContent={<ActivityIndicator color={colors.PRIMARY_COLOR} />} source={{ uri: item.data.mainImageUrl }} style={styles.catImage} />
                        <Text style={styles.money}>{`${item.data.currency} ${formatMoney((item.data.price))}`}</Text>
                    </View>
                    <View style={styles.catContenTextContainer}>
                        <Text style={styles.catContentLeft}>{item.data.stockCount} stock(s) left</Text>
                        <Text style={styles.catContenText}>{item.data.name}</Text>
                        <Button onPress={()=>{
                            addToCart(item)
                        }} disabled={(item.data.stockCount != 0) ? false:true} labelStyle={{ color: 'white' }} color={colors.PRIMARY_COLOR} mode='contained'>
                            {
                                (item.data.stockCount != 0) ? "ADD TO CART" : "OUT OF STOCK"
                            }
                        </Button>
                    </View>
                </View>
            )
        }}
        numColumns={2}
        />
  )
}

const styles = StyleSheet.create({
    catContent: {
        flex: 1,
        // height: 300,
        marginHorizontal: 4,
        // width: '80%',
        // marginHorizontal: '10%',
        marginVertical: 10,
        backgroundColor: colors.PRIMARY_BG,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12
    },
    catImage: {
        height: 245,
        width: '100%'
    },
    catContenTextContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '100%'
    },
    catContenText: {
        textAlign: 'center',
        color: 'black',
        fontWeight: '500',
        marginVertical: 8
    },
    catContentLeft: {
        fontSize: 10,
        color: 'rgba(0, 0, 0, 0.7)',
    },
    money: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '700',
        fontSize: 10.9,
        right: 0,
        top: 12,
        padding: 4,

    }
})

export default ProductRenderer