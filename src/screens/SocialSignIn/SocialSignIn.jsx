import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import google from './../../../assets/images/google-icon.png';
import fb from './../../../assets/images/facebook-icon.png';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {scale} from 'react-native-size-matters';
import envelope from './../../../assets/images/envelope.png';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import useAxios from '../../../Axios/useAxios';
import {
  LoginManager,
  AccessToken,
  AuthenticationToken,
} from 'react-native-fbsdk-next';
import {getFriendlyErrorMessage} from './../../../utils';
import {v4 as uuidv4} from 'uuid';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal';
import messaging from '@react-native-firebase/messaging';
import {handleAuth} from '../../Redux/userReducer';
import apple from './../../../assets/images/apple-icon.png';
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import {handleStats} from '../../Redux/userStats';

const SocialSignIn = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    console.log(data);
  }, [data]);
  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const [authLoading, setAuthLoading] = useState(false);

  const axiosInstance = useAxios();

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
  const dispatch = useDispatch();
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({
    open: false,
    message: '',
    success: true,
  });
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

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn({
        prompt: 'select_account',
        loginHint: '',
      });
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const res = await auth().signInWithCredential(googleCredential);
      const firebaseToken = await res.user.getIdToken();
      const myuser = await axiosInstance.post('/auth/firebase-authentication', {
        accessToken: firebaseToken,
      });

      if (myuser) {
        await getInitialFcmToken(myuser?.data?.user?.token);
        dispatch(
          handleStats({
            followers: myuser?.data?.user?.followers,
            followings: myuser?.data?.user?.following,
            checkins: myuser?.data?.user?.checkinsCount,
            uri: myuser?.data?.user?.image,
            name: myuser?.data?.user?.name,
            date: myuser?.data?.user?.createdAt,
            reviewsCount: myuser?.data?.user?.reviewsCount,
          }),
        );
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
    } catch (error) {
      // Handle specific errors
      const friendlyMessage = getFriendlyErrorMessage(error);
      if (friendlyMessage) {
        // Only show if it's not null
        setAlertModal({
          open: true,
          message: friendlyMessage,
          success: false,
        });
      }
    } finally {
      setIsEnabled(true); // Re-enable button or other elements
      setLoading(false);
    }
  };

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    try {
      setIsEnabled(false); // Re-enable button or other elements
      setLoading(true);
      setAuthLoading(true);

      let result;
      let token;
      let data;
      let nonce;
      if (Platform.OS === 'ios') {
        // Generate a unique nonce for this login request
        nonce = uuidv4();

        // Use 'limited' for Limited Login and provide the generated nonce
        result = await LoginManager.logInWithPermissions(
          ['public_profile', 'email'],
          'limited', // loginTrackingIOS
          nonce, // nonceIOS
        );
        token = await AuthenticationToken.getAuthenticationTokenIOS();
      } else {
        // For Android, use the standard login
        result = await LoginManager.logInWithPermissions([
          'public_profile',
          'email',
        ], {
          loginBehaviorAndroid: 'web_only', // Force login via web
        });
        token = await AccessToken.getCurrentAccessToken();
      }

      if (result.isCancelled) {
        return;
      }

      data =
        Platform.OS == 'ios'
          ? {
              token,
              platform: 'ios',
              nonce,
            }
          : {
              token,
              platform: 'android',
            };
      const myuser = await axiosInstance.post('/auth/fb-auth', data);
      if (myuser) {
        const firebaseUserCredential = await auth().signInWithCustomToken(
          myuser?.data?.user?.firebaseCustomToken,
        );
        const firebaseUser = firebaseUserCredential.user; // Optionally, get the Firebase ID tokenconst
        let firebaseIdToken = await firebaseUser.getIdToken();
        if (!firebaseIdToken) {
          setAuthLoading(false);
          setIsEnabled(true); // Re-enable button or other elements
          setLoading(false);
          setAlertModal({
            open: true,
            message: 'Facebook Sign in Failed.',
            success: false,
          });
          return;
        }
        await getInitialFcmToken(myuser?.data?.user?.token);
        dispatch(
          handleStats({
            followers: myuser?.data?.user?.followers,
            followings: myuser?.data?.user?.following,
            checkins: myuser?.data?.user?.checkinsCount,
            uri: myuser?.data?.user?.image,
            name: myuser?.data?.user?.name,
            date: myuser?.data?.user?.createdAt,
            reviewsCount: myuser?.data?.user?.reviewsCount,
          }),
        );
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
      setIsEnabled(true); // Re-enable button or other elements
      setLoading(false);
    } catch (error) {
      // Handle specific errors
      setAuthLoading(false);
      setIsEnabled(true); // Re-enable button or other elements
      setLoading(false);
      setAlertModal({
        open: true,
        message: error.userInfo.message,
        success: false,
      });
    } finally {
      setIsEnabled(true); // Re-enable button or other elements
      setLoading(false);
      setAuthLoading(false);
    }
  }
  async function onAppleButtonPress() {
    // console.log("hello g")
    try {
      setLoading(true);

      // Perform Apple authentication request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      // Extract identityToken, nonce, and fullName
      const {identityToken, nonce, fullName} = appleAuthRequestResponse;

      // Check if identityToken is present
      if (!identityToken) {
        setAlertModal({
          open: true,
          message: 'Apple Sign-In failed - no identity token returned',
          success: false,
        });
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      // Create a Firebase credential from the response
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // Sign in with Firebase
      const userCredential = await auth().signInWithCredential(appleCredential);

      // Check if the user is new
      const isNewUser = userCredential.additionalUserInfo.isNewUser;

      // Initialize userName
      let userName = '';

      // If the user is new and fullName is available, extract the name
      if (isNewUser && fullName) {
        const {givenName, familyName} = fullName;
        userName = `${givenName || ''} ${familyName || ''}`.trim();

        // Update the user's display name in Firebase
        await userCredential.user.updateProfile({
          displayName: userName,
        });
      } else {
        // Use the displayName from Firebase if available
        userName = userCredential.user.displayName || '';
      }

      // Get the Firebase ID token
      const firebaseIdToken = await userCredential.user.getIdToken();

      // Send the Firebase ID token and userName to your backend
      const myuser = await axiosInstance.post('/auth/firebase-authentication', {
        accessToken: firebaseIdToken,
        name: userName, // Include the user's name
      });

      if (myuser) {
        await getInitialFcmToken(myuser?.data?.user?.token);
        dispatch(
          handleStats({
            followers: myuser?.data?.user?.followers,
            followings: myuser?.data?.user?.following,
            checkins: myuser?.data?.user?.checkinsCount,
            uri: myuser?.data?.user?.image,
            name: myuser?.data?.user?.name,
            date: myuser?.data?.user?.createdAt,
            reviewsCount: myuser?.data?.user?.reviewsCount,
          }),
        );
        dispatch(
          handleAuth({
            token: myuser?.data?.user?.token,
            uid: myuser?.data?.user?.token,
            name: myuser?.data?.user?.name || userName, // Use the name from response or the one we have
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

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAlertModal({
        open: true,
        message: error.userInfo.message,
        success: false,
      });
    } finally {
      setIsEnabled(true); // Re-enable button or other elements
      setLoading(false);
    }
  }

  if (loading || authLoading) {
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
          style={{flex: 1}}>
          <Header
            showMenu={false}
            showProfilePic={false}
            cb={() => {
              navigation.goBack();
            }}
            title="Sign in"
            description="Sign in with your data that you entered during registration."
          />
          <View
            style={{
              paddingHorizontal: 20,
              flex: 1,
              justifyContent: 'space-between',
              paddingVertical: 40,
              paddingBottom: 100,
              gap: scale(10),
            }}>
            <View style={{alignItems: 'center', gap: 20}}>
              <CustomButtom
                loading={loading}
                Icon={() => (
                  <Image style={{width: 28, height: 20}} source={envelope} />
                )}
                showIcon={true}
                buttonTextStyle={{fontSize: scale(14)}}
                buttonstyle={{
                  width: '100%',
                  borderColor: '#FFA100',
                  padding: 15,
                  backgroundColor: '#2E210A',
                  display: 'flex',
                  gap: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  navigation.navigate('SignIn');
                }}
                title={'Sign In With Email'}
              />

              {Platform.OS == 'ios' && (
                <CustomButtom
                  loading={loading}
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
                  }}
                  title={'Sign In With Apple'}
                />
              )}

              <CustomButtom
                loading={loading}
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
                }}
                title={'Sign In With Google'}
              />
              <CustomButtom
                loading={loading}
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
                }}
                title={'Sign In With Facebook'}
              />
              <Text
                style={{
                  color: '#FFA100',
                  fontSize: scale(25),
                  lineHeight: scale(30),
                  fontWeight: 500,
                  marginVertical: scale(40),
                }}>
                OR
              </Text>
              <CustomButtom
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
                  navigation.navigate('SignUp');
                }}
                title={'Sign Up'}
              />
            </View>
          </View>
          <CustomAlertModal
            title={alertModal?.message}
            modalVisible={alertModal?.open}
            success={alertModal?.success}
            setModalVisible={() => setAlertModal(false)}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SocialSignIn;
