import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {useNavigation, useRoute} from '@react-navigation/native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import darkArrow from './../../../assets/images/darkArrow.png';
import yellowChilli from './../../../assets/images/yellow-chilli.png';
import redChilli from './../../../assets/images/red-chilli.png';
import marker from './../../../assets/images/marker.png';

import debounce from 'lodash.debounce';
import Geocoder from 'react-native-geocoding';
// Initialize the Geocoder with your API key (for example, Google API)
import useAxios from '../../../Axios/useAxios'; // Make sure to import your axios instance
import Toast from 'react-native-toast-message';
import {Search} from 'lucide-react-native';
import axios from 'axios';
import YesNoModal from '../../components/YesNoModal/YesNoModal';

const {width} = Dimensions.get('window');

const MapScreen = () => {
  const axiosInstance = useAxios();
  const navigation = useNavigation();
  const route = useRoute();
  const lng = route?.params?.lng;
  const lat = route?.params?.lat;
  const showContinue = route?.params?.showContinue;
  const handleEventCoords = route?.params?.fn || function () {};
  const [selectedId, setSelectedId] = useState(null)
  const [region, setRegion] = useState({
    latitude: lat,
    longitude: lng,
    latitudeDelta:0.01,
    longitudeDelta:0.01,
  });

  const [selectedRegion, setSelectedRegion] = useState({
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [selectedMarkers, setSelectedMarkers] = useState({});
  const [isSelectedZoom, setIsSelectedZoom] = useState(false)
  const [markerSize, setMarkerSize] = useState(90);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [stores, setStores] = useState([]);
  const mapRef = useRef();
  const [isAutocompleteActive, setIsAutocompleteActive] = useState(false);
  const [isContinue, setIsContinue] = useState(false);
  const [hotSauceMarkers, setHotSauceMarkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const handleAutocompleteFocus = () => {
    setIsAutocompleteActive(true);
  };

  const handleAutocompleteBlur = () => {
    setIsAutocompleteActive(false);
  };
  useEffect(() => {
    // Fetch stores data
    const fetchHotSauces = async () => {
      try {
        const res = await axiosInstance.get('/get-locations', {
          params: {
            type: 'hotsauces',
          },
        });
        const validHotSauces = res.data.items.filter(hotSauce => {
          const latitude = parseFloat(hotSauce.hotsauceLocation.latitude);
          const longitude = parseFloat(hotSauce.hotsauceLocation.longitude);
          // Check if both latitude and longitude are valid numbers
          return !isNaN(latitude) && !isNaN(longitude);
        });
        const hotSauces = validHotSauces.map(item => {
          return {
            place_id: item?.place_id,
            zip: item?.zip,
            latitude: item?.hotsauceLocation.latitude,
            longitude: item?.hotsauceLocation.longitude,
          };
        });
        setHotSauceMarkers(hotSauces);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };
    Geocoder.init('AIzaSyDRPFzLdRC8h3_741v8gAW4DqmMusWPl4E'); // replace with your actual API key
    fetchHotSauces();
  }, []);

  useEffect(() => {
    // Fetch stores data
    const fetchStores = async () => {
      try {
        const res = await axiosInstance.get('/get-locations', {
          params: {
            type: 'store',
          },
        });

        const validStores = res.data.items.filter(store => {
          const latitude = parseFloat(store.storeLocation.latitude);
          const longitude = parseFloat(store.storeLocation.longitude);
          // Check if both latitude and longitude are valid numbers
          return !isNaN(latitude) && !isNaN(longitude);
        });

        const stores = validStores.map(item => ({
          latitude: parseFloat(item.storeLocation.latitude), // Ensure it's a number
          longitude: parseFloat(item.storeLocation.longitude), // Ensure it's a number
          place_id: item.place_id,
          zip: item.zip,
        }));

        setStores(stores);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };
    Geocoder.init('AIzaSyDRPFzLdRC8h3_741v8gAW4DqmMusWPl4E'); // replace with your actual API key
    fetchStores();
  }, []);

  useEffect(() => {
    if (isSelectedZoom && selectedRegion && mapRef?.current) {
      mapRef?.current?.animateToRegion(
        {
          latitude: selectedRegion.latitude,
          longitude: selectedRegion.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      ); // 1000ms animation duration
    }
    fetchNearbyPlaces(selectedRegion);
  }, [selectedRegion]);


 
  

  const getRadiusFromDelta = useCallback(latitudeDelta => {
    return Math.round(latitudeDelta * 100000); // Adjust multiplier for different radius
  }, []);

  const handleMarkerPress = store => {
    Alert.alert(
      'Store Information',
      `Zip: ${store.zip ? store.zip : ' N/A'}`,
      [{text: 'OK'}],
    );
  };

  const handleAddHotSauce = useCallback(async data => {
    const res = await axiosInstance.post('/add-hotsauce', data);
    return res;
  }, []);
  const handleNearByMarkerPressCB = async () => {
    // Get the lat and lng
    const latitude = selectedPlace.latitude;
    const longitude = selectedPlace.longitude;
    const place_id = selectedPlace.placeId;
    const address = selectedPlace.address;
    const zip = selectedPlace.postalCode;
    setHotSauceMarkers(prev => [
      ...prev,
      {place_id, latitude, longitude, zip, address},
    ]);
    const res = await handleAddHotSauce({
      latitude: latitude?.toString(),
      longitude: longitude?.toString(),
      zip: zip?.toString(),
      place_id: place_id.toString(),
    });
  };

  const handleNearByMarkerPress = useCallback(async place => {
    // Check if this place is already a hot sauce
    const isHotSauce = hotSauceMarkers.some(
      item => item.place_id === place.place_id,
    );

    if (isHotSauce) {
      // Show details if it's a hot sauce
      Alert.alert(
        'Hot Sauce Details',
        `Place: ${place.name}\nZip: ${place.zip ? place.zip : ' N/A'}`,
        [{text: 'OK'}],
      );
    } else {
      // Show modal to add it as a hot sauce
      setShowModal(true);
      setSelectedPlace(place);
    }

    // Toggle selection state for this marker
    setSelectedMarkers(prev => ({
      ...prev,
      [place.place_id]: !prev[place.place_id], // Toggle selection state
    }));
  }, []);
  const fetchNearbyPlaces = useCallback(async region => {
    try {
      setIsSelectedZoom(true)
      const radius = getRadiusFromDelta(region.latitudeDelta);
      const nearbyResponse = await axios.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        {
          params: {
            location: `${region.latitude},${region.longitude}`,
            radius: radius,
            key: 'AIzaSyDRPFzLdRC8h3_741v8gAW4DqmMusWPl4E', // Replace with your API key
          },
        },
      );

      // Map over the results to get place details for each
      const placeDetailsPromises = nearbyResponse.data.results.map(
        async place => {
          try {
            const detailsResponse = await axios.get(
              'https://maps.googleapis.com/maps/api/place/details/json',
              {
                params: {
                  place_id: place.place_id,
                  key: 'AIzaSyDRPFzLdRC8h3_741v8gAW4DqmMusWPl4E', // Replace with your API key
                  fields: 'place_id,geometry,name,address_components,types', // Specify the fields you need
                },
              },
            );

            const details = detailsResponse.data.result;

            // Extract zip code from address_components
            const postalCodeComponent = details.address_components.find(
              component => component.types.includes('postal_code'),
            );
            const zip = postalCodeComponent
              ? postalCodeComponent.long_name
              : null;
            return {
              place_id: details.place_id,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              zip: zip,
              types: details.types || [],
              name: details.name,
            };
          } catch (error) {
            console.error(
              `Error fetching details for place_id ${place.place_id}:`,
              error,
            );
            return null; // Handle individual errors and continue
          }
        },
      );

      const places = await Promise.all(placeDetailsPromises);

      // Filter out any null responses due to errors
      const validPlaces = places.filter(place => place !== null);
      setNearbyPlaces(validPlaces);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  }, []);

  const handleRegionChangeComplete = debounce(
    newRegion => {
      // Fetch nearby places without updating the displayed region
      fetchNearbyPlaces(newRegion);
    },
    1000,
    {trailing: true, leading: false},
  );

  const fetchPlaceOnTap = async (latitude, longitude) => {
    try {
      const geocodeResponse = await Geocoder.from(latitude, longitude);
      const placeId = geocodeResponse.results[0].place_id;
      const address = geocodeResponse.results[0].formatted_address;
      const postalCode = geocodeResponse.results[0].address_components.find(
        component => component.types.includes('postal_code'),
      )?.long_name;

      return {placeId, address, postalCode};
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error; // Re-throw the error to be caught in the calling function
    }
  };

  const handleLongPress = async e => {
    try {
      const {latitude, longitude} = e.nativeEvent.coordinate;
      const {placeId, address, postalCode} = await fetchPlaceOnTap(
        latitude,
        longitude,
      );
      setSelectedPlace({latitude, longitude, placeId, address, postalCode});
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching place ID:', error);
      Alert.alert('Error', 'Unable to fetch place ID.');
    }
  };

  const CustomMarker = React.memo(
    ({imageSource, size}) => (
      <View
        style={{
          alignItems: 'center',
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.17,
          shadowRadius: 3.05,
          elevation: 4,
        }}>
        <Image
          source={imageSource}
          style={[{width: scale(size), height: scale(size)}]}
        />
      </View>
    ),
    [],
  );
  const handlePoiClick = e => {
    const {coordinate, name, placeId} = e.nativeEvent;
    const postalCode = ""
    const {latitude, longitude} = coordinate;
    // Alert.alert('Place Info', `Name: ${name}`);
    const newSelectedRegion = {
      latitude,
      longitude
    };

    setSelectedRegion(newSelectedRegion);
    handleEventCoords({
      latitude,
      longitude,
      destination: name,
      zip: postalCode?.toString(),
      place_id: placeId?.toString(),
    });

    Toast.show({
      type: 'success',
      text1: 'Location selected',
      text2: 'Please go Back to continue.',
    });
    setIsContinue(true);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
            source={darkArrow}
          />
        </TouchableOpacity>

        <View
          style={{
            position: 'relative',
          }}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              zIndex: 3,
              top: scale(28),
              left: scale(45),
              zIndex: isAutocompleteActive ? -1 : 3, // Conditionally set zIndex to hide/show the search icon
              opacity: isAutocompleteActive ? 0 : 1,
            }}>
            <Search color={'gray'} size={23} />
          </View>
          <GooglePlacesAutocomplete
            nearbyPlacesAPI="GooglePlacesSearch"
            placeholder="Search for places"
            fetchDetails={true}
            onPress={(data, details = null) => {
              const placeId = details?.place_id || data?.place_id;
              const postalCode = details?.address_components?.find(component =>
                component?.types?.includes('postal_code'),
              )?.long_name;
              const newSelectedRegion = {
                latitude: details?.geometry?.location?.lat,
                longitude: details?.geometry?.location?.lng,
              };

              setSelectedRegion(newSelectedRegion);

              handleEventCoords({
                latitude: details?.geometry?.location?.lat,
                longitude: details?.geometry?.location?.lng,
                destination: data?.description,
                zip: postalCode?.toString(),
                place_id: placeId?.toString(),
              });

              Toast.show({
                type: 'success',
                text1: 'Location selected',
                text2: 'Please go Back to continue.',
              });
              setIsContinue(true);
            }}
            query={{
              key: 'AIzaSyDRPFzLdRC8h3_741v8gAW4DqmMusWPl4E', // Replace this with your actual API key
              language: 'en',
            }}
            textInputProps={{
              placeholderTextColor: 'gray',
              returnKeyType: 'search',
              onFocus: handleAutocompleteFocus,
              onBlur: handleAutocompleteBlur,
            }}
            styles={{
              textInput: {
                backgroundColor: '#FFFFFF',
                height: scale(45),
                borderRadius: scale(50),
                fontSize: 15,
                paddingLeft: isAutocompleteActive ? scale(20) : scale(35),
                color: 'gray',
              },
              container: {
                position: 'absolute',
                width: '85%',
                top: scale(15),
                left: width * 0.1,
                zIndex: 1,
              },

              description: {
                color: 'gray',
              },
            }}
          />
        </View>

        <MapView
        provider={PROVIDER_GOOGLE}
         onPoiClick={handlePoiClick}
          onLongPress={e => {
            handleLongPress(e);
          }}
          // showsTraffic={true}
          showsScale={true}
          cacheEnabled={false}
          //  showsUserLocation={true}
          showsCompass={false}
          //  showsMyLocationButton
          //  toolbarEnabled={false}
          //  tracksViewChanges={false}
          //  optimizeWaypoints={true}
          showsIndoors={true}
          loadingEnabled
          // onRegionChangeComplete={handleRegionChangeComplete}
          ref={mapRef}
          onPress={async e => {
            const {latitude, longitude} = e?.nativeEvent?.coordinate;
            const newSelectedRegion = {
              latitude,
              longitude,
            };
            setSelectedRegion(newSelectedRegion);

            try {
              const geocodeResponse = await Geocoder.from(latitude, longitude);
              const placeId = geocodeResponse.results[0].place_id;
              const address = geocodeResponse.results[0].formatted_address;
              const postalCode =
                geocodeResponse.results[0].address_components.find(component =>
                  component.types.includes('postal_code'),
                )?.long_name;

                console.log("geocodeResponse.results[0].address_components=====================================================>",JSON.stringify(geocodeResponse.results[0].address_components))

              handleEventCoords({
                latitude,
                longitude,
                destination: address,
                zip: postalCode?.toString(),
                place_id: placeId?.toString(),
              });

              Toast.show({
                type: 'success',
                text1: 'Location selected',
                text2: 'Please go Back to continue.',
              });
              setIsContinue(true);
            } catch (error) {
              console.error('Error fetching location description:', error);
            }
          }}
          style={styles.map}
          initialRegion={region}
          followsUserLocation={true}>
          {/* {!!region && (
          <Marker
          // zIndex={111}

          // stopPropagation={true}
          // tracksViewChanges={false}
          // optimizeWaypoints={true}
          // showsUserLocation={true}
          // showsCompass={false}
          // showsMyLocationButton
          // toolbarEnabled={false}
          showsIndoors={false}
          loadingEnabled
          anchor={{ x: 0.5, y: 0.5 }}
            onPress={(e) => { console.log(e) }}
            coordinate={region}>
            <View style={styles.marker}>
              <Image
                source={yellowChilli}
                style={[styles.markerImage, { width: scale(markerSize), height: scale(markerSize) }]}
              />
            </View>
          </Marker>
        )} */}

          {!!selectedRegion && (
            <Marker
              // zIndex={111}

              // stopPropagation={true}

              // showsUserLocation={true}
              // showsCompass={false}
              // // showsMyLocationButton
              // toolbarEnabled={false}
              // tracksViewChanges={false}
              // optimizeWaypoints={true}
              // showsIndoors={false}
              // loadingEnabled
              anchor={{x: 0.5, y: 0.5}}
              coordinate={{
                latitude: selectedRegion.latitude,
                longitude: selectedRegion.longitude,
              }}>
              <View style={styles.marker}>
                <Image
                  source={showContinue ? yellowChilli : redChilli}
                  style={[
                    styles.markerImage,
                    {width: scale(markerSize), height: scale(markerSize)},
                  ]}
                />
              </View>
            </Marker>
          )}

          {/* Render multiple markers with validation */}
          {stores.map(store => {
            const latitude = parseFloat(store.latitude);
            const longitude = parseFloat(store.longitude);

            // Validate latitude and longitude before rendering the marker
            if (!isNaN(latitude) && !isNaN(longitude)) {
              return (
                <Marker
                  // zIndex={111}

                  // stopPropagation={true}

                  // showsUserLocation={true}
                  // showsCompass={false}
                  // showsMyLocationButton
                  // toolbarEnabled={false}
                  // tracksViewChanges={false}
                  // // optimizeWaypoints={true}
                  // showsIndoors={false}
                  // loadingEnabled
                  anchor={{x: 0.5, y: 0.5}}
                  key={store.place_id}
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  pinColor="orange"
                  onPress={() => handleMarkerPress(store)}>
                  <View style={styles.marker}>
                    <Image
                      source={redChilli}
                      style={[
                        styles.markerImage,
                        {width: markerSize, height: markerSize},
                      ]}
                    />
                  </View>
                </Marker>
              );
            }

            return null;
          })}

          {hotSauceMarkers.map(store => {
            const latitude = parseFloat(store.latitude);
            const longitude = parseFloat(store.longitude);

            // Validate latitude and longitude before rendering the marker
            if (!isNaN(latitude) && !isNaN(longitude)) {
              return (
                <Marker
                  // zIndex={111}

                  // stopPropagation={true}

                  // showsUserLocation={true}
                  // showsCompass={false}
                  // showsMyLocationButton
                  // toolbarEnabled={false}
                  // tracksViewChanges={false}
                  // // optimizeWaypoints={true}
                  // showsIndoors={false}
                  // loadingEnabled
                  anchor={{x: 0.5, y: 0.5}}
                  key={store.place_id}
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  pinColor="orange"
                  onPress={() => handleMarkerPress(store)}>
                  <View style={styles.marker}>
                    <Image
                      source={redChilli}
                      style={[
                        styles.markerImage,
                        {width: markerSize, height: markerSize},
                      ]}
                    />
                  </View>
                </Marker>
              );
            }

            return null;
          })}
          {/* {nearbyPlaces.map((place) => (
          <Marker
          // zIndex={111}
          // stopPropagation={true}

          // showsUserLocation={true}
          // showsCompass={false}
          // showsMyLocationButton
          // toolbarEnabled={false}
          tracksViewChanges={false}
          // optimizeWaypoints={true}
          showsIndoors={false}
          loadingEnabled
            key={place.id}
            anchor={{ x: 0.5, y: 0.5 }}

            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            onPress={() =>{
              handleNearByMarkerPress(place)
              setSelectedId(place?.place_id)
            }}
          >
            <CustomMarker
            onPress={() =>  {

              handleNearByMarkerPress(place)
              setSelectedId(place?.place_id)

            }



            }
              imageSource={
                selectedMarkers[place.place_id] || hotSauceMarkers.some(item=>item.place_id == place.place_id)
                ?
                redChilli
                :
                marker
              }
              size={scale(70)}
            />
          </Marker>
        ))} */}
        </MapView>

        {isContinue && !showContinue && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
        <YesNoModal
          success={true}
          modalVisible={showModal}
          setModalVisible={setShowModal}
          cb={() => handleNearByMarkerPressCB()}
          title="Is That a Hot Sauce?"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    width: scale(20),
    height: scale(20),
    zIndex: 2,
    top: scale(25),
    left: scale(8),
  },
  map: {
    flex: 1,
  },
  marker: {
    alignItems: 'center',
    width: scale(100),
    height: scale(150),
  },
  markerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 150,
  },
  continueButton: {
    position: 'absolute',
    bottom: 20, // 20px from the bottom
    left: '10%',
    right: '10%',
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;
