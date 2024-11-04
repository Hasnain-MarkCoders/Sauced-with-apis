import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header/Header.jsx';
import home from './../../../assets/images/home.png';
import search from './../../../assets/images/search_icon.png';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import HorizontalUsersList from '../../components/HorizontalUsersList/HorizontalUsersList.jsx';
import ProfileCard from '../../components/ProfileCard/ProfileCard.jsx';
import {useDispatch, useSelector} from 'react-redux';
import useAxios from '../../../Axios/useAxios.js';
import FavoriteSaucesList from '../../components/FavoriteSaucesList/FavoriteSaucesList.jsx';
import CheckedInSaucesList from '../../components/CheckedInSaucesList/CheckedInSaucesList.jsx';
import SaucesListOne from '../../components/SaucesListOne/SaucesListOne.jsx';
import SaucesListTwo from '../../components/SaucesListTwo/SaucesListTwo.jsx';
import SaucesListThree from '../../components/SaucesListThree/SaucesListThree.jsx';
import InterestedEventsCarousel from '../../components/InterestedEventsCarousel/InterestedEventsCarousel.jsx';
import WishListSauces from '../../components/WishListSauces/WishListSauces.jsx';
import ReviewedSaucesList from '../../components/ReviewedSaucesList/ReviewedSaucesList.jsx';
import {handleStats} from '../../Redux/userStats.js';
const ProfileScreen = () => {
  const auth = useSelector(state => state.auth);
  const [initialLoading, setInitialLoading] = useState(false);
  const axiosInstance = useAxios();
  const saucesListOne = useSelector(state => state.saucesListOne);
  const saucesListTwo = useSelector(state => state.saucesListTwo);
  const saucesListThree = useSelector(state => state.saucesListThree);
  const [loading, setLoading] = useState(false);
  const [isKeyBoard, setIsKeyBoard] = useState(false);
  const users = useSelector(state => state?.users);
  const userStats = useSelector(state => state?.userStats);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyBoard(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyBoard(false);
    });

    // Cleanup function
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  React.useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/get-user`);
        dispatch(
          handleStats({
            followers: res?.data?.user?.followers,
            followings: res?.data?.user?.following,
            checkins: res?.data?.user?.checkinsCount,
            uri: res?.data?.user?.image,
            name: res?.data?.user?.name,
            date: res?.data?.user?.date,
            reviewsCount: res?.data?.user?.reviewsCount,
          }),
        );
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchUser();

    // Setting up interval for short polling (fetch every 10 seconds, adjust as needed)
    const interval = setInterval(fetchUser, 10000); // 10000 milliseconds = 10 seconds

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setRefresh(prev => !prev);
    });
    return () => {
      navigation.removeListener('focus', () => {
        setRefresh(prev => !prev);
      });
    };
  }, []);

  if (initialLoading) {
    return (
      <ImageBackground
        source={home}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#FFA100" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      style={{flex: 1, width: '100%', height: '100%'}}
      source={home}>
      <SafeAreaView
        style={{flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(90)}}>
        <Header
          showMenu={true}
          cb={() => navigation.goBack()}
          showProfilePic={false}
          headerContainerStyle={{
            paddingBottom: scale(20),
          }}
          showText={false}
        />

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: scale(150),
          }}
          data={[1, 1, 1, 1, 1, 1]}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  paddingHorizontal: scale(20),
                }}>
                {index == 0 && (
                  <View
                    style={{
                      marginBottom: scale(20),
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 600,
                        fontSize: scale(35),
                        lineHeight: scale(50),
                        marginBottom: scale(20),
                      }}>
                      My Profile
                    </Text>
                    <ProfileCard
                      _id={auth?._id}
                      totalCheckIns={userStats?.checkins}
                      totalFollowersCount={userStats?.followers}
                      totalFollowingCount={userStats?.followings}
                      url={userStats?.uri}
                      name={userStats?.name}
                      date={userStats?.date}
                      reviewsCount={userStats?.reviewsCount}
                    />
                  </View>
                )}
                {index == 1 && (
                  <View>
                    <View
                      style={{
                        marginVertical: scale(30),
                      }}>
                      <TouchableOpacity
                        style={{
                          width: '100%',
                        }}
                        onPress={() => {
                          navigation.navigate('UserSearchScreen');
                        }}>
                        <View
                          style={{
                            width: '100%',
                            height: scale(53),
                            borderRadius: scale(8),
                            borderWidth: 1,
                            borderColor: '#FFA100',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: scale(10),
                            paddingLeft: scale(10),
                          }}>
                          <Image
                            style={{
                              width: scale(27),
                              height: scale(27),
                            }}
                            source={search}
                          />
                          <Text
                            style={{
                              color: 'white',
                              fontSize: scale(13),
                            }}>
                            Search Friends
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: scale(20),
                      }}>
                      {users?.length > 0 && (
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: scale(24),
                            lineHeight: scale(28),
                          }}>
                          Add Friends
                        </Text>
                      )}

                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('AllUserReviews', {
                            _id: auth?._id,
                          });
                        }}
                        style={{
                          paddingHorizontal: scale(10),
                          paddingVertical: scale(6),
                          backgroundColor: '#FFA100',
                          borderRadius: scale(5),
                          elevation: scale(5),
                          alignSelf: 'flex-end',
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            fontWeight: '700',
                          }}>
                          My Reviews
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        marginBottom:
                          (users?.length > 0 ||
                            saucesListThree.length > 0 ||
                            saucesListTwo?.length > 0 ||
                            saucesListOne.length > 0) &&
                          scale(30),
                      }}>
                      <HorizontalUsersList />
                    </View>
                  </View>
                )}
                {index == 2 && (
                  <View
                    style={{
                      gap: scale(40),
                    }}>
                    <FavoriteSaucesList
                      refresh={refresh}
                      title="My Favorites"
                    />

                    <CheckedInSaucesList
                      refresh={refresh}
                      title="Checked-in Sauces"
                    />
                    <ReviewedSaucesList
                      refresh={refresh}
                      title="Reviewed Sauces"
                    />
                  </View>
                )}
                {index == 3 && (
                  <View
                    style={{
                      marginTop:
                        (saucesListThree.length > 0 ||
                          saucesListTwo?.length > 0 ||
                          saucesListOne.length > 0) &&
                        scale(50),

                      marginBottom:
                        (users?.length > 0 ||
                          saucesListThree.length > 0 ||
                          saucesListTwo?.length > 0 ||
                          saucesListOne.length > 0) &&
                        scale(30),

                      gap: scale(50),
                    }}>
                    <SaucesListOne refresh={refresh} title="My List 1" />
                    <SaucesListTwo refresh={refresh} title="My List 2" />
                    <SaucesListThree refresh={refresh} title="My List 3" />
                  </View>
                )}
                {index == 4 && (
                  <WishListSauces refresh={refresh} title="Wishlist" />
                )}
                {index == 5 && (
                  <View
                    style={{
                      gap: scale(20),
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 600,
                        fontSize: scale(24),
                        lineHeight: scale(28),
                      }}>
                      Events I'm Interested In
                    </Text>
                    <View>
                      <InterestedEventsCarousel
                        refresh={refresh}
                        showText={true}
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  separator: {
    marginRight: scale(20),
  },
});
