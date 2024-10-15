import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, ImageBackground, ScrollView,  Image, Vibration, ActivityIndicator } from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import google from "./../../../assets/images/google-icon.png";
import fb from "./../../../assets/images/facebook-icon.png";
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
// import { handleAuth } from '../../../android/app/Redux/userReducer';
import { scale } from 'react-native-size-matters';
import envelope from "./../../../assets/images/envelope.png";
import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";
import auth from '@react-native-firebase/auth';
import useAxios from '../../../Axios/useAxios';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal';
import messaging from '@react-native-firebase/messaging';
import { handleAuth } from '../../Redux/userReducer';



const SocialSignIn = () => {
    
  const navigation = useNavigation()
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    console.log(data)
  }, [data])
  const navigateToSignUp = () => {
    navigation.navigate('SignUp')
  }


  const axiosInstance = useAxios()

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
    const dispatch = useDispatch()
    const [isEnabled, setIsEnabled] = useState(true);
    const [loading, setLoading] = useState(false)
    // const [alertModal, setAlertModal] =useState(false)
    const [alertModal, setAlertModal] = useState({
      open: false,
      message: "",
      success:true
  })
    const [message, setMessage] = useState("")
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

    const signInWithGoogle = async () => {
      setLoading(true)
         try{
          await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true})
          const { idToken } = await GoogleSignin.signIn(
            {
              prompt: 'select_account',
              loginHint: '',
            }
          );
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);
           const res =   await auth().signInWithCredential(googleCredential)
           const firebaseToken = await res.user.getIdToken();
           const myuser = await axiosInstance.post("/auth/firebase-authentication", { accessToken: firebaseToken });
          //  console.log("firebaseToken==>", firebaseToken)
          //  console.log("myuser google==>", myuser.data.user)
          
          if (myuser) {
            await  getInitialFcmToken(myuser?.data?.user?.token)
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
          message: error?.message,
          success:false

      });
      }
    } finally {
      setIsEnabled(true); // Re-enable button or other elements
      setLoading(false)
    }

      };


      async function onFacebookButtonPress() {
      setLoading(true)

        // Attempt login with permissions
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
            console.log("firebaseToken==>", firebaseIdToken)
            console.log("myuser google==>", myuser)
            if (myuser) {
          await  getInitialFcmToken(myuser?.data?.user?.token)

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
       message: error?.message,
       success:false

   });
   }
     } finally {
       setIsEnabled(true);
       setLoading(false)
     }
       
      }


if(loading){
  return  <ImageBackground style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }} source={home}>
  <ActivityIndicator  color="#FFA100" size="large" />
</ImageBackground>
}


  return (
    <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
        
        showsHorizontalScrollIndicator={false} 
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}>
          <Header showMenu={false} showProfilePic={false} cb={()=>{navigation.goBack(); Vibration.vibrate(10)}} title="Sign in" description="Sign in with your data that you entered during registration." />
          <View style={{ paddingHorizontal: 20, flex: 1, justifyContent: "space-between", paddingVertical: 40, paddingBottom: 100, gap: scale(10) }}>

            <View style={{ alignItems: "center", gap: 20 }}>
            <CustomButtom
                Icon={()=><Image style={{width:28, height:20}} source={envelope} />}
                showIcon={true}
                buttonTextStyle={{ fontSize: scale(14) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, backgroundColor: "#2E210A",  display:"flex", gap:10, flexDirection:"row", alignItems:"center", justifyContent:"center"}}
                onPress={()=>{navigation.navigate("SignIn"); Vibration.vibrate(10)}}
                title={"Sign In With Email"}
              />
              <CustomButtom
                showIcon={true}
                Icon={()=><Image style={{width:24, height:24}}  source={google} />}
                buttonTextStyle={{ fontSize: scale(14) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, backgroundColor: "#2E210A",justifyContent:"start",  display:"flex", gap:10, flexDirection:"row", alignItems:"center", justifyContent:"center" }}
                onPress={()=>{signInWithGoogle(); Vibration.vibrate(10)}}
                // onPress={()=>{navigation.reset({index:0,routes:[{name:"Drawer"}]});  Vibration.vibrate(10)}}

                title={"Sign In With Google"}
              />
              <CustomButtom
                showIcon={true}
                Icon={()=><Image style={{width:24, height:24}}  source={fb} />}
                buttonTextStyle={{ fontSize: scale(14) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, backgroundColor: "#2E210A" ,justifyContent:"start",  display:"flex", gap:10, flexDirection:"row", alignItems:"center", justifyContent:"center"}}
                onPress={()=>{onFacebookButtonPress();  Vibration.vibrate(10)}}
                // onPress={()=>{navigation.reset({index:0,routes:[{name:"Drawer"}]});  Vibration.vibrate(10)}}

                title={"Sign In With Facebook"}
              />
            <Text style={{
              color:"#FFA100",
              fontSize:scale(25),
              lineHeight:scale(30),
              fontWeight:500,
              marginVertical:scale(40)
            }}>
              OR
            </Text>
            <CustomButtom
                buttonTextStyle={{ fontSize: scale(14) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, backgroundColor: "#2E210A" ,justifyContent:"start",  display:"flex", gap:10, flexDirection:"row", alignItems:"center", justifyContent:"center"}}
                onPress={()=>{navigation.navigate("SignUp");  Vibration.vibrate(10)}}
                title={"Sign Up"}
              />
          
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
};

export default SocialSignIn;
