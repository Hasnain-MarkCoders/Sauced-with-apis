import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Vibration,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import CustomInput from '../../components/CustomInput/CustomInput';
import {handleText, validateEmail} from '../../../utils';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import google from './../../../assets/images/google-icon.png';
import apple from './../../../assets/images/apple-icon.png';

import fb from './../../../assets/images/facebook-icon.png';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
// import { handleAuth } from '../../../android/app/Redux/userReducer';
import auth, {firebase} from '@react-native-firebase/auth';
import useAxios from '../../../Axios/useAxios';
import {scale} from 'react-native-size-matters';
import scaledOpenEye from './../../../assets/images/scaledOpenEye.png';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal';
import messaging from '@react-native-firebase/messaging';
import ModalWithInput from '../../components/ModalWithInput/ModalWithInput';
import {handleAuth} from '../../Redux/userReducer';
import {appleAuth} from '@invertase/react-native-apple-authentication';

const SignIn = () => {
  const dispatch = useDispatch();
  // const [alertModal, setAlertModal] =useState(false)
  const [alertModal, setAlertModal] = useState({
    open: false,
    message: '',
    success: true,
  });

  const [message, setMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();
  const navigation = useNavigation();
  const [ForgetPasswordModal, setForgotPasswordModal] = useState({
    open: false,
    loading: false,
    success: false,
    message: '',
    cb: function () {},
  });
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  // const handleForgetPassword = async()=>{
  //     console.log("forgetPasswordEmail.email=============>", forgetPasswordEmail)

  //   // try{
  //   //   console.log("forgetPasswordEmail.email=============>", forgetPasswordEmail)
  //   //   if(!forgetPasswordEmail.email){
  //   //     setAlertModal({
  //   //       open: true,
  //   //       message: "Email address can not be empty",
  //   //       success:false

  //   //   });
  //   //   setForgetPasswordEmail({email:""})

  //   //   return
  //   //   }
  //   //   if(!validateEmail(forgetPasswordEmail.email)){
  //   //    setForgotPasswordModal(prev=>({...prev,open:false }))
  //   //      setAlertModal({
  //   //       open: true,
  //   //       message: "Please enter a valid email address!",
  //   //       success:false

  //   //   });
  //   //   setForgetPasswordEmail({email:""})

  //   //   return
  //   //   }
  //   //  await auth().sendPasswordResetEmail(forgetPasswordEmail.email)
  //   //   setAlertModal({
  //   //     open: true,
  //   //     message: "Please check your email",
  //   //     success:true

  //   // });
  //   // setForgetPasswordEmail({email:""})

  //   // }catch(error){
  //   //   console.log(error)
  //   //   setForgotPasswordModal(prev=>({...prev,open:false }))

  //   //   setAlertModal({
  //   //     open: true,
  //   //     message: error?.message,
  //   //     success:false

  //   // });
  //   // setForgetPasswordEmail({email:""})

  //   // }finally{
  //   //   setForgotPasswordModal({open:false})
  //   // }

  // }

  const handleForgetPassword = async (email, setEmail) => {
    console.log('forgetPasswordEmail=============>', email);

    try {
      // Input validation
      if (!email) {
        setAlertModal({
          open: true,
          message: 'Email address cannot be empty',
          success: false,
        });
        return;
      }

      if (!validateEmail(email)) {
        setForgotPasswordModal(prev => ({...prev, open: false}));
        setAlertModal({
          open: true,
          message: 'Please enter a valid email address!',
          success: false,
        });
        return;
      }

      // Send password reset email
      await auth().sendPasswordResetEmail(email);
      setAlertModal({
        open: true,
        message: 'Please check your email for password reset instructions.',
        success: true,
      });
    } catch (error) {
      console.log(error);
      setForgotPasswordModal(prev => ({...prev, open: false}));
      setAlertModal({
        open: true,
        message:
          error?.message || 'An error occurred while resetting the password.',
        success: false,
      });
    } finally {
      setForgotPasswordModal({open: false});
      setEmail({email: ''});
    }
  };

  const updateTokenOnServer = async (authToken, newFcmToken) => {
    try {
      const resposne = await axiosInstance.post(
        '/update-token',
        {notificationToken: newFcmToken},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      console.log('Token updated on the server successfully.', resposne.data);
    } catch (error) {
      console.error('Failed to update token on server:', error);
    }
  };

  const getInitialFcmToken = async authToken => {
    const fcmToken = await messaging().getToken();
    console.log('Initial FCM Token:', fcmToken);
    await updateTokenOnServer(authToken, fcmToken); // Update token to your backend
  };

  const handleLogin = async () => {
    try {
      // Input validation
      if (!data.email) {
        setAlertModal({
          open: true,
          message: 'Email is required!',
          success: false,
        });
        return;
      }

      if (!validateEmail(data.email)) {
        setAlertModal({
          open: true,
          message: 'Please use valid email address!',
          success: false,
        });
        return;
      }
      if (!data.password) {
        setAlertModal({
          open: true,
          message: 'Password is required!',
          success: false,
        });
        return;
      }

      if (data.password.length < 6) {
        setAlertModal({
          open: true,
          message: 'Password at least 6 characters',
          success: false,
        });
        return;
      }
      setIsEnabled(false); // Disable login button or other elements
      setLoading(true);
      setAuthLoading(true);
      // Firebase authentication
      const userCredential = await auth().signInWithEmailAndPassword(
        data.email,
        data.password,
      );
      const user = userCredential.user;

      if (user) {
        const token = await user?.getIdToken();

        // Your API authentication

        const myuser = await axiosInstance.post(
          '/auth/firebase-authentication',
          {accessToken: token},
        );
        await getInitialFcmToken(myuser?.data?.user?.token);
        if (myuser) {
          dispatch(
            handleAuth({
              token: myuser?.data?.user?.token,
              uid: myuser?.data?.user?.token,
              name: myuser?.data?.user?.name,
              email: myuser?.data?.user?.email,
              provider: myuser?.data?.user?.provider,
              type: myuser?.data?.user?.type,
              status: myuser?.data?.user?.status,
              _id: myuser?.data?.user?._id,
              url: myuser?.data?.user?.image,
              authenticated: true,
              welcome: myuser?.data?.user?.welcome,
            }),
          );
        } else {
          console.log('No user found');

          setAlertModal({
            open: true,
            message: 'No user found on Firebase',
            success: false,
          });
          setAuthLoading(false);
        }
        setAuthLoading(false);

        // Optional: Update state or handle user authentication details
      } else {
        console.log('No user found');
        setAlertModal({
          open: true,
          message: 'No user found on Firebase',
          success: false,
        });
        setAuthLoading(false);
      }
    } catch (error) {
      // Handle specific errors
      setAuthLoading(false);

      if (error.code === 'auth/email-already-in-use') {
        setAlertModal({
          open: true,
          message: 'That email address is already in use!',
          success: false,
        });
      } else if (error.code === 'auth/invalid-email') {
        setAlertModal({
          open: true,
          message: 'That email address is invalid!',
          success: false,
        });
      } else {
        console.error(error);
        setAlertModal({
          open: true,
          message: 'Invalid credentials',
          success: false,
        });
      }
    } finally {
      setIsEnabled(true); // Re-enable button or other elements
      setLoading(false);
      setAuthLoading(false);
    }
  };

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    try {
      setAuthLoading(true);

      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        setAlertModal({
          open: true,
          message: 'User cancelled the login process',
          success: false,
        });
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccessToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        setAlertModal({
          open: true,
          message: 'Something went wrong obtaining access token',
          success: false,
        });
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(
        facebookCredential,
      );
      const firebaseIdToken = await userCredential.user.getIdToken();
      console.log('firebaseIdToken=================>', firebaseIdToken);
      const myuser = await axiosInstance.post('/auth/firebase-authentication', {
        accessToken: firebaseIdToken,
      });
      if (myuser) {
        await getInitialFcmToken(myuser?.data?.user?.token);

        dispatch(
          handleAuth({
            token: myuser?.data?.user?.token,
            uid: myuser?.data?.user?.token,
            name: myuser?.data?.user?.name,
            email: myuser?.data?.user?.email,
            provider: myuser?.data?.user?.provider,
            type: myuser?.data?.user?.type,
            status: myuser?.data?.user?.status,
            _id: myuser?.data?.user?._id,
            url: myuser?.data?.user?.image,
            authenticated: true,
            welcome: myuser?.data?.user?.welcome,
          }),
        );
      }
      setAuthLoading(true);
    } catch (error) {
      // Handle specific errors
      setAuthLoading(false);

      if (error.code === 'auth/email-already-in-use') {
        setAlertModal({
          open: true,
          message: 'That email address is already in use!',
          success: false,
        });
      } else if (error.code === 'auth/invalid-email') {
        setAlertModal({
          open: true,
          message: 'That email address is invalid!',
          success: false,
        });
      } else {
        console.error(error);
        setAlertModal({
          open: true,
          message: error?.message,
          success: false,
        });
      }
    } finally {
      setIsEnabled(true); // Re-enable button or other elements
      setLoading(false);
      setAuthLoading(false);
    }



  }

  const signInWithGoogle = async () => {
    try {
      setAuthLoading(true);

      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn({
        prompt: 'select_account',
      });
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const res = await auth().signInWithCredential(googleCredential);
      const firebaseToken = await res.user.getIdToken();
      const myuser = await axiosInstance.post('/auth/firebase-authentication', {
        accessToken: firebaseToken,
      });
      console.log(
        'myuser=================================================================>',
        myuser,
      );
      if (myuser) {
        await getInitialFcmToken(myuser?.data?.user?.token);

        dispatch(
          handleAuth({
            token: myuser?.data?.user?.token,
            uid: myuser?.data?.user?.token,
            name: myuser?.data?.user?.name,
            email: myuser?.data?.user?.email,
            provider: myuser?.data?.user?.provider,
            type: myuser?.data?.user?.type,
            status: myuser?.data?.user?.status,
            _id: myuser?.data?.user?._id,
            url: myuser?.data?.user?.image,
            authenticated: true,
            welcome: myuser?.data?.user?.welcome,
          }),
        );
      }
      setAuthLoading(false);
    } catch (error) {
      setAuthLoading(false);

      // Handle specific errors
      if (error.code === 'auth/email-already-in-use') {
        setAlertModal({
          open: true,
          message: 'That email address is already in use!',
          success: false,
        });
        setAuthLoading(false);
      } else if (error.code === 'auth/invalid-email') {
        setAlertModal({
          open: true,
          message: 'That email address is invalid!',
          success: false,
        });
        setAuthLoading(false);
      } else {
        console.error(error);
        setAlertModal({
          open: true,
          message: error?.message,
          success: false,
        });
        setAuthLoading(false);
      }
    } finally {
      setIsEnabled(true); // Re-enable button or other elements
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigation.goBack();
    // console.log("hello from hasnain")
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '406307069293-kgffko9vq29heap8t2pmvrih1qbea6bi.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // specifies an email address or subdomain that will be pre-filled in the login hint field
      forceCodeForRefreshToken: true, // [Android] if you want to force code for refresh token
      accountName: '', // [Android] specifies an account name on the device that should be used,
    });
  }, []);

  async function onAppleButtonPress() {
    // console.log("hello g")
    //   try{
    // // Start the sign-in request
    // const appleAuthRequestResponse = await appleAuth.performRequest({
    //   requestedOperation: appleAuth.Operation.LOGIN,
    //   // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
    //   // See: https://github.com/invertase/react-native-apple-authentication#faqs
    //   requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    // });
    // console.log("appleAuthRequestResponse==============>", appleAuthRequestResponse)
    // // Ensure Apple returned a user identityToken
    // if (!appleAuthRequestResponse.identityToken) {
    //   throw new Error('Apple Sign-In failed - no identify token returned');
    // }
    // // Create a Firebase credential from the response
    // const { identityToken, nonce } = appleAuthRequestResponse;
    // const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
    // console.log("identityToken============>", identityToken)
    // // Sign the user in with the credential
    // return auth().signInWithCredential(appleCredential);
    //   }catch(err){
    // console.log(err)
    //   }finally{
    //   }
  }

  if (authLoading) {
    return (
      <ImageBackground
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
        source={home}>
        <ActivityIndicator color="#FFA100" size="large" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      style={{flex: 1, width: '100%', height: '100%'}}
      source={home}>
      <SafeAreaView style={{flex: 1}}>

          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1, gap: scale(14)}}>
            <Header
              showMenu={false}
              showProfilePic={false}
              cb={() => {
                navigateToSignUp();
                Vibration.vibrate(10);
              }}
              title="Sign in"
              description="Sign in with your data that you entered during registration."
            />

            <View
              style={{
                gap: scale(40),
                paddingHorizontal: scale(20),
                paddingVertical: scale(10),
              }}>
              <View
                style={{
                  gap: scale(10),
                  flex: 1,
                }}>
                <CustomInput
                  isWhiteInput={true}
                  onChange={handleText}
                  updaterFn={setData}
                  value={data.email}
                  title="Email"
                  name="email"
                  inputStyle={{
                    paddingVertical: scale(10),
                  }}
                />
                <View
                  style={{
                    gap: scale(10),
                  }}>
                  <CustomInput
                    isWhiteInput={true}
                    imageStyles={{
                      top: '50%',
                      left: '90%',
                      transform: [{translateY: -0.5 * scale(20)}],
                      width: scale(25),
                      height: scale(16),
                    }}
                    isURL={false}
                    showImage={true}
                    uri={scaledOpenEye}
                    onChange={handleText}
                    updaterFn={setData}
                    value={data.password}
                    title="Password"
                    name="password"
                    secureTextEntry={true}
                    inputStyle={{
                      paddingVertical: scale(10),
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      marginLeft: 'auto',
                    }}
                    onPress={() => {
                      // setShowForgotPasswordModal(true)
                      setForgotPasswordModal({
                        open: true,
                        loading: false,
                        success: false,
                        message: 'PLease enter your email address',
                        cb: handleForgetPassword,
                      });
                      //   setAlertModal(true)
                      // Alert.alert("hello")
                      // setMessage('Feature Coming Soon.')
                    }}>
                    <Text
                      style={{
                        color: '#C1C1C1',
                        fontSize: scale(12),
                        lineHeight: scale(25),
                        textAlign: 'right',
                      }}>
                      Forgot Password
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{alignItems: 'center', gap: scale(10)}}>
                <CustomButtom
                  loading={loading}
                  buttonTextStyle={{fontSize: scale(14)}}
                  buttonstyle={{
                    width: '100%',
                    borderColor: '#FFA100',
                    padding: 15,
                    backgroundColor: '#2E210A',
                  }}
                  onPress={() =>
                    isEnabled ? (handleLogin(), Vibration.vibrate(10)) : null
                  }
                  //  onPress={()=>{navigation.reset({index:0,routes:[{name:"Drawer"}]});  Vibration.vibrate(10)}}

                  title={'Sign In'}
                />

                <Text
                  style={{
                    color: '#FFA100',
                    fontSize: scale(20),
                    lineHeight: scale(30),
                    fontWeight: 500,
                    marginVertical: scale(15),
                  }}>
                  OR
                </Text>
                <View
                  style={{
                    width: '100%',
                    gap: scale(20),
                  }}>
                  {Platform.OS == 'ios' && (
                    <CustomButtom
                      showIcon={true}
                      Icon={() => (
                        <Image
                          style={{width: 24, height: 24, objectFit: 'contain'}}
                          source={apple}
                        />
                      )}
                      buttonTextStyle={{fontSize: scale(14)}}
                      buttonstyle={{
                        width: '100%',
                        borderColor: '#FFA100',
                        padding: 15,
                        backgroundColor: '#2E210A',
                        justifyContent: 'start',
                        display: 'flex',
                        gap: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        onAppleButtonPress();
                        Vibration.vibrate(10);
                      }}
                      //  onPress={()=>{navigation.reset({index:0,routes:[{name:"Drawer"}]});  Vibration.vibrate(10)}}

                      title={'Sign In With Apple'}
                    />
                  )}

                  <CustomButtom
                    showIcon={true}
                    Icon={() => (
                      <Image style={{width: 24, height: 24}} source={google} />
                    )}
                    buttonTextStyle={{fontSize: scale(14)}}
                    buttonstyle={{
                      width: '100%',
                      borderColor: '#FFA100',
                      padding: 15,
                      backgroundColor: '#2E210A',
                      justifyContent: 'start',
                      display: 'flex',
                      gap: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      signInWithGoogle();
                      Vibration.vibrate(10);
                    }}
                    //  onPress={()=>{navigation.reset({index:0,routes:[{name:"Drawer"}]});  Vibration.vibrate(10)}}

                    title={'Sign In With Google'}
                  />
                  <CustomButtom
                    showIcon={true}
                    Icon={() => (
                      <Image style={{width: 24, height: 24}} source={fb} />
                    )}
                    buttonTextStyle={{fontSize: scale(14)}}
                    buttonstyle={{
                      width: '100%',
                      borderColor: '#FFA100',
                      padding: 15,
                      backgroundColor: '#2E210A',
                      justifyContent: 'start',
                      display: 'flex',
                      gap: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      onFacebookButtonPress();
                      Vibration.vibrate(10);
                    }}
                    //  onPress={()=>{navigation.reset({index:0,routes:[{name:"Drawer"}]});  Vibration.vibrate(10)}}

                    title={'Sign In With Facebook'}
                  />
                </View>
                <View style={{flexDirection: 'row', marginTop: scale(20)}}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: scale(14),
                      lineHeight: 18,
                    }}>
                    Don't have an account?{' '}
                  </Text>
                  <TouchableOpacity
                    //  onPress={() => {navigateToSignUp(),  Vibration.vibrate(10)}}
                    onPress={() => {
                      navigation.navigate('SignUp'), Vibration.vibrate(10);
                    }}
                    style={{verticalAlign: 'middle'}}>
                    <Text
                      style={{
                        color: '#FFA100',
                        fontSize: scale(14),
                        lineHeight: 18,
                        marginTop: scale(0),
                        paddingHorizontal: scale(3),
                      }}>
                      Register
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

        <ModalWithInput
          setInput={setForgetPasswordEmail}
          setModalVisible={setForgotPasswordModal}
          modalVisible={ForgetPasswordModal.open}
          success={ForgetPasswordModal.success}
          title={ForgetPasswordModal.message}
          cb={ForgetPasswordModal.cb}
          input={forgetPasswordEmail}
          loading={ForgetPasswordModal.loading}
          placeholder="Email"
        />

        <CustomAlertModal
          title={alertModal?.message}
          modalVisible={alertModal?.open}
          success={alertModal?.success}
          setModalVisible={() => setAlertModal(false)}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignIn;
