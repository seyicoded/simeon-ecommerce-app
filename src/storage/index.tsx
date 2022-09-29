import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARD_TOKEN: string = "APP::ONBOARD_TOKEN";

export const getOnBoardState = async ()=>{
    const _res = await AsyncStorage.getItem(ONBOARD_TOKEN)

    return ((_res !== null) ? true : false)
}

export const setOnBoardState = async ()=>{
    const _res = await AsyncStorage.setItem(ONBOARD_TOKEN, "true")

    return null;
}