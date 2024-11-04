import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  Alert,
  Image,
  Linking,
} from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import arrow from './../../../assets/images/arrow.png';
import {useNavigation} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import CustomConfirmModal from '../../components/CustomConfirmModal/CustomConfirmModal';
import auth from '@react-native-firebase/auth';
import useAxios from '../../../Axios/useAxios';
import {handleAuth} from '../../Redux/userReducer';
import YesNoModal from '../../components/YesNoModal/YesNoModal';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal';
import {handleStats} from '../../Redux/userStats';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
const SettingScreen = () => {
  const navigation = useNavigation();
  const [showBlockModal, setShowBlockmodal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setLogoutModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const axiosInstance = useAxios();
  const [showAlertModal, setShowAlertModal] = useState({
    open: false,
    message: '',
    severity: true,
  });

  const dispatch = useDispatch();

  const handleLogout = async () => {
    await auth().signOut();
    await GoogleSignin.revokeAccess(); // Revoke access
    await GoogleSignin.signOut();
    dispatch(
      handleStats({
        followers: null,
        followings: null,
        checkins: null,
        uri: null,
        name: null,
        date: null,
        reviewsCount: null,
      }),
    );
    dispatch(
      handleAuth({
        token: null,
        uid: null,
        name: null,
        email: null,
        provider: null,
        type: null,
        status: null,
        _id: null,
        url: null,
        authenticated: false,
        welcome: false,
      }),
    );
    navigation.replace('SignIn');
  };

  const handleConfirmModal = setModal => {
    setModal(prev => !prev);
  };

  const handleBlock = () => {
    navigation.navigate('BlockedUsersList');
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setIsEnabled(false);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowDeleteModal(false);
    } catch {
      console.log(error);
      Alert.alert(error.message || error.toString());
    } finally {
      setLoading(false);
      setIsEnabled(true);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axiosInstance.delete('/delete-user');
      if (res.data.success) {
        handleLogout();
      } else {
        setShowAlertModal({
          open: true,
          message: 'Failed to delete account.',
          severity: false,
        });
      }
    } catch (error) {
      setShowAlertModal({
        open: true,
        message: error.message,
        severity: false,
      });
    }
  };

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
            showMenu={true}
            cb={() => navigation.goBack()}
            showProfilePic={false}
            showDescription={false}
            title="Settings"
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
                Icon={() => <Image source={arrow} />}
                showIcon={true}
                buttonTextStyle={{fontSize: scale(14)}}
                buttonstyle={{
                  width: '100%',
                  borderColor: '#FFA100',
                  backgroundColor: '#2e210a',
                  padding: 15,
                  display: 'flex',
                  gap: 10,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => navigation.navigate('Edit Profile')}
                title={'Edit Profile'}
              />
              <CustomButtom
                Icon={() => <Image source={arrow} />}
                showIcon={true}
                buttonTextStyle={{fontSize: scale(14)}}
                buttonstyle={{
                  width: '100%',
                  borderColor: '#FFA100',
                  backgroundColor: '#2e210a',
                  padding: 15,
                  display: 'flex',
                  gap: 10,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() =>
                  Linking.openURL(
                    'https://www.saucedapp.com/terms-and-conditions',
                  )
                }
                title={'Help & Support'}
              />

              <CustomButtom
                Icon={() => <Image source={arrow} />}
                showIcon={true}
                buttonTextStyle={{fontSize: scale(14)}}
                buttonstyle={{
                  width: '100%',
                  borderColor: '#FFA100',
                  backgroundColor: '#2e210a',
                  padding: 15,
                  display: 'flex',
                  gap: 10,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() =>
                  Linking.openURL('https://www.saucedapp.com/privacy-policy')
                }
                title={'Privacy Policy'}
              />
                <CustomButtom
                            Icon={() => <Image source={arrow} />}
                            showIcon={true}
                            buttonTextStyle={{fontSize: scale(14)}}
                            buttonstyle={{
                            width: '100%',
                            borderColor: '#FFA100',
                            backgroundColor: '#2e210a',
                            padding: 15,
                            display: 'flex',
                            gap: 10,
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            }}
                            onPress={() => {
                            // handleConfirmModal(setShowDeleteModal);
                            navigation.navigate('BlockedUsersList');
                            }}
                            title={'Blocked Users'}
                        />

              <CustomButtom
                Icon={() => <Image source={arrow} />}
                showIcon={true}
                buttonTextStyle={{fontSize: scale(14)}}
                buttonstyle={{
                  width: '100%',
                  borderColor: '#FFA100',
                  backgroundColor: '#2e210a',
                  padding: 15,
                  display: 'flex',
                  gap: 10,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => {
                  handleConfirmModal(setShowDeleteModal);
                }}
                title={'Delete Account'}
              />

              <CustomButtom
                Icon={() => <Image source={arrow} />}
                showIcon={true}
                buttonTextStyle={{fontSize: scale(14)}}
                buttonstyle={{
                  width: '100%',
                  borderColor: '#FFA100',
                  backgroundColor: '#2e210a',
                  padding: 15,
                  display: 'flex',
                  gap: 10,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => {
                  handleConfirmModal(setLogoutModal);
                }}
                title={'Log Out'}
              />
            </View>
          </View>
          <YesNoModal
            showCancel={true}
            modalVisible={showDeleteModal || showLogoutModal}
            setModalVisible={() => {
              handleConfirmModal(
                showDeleteModal ? setShowDeleteModal : setLogoutModal,
              );
            }}
            success={false}
            title={
              showDeleteModal
                ? 'Are you sure you want to delete your account?'
                : 'Are you sure you want to logout?'
            }
            isQuestion={true}
            cb={showDeleteModal ? handleDeleteAccount : handleLogout}
          />
          <CustomConfirmModal
            isEnabled={isEnabled}
            loading={loading}
            title={'Block Account?'}
            modalVisible={showBlockModal}
            setModalVisible={setShowBlockmodal}
            cb={handleBlock}
          />

          <CustomAlertModal
            modalVisible={showAlertModal.open}
            setModalVisible={() => {
              setShowAlertModal({
                open: false,
                message: '',
                severity: true,
              });
            }}
            success={false}
            title={'Failed to Delete Acount'}
            cb={() => {}}
            buttonText={''}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SettingScreen;
