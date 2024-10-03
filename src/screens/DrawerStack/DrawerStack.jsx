import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, Text, Vibration, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FollowerScreen from '../FollowerScreen/FollowerScreen';
import FollowingScreen from '../FollowingScreen/FollowingScreen';
import SettingScreen from '../SettingScreen/SettingScreen';
import EditProfileScreen from '../EditProfileScreen/EditProfileScreen';
import PrivateStack from '../PrivateStack/PrivateStack';
import { useNavigation } from '@react-navigation/native';
import { handleAuth } from '../../../android/app/Redux/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import home from './../../../assets/images/home.png';
import { persistor, store } from '../../../android/app/Redux/store';
import NotificationsScreen from '../NotificationsScreen/NotificationsScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const DrawerStack = () => {
    let count = useSelector(state=>state.notifications)
    count = count.count

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const logScreenNameOnFocus = ({ route }) => ({
        focus: () => {
            Vibration.vibrate(10)
        },
    });
    const handleLogout = async () => {
        navigation.navigate("Public")
        store.dispatch({ type: 'LOGOUT' });
        // Clear persisted state
        await persistor.purge();
        persistor.purge()
        await auth().signOut()
        dispatch(handleAuth({
            "token": null,
            "uid": null,
            "name": null,
            "email": null,
            "provider": null,
            "type": null,
            "status": null,
            "_id": null,
            "url": null,
            "authenticated": false,
            "welcome": false,
        }))
    }




    return (

        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerActiveTintColor: 'black',
                drawerInactiveTintColor: 'white',
                drawerType: 'front',
                drawerPosition: 'right',
                drawerStyle: {
                    backgroundColor: "#FFA100",
                    width: 240,
                },
                swipeEnabled: false,
            }}
        >
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Profile" component={PrivateStack} />
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Following" component={FollowingScreen} />
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Followers" component={FollowerScreen} />
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Settings" component={SettingScreen} />
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Edit Profile" component={EditProfileScreen} />
            <Drawer.Screen 
            listeners={logScreenNameOnFocus} 
            name="Notifications"
            component={NotificationsScreen}
            options={{
                drawerLabel: ({ focused, color }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color, fontSize: 16 }}>Notifications</Text>
                    {count > 0 && (
                      <View
                        style={{
                          backgroundColor: 'red',
                          borderRadius: 10,
                          marginLeft: 8,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: 'white', fontSize: 12 }}>{count}</Text>
                      </View>
                    )}
                  </View>
                ),
              }}
            />




            <Drawer.Screen listeners={() => {
                handleLogout()
            }} name="Log Out" component={() => <ImageBackground style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }} source={home}>
                <ActivityIndicator color="#FFA100" size="large" />
            </ImageBackground>} />

        </Drawer.Navigator>



    );
};

export default memo(DrawerStack);
