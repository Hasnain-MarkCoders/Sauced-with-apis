import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions, ScrollView, Alert, Image, Vibration, ActivityIndicator } from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import CustomInput from '../../components/CustomInput/CustomInput';
import { handleText } from '../../../utils';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import google from "./../../../assets/images/google-icon.png";
import apple from "./../../../assets/images/apple-icon.png";
import fb from "./../../../assets/images/facebook-icon.png";
import IconButton from '../../components/IconButton/IconButton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { handleAuth } from '../../../android/app/Redux/userReducer';
import useAxios from '../../../Axios/useAxios';
import GoogleSignInBTN from '../../components/GoogleSignInBTN/GoogleSignInBTN';
import FacebookSignInBTN from '../../components/FacebookSignInBTN/FacebookSignInBTN';
import { scale } from 'react-native-size-matters';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import openEye from "./../../../assets/images/openEye.png"
import scaledOpenEye from "./../../../assets/images/scaledOpenEye.png"
import messaging from '@react-native-firebase/messaging';

import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal';
// Get screen dimensions

const SignUp = () => {
  const dispatch = useDispatch()
  const axiosInstance = useAxios()
  const [message, setMessage] = useState("")
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false)
  const [authLoading , setAuthLoading]= useState(false)
  const navigation = useNavigation()







  const updateTokenOnServer = async (authToken,newFcmToken) => {
    try {
      const resposne = await axiosInstance.post("/update-token", { notificationToken: newFcmToken }, {
        headers:{
          "Authorization":`Bearer ${authToken}`
        }
      });
      console.log('Token updated on the server successfully.', resposne.data);
    } catch (error) {
      console.error('Failed to update token on server:', error);
    }
  };


  const getInitialFcmToken = async (authToken) => {
    const fcmToken = await messaging().getToken();
    console.log('Initial FCM Token:', fcmToken);
    await updateTokenOnServer(authToken, fcmToken); // Update token to your backend
  };



  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  // const [alertModal, setAlertModal] =useState(false)
  const [alertModal, setAlertModal] = useState({
    open: false,
    message: "",
    success:true
})
  const handleSignUp = async () => {
    if (!data.fullName) {
      setIsEnabled(true); // Re-enable the button



      setAlertModal({
        open: true,
        message: "Full Name is required!",
        success:false
    
    })
      return 
    }
    if (!data.email) {
      setIsEnabled(true); // Re-enable the button
      setAlertModal({
        open: true,
        message: "Email is required!",
        success:false
    
    })
      return
    }
    if (!data.password) {
      setIsEnabled(true); // Re-enable the button
      setAlertModal({
        open: true,
        message: "Password is required!",
        success:false
    
    })
      return 
    }
    setIsEnabled(false); // Disable the button at the start
    setLoading(true)
    setAuthLoading(true)

    try {
      // Create user with email and password
      const userCredentials = await auth().createUserWithEmailAndPassword(data.email, data.password);
      const user = userCredentials.user;

      // Update the user profile
      if (user) {
        await user.updateProfile({ displayName: data.fullName });
        console.log('Display Name updated successfully!');

        // Fetch the token
        const token = await user.getIdToken();

        // API call for additional authentication or user setup
        const myuser = await axiosInstance.post("/auth/firebase-authentication", { accessToken: token , name:data?.fullName});
        console.log("<==myuserhnm==>", myuser)
        console.log("<==firebasetokenhnm==>",token )
        if (myuser) {
          await getInitialFcmToken(myuser?.data?.user?.token)

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
        setAuthLoading(false)
     
      } else {
        console.log('No user found');

        setAlertModal({
          open: true,
          message: "No user found",
          success:false
      
      })
     
      }
    } catch (error) {
 setAuthLoading(false)

      console.error(error);
      setAuthLoading(false)

      if (error.code === 'auth/email-already-in-use') {
        setAlertModal({
          open: true,
          message: "That email address is already in use!",
          success:false

      });
      } else if (error.code === 'auth/invalid-email') {
        setAlertModal({
          open: true,
          message: "That email address is invalid!",
          success:false

      });
      } else {
        console.error(error);
        setAlertModal({
          open: true,
          message: "An error occurred during login",
          success:false

      });
      }
    } finally {
      setIsEnabled(true); // Re-enable the button regardless of outcome
      setLoading(false)
      setAuthLoading(false)

    }
  };


  const navigateToSignIn = () => {
    navigation.goBack()
  }
  useEffect(() => {
    console.log(data)
  }, [data])



  async function onFacebookButtonPress() {
    // Attempt login with permissions
     setAuthLoading(true)

    try{
  
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
        if (result.isCancelled) {
          setAlertModal({
            open: true,
            message: "User cancelled the login process",
            success:false
  
        });
          throw 'User cancelled the login process';
        }
      
        // Once signed in, get the users AccessToken
        const data = await AccessToken.getCurrentAccessToken();
      
        if (!data) {
          setAlertModal({
            open: true,
            message: "Something went wrong obtaining access token",
            success:false
  
        });
          throw 'Something went wrong obtaining access token';
        }
      
        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      
        // Sign-in the user with the credential
        const userCredential = await auth().signInWithCredential(facebookCredential);
        const firebaseIdToken = await userCredential.user.getIdToken();
        const myuser = await axiosInstance.post("/auth/firebase-authentication", { accessToken: firebaseIdToken });
        if (myuser) {

          await getInitialFcmToken(myuser?.data?.user?.token)

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
      setAuthLoading(false)

      } catch (error) {

   // Handle specific errors
   setAuthLoading(false)

   if (error.code === 'auth/email-already-in-use') {
     setAlertModal({
       open: true,
       message: "That email address is already in use!",
       success:false

   });
   } else if (error.code === 'auth/invalid-email') {
     setAlertModal({
       open: true,
       message: "That email address is invalid!",
       success:false

   });
   } else {
     console.error(error);
     setAlertModal({
       open: true,
       message: "An error occurred during login",
       success:false

   });
   }
 } finally {
   setIsEnabled(true); // Re-enable button or other elements
   setLoading(false)
   setAuthLoading(false)

 }
   
  }


  const signInWithGoogle = async () => {
 setAuthLoading(true)

    try{
     await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true})
     const { idToken } = await GoogleSignin.signIn();
     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const res =   await auth().signInWithCredential(googleCredential)
      const firebaseToken = await res.user.getIdToken();
      console.log("firebaseToken============================>", firebaseToken)
      const myuser = await axiosInstance.post("/auth/firebase-authentication", { accessToken: firebaseToken });
      if (myuser) {
        await getInitialFcmToken(myuser?.data?.user?.token)

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
      setAuthLoading(false)

    } catch (error) {
      setAuthLoading(false)

      if (error.code === 'auth/email-already-in-use') {
        setAlertModal({
          open: true,
          message: "That email address is already in use!",
          success:false

      });
      } else if (error.code === 'auth/invalid-email') {
        setAlertModal({
          open: true,
          message: "That email address is invalid!",
          success:false

      });
      } else {
        console.error(error);
        setAlertModal({
          open: true,
          message: "An error occurred during login",
          success:false

      });
      }
} finally {
 setIsEnabled(true); // Re-enable button or other elements
 setLoading(false)
 setAuthLoading(false)
}

 };
 useEffect(() => {
  GoogleSignin.configure({
   scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'], // what API you want to access on behalf of the user, default is email and profile
   webClientId: '406307069293-kgffko9vq29heap8t2pmvrih1qbea6bi.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
   hostedDomain: '', // specifies a hosted domain restriction
   loginHint: '', // specifies an email address or subdomain that will be pre-filled in the login hint field
   forceCodeForRefreshToken: true, // [Android] if you want to force code for refresh token
   accountName: '', // [Android] specifies an account name on the device that should be used,
   
 });
}, []);


if(authLoading){
  return  <ImageBackground style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }} source={home}>
  <ActivityIndicator  color="#FFA100" size="large" />
