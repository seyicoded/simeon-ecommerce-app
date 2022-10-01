import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import HeaderTwo from '../../../components/header/headerTwo';
import ProductRenderer from '../../../components/products/renderer';
import AppContext from '../../../context'

type Props = {
    navigation: any;
    route: any;
}

const CategoryProductList = ({navigation, route}: Props) => {
    const {name, id} = route.params;
    const context = useContext(AppContext);
    const [data, setData] = useState([])

    useEffect(() => {
      let temp: any;
      temp = (context[0].allProducts).filter(val => (id === val.data.catId) )
      setData(temp)

      return () => {
        setData([])
      }
    }, [id])
    

    return (
        <View style={styles.container}>
            <HeaderTwo name={name} navigation={navigation} />
            
            
            <Text />
            <ProductRenderer data={data} navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
})

export default CategoryProductList