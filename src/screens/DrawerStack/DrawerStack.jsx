import React, { memo } from 'react';
import { Vibration } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FollowerScreen from '../FollowerScreen/FollowerScreen';
import FollowingScreen from '../FollowingScreen/FollowingScreen';
import SettingScreen from '../SettingScreen/SettingScreen';
import EditProfileScreen from '../EditProfileScreen/EditProfileScreen';
import PrivateStack from '../PrivateStack/PrivateStack';
const Drawer = createDrawerNavigator();

const DrawerStack = () => {
    const logScreenNameOnFocus = ({ route }) => ({
        focus: () => {
            Vibration.vibrate(10)
        },
    });

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
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Follower" component={FollowerScreen} />
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Setting" component={SettingScreen} />
            <Drawer.Screen listeners={logScreenNameOnFocus} name="Edit Profile" component={EditProfileScreen} />
        </Drawer.Navigator>
    );
};

export default memo(DrawerStack);
