import { View, Text, StyleSheet, Image, Animated } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import CustomText from '../../../components/custom/Text';
import CustomButton from '../../../components/custom/Button';
import { AntDesign } from '@expo/vector-icons'; 
import { setOnBoardState } from '../../../storage';

type Props = {
    navigation: any;
    route: any;
}

export default function Index({navigation, route}: Props) {
    const fadeAnim1 = useRef( new Animated.Value(0)).current;

    useEffect(()=>{
        // @ts-ignore
        Animated.timing(fadeAnim1, {
            toValue: 1,
            duration: 3000
        }).start()
    }, [])

    const navigateToHome = ()=>{
        setOnBoardState()
        navigation.replace("Home")
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.687 }}>
                <Image style={styles.image} source={require('../../../../assets/images/onBoard.png')} />
            </View>
            {/* @ts-ignore */}
            <Animated.View style={{ flex: 0.3, opacity: fadeAnim1 }}>
                <CustomText text='Welcome to E-commerce By Simeon !' type='title' customStyle={{ textAlign: 'center' }} />
                <CustomText text='With long experience in the audio industry, we create the best quality products' type='desc' customStyle={{ textAlign: 'center' }} />
                <CustomButton onPress={navigateToHome} text='Get Started' icon={<AntDesign name="arrowright" size={24} color="white" />} />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        width: '100%',
        height: '100%'
    }
})