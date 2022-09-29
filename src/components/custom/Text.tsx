import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import React from 'react'

type Props = {
    type: 'title'|'desc';
    text: string;
    customStyle?: any|string|ViewStyle;
}

const CustomText = ({
    type,
    text,
    customStyle
}: Props) => {

    switch(type){
        case 'title':
            return <Text style={[styles.titleText, customStyle]}>{text}</Text>
            break;

        case 'desc':
            return <Text style={[styles.descText, customStyle]}>{text}</Text>
            break;
    }
  return (
    <></>
  )
}

const styles = StyleSheet.create({
    titleText: {
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 32,
        marginVertical: 30 
    },
    descText: {
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 24,
        letterSpacing: -0.4,
        color: 'rgba(23, 23, 23, 1)'
    }
})

export default CustomText