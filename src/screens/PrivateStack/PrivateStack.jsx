import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Home/Home';
import homeIcon from './../../../assets/images/homeIcon.png';
import Awards from '../Awards/Awards';
import awardicon from './../../../assets/images/awardicon.png';
import profileicon from './../../../assets/images/profileicon.png';
import ProfileScreen from '../Profile/Profile';
import camera from './../../../assets/images/camera.png';
import search from './../../../assets/images/search.png';
import {scale} from 'react-native-size-matters';
import SearchScreen from '../SearchScreen/SearchScreen';
import {memo, useState} from 'react';
import CameraScreen from '../CameraScreen/CameraScreen';
import {useNavigation} from '@react-navigation/native';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import YesNoModal from '../../components/YesNoModal/YesNoModal';
const Tab = createBottomTabNavigator();

const PrivateStack = () => {
  const [yesNoModal, setYesNoModal] = useState({
    open: false,
    message: '',
    severity: 'success',
    cb: () => {},
    isQuestion: false,
  });
  const navigation = useNavigation();

  const handleNavigateToCameraScreen = () => {
    navigation.navigate('QRScan');
  };

  const handleCameraPermission = () => {
    const cameraPermission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    check(cameraPermission)
      .then(result => {
        if (result === RESULTS.GRANTED) {
          handleNavigateToCameraScreen(); // Proceed to camera screen
        } else if (result === RESULTS.DENIED) {
          setYesNoModal({
            open: true,
            message:
              'Camera Permission Required. Would you like to grant permission?',
            success: true,
            isQuestion: true,

            cb: () => {
              request(cameraPermission).then(result => {
                if (result === RESULTS.GRANTED) {
                  handleNavigateToCameraScreen();
                } else {
                  Alert.alert(
                    'Camera Permission Blocked',
                    'Please enable Camera permission in your device settings to use this feature.',
                    [
                      {text: 'Cancel', style: 'cancel'},
                      {
                        text: 'Open Settings',
                        onPress: () => Linking.openSettings(),
                      },
                    ],
                  );
                }
              });
            },
          });
        } else if (result === RESULTS.BLOCKED) {
          Alert.alert(
            'Camera Permission Blocked',
            'Please enable Camera permission in your device settings to use this feature.',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Open Settings', onPress: () => Linking.openSettings()},
            ],
          );
        }
      })
      .catch(error => {
        console.warn('Error checking camera permission:', error);
        setAlertModal({
          open: true,
          message: `An error occurred while checking camera permission. Please try again.`,
          success: false,
        });
      });
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFA100',
            position: 'absolute',
            paddingVertical: scale(10),
            minHeight: scale(100),
            elevation: 5,
            left: 0,
            right: 0,
            bottom: 0,
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'white',
          tabBarIcon: ({focused, color, size}) => {
            let icon;
            if (route.name === 'Home') {
              icon = homeIcon;
            } else if (route.name === 'Search') {
              icon = search;
            } else if (route.name === 'QRScan') {
              icon = camera;
            } else if (route.name === 'Awards') {
              icon = awardicon;
            } else if (route.name === 'Main') {
              icon = profileicon;
            }

            return (
              <>
                {route.name === 'QRScan' ? (
                  <>
                    <TouchableOpacity
                      onPress={handleCameraPermission}
                      style={{
                        gap: 4,
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: scale(25),
                        borderRadius: scale(50),
                      }}>
                      <Image
                        style={{
                          resizeMode: 'contain',
                        }}
                        source={icon}
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <View
                    style={{
                      gap: scale(4),
                      minWidth: scale(40),
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        maxWidth: scale(20),
                        resizeMode: 'contain',
                        maxHeight: scale(20),
                        aspectRatio: '1/1',
                        tintColor: focused ? 'black' : 'white', // Set tintColor based on focus
                      }}
                      source={icon}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 18,
                        color: focused ? 'black' : 'white',
                      }}>
                      {' '}
                      {route.name.toLocaleLowerCase() == 'main'
                        ? 'Profile'
                        : route.name == 'Awards'
                        ? 'Badges'
                        : route.name}{' '}
                    </Text>
                  </View>
                )}
              </>
            );
          },
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          options={{
            tabBarStyle: {display: 'none'}, // Hide the tab bar on QRScan screen
          }}
          name="QRScan"
          component={CameraScreen}
        />
        <Tab.Screen name="Awards" component={Awards} />
        <Tab.Screen name="Main" component={ProfileScreen} />
      </Tab.Navigator>
      <YesNoModal
        isQuestion={yesNoModal.isQuestion}
        modalVisible={yesNoModal.open}
        setModalVisible={() => {
          setYesNoModal({
            open: false,
            messsage: '',
            severity: true,
          });
        }}
        success={yesNoModal.severity}
        title={yesNoModal.message}
        cb={yesNoModal.cb}
      />
    </>
  );
};

export default memo(PrivateStack);
