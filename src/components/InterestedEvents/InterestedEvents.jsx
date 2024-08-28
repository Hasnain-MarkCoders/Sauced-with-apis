import * as React from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Banner from '../Banner/Banner';
import useAxios from '../../../Axios/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { handleInterestedEvents, handleRemoveInterestedEvents } from '../../../android/app/Redux/InterestedEvents';
 const InterestedEvents = ({
    showText = false
}) => {
    const axiosInstance = useAxios()
    const [data, setData] = React.useState([])
    const [page, setPage] = React.useState(1)
    const [hasMore, setHasMore] = React.useState(true)
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch()
    const InterestedEvents = useSelector(state=>state?.interestedEvents)

      const fetchEvents = React.useCallback(async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/get-interested-event`, {
                params: {
                    page: page
                }
            });
            setHasMore(res.data.pagination.hasNextPage);
            dispatch(handleInterestedEvents(res.data?.interestedEvents))
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    },[page]);

    React.useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);


    const handleToggleInterestedEvent=React.useCallback(async(event)=>{
        dispatch(handleRemoveInterestedEvents(event?._id))
        const res = await axiosInstance.post(`/interest-event`, {
            eventId:event?._id
        });
    },[]
)
    return (
        
        <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={[1, 1]}
            renderItem={({ item, index }) => {
                return (
                    <View style={{
                        width: "100%",
                        flex: 1,
                        marginTop:scale(20)
                    }}>

                        {
                            index == 0 &&

                            <Text style={{
                                color: "white",
                                fontWeight: 600,
                                fontSize: scale(35),
                                lineHeight: scale(50),
                                marginBottom: scale(20)

                            }}>
                                Interested Events

                            </Text>
                        }
                        {
                            index == 1 && <View style={{
                            }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{
                                        gap:scale(20),
                                        display:"flex",
                                        flexDirection:"column"
                                    }}
                                    showsHorizontalScrollIndicator={false}
                                    data={InterestedEvents}
                                    onEndReachedThreshold={0.8}
                                    onEndReached={() => {
                                        if (!loading && hasMore) {
                                            setPage(currentPage => currentPage + 1);
                                        }
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) =>
                                            <Banner
                                                        cb={handleToggleInterestedEvent}
                                                        isInterested={true}
                                                          showOverlay={true}
                                                          showText={true}
                                                          event={item}
                                                          url={item?.bannerImage}
                                                          infoText={""} 
                                                          
                                                          />
                                    }
                                    ItemSeparatorComponent={() => <View style={{
                                        marginBottom:scale(20)
                                    }} />}
                                    ListFooterComponent ={
                                       loading && <ActivityIndicator  size="small" style={{marginTop:20 }} color="#FFA100" />
                                }
                                />
                            </View>
                        }
                    </View>
                )
            }}
        />
    )
}

export default InterestedEvents
