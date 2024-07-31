import { View, Image, Text, Vibration } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Home/Home';
import homeIcon from "./../../../assets/images/homeIcon.png";
import Awards from '../Awards/Awards';
import awardicon from "./../../../assets/images/awardicon.png";
import profileicon from "./../../../assets/images/profileicon.png";
import ProfileScreen from '../Profile/Profile';
import QRScreen from '../QRScreen/QRScreen';
import qrImage from "./../../../assets/images/qr_transparent.png";
import search from "./../../../assets/images/search.png";
import { scale } from 'react-native-size-matters';
import SearchScreen from '../SearchScreen/SearchScreen';
import { memo } from 'react';
const Tab = createBottomTabNavigator();

const PrivateStack = () => {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#FFA100",
                    position: "absolute",
                    height: 95,
                    elevation: 5,
                    left: 0,
                    right: 0,
                    bottom: 0
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'white',
                tabBarIcon: ({ focused, color, size }) => {
                    let icon;
                    if (route.name === 'Home') {
                        icon = homeIcon;
                    } else if (route.name === 'Search') {
                        icon = search;
                    } else if (route.name === 'QRScan') {
                        icon = qrImage;
                    } else if (route.name === 'Awards') {
                        icon = awardicon;
                    } else if (route.name === 'Main') {
                        icon = profileicon;
                    }

                    return (
                        <>
                     { route.name==="QRScan"?
                     
                     <>
                     <View style={{ gap: 4, alignItems: "center", backgroundColor:'white', padding:scale(25), borderRadius:scale(50) }}>
                            <Image style={{
                                maxWidth: scale(24),
                                resizeMode: 'contain',
                                maxHeight: scale(24),
                                // tintColor: focused ?   'white':'black'  // Set tintColor based on focus
                            }} source={icon} />
                        </View>
                            {/* <Text style={{ fontSize: 12, lineHeight: 18, color: focused ?  'white':'black'  }}> {route.name} </Text> */}
                        </>
                        
                        :
                        <View style={{ gap: 4, alignItems: "center" }}>
                            <Image style={{
                                maxWidth: scale(20),
                                resizeMode: 'contain',
                                maxHeight: scale(20),
                                aspectRatio:"1/1",
                                tintColor: focused ? 'black' : 'white'  // Set tintColor based on focus
                            }} source={icon} />
                            <Text style={{ fontSize: 12, lineHeight: 18, color: focused ? 'black' : 'white' }}> {route.name.toLocaleLowerCase()=="main"?"Profile":route.name} </Text>
                        </View>}
                        </>
                    );
                }
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="QRScan" component={QRScreen} />
            <Tab.Screen name="Awards" component={Awards} />
            <Tab.Screen name="Main" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default memo(PrivateStack);
