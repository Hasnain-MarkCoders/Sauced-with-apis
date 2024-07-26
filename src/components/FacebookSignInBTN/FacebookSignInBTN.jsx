import { Alert, Image, TouchableOpacity } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import {
//     GoogleSignin,
//     isErrorWithCode,
//     statusCodes,
//   } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import google from "./../../../assets/images/google-icon.png"
import { handleAuth } from '../../../android/app/Redux/userReducer';
import { useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import useAxios from '../../../Axios/useAxios';

const FacebookSignInBTN = ({
    onPress = () => {},
    buttonstyle={},
    imageStyle={},
    url=google
}) => {
    const dispatch = useDispatch()
  const axiosInstance = useAxios()

    // const [user, setUser] = useState(null);
    
    // useEffect(() => {
    //          GoogleSignin.configure();
    // }, []);

    // const signIn = async () => {
    //     try {
    //         await GoogleSignin.hasPlayServices()

    //     const userInfo = await GoogleSignin.signIn();
    //     console.log('User Info --> ', userInfo);
          
    //       if(userInfo){
    //         Alert.alert("user mil gya")
    //       }else {
    //         Alert.alert("user ni mila")
    //       }
    //       console.log(userInfo)
    //       dispatch(handleAuth(
    //      {   ...userInfo,
    //         authenticated:true}
    //       ))
    //       setUser({ userInfo, error: undefined });
    //     } catch (error) {
    //       if (isErrorWithCode(error)) {
    //         switch (error.code) {
    //           case statusCodes.SIGN_IN_CANCELLED:
    //             // user cancelled the login flow
    //             console.log(" user cancelled the login flow",error)
    //             break;
    //           case statusCodes.IN_PROGRESS:
    //             // operation (eg. sign in) already in progress
    //             console.log(" operation (eg. sign in) already in progress",error)

    //             break;
    //           case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
    //             // play services not available or outdated
    //             console.log("play services not available or outdated",error)

    //             break;
    //           default:
    //           // some other error happened
    //           console.log("some other error happened",error)

    //         }
    //       } else {
    //         // an error that's not related to google sign in occurred
    //       }
    //     }
    //   };

    async function onFacebookButtonPress() {
        // Attempt login with permissions
        try{
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
            if (result.isCancelled) {
              throw 'User cancelled the login process';
            }
          
            // Once signed in, get the users AccessToken
            const data = await AccessToken.getCurrentAccessToken();
          
            if (!data) {
              throw 'Something went wrong obtaining access token';
            }
          
            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
          
            // Sign-in the user with the credential
            const userCredential = await auth().signInWithCredential(facebookCredential);
            const firebaseIdToken = await userCredential.user.getIdToken();
            const myuser = await axiosInstance.post("/auth/firebase-authentication", { accessToken: firebaseIdToken });
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
       
      }
    
    return (
        <TouchableOpacity
    onPress={onFacebookButtonPress}
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
        ...imageStyle
      }}/>
  </TouchableOpacity>
    );
};

export default FacebookSignInBTN;
