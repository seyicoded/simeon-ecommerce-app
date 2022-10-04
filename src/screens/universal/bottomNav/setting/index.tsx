import { View, DevSettings, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Image } from 'react-native-elements'
import AppContext from '../../../../context'
import { deleteUser, getUser, setUser } from '../../../../storage'
import colors from '../../../../components/colors'
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper'

import * as Google from 'expo-auth-session/providers/google';

import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import Constant from '../../../../constants/collection/list';
import Toast from 'react-native-toast-message'
import axios from 'axios'

type Props = {
  navigation: any;
  route: any;
}

const Setting = ({navigation, route}: Props) => {
  const context = useContext(AppContext)
  const [userData, setUserData] = useState(null)
  const db = getFirestore();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '595988627302-21farsd2j0hsodl0k6qe7edg5c6lsgig.apps.googleusercontent.com',
        iosClientId: '595988627302-r7da7fgqgk6tsn45h7susjp7ao55dm8g.apps.googleusercontent.com',
        androidClientId: '595988627302-mvms1i2nkc1ioiqqkrgu4kj846ig69b9.apps.googleusercontent.com',
    // webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
  });

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
                    text1: "Login Succesful"
                })
            }catch(e){
                console.log(authentication.accessToken)
                console.log(e)
            }
        })();
        
    }
  }, [response]);

  useEffect(() => {
    (async()=>{
      const _res = await getUser()
      if(!_res){
        return
      }

      // update
      setUserData(JSON.parse(_res))
    })()
    return () => {
      
    }
  }, [context[0].isSignedIn])

  // console.log(userData)
  
  return (
    <View style={styles.container}>
      {
        ((context[0].isSignedIn) && (userData != null) ) ? 
        <View style={{ flex: 1 }}>
          
          <View style={[styles.card, { padding: 20, flexDirection: 'row' }]}>
            <Image PlaceholderContent={<ActivityIndicator />} source={{ uri: userData.picture }} style={{ width: 78, height: 78, borderRadius: 100 }} />
            <View style={{ flex: 1, marginLeft: 30 }}>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>{userData.name}</Text>
              <Text style={{ marginTop: 5, color: 'grey' }}>{userData.email}</Text>

              <Text onPress={()=>{
                // logout code
                (async()=>{
                  await deleteUser()
                  Alert.alert("A quick reload would be triggered", "", [
                    {
                      text: "OKAY",
                      style: "cancel",
                      onPress: ()=>DevSettings.reload()
                    },
                    {
                      text: "OKAY",
                      onPress: ()=>DevSettings.reload()
                    }
                  ])
                })()
              }} style={{ color: colors.PRIMARY_COLOR, marginTop: 20, textAlign: 'right' }}>logout</Text>
            </View>
          </View>

          <Text style={{ height: 20 }}/>

          <TouchableOpacity onPress={()=>{
            navigation.navigate("OrderScreen")
          }}>
            <View style={[styles.card, { padding: 20, flexDirection: 'row' }]}>
              <FontAwesome5 name="jedi-order" size={24} color="black" />
              <View style={{ flex: 1, marginLeft: 30 }}>
                <Text style={{ fontWeight: '700', fontSize: 18 }}>My Orders History</Text>
              </View>
            </View>
          </TouchableOpacity>
          

          <Text style={{ height: 20 }}/>

          <TouchableOpacity onPress={()=>{
            Linking.openSettings()
          }}>
            <View style={[styles.card, { padding: 20, flexDirection: 'row' }]}>
              <Ionicons name="notifications" size={24} color="black" />
              <View style={{ flex: 1, marginLeft: 30 }}>
                <Text style={{ fontWeight: '700', fontSize: 18 }}>Notifications</Text>
              </View>
            </View>
          </TouchableOpacity>
          

          

        </View>
        :
        <View style={{ flex: 1 }}>
          
          <View style={[styles.card, { padding: 20 }]}>
            <Button onPress={()=>promptAsync()} color={colors.PRIMARY_COLOR}>SIGN IN</Button>    
          </View>

          <Text style={{ height: 20 }}/>

          <TouchableOpacity onPress={()=>{
            Linking.openSettings()
          }}>
            <View style={[styles.card, { padding: 20, flexDirection: 'row' }]}>
              <Ionicons name="notifications" size={24} color="black" />
              <View style={{ flex: 1, marginLeft: 30 }}>
                <Text style={{ fontWeight: '700', fontSize: 18 }}>Notifications</Text>
              </View>
            </View>
          </TouchableOpacity>

        </View>
      }

      <Text style={{ textAlign: 'center', fontSize: 12, color: 'grey', fontWeight: '500' }}>APP: v1.0.0</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 20
  },
  card: {
    borderWidth: 0.61,
    borderColor: 'rgba(0, 0, 0, 0.6)',
    marginHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 4
  }
})

export default Setting