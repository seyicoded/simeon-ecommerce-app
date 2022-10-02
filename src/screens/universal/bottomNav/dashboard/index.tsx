import { collection, doc, getFirestore, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native'
import React, { useContext, useEffect } from 'react'
import HeaderOne from '../../../../components/header/headerOne'
import AppContext from '../../../../context'
import Constant from '../../../../constants/collection/list';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import colors from '../../../../components/colors';
import { Image } from 'react-native-elements'
import ProductRenderer from '../../../../components/products/renderer';
import { getUser } from '../../../../storage';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('screen')

type Props = {
    navigation: any,
    route: any
}

const Dashboard = ({navigation, route}: Props) => {
    const context = useContext(AppContext);
    const db = getFirestore();

    // utilize firebase firestore to get all products and category

    const getCat = async ()=>{
        context[1].setIsLoading(true)
        const collRef = collection(db, Constant.COLLECTION.CATEGORY);
        const data = onSnapshot(collRef, (docs)=>{
            // console.log("Current data: ", docs);
            const temp = [];
            docs.forEach(item=>{
                temp.push({
                    id: item.id,
                    data: item.data()
                })
            })

            // setcatData(temp)
            context[1].setAllCategory(temp)

            context[1].setIsLoading(false)
        });
    }

    const getProducts = async ()=>{
        context[1].setIsLoading(true)
        const collRef = collection(db, Constant.COLLECTION.PRODUCT);
        const data = onSnapshot(collRef, (docs)=>{
            // console.log("Current data: ", docs);
            const temp = [];
            docs.forEach(item=>{
                temp.push({
                    id: item.id,
                    data: item.data()
                })
            })

            // setcatData(temp)
            context[1].setAllProducts(temp)

            context[1].setIsLoading(false)
        });
    }

    const getCart = async ()=>{
        if(!(context[0].isSignedIn)){
            return null;
        }

        // @ts-ignore
        const userData = JSON.parse(await getUser());
        const userEmail = userData.email;

        context[1].setIsLoading(true)
        const docRef = doc(db, Constant.COLLECTION.CART, userEmail);
        const data = onSnapshot(docRef, (docs)=>{
            // console.log("Current data: ", docs);
            // const temp = [];
            // docs.forEach(item=>{
            //     temp.push({
            //         id: item.id,
            //         data: item.data()
            //     })
            // })

            // setcatData(temp)
            context[1].setAllCarts((docs.data())?.cartItems || [])

            context[1].setIsLoading(false)
        });
    }

    const getOrders = async ()=>{
        if(!(context[0].isSignedIn)){
            return null;
        }

        // @ts-ignore
        const userData = JSON.parse(await getUser());
        const userEmail = userData.email;

        context[1].setIsLoading(true)
        const collRef = collection(db, Constant.COLLECTION.ORDER);
        const q = query(collRef, where("by", "==", userEmail))
        const data = onSnapshot(q, (docs)=>{
            // console.log("Current data: ", docs);
            const temp = [];
            docs.forEach(item=>{
                temp.push({
                    id: item.id,
                    data: item.data()
                })
            })

            // setcatData(temp)
            context[1].setAllOrders(temp)

            context[1].setIsLoading(false)
        });
    }
    

    useEffect(() => {
        
        getCat()
        getProducts()

      return () => {
        // 
      }
    }, [])

    useEffect(()=>{
        getCart()
        getOrders()
    }, [context[0].isSignedIn])
    

    return (
        <View style={styles.container}>
            <HeaderOne navigation={navigation} cartItemCount={ (()=>{
                let count = 0;

                if(context[0].allCarts != undefined){
                    (context[0].allCarts).map(__item=>{
                        count += parseInt(__item.quantity);
                    })
                }

                // console.log(count)

                return count;
            })() } />
            <ScrollView style={styles.mainScroll}>
                <View>
                    <Text style={styles.headTitle}>OUR PREMIUM CATEGORY</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} pagingEnabled={true} horizontal={true} style={styles.catScroll}>
                        {
                            (context[0].allCategory).map((item, index) => {
                                // console.log(item)
                                if((item.data.status) !== 1){
                                    return (<></>)
                                }

                                return (
                                    <View key={item.id} style={styles.catContent}>
                                        <Image onPress={()=>{
                                            navigation.navigate("CategoryProductList", {
                                                item,
                                                name: item.data.name,
                                                id: item.id
                                            })
                                        }} PlaceholderContent={<ActivityIndicator color={colors.PRIMARY_COLOR} />} source={{ uri: item.data.catUrl }} style={styles.catImage} />
                                        <View style={styles.catContenTextContainer}>
                                            <Text style={styles.catContenText}>{item.data.name}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>

                    {/* list normal products at random */}
                    <Text style={styles.headTitle}>SOME PREMIUM PRODUCTS</Text>
                    <ProductRenderer navigation={navigation} data={context[0].allProducts} />
                    <Text />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    mainScroll: {
        flex: 1,
        padding: 14
    },
    catScroll: {
        height: 300,
        marginBottom: 30
    },
    headTitle: {
        fontWeight: '600',
        marginBottom: 5,
        marginTop: 13,
        fontSize: 11.58,
        color: 'grey'
    },
    catContent: {
        width: deviceWidth - (deviceWidth * 0.4),
        marginRight: deviceWidth - (deviceWidth * 0.9) ,
        backgroundColor: colors.PRIMARY_BG,
        borderRadius: 4,
        overflow: 'hidden'
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
        fontWeight: '500'
    }
})

export default Dashboard