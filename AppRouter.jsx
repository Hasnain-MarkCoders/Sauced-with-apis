import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PublicStack from './src/screens/PublicStack/PublicStack';
import { useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerStack from './src/screens/DrawerStack/DrawerStack';
import Product from './src/screens/Product/Product';
import home from './assets/images/home.png';
import CheckinScreen from './src/screens/CheckinScreen/CheckinScreen';
import SouceDetails from './src/screens/SouceDetails/SouceDetails';
import ExternalProfileScreen from './src/screens/ExternalProfileScreen/ExternalProfileScreen';
import AddReview from './src/screens/AddReview/AddReview';
import AllReviewsScreen from './src/screens/AllReviewsScreen/AllReviewsScreen';
import QRScreen from './src/screens/QRScreen/QRScreen';
import AllCheckinsScreen from './src/screens/AllCheckinsScreen/AllCheckinsScreen';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator, ImageBackground, View } from 'react-native';
import BootSplash from "react-native-bootsplash";
import EventPage from './src/screens/EventPage/EventPage';
import MapScreen from './src/screens/MapScreen/MapScreen';
import YoutubeScreen from './src/screens/YoutubeScreen/YoutubeScreen';
import RequestASauceScreen from './src/screens/RequestASauceScreen/RequestASauceScreen';
import AddEventScreen from './src/screens/AddEventScreen/AddEventScreen';
import Welcome from './src/screens/Welcome/Welcome';
import MainNavigation from './src/screens/MainNavigation/MainNavigation';
import BrandScreen from './src/screens/BrandScreen/BrandScreen';
import UserSearchScreen from './src/screens/UserSearchScreen/UserSearchScreen';
import AllUserReviews from './src/screens/AllUserReviews/AllUserReviews';

const Stack = createNativeStackNavigator();
function AppRouter() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [initialState, setInitialState] = React.useState(true)
  const userAuth = useSelector(state => state.auth)
  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user && userAuth?.authenticated) {
        setIsAuthenticated(true)
        setInitialState(false)
      } else {
        setIsAuthenticated(false)
        setInitialState(false)
      }
    });
    return subscriber; // unsubscribe on unmount
  }, [userAuth?.authenticated]);


  // React.useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(user => {
  //     if (user ) {
  //       setIsAuthenticated(true)
  //       setInitialState(false)
  //     } else {
  //       setIsAuthenticated(false)
  //       setInitialState(false)
  //     }
  //   });
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  React.useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, []);


  if (initialState) {
    return <ImageBackground style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }} source={home}>
    <ActivityIndicator color="#FFA100" size="large" />
  </ImageBackground>
  }

  return (
  


    <GestureHandlerRootView>
      <NavigationContainer
        onReady={() => BootSplash.hide({ fade: true })}
      >
        <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
          {
            isAuthenticated ?
              <>
              
              <Stack.Screen name="Map" component={MapScreen} />
              <Stack.Screen name="Main" component={MainNavigation} />

                <Stack.Screen name="Drawer" component={DrawerStack} />
                <Stack.Screen name="AllReviews" component={AllReviewsScreen} />
                <Stack.Screen name="QRScreen" component={QRScreen} />
                <Stack.Screen name="Checkin" component={CheckinScreen} />
                <Stack.Screen name="AddReview" component={AddReview} />
                <Stack.Screen name="ExternalProfileScreen" component={ExternalProfileScreen} />
                <Stack.Screen name="SauceDetails" component={SouceDetails} />
                <Stack.Screen name="Youtube" component={YoutubeScreen} />
                <Stack.Screen name="EventPage" component={EventPage} />
                {/* <Stack.Screen name="Map" component={MapScreen} /> */}
                <Stack.Screen name="ProductDetail" component={Product} />
                <Stack.Screen name="RequestASauceScreen" component={RequestASauceScreen} />
                <Stack.Screen name="AddEventScreen" component={AddEventScreen} />
                <Stack.Screen name="AllUserReviews" component={AllUserReviews} />
                <Stack.Screen name="AllCheckinsScreen" component={AllCheckinsScreen} />
                <Stack.Screen name="BrandScreen" component={BrandScreen} />
                <Stack.Screen name="UserSearchScreen" component={UserSearchScreen} />


                <Stack.Screen name="Welcome" component={Welcome} />
              </>
              :
              <Stack.Screen name="Public" component={PublicStack} />


          }
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>

  );
}

export default React.memo(AppRouter);
