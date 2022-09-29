import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import React from 'react'

type Props = {
    icon?: JSX.Element;
    text?: string;
    onPress?: ()=>{}|any
}

const CustomButton = ({text = '', icon = <></>, onPress = ()=>{}}: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.icon}>{icon}</View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#C6AB59',
        width: '86%',
        left: '7%',
        padding: 10,
        marginVertical: 12,
        position: 'relative',
        borderRadius: 8
    },
    text: {
        color: 'white',
        textAlign: 'center'
    },
    icon: {
        position: 'absolute',
        right: 10,
        top: '40%'
    },
})

export default CustomButton