import { Alert, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
  } from "@react-native-google-signin/google-signin";
import google from "./../../../assets/images/google-icon.png"
import { useDispatch } from 'react-redux';
import { handleAuth } from '../../../android/app/Redux/userReducer';
import auth from '@react-native-firebase/auth';
import useAxios from '../../../Axios/useAxios';

const GoogleSignInBTN = ({
    onPress = () => {},
    buttonstyle={},
    imageStyle={},
    url=google
}) => {
  const axiosInstance = useAxios()
    const dispatch = useDispatch()
    const [isEnabled, setIsEnabled] = useState(true);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
             GoogleSignin.configure({
              scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'], // what API you want to access on behalf of the user, default is email and profile
              webClientId: '406307069293-kgffko9vq29heap8t2pmvrih1qbea6bi.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
              offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
              hostedDomain: '', // specifies a hosted domain restriction
              loginHint: '', // specifies an email address or subdomain that will be pre-filled in the login hint field
              forceCodeForRefreshToken: true, // [Android] if you want to force code for refresh token
              accountName: '', // [Android] specifies an account name on the device that should be used
            });
    }, []);

    const signIn = async () => {
         try{
          await GoogleSignin.hasPlayServices()
          const { idToken } = await GoogleSignin.signIn();
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);
           const res =   await auth().signInWithCredential(googleCredential)
           const firebaseToken = await res.user.getIdToken();
           const myuser = await axiosInstance.post("/auth/firebase-authentication", { accessToken: firebaseToken });
           if (myuser) {
             dispatch(
               handleAuth({
                 "token": myuser?.data?.user?.token,
                 "uid": myuser?.data?.user?.token,
                 "name": myuser?.data?.user?.name,
                 "email": myuser?.data?.user?.email,
                 "provider": myuser?.data?.user?.provider,
                 "type": myuser?.data?.user?.type,
                 "status": myuser?.data?.user?.status,
                 "_id": myuser?.data?.user?._id,
                 "url":myuser?.data?.user?.image,
                 "authenticated": true,
                 "welcome":myuser?.data?.user?.welcome
               }))
           }
         } catch (error) {
      // Handle specific errors
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('That email address is invalid!');
      } else {
        console.error(error);
        Alert.alert('An error occurred during login');
      }
    } finally {
      setIsEnabled(true); // Re-enable button or other elements
      setLoading(false)
    }

      };
    return (
        <TouchableOpacity
    onPress={signIn}
    style={{
      alignItems:"center",
      justifyContent:"center",
      padding: 20,
      borderRadius: 50,
      width:40,
      height:40,
      ...buttonstyle
    }}>
      <Image
        source={url}
      style={{
        // minWidth:40,
        // minHeight:40,
        ...imageStyle
      }}/>
  </TouchableOpacity>
    );
};

export default GoogleSignInBTN;
