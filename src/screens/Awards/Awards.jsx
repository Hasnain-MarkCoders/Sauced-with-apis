import {
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Header from '../../components/Header/Header';
import home from './../../../assets/images/home.png';
import {scale, verticalScale} from 'react-native-size-matters';
import AwardList from '../../components/AwardList/AwardList.jsx';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import useAxios from '../../../Axios/useAxios.js';
import NotFound from '../../components/NotFound/NotFound.jsx';
import YesNoModal from '../../components/YesNoModal/YesNoModal.jsx';
import CustomAwardPointModal from '../../components/CustomAwardPointModal/CustomAwardPointModal.jsx';

const Awards = ({navigation}) => {
  const [awards, setAwards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const axiosInstance = useAxios();
  const [points, setPoints] = useState(0);
  const [badgeCount, setBadgeCount] = useState('1/1');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const fetchAwards = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get('/get-user-badges', {
        params: {
          page: page,
        },
      });
      setHasMore(res.data.pagination.hasNextPage);
      setAwards(res?.data?.badges);
      setPoints(res?.data?.points);
      setBadgeCount(res?.data?.badgeCount);
    } catch (error) {
      console.error('Failed to fetch awards:', error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, page]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAwards();
    });

    return unsubscribe;
  }, [fetchAwards]);

  if (loading) {
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
      <SafeAreaView style={{flex: 1, paddingBottom: verticalScale(80)}}>
        <Header
          showMenu={false}
          showProfilePic={true}
          cb={() => navigation.goBack()}
          headerContainerStyle={{
            paddingBottom: verticalScale(30),
          }}
          showText={false}
        />

        {awards.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={[1, 1]}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    paddingHorizontal: scale(20),
                    flex: 1,
                  }}>
                  {index == 0 && (
                    <View>
                      <View
                        style={{
                          width: '100%',
                          backgroundColor: '#FFA100',
                          borderRadius: scale(12),
                          justifyContent: 'center',
                          paddingLeft: scale(20),
                          paddingVertical: scale(20),
                          gap: scale(3),
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: scale(16),
                            lineHeight: scale(20),
                            fontWeight: 500,
                          }}>
                          My Points
                        </Text>
                        <View
                          style={{
                            gap: scale(15),
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: scale(40),
                              lineHeight: scale(50),
                              fontWeight: 500,
                            }}>
                            {points} Points
                          </Text>

                          <View
                            style={{
                              flexDirection: 'row',
                              gap: scale(10),
                              padding: scale(10),
                              borderRadius: scale(50),
                              backgroundColor: 'white',
                              alignSelf: 'flex-start',
                            }}>
                            <View
                              style={{
                                backgroundColor: '#FFA100',
                                borderRadius: scale(50),
                                width: scale(10),
                                height: scale(10),
                              }}></View>

                            <Text
                              style={{
                                color: '#FFA100',
                                lineHeight: scale(12),
                                fontSize: scale(10),
                                fontWeight: 700,
                              }}>
                              Badges
                            </Text>

                            <Text
                              style={{
                                color: '#FFA100',
                                lineHeight: scale(12),
                                fontSize: scale(10),
                                fontWeight: 700,
                              }}>
                              {badgeCount}
                            </Text>
                          </View>
                        </View>
                      </View>
                    <View style={{
                      display:"flex",
                      flexDirection:"row",
                      justifyContent:"space-between",
                      alignItems:"center",
                      marginTop:scale(5)
                    }}>

                        <Text
                          style={{
                            fontSize: scale(10),
                            lineHeight: scale(12),
                            color: 'white',
                            marginTop: scale(5),
                            marginBottom: scale(20),
                          }}>
                          Redeem points (Coming soon)
                        </Text>

                      <TouchableOpacity
                        onPress={() => {
                          setShowModal(true);
                        }}>
                        <Text
                          style={{
                            fontSize: scale(10),
                            lineHeight: scale(12),
                            color: 'white',
                            marginTop: scale(5),
                            marginBottom: scale(20),
                            textDecorationStyle: "solid",
                            textDecorationLine: "underline" 
                          }}>
                          How to win points?
                        </Text>
                      </TouchableOpacity>
                    </View>

                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 600,
                          fontSize: 35,
                          lineHeight: 50,
                        }}>
                        Badges
                      </Text>
                    </View>
                  )}
                  {index == 1 && (
                    <AwardList
                      loading={loading}
                      hasMore={hasMore}
                      setPage={setPage}
                      data={awards}
                    />
                  )}
                </View>
              );
            }}
          />
        ) : (
          <NotFound title="Badges Not available" />
        )}
        {/* <YesNoModal
        setModalVisible={setShowModal}
        modalVisible={showModal}
        cb={()=>{
          setShowModal(false)
        }}
        isQuestion={true}
        ButtonText={"Close"}
        title={
          "Users can display earned badges on their profiles to showcase their expertise and dedication within the hot sauce community. Users are awarded 1 point every time they post a review 2 points if they include an image. "
        }
        /> */}
        <CustomAwardPointModal
         setModalVisible={setShowModal}
         modalVisible={showModal}
         cb={()=>{
           setShowModal(false)
         }}
         title={
           "Users can display earned badges on their profiles to showcase their expertise and dedication within the hot sauce community. Users are awarded 1 point every time they post a review or check-in, 2 points if they include an image. "
         }
        />
      </SafeAreaView>


    </ImageBackground>
  );
};

export default Awards;

const styles = StyleSheet.create({
  separator: {
    marginRight: scale(20),
  },
});
