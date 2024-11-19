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
import {handleText, strongPasswordRegex, validateEmail} from '../../../utils';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import google from './../../../assets/images/google-icon.png';
import apple from './../../../assets/images/apple-icon.png';
import fb from './../../../assets/images/facebook-icon.png';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {v4 as uuidv4} from 'uuid';

import useAxios from '../../../Axios/useAxios';
import {scale} from 'react-native-size-matters';
import {
  LoginManager,
  AccessToken,
  AuthenticationToken,
} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import scaledOpenEye from './../../../assets/images/scaledOpenEye.png';
import messaging from '@react-native-firebase/messaging';

import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal';
import {handleAuth} from '../../Redux/userReducer';
// import appleAuth from '@invertase/react-native-apple-authentication';
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import {handleStats} from '../../Redux/userStats';

// Get screen dimensions

const SignUp = () => {
  const dispatch = useDispatch();
  const axiosInstance = useAxios();
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [isStrongPassword, setIsStrongPassword] = useState(true);
  const navigation = useNavigation();
  const [passwordFeedback, setPasswordFeedback] = useState([]);

  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  


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

  const [data, setData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  // const [alertModal, setAlertModal] =useState(false)
  const [alertModal, setAlertModal] = useState({
    open: false,
    message: '',
    success: true,
  });
  const handleSignUp = async () => {
    if (!data.fullName) {
      setIsEnabled(true); // Re-enable the button

      setAlertModal({
        open: true,
        message: 'Full Name is required!',
        success: false,
      });
      return;
    }
    if (!data.email) {
      setIsEnabled(true); // Re-enable the button
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
      setIsEnabled(true); // Re-enable the button
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

    if (data.password && !strongPasswordRegex.test(data.password)) {
      setAlertModal({
        open: true,
        message:
          'Your password must be at least 8 characters long and include uppercase and lowercase letters, a number, and one special character from @$!%*?&',
        success: false,
      });
      setIsStrongPassword(false);
      return;
    }
    setIsEnabled(false); // Disable the button at the start
    setLoading(true);
    setAuthLoading(true);

    try {
      // Create user with email and password
      const userCredentials = await auth().createUserWithEmailAndPassword(
        data.email,
        data.password,
      );
      const user = userCredentials.user;

      // Update the user profile
      if (user) {
        await user.updateProfile({displayName: data.fullName});
        // Fetch the token
        const token = await user.getIdToken();

        // API call for additional authentication or user setup
        const myuser = await axiosInstance.post(
          '/auth/firebase-authentication',
          {accessToken: token, name: data?.fullName},
        );
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
      } else {
        console.log('No user found');

        setAlertModal({
          open: true,
          message: 'No user found',
          success: false,
        });
      }
    } catch (error) {
      setAuthLoading(false);
      setAlertModal({
        open: true,
        message: error.userInfo.message,
        success: false,
      });
    } finally {
      setIsEnabled(true); // Re-enable the button regardless of outcome
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const navigateToSignIn = () => {
    navigation.goBack();
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
        ],{
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
          setAlertModal({
            open: true,
            message: 'Facebook Sign up Failed.',
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
  }

  const signInWithGoogle = async () => {
    setAuthLoading(true);

    try {
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

  const evaluatePasswordStrength = password => {
    const feedback = [];
    let strength = '';

    const lengthCriteria = password.length >= 8;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[@$!%*?&]/.test(password);

    const passedCriteria = [
      lengthCriteria,
      uppercaseCriteria,
      lowercaseCriteria,
      numberCriteria,
      specialCharCriteria,
    ].filter(Boolean).length;

    // Determine strength level
    if (passedCriteria <= 1) {
      strength = 'Very Weak';
    } else if (passedCriteria === 2) {
      strength = 'Weak';
    } else if (passedCriteria === 3) {
      strength = 'Medium';
    } else if (passedCriteria >= 4) {
      strength = 'Strong';
    }

    // Provide feedback on missing criteria
    if (!lengthCriteria) {
      feedback.push('At least 8 characters');
    }
    if (!uppercaseCriteria) {
      feedback.push('An uppercase letter');
    }
    if (!lowercaseCriteria) {
      feedback.push('A lowercase letter');
    }
    if (!numberCriteria) {
      feedback.push('A number');
    }
    if (!specialCharCriteria) {
      feedback.push('A special character (@$!%*?&)');
    }

    return {strength, feedback};
  };

  const handleInputChange = (name, value) => {
    setData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'password') {
      setShowPasswordStrength(value.length > 0);
      const {strength, feedback} = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
      setPasswordFeedback(feedback);
    }
  };

  
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
          showsVerticalScrollIndicator={false}>
          <Header
            showMenu={false}
            showProfilePic={false}
            cb={() => {
              navigateToSignIn();
            }}
            title="Sign up"
            description="Sign up with one of the following."
          />
          <View
            style={{
              paddingHorizontal: scale(20),
              flex: 1,
              justifyContent: 'space-between',
              paddingVertical: scale(30),
              gap: 40,
            }}>
            <View style={{gap: scale(20), marginBottom: scale(40)}}>
              <CustomInput
                isWhiteInput={true}
                onChange={handleText}
                updaterFn={setData}
                value={data.fullName}
                title="Full Name"
                name="fullName"
                inputStyle={{
                  paddingVertical: scale(15),
                }}
              />
              <CustomInput
                isWhiteInput={true}
                onChange={handleText}
                updaterFn={setData}
                value={data.email}
                title="Email"
                name="email"
                inputStyle={{
                  paddingVertical: scale(15),
                }}
              />
              <View
                style={{
                  gap: scale(10),
                }}>
                <CustomInput
                handleInputChange={handleInputChange}
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
                    paddingVertical: scale(15),
                  }}
                />
                {/* <Text
                  style={{
                    color: '#C1C1C1',
                    fontSize: scale(12),
                    lineHeight: scale(25),
                  }}>
                  {isStrongPassword ? '' : 'Please create a strong password'}
                </Text> */}
                        {showPasswordStrength && (
                  <View>
                    <Text
                      style={{
                        color: '#C1C1C1',
                        fontSize: scale(12),
                        lineHeight: scale(20),
                      }}>
                      Password Strength: {passwordStrength}
                    </Text>
                    {passwordFeedback.length > 0 && (
                      <Text
                        style={{
                          color: '#C1C1C1',
                          fontSize: scale(12),
                          lineHeight: scale(20),
                        }}>
                        Add{' '}
                        {passwordFeedback
                          .map((item, index) => {
                            if (index === passwordFeedback.length - 1) {
                              return item;
                            } else {
                              return item + ', ';
                            }
                          })
                          .join('')}
                        {' to make it stronger.'}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
            <View style={{alignItems: 'center', gap: 20}}>
              <CustomButtom
                loading={loading}
                buttonTextStyle={{fontSize: scale(14)}}
                buttonstyle={{
                  width: '100%',
                  borderColor: '#FFA100',
                  padding: scale(15),
                  backgroundColor: '#2E210A',
                }}
                onPress={() =>
                  isEnabled ? (handleSignUp() ) : null
                }
                title={'Sign Up'}
              />
              <Text
                style={{
                  color: '#FFA100',
                  fontSize: scale(25),
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
                    title={'Sign Up With Apple'}
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
                  title={'Sign Up With Google'}
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
                  title={'Sign Up With Facebook'}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: scale(20),
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: 'white', fontSize: scale(14), lineHeight: 18}}>
                  Already Have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SignIn')
                  }}>
                  <Text
                    style={{
                      color: '#FFA100',
                      fontSize: scale(14),
                      marginTop: scale(0),
                      lineHeight: 18,
                      paddingHorizontal: scale(4),
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
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

export default SignUp;
