import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import FollowerScreen from '../FollowerScreen/FollowerScreen';
import FollowingScreen from '../FollowingScreen/FollowingScreen';
import SettingScreen from '../SettingScreen/SettingScreen';
import EditProfileScreen from '../EditProfileScreen/EditProfileScreen';
import PrivateStack from '../PrivateStack/PrivateStack';
import { useNavigation } from '@react-navigation/native';
// import { handleAuth } from '../../../android/app/Redux/userReducer';
// import { persistor, store } from '../../../android/app/Redux/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import home from './../../../assets/images/home.png';
import NotificationsScreen from '../NotificationsScreen/NotificationsScreen';
import YesNoModal from '../../components/YesNoModal/YesNoModal';
import { scale } from 'react-native-size-matters';
import { handleAuth } from '../../Redux/userReducer';
import { persistor, store } from '../../Redux/store';
import { handleStats } from '../../Redux/userStats';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const DrawerStack = () => {

    let count = useSelector(state=>state.notifications)
    const [showModal, setShowModal] = useState(false)
    const drawerLabelStyles = {
      fontFamily: 'Montserrat', // Replace with your desired font family
      fontSize: scale(12),                 // Replace with your desired font size
      fontWeight: '700',            // Replace with your desired font weight
  };

    const CustomDrawerContent = ({ setShowModal, ...props }) => {
      // const count = useSelector(state => state.notifications.count);

      return (
          <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
              <DrawerItemList {...props} />
              {/* Add a separator or any custom styling if needed */}
              <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  style={styles.logoutButton}
              >
                  <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
          </DrawerContentScrollView>
      );
  };
    count = count.count

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const logScreenNameOnFocus = ({ route }) => ({
        focus: () => {
            Vibration.vibrate(10)
        },
    });
    const handleLogout = async () => {
try {



  setShowModal(false)

  store.dispatch({ type: 'LOGOUT' });
  // Clear persisted state
  await persistor.purge();
  persistor.purge()
    // Google Sign-Out
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log('Successfully signed out from Google');
    } catch (error) {
      console.error('Error signing out from Google: ', error);
    }

    // Facebook Sign-Out
    try {
      LoginManager.logOut();
      console.log('Successfully logged out from Facebook');
    } catch (error) {
      console.error('Error logging out from Facebook: ', error);
    }

    // Apple Sign-Out
    // Apple Sign-In does not have a specific sign-out method
    // Since we are signing out from Firebase, this will suffice
    console.log('Signing out from Apple (handled by Firebase sign-out)');

    // Firebase Sign-Out
    try {
      await auth().signOut();
      console.log('Successfully signed out from Firebase');
    } catch (error) {
      console.error('Error signing out from Firebase: ', error);
    }


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
  dispatch(handleStats({
    followers:null,
    followings:null,
    checkins:null,
    uri:null,
    name:null,
    date:null,
    reviewsCount:null
}))
navigation.navigate("Public")


} catch (error) {

}




    }




    return (
<>
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
                drawerLabelStyle: drawerLabelStyles,
              }}
              drawerContent={(props) => <CustomDrawerContent {...props} setShowModal={setShowModal} />}
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
                    <Text style={{ color,  fontFamily: 'Montserrat', // Replace with your desired font family
      fontSize: scale(12),                 // Replace with your desired font size
      fontWeight: '700',     }}>Notifications</Text>
                    {count > 0 && (
                      <View
                        style={{
                          backgroundColor: 'red',
                          borderRadius: 10,
                          marginLeft: -3,
                          marginTop:-13,
                          width: scale(15),
                          height: scale(15),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: 'white'  , fontFamily: 'Montserrat', // Replace with your desired font family
      fontSize: scale(7),                 // Replace with your desired font size
      fontWeight: '700',     }}>{count}</Text>
                      </View>
                    )}
                  </View>
                ),
              }}
            />




            {/* <Drawer.Screen listeners={() => {
                // handleLogout()
                setShowModal(true)
            }} name="Log Out" component={() => <ImageBackground style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }} source={home}>
                <ActivityIndicator color="#FFA100" size="large" />
            </ImageBackground>} /> */}

        </Drawer.Navigator>
       <YesNoModal
                cb={handleLogout}
                title="Are you sure you want to logout?"
                success={false}
                setModalVisible={setShowModal}
                modalVisible={showModal}
            />
</>



    );
};
const styles = StyleSheet.create({
  logoutButton: {
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
},
logoutText: {
  fontFamily: 'Montserrat', // Replace with your desired font family
  fontSize: scale(12),                 // Replace with your desired font size
  fontWeight: '700',
  color:"white"
},
})
export default memo(DrawerStack);
