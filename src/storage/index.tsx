import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARD_TOKEN: string = "APP::ONBOARD_TOKEN";
const USER_STORE: string = "APP::USER_STORE";

export const getOnBoardState = async ()=>{
    const _res = await AsyncStorage.getItem(ONBOARD_TOKEN)

    return ((_res !== null) ? true : false)
}

export const setOnBoardState = async ()=>{
    const _res = await AsyncStorage.setItem(ONBOARD_TOKEN, "true")

    return null;
}

export const getUser = async()=>{
    const _res = await AsyncStorage.getItem(USER_STORE)

    return ((_res !== null) ? _res : false)
}

export const setUser = async(data)=>{
    const _data = JSON.stringify(data);
    await AsyncStorage.setItem(USER_STORE, _data)

    return null;
}

export const deleteUser = async()=>{
    await AsyncStorage.removeItem(USER_STORE)

    return null;
}