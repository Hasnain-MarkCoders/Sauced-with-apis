import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel'
import { scale } from 'react-native-size-matters';
import Banner from '../Banner/Banner';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../../../Axios/useAxios';
// import { handleInterestedEvents, handleRemoveInterestedEvents } from '../../../android/app/Redux/InterestedEvents';

import { useDispatch, useSelector } from 'react-redux';
import CarouselSkeleton from '../CarouselSkeleton/CarouselSkeleton';
// import { handleAllEventsExceptInterested, handleRemoveAllEventsExceptInterested } from '../../../android/app/Redux/allEventsExceptInterested';

import NotFound from '../NotFound/NotFound';
import { handleInterestedEvents, handleRemoveInterestedEvents } from '../../Redux/InterestedEvents';
import { handleAllEventsExceptInterested, handleRemoveAllEventsExceptInterested } from '../../Redux/allEventsExceptInterested';
const screenWidth = Dimensions.get('window').width;
const horizontalPadding = scale(20); // Assuming 20 is your scale for horizontal padding
const effectiveWidth = screenWidth - 2 * horizontalPadding;

const InterestedEventsCarousel = ({
    showText=false,
    refresh=false
}) => {
const [selected, setSelected] = React.useState(0)
const [initialLoading, setInitialLoading] = React.useState(true)
 const navigation = useNavigation()
 const axiosInstance = useAxios()
 const [data, setData] = React.useState([])
 const [page, setPage] = React.useState(1)
 const [hasMore, setHasMore] = React.useState(true)
 const [loading, setLoading] = React.useState(false);
 const dispatch=useDispatch()
 const interestedEvents = useSelector(state=>state?.interestedEvents)
 const auth  = useSelector(state=>state.auth)
 const [limit,setLimit] = React.useState(null)
 const [ paginationBullets, setPaginationBullets] = React.useState(null)

 //  console.log(auth?.token)
 React.useEffect(() => {
     const fetchEvents = async () => {
         if (!hasMore || loading) return;
         setLoading(true);
         try {
             const res = await axiosInstance.get(`/get-interested-event`, {
                 params: {
                     page: page,
                    //  type:"allExceptInterested"
                 }
             });
                 setHasMore(res?.data?.pagination?.hasNextPage);
                 setLimit(res?.data?.pagination?.limit)
                //  console.log("res?.data?.events=============================>", res?.data?.events.length)
                // //  setData([...res.data?.events]);

                dispatch(handleInterestedEvents(res?.data?.interestedEvents))
                setPaginationBullets(res?.data?.interestedEvents?.length)
         } catch (error) {
             console.error('Failed to fetch reviews:', error);
         } finally {
             setLoading(false);
         }
     };
    
     fetchEvents();
    }, [page, refresh]);
    const handleSnapToItem = (index) => {
        setSelected(index);
        if (index === interestedEvents.length - 1) {
            setPage(prevPage => prevPage + 1); // Increment page to fetch next batch
        }

    };


    const handleInterestedEvent = async(event)=>{
        const x = interestedEvents?.find(item=>item?._id==event?._id)

        if(!!x){
                   dispatch(handleRemoveInterestedEvents(event?._id))
                   dispatch(handleAllEventsExceptInterested([event]))
                    const res = await axiosInstance.post(`/interest-event`, {
                        eventId:event?._id
                    });

        }
    }

    React.useEffect(()=>{
setTimeout(()=>{
    setInitialLoading(false)
}, 3000)
    },[])

    // React.useEffect(()=>{
    //     if (interestedEvents?.length==0)
    //     setPaginationBullets(0)
    // },[interestedEvents?.length])
  return (
    <View style={{gap:scale(10)}}>
        {
            initialLoading
            ?
            <CarouselSkeleton/>
            :
            
            interestedEvents?.length
            >0
            ?
            <Carousel
            autoPlayInterval={7000}
                loop
                width={effectiveWidth}
                height={155}
                autoPlay={true}
                data={interestedEvents}
                scrollAnimationDuration={1000}
               
                onSnapToItem={(index) =>{ handleSnapToItem(index)}}
                renderItem={({ item, index }) => (<>
                  <Banner
        
                                loading={false}
                                cb={handleInterestedEvent}
                                showOverlay={true}
                                showText={showText}
                                event={item}
                                url={item?.bannerImage}
                                infoText={""} />
                        
                </>)
                }
            />
            :
            <NotFound
            title='No events added yet.'
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
                        </TouchableOpacity>
                        }
                    <View style={{
                        flexDirection: "row",
                        paddingVertical: scale(10),
                        justifyContent: "flex-start",
                        gap: scale(3),
                    }}>
                        {Array.from({ length: interestedEvents }).map((_, index) => (  // Only create 8 dots
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

export default InterestedEventsCarousel
