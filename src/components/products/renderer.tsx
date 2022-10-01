import { View, Text, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import colors from '../colors';
import { Image } from 'react-native-elements'
import { formatMoney } from '../../util/functions';
import { Button } from 'react-native-paper'


type Props = {
    data: array;
    navigation: any;
}

const ProductRenderer = ({data, navigation}: Props) => {
  return (
    <FlatList
        data={data}
        renderItem={({item, index})=>{
            console.log(item)
            if((item.data.status) !== 1){
                return (<></>)
            }

            return (
                <View key={item.id} style={styles.catContent}>
                    <View>
                        <Image PlaceholderContent={()=><ActivityIndicator color={colors.PRIMARY_COLOR} />} source={{ uri: item.data.mainImageUrl }} style={styles.catImage} />
                        <Text style={styles.money}>{`${item.data.currency} ${formatMoney((item.data.price))}`}</Text>
                    </View>
                    <View style={styles.catContenTextContainer}>
                        <Text style={styles.catContentLeft}>{item.data.stockCount} stock(s) left</Text>
                        <Text style={styles.catContenText}>{item.data.name}</Text>
                        <Button disabled={(item.data.stockCount != 0) ? false:true} labelStyle={{ color: 'white' }} color={colors.PRIMARY_COLOR} mode='contained'>
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