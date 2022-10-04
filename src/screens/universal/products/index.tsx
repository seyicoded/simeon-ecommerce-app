import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import HeaderTwo from '../../../components/header/headerTwo';
import { useState, useEffect } from 'react';
import ImageSlider from 'react-native-image-slider';
import { Image } from 'react-native-elements'
import { DataTable, Button } from 'react-native-paper';
import { formatMoney } from '../../../util/functions';
import colors from '../../../components/colors';

import AppContext from '../../../context'

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

import { getUser, setUser } from '../../../storage';
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import Constant from '../../../constants/collection/list';
import Toast from 'react-native-toast-message'

type Props = {
    navigation: any;
    route: any;
}

const {width: deviceWidth, height: deviceHeight} = Dimensions.get("screen")

const ProductViewer = ({navigation, route}: Props) => {
    const {item} = route.params;
    const [imageSliderContent, setImageSliderContent] = useState([])

    const context = useContext(AppContext);
    const db = getFirestore();

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '595988627302-21farsd2j0hsodl0k6qe7edg5c6lsgig.apps.googleusercontent.com',
        iosClientId: '595988627302-r7da7fgqgk6tsn45h7susjp7ao55dm8g.apps.googleusercontent.com',
        androidClientId: '595988627302-mvms1i2nkc1ioiqqkrgu4kj846ig69b9.apps.googleusercontent.com',
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

    // assemble images
    useEffect(()=>{
        let temp = [];
        temp.push(item.data.mainImageUrl);
        // looper for other images
        (item.data.otherImageUrl).map(item=> temp.push(item));
        // console.log(temp);
        setImageSliderContent(temp);

        return ()=>{
            setImageSliderContent([])
        }
    }, [item])
    return (
        <View style={styles.container}>
            <HeaderTwo name={`Product: ${item.data.name}`} navigation={navigation} />

            <ScrollView style={{ padding: 20 }}>
                <View style={{ width: '100%', borderRadius: 4, overflow: 'hidden' }}>
                    <ImageSlider
                        loopBothSides
                        autoPlayWithInterval={3000}
                        images={imageSliderContent}
                        style={{  }}
                        customSlide={({ index, item, style, width })=>(
                            <View style={{ height: '100%', width }}>
                                <Image PlaceholderContent={<ActivityIndicator />} resizeMode='contain' source={{ uri: item }} style={[styles.customImage]} />
                            </View>
                        )}/>
                </View>

                <View style={{ marginTop: 10 }}>
                    <DataTable>
                        {/* <DataTable.Header>
                            <DataTable.Title>Dessert</DataTable.Title>
                            <DataTable.Title numeric>Calories</DataTable.Title>
                            <DataTable.Title numeric>Fat</DataTable.Title>
                        </DataTable.Header> */}

                        <DataTable.Row>
                            <DataTable.Cell textStyle={{ fontSize: 12, fontWeight: '400' }}>PRODUCT NAME</DataTable.Cell>
                            <DataTable.Cell textStyle={{ fontSize: 12, fontWeight: '600' }}>{item.data.name}</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell textStyle={{ fontSize: 12, fontWeight: '400' }}>AVAILABLE STOCK</DataTable.Cell>
                            <DataTable.Cell textStyle={{ fontSize: 12, fontWeight: '600' }}>{item.data.stockCount}</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell textStyle={{ fontSize: 12, fontWeight: '400' }}>COST</DataTable.Cell>
                            <DataTable.Cell textStyle={{ fontSize: 12, fontWeight: '600' }}>{item.data.currency} {formatMoney(item.data.price)}</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                </View>

            </ScrollView>

            <Button onPress={()=>{
                addToCart(item)
            }} style={{ marginBottom: 30, width: '86%', marginLeft: '7%' }} disabled={(item.data.stockCount != 0) ? false:true} labelStyle={{ color: 'white' }} color={colors.PRIMARY_COLOR} mode='contained'>
                {
                    (item.data.stockCount != 0) ? "ADD TO CART" : "OUT OF STOCK"
                }
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    customImage: {
        width: '100%',
        height: 300,
        borderRadius: 4,
        overflow: 'hidden'
    }
})

export default ProductViewer