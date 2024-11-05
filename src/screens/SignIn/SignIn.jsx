import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import CustomInput from '../../components/CustomInput/CustomInput';
import {handleText, validateEmail} from '../../../utils';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import google from './../../../assets/images/google-icon.png';
import apple from './../../../assets/images/apple-icon.png';
import {v4 as uuidv4} from 'uuid';
import fb from './../../../assets/images/facebook-icon.png';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import auth, {firebase} from '@react-native-firebase/auth';
import useAxios from '../../../Axios/useAxios';
import {scale} from 'react-native-size-matters';
import scaledOpenEye from './../../../assets/images/scaledOpenEye.png';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  AccessToken,
  LoginManager,
  AuthenticationToken,
} from 'react-native-fbsdk-next';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal';
import messaging from '@react-native-firebase/messaging';
import ModalWithInput from '../../components/ModalWithInput/ModalWithInput';
import {handleAuth} from '../../Redux/userReducer';
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import {handleStats} from '../../Redux/userStats';

const SignIn = () => {
  const dispatch = useDispatch();
  const [alertModal, setAlertModal] = useState({
    open: false,
    message: '',
    success: true,
  });

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
  const handleForgetPassword = async (email, setEmail) => {

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
  };

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    try {
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
        ]);
        token = await AccessToken.getCurrentAccessToken();
      }

      if (result.isCancelled) {
        return;
        throw 'User cancelled the login process';
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
          setAlertModal({
            open: true,
            message: 'Facebook Login Failed.',
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
    } catch (error) {
      setAuthLoading(false);

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
      setAuthLoading(false);
    } catch (error) {
      setAuthLoading(false);
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
  };

  const navigateToSignUp = () => {
    navigation.goBack();
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
    try {
      setAuthLoading(true);

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

      setAuthLoading(false);
    } catch (error) {
      setAuthLoading(false);
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
                    setForgotPasswordModal({
                      open: true,
                      loading: false,
                      success: false,
                      message: 'Pease enter your email address',
                      cb: handleForgetPassword,
                    });
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
                  isEnabled ? (handleLogin())
                  : null
                }
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
                    }}

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
                  }}
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
                  }}
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
                  onPress={() => {
                    navigation.navigate('SignUp')
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