</ImageBackground>
}
  return (
    <ImageBackground style={{ flex: 1, width: '100%', height: '100%', }} source={home}>
      <SafeAreaView style={{ flex: 1}}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
         >
          <Header showMenu={false} showProfilePic={false} cb={()=>{navigateToSignIn(); Vibration.vibrate(10)}} title="Sign up" description="Sign up with one of the following." />
          <View style={{ paddingHorizontal: scale(20), flex: 1, justifyContent: "space-between", paddingVertical:scale(30), gap: 40 }}>
            <View style={{ gap: scale(20), marginBottom:scale(40) }}>
              <CustomInput
                onChange={handleText}
                updaterFn={setData}
                value={data.fullName}
                title="Full Name"
                name="fullName"
              />
              <CustomInput
                onChange={handleText}
                updaterFn={setData}
                value={data.email}
                title="Email"
                name="email"
              />
              <View style={{
                gap:scale(10)
              }}>
              <CustomInput
                imageStyles={{top:"50%", left:"90%", transform: [{ translateY: -0.5 * scale(20) }], width:scale(25), height:scale(16)}}
                isURL={false}
                showImage={true}
                uri={scaledOpenEye}
                onChange={handleText}
                updaterFn={setData}
                value={data.password}
                title="Password"
                name="password"
                secureTextEntry={true}
              />

              <TouchableOpacity 
              onPress={()=>{
                setAlertModal(true)
                setMessage("Feature Coming Soon.")}
              }
              >
              <Text style={{
                color:"#C1C1C1",
                fontSize:scale(12),
                lineHeight:scale(25),
              }}>Please create a strong password</Text>
              </TouchableOpacity>
              </View>
            </View>
            <View style={{ alignItems: "center", gap: 20 }}>
              <CustomButtom
              loading={loading}
                buttonTextStyle={{ fontSize: scale(14) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: scale(15), backgroundColor: "#2E210A" }}
                onPress={() => isEnabled ? (handleSignUp(), Vibration.vibrate(10)) : null}
                    //  onPress={()=>{navigation.reset({index:0,routes:[{name:"Drawer"}]});  Vibration.vibrate(10)}}
                    // onPress={()=>{navigation.reset({index:0,routes:[{name:"Welcome"}]});  Vibration.vibrate(10)}}


                title={"Sign Up"}
              />
                <Text style={{
              color:"#FFA100",
              fontSize:scale(25),
              lineHeight:scale(30),
              fontWeight:500,
              marginVertical:scale(15)
            }}>
              OR
            </Text>
            <View style={{
             width:"100%",
             gap:scale(20)
            }}>

<CustomButtom
                showIcon={true}
                Icon={()=><Image style={{width:24, height:24}}  source={google} />}
                buttonTextStyle={{ fontSize: scale(14) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, backgroundColor: "#2E210A",justifyContent:"start",  display:"flex", gap:10, flexDirection:"row", alignItems:"center", justifyContent:"center" }}
                onPress={()=>{signInWithGoogle(); Vibration.vibrate(10)}}
                    //  onPress={()=>{navigation.reset({index:0,routes:[{name:"Drawer"}]});  Vibration.vibrate(10)}}
                    // onPress={()=>{navigation.reset({index:0,routes:[{name:"Welcome"}]});  Vibration.vibrate(10)}}


                title={"Sign Up With Google"}
              />
            <CustomButtom
                showIcon={true}
                Icon={()=><Image style={{width:24, height:24}}  source={fb} />}
                buttonTextStyle={{ fontSize: scale(14) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, backgroundColor: "#2E210A" ,justifyContent:"start",  display:"flex", gap:10, flexDirection:"row", alignItems:"center", justifyContent:"center"}}
                onPress={()=>{onFacebookButtonPress(); Vibration.vibrate(10)}}
                    //  onPress={()=>{navigation.reset({index:0,routes:[{name:"Drawer"}]});  Vibration.vibrate(10)}}
                    //  onPress={()=>{navigation.reset({index:0,routes:[{name:"Welcome"}]});  Vibration.vibrate(10)}}


                title={"Sign Up With Facebook"}
              />
            </View>
              <View style={{ flexDirection: "row", marginTop:scale(20), alignItems:"center" }}>
                <Text style={{ color: "white", fontSize: scale(14), lineHeight: 18 }}>Already Have an account? </Text>
                <TouchableOpacity 
                
                onPress={() => {navigation.navigate("SignIn"), Vibration.vibrate(10)}} >
                  <Text style={{ color: "#FFA100", fontSize: scale(14), marginTop:scale(0),lineHeight: 18 , paddingHorizontal:scale(4)}}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <CustomAlertModal
          title={alertModal?.message}
          modalVisible={alertModal?.open}
          success={alertModal?.success}
          setModalVisible={()=>setAlertModal(false)}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default SignUp;
