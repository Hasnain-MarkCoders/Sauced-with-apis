import {
  ImageBackground,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import home from './../../../assets/images/home.png';
import {scale} from 'react-native-size-matters';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Header from '../../components/Header/Header';
import useAxios from '../../../Axios/useAxios';
import SingleReview from '../../components/SingleReview/SingleReview';
import {useSelector} from 'react-redux';
import NotFound from '../../components/NotFound/NotFound';
import {SafeAreaView} from 'react-native-safe-area-context';

const AllUserReviews = () => {
  const route = useRoute();
  const axiosInstance = useAxios();
  const _id = route?.params?._id;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth);
  const fetchReviews = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/get-user-reviews`, {
        params: {
          page: page,
          _id,
        },
      });
      setHasMore(res?.data?.pagination?.hasNextPage);
      res?.data?.reviews && setData(prev => [...prev, ...res?.data?.reviews]);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReviews();
    }, [_id, page]), // Ensure _id is included if it can change
  );
  return (
    <ImageBackground
      source={home}
      style={{
        flex: 1,
      }}>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <View
          style={{
            paddingHorizontal: scale(20),
            paddingTop: scale(30),
          }}>
          <Header
            showText={false}
            showMenu={false}
            showProfilePic={false}
            cb={() => {
              navigation.goBack();
            }}
            headerContainerStyle={{paddingTop: scale(0), paddingHorizontal: 0}}
            title="Reviewed Sauces"
            showDescription={false}
            description=""
          />
        </View>
        <View
          style={{
            paddingHorizontal: scale(20),
            flex: 1,
            paddingBottom: scale(6),
            gap: scale(10),
            marginTop: scale(30),
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 600,
              fontSize: scale(35),
              lineHeight: scale(50),
            }}>
            Reviews
          </Text>

          {loading && data?.length < 1 ? (
            <ActivityIndicator
              size="small"
              style={{marginBottom: scale(100)}}
              color="#FFA100"
            />
          ) : !loading && data?.length < 1 ? (
            <NotFound title="No reviews Found" />
          ) : (
            <FlatList
              contentContainerStyle={{
                gap: scale(10),
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={data}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (!loading && hasMore) {
                  setPage(currentPage => currentPage + 1);
                }
              }}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={
                loading && (
                  <ActivityIndicator
                    size="small"
                    style={{marginBottom: scale(100)}}
                    color="#FFA100"
                  />
                )
              }
              renderItem={({item}) => (
                <SingleReview
                  sauceId={item?.sauceId?._id}
                  isNavigate={true}
                  url={item?.owner.image}
                  name={item?.owner.name}
                  _id={item?.owner?._id}
                  item={item}
                  userName={item?.owner?.name}
                  sauceName={item?.sauceId?.name}
                  stars={item?.star}
                  text={item?.text}
                  textLength={item?.text?.length}
                  date={item?.createdAt}
                  images={item?.images}
                />
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default AllUserReviews;
