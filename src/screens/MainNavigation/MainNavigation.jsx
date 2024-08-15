import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import DrawerStack from '../DrawerStack/DrawerStack';
import Welcome from '../Welcome/Welcome';
import home from './../../../assets/images/home.png';
import useAxios from '../../../Axios/useAxios';
import PublicStack from '../PublicStack/PublicStack';
import AllReviewsScreen from '../AllReviewsScreen/AllReviewsScreen';
import QRScreen from '../QRScreen/QRScreen';
import CheckinScreen from '../CheckinScreen/CheckinScreen';
import AddReview from '../AddReview/AddReview';
import ExternalProfileScreen from '../ExternalProfileScreen/ExternalProfileScreen';
import SouceDetails from '../SouceDetails/SouceDetails';
import YoutubeScreen from '../YoutubeScreen/YoutubeScreen';
import EventPage from '../EventPage/EventPage';
import MapScreen from '../MapScreen/MapScreen';
import Product from '../Product/Product';
import RequestASauceScreen from '../RequestASauceScreen/RequestASauceScreen';
import AddEventScreen from '../AddEventScreen/AddEventScreen';
import MyReviewSauces from '../MyReviewSauces/MyReviewSauces';
import AllCheckinsScreen from '../AllCheckinsScreen/AllCheckinsScreen';

const Stack = createNativeStackNavigator();
import axios from 'axios';
const MainNavigation = () => {
    const axiosInstance = useAxios()
    const auth = useSelector(state=>state.auth)
    const [initialState, setInitialState] = React.useState(true)
    const [isWelcome, setIsWelcome] = useState(false)
    useEffect(()=>{
        (async()=>{
            try{
                const response = await axios.get("https://aws.markcoders.com/sauced-backend/api/welcome", {
                    headers:{
                        "Authorization":`Bearer ${auth.token}`
                    }
                })
                setIsWelcome(response?.data?.welcome)
                setInitialState(false)
                console.log(isWelcome)
            }catch(error){
                console.log(error)
            }
        })()
     },[isWelcome, auth])
    const handleWelcome =async()=>{
      try{
        setInitialState(true)
        const response = await axiosInstance.post("/welcome")
        console.log(response?.data?.welcome)
         setIsWelcome(response?.data?.welcome)
        setInitialState(false)
      }catch(error){
        console.log(error)
      }
    }


    if (initialState || !auth.authenticated) {
        return <ImageBackground style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }} source={home}>
            <ActivityIndicator color="#FFA100" size="large" />
        </ImageBackground>
    }
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
            <>
            {
            isWelcome
            ?
            <Stack.Screen initialParams={{ handleWelcome: handleWelcome }} name="Welcome" component={Welcome} />
            :
            <Stack.Screen name="Drawer" component={DrawerStack} />
            }
            </>

        </Stack.Navigator>
    )
}

export default MainNavigation

const styles = StyleSheet.create({})