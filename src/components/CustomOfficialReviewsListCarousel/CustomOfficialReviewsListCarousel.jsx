import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel'
import { scale } from 'react-native-size-matters';
import Banner from '../Banner/Banner';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../../../Axios/useAxios';
import CarouselSkeleton from '../CarouselSkeleton/CarouselSkeleton';
import NotFound from '../NotFound/NotFound';
const screenWidth = Dimensions.get('window').width;
const horizontalPadding = scale(20); // Assuming 20 is your scale for horizontal padding
const effectiveWidth = screenWidth - 2 * horizontalPadding;
const CustomOfficialReviewsListCarousel = ({
    showText=false
}) => {

    const navigation = useNavigation()
    const [initialLoading, setInitialLoading] = React.useState(true)
    const axiosInstance = useAxios()
    const [selected, setSelected] = React.useState(0)
    const [data, setData] = React.useState([])
    const [page, setPage] = React.useState(1)
    const [hasMore, setHasMore] = React.useState(true)
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchOfficalReviews = async () => {
            if (!hasMore || loading) return;
       
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/get-official-reviews`, {
                    params: {
                        page: page
                    }
                });
                    setHasMore(res.data.pagination.hasNextPage);
                    setData(res?.data?.officialReviews);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };
       
        fetchOfficalReviews();
       }, [page]);



       const handleSnapToItem = (index) => {
        setSelected(index);
        if (index === data.length - 1) {
            // setPage(prevPage => prevPage + 1); // Increment page to fetch next batch
        }
    };
    React.useEffect(()=>{
        setTimeout(()=>{
            setInitialLoading(false)
        }, 3000)
            },[])

  return (
    <View style={{}}>


        {
            initialLoading?
            <CarouselSkeleton/>
            :
            data.length>0
            ?
            <Carousel
            autoPlayInterval={7000}
                loop
                width={effectiveWidth}
                height={190}
                autoPlay={true}
                data={data}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => handleSnapToItem(index)}
                renderItem={({ item, index }) => (<>
                  <Banner
                                showOverlay={true}
                                item={item}
                                showText={showText}
                                videoId={item?.videoId}
                                url={item?.bannerImage}
                                infoText={""} />
                        
                </>)}
            />
            :
            <NotFound
            
            title='No official reviews found'
            />

        }
        <View style={{
                    flexDirection: "row",
                    justifyContent: showText ? "space-between" : "flex-end"
                }}>
                    {showText &&
                        <TouchableOpacity onPress={() => navigation.navigate("AddEventScreen")}>

                            <Text style={{
                                marginTop: scale(4), fontWeight: 700,
                                textDecorationLine: "underline",
                                color: "white",
                                fontSize: scale(10),
                                lineHeight: scale(13),
                                fontFamily: "Montserrat",
                            }}>
                                Don't see your event, suggest it to us
                            </Text>
                        </TouchableOpacity>}
                    <View style={{
                        flexDirection: "row",
                        paddingVertical: scale(10),
                        justifyContent: "flex-start",
                        gap: scale(3),
                    }}>
                        {Array.from({ length: 8 }).map((_, index) => (  // Only create 8 dots
                            <View
                                key={index}
                                style={{
                                    backgroundColor: selected === index ? "#FFA100" : "#D9D9D9",
                                    width: scale(selected === index ? 5 : 5),
                                    height: scale(selected === index ? 5 : 5),
                                    borderRadius: scale(10)
                                }}
                            />
                        ))}
                    </View>
                </View>
</View>
  )
}

export default CustomOfficialReviewsListCarousel
