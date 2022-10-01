import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import HeaderThree from '../../../components/header/headerThree';
import { useContext } from 'react';
import AppContext from '../../../context'
import ProductRenderer from '../../../components/products/renderer';

type Props = {
    navigation: any;
}

const SearchMain = ({navigation}: Props) => {
    const context = useContext(AppContext);
    const [data, setData] = useState([])
    return (
        <View style={styles.container}>
            <HeaderThree navigation={navigation} onSearch={e=>{
                let temp: any;
                temp = (context[0].allProducts).filter(val => ((val.data.name).includes(e)) )
                setData(temp)
          
                return () => {
                  setData([])
                }
            }} />
        
            <Text />
            <ProductRenderer data={data} navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})

export default SearchMain