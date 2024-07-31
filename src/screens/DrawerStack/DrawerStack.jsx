import React, { memo } from 'react';
import { Vibration } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FollowerScreen from '../FollowerScreen/FollowerScreen';
import FollowingScreen from '../FollowingScreen/FollowingScreen';
import SettingScreen from '../SettingScreen/SettingScreen';
import EditProfileScreen from '../EditProfileScreen/EditProfileScreen';
import PrivateStack from '../PrivateStack/PrivateStack';
import { useNavigation } from '@react-navigation/native';
import { handleAuth } from '../../../android/app/Redux/userReducer';
import auth from '@react-native-firebase/auth';

import { useDispatch } from 'react-redux';
const Drawer = createDrawerNavigator();

const DrawerStack = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const logScreenNameOnFocus = ({ route }) => ({
        focus: () => {
            Vibration.vibrate(10)
        },
    });

    
    const handleLogout= async()=>{
        navigation.replace("SignIn")
        await auth().signOut()
        dispatch(  handleAuth({
            "token": null,
            "uid": null,
            "name": null,
            "email": null,
            "provider": null,
            "type": null,
            "status": null,
            "_id": null,
            "url":null,
            "authenticated": false,
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
                }
            }}
        >
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Profile" component={PrivateStack} />
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Following" component={FollowingScreen} />
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Followers" component={FollowerScreen} />
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Settings" component={SettingScreen} />
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Edit Profile" component={EditProfileScreen} />
            <Drawer.Screen listeners={()=>{
                handleLogout()
            }} name="Logout" component={()=>null} />

        </Drawer.Navigator>
    );
};

export default memo(DrawerStack);
