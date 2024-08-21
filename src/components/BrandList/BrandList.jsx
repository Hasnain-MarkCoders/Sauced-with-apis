import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SingleBrand from '../SingleBrand/SingleBrand';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import useAxios from '../../../Axios/useAxios';

const BrandList = ({  title = null }) => {

    
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxios()
    
    const data1 = data.slice(0, data.length / 2)
    const data2 = data.slice(data.length / 2, data.length)

    const fetchTopBrands = async () => {
      if (!hasMore || loading) return;
 
      setLoading(true);
      try {
          const res = await axiosInstance.get(`/get-top-brands`, {
              params: {
                  page: page
              }
          });
                setHasMore(res.data.pagination.hasNextPage);
                setData(prevData => [...prevData, ...res?.data?.brands]);;
      } catch (error) {
          console.error('Failed to fetch photos:', error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchTopBrands();
  }, [data]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={{
                gap: scale(7)
            }}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal
                    data={data1}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <SingleBrand item={item} url={item?.brand?.image} title={item?.brand?.name} />}
                />
                     <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal
                    data={data2}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <SingleBrand item={item} url={item?.brand?.image} title={item?.brand?.name} />}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: verticalScale(20)
    },
    title: {
        color: "white",
        lineHeight: verticalScale(28.8),
        fontSize: moderateScale(24),
        fontWeight: "600",
    },
    separator: {
        marginRight: scale(10)
    }
});

export default BrandList;
