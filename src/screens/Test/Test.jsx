// Import Statements
import React, { useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  Text,
  SafeAreaView, 
  Image
} from 'react-native';
import { scale } from 'react-native-size-matters';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAP_API_KEY } from '@env';
import home from './../../../assets/images/home.png'; // Adjust the path as needed
// Get device dimensions
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

// Define constants for the map
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Define origin and destination
const currentCoords = {"latitude": 37.785834, "longitude": -122.406417}
const eventCoords ={"latitude": 24.900601674056873, "longitude": 67.11317876035402}
import yellowChilli from "./../../../assets/images/yellow-chilli.png";
import redChilli from "./../../../assets/images/red-chilli.png";
// Stylesheet
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: scale(32),
  },
  map: {
    flex: 1,
  },
  versionBox: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 6,
    borderRadius: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#000',
  },
});

// Functional Component
const Test = () => {
  // State for initial loading
  const [initialLoading, setInitialLoading] = useState(true);

  // Ref for MapView
  const mapRef = useRef(null);

  // Effect to simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
      console.log('Google Maps API Key:', GOOGLE_MAP_API_KEY);
    }, 1000);

    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, []);

  // Handler when directions are ready
  const onReady = (result) => {
    console.log(`Distance: ${result.distance} km`);
    console.log(`Duration: ${result.duration} min.`);

    if (mapRef.current) {
      mapRef.current.fitToCoordinates(result.coordinates, {
        edgePadding: {
          right: width / 20,
          bottom: height / 20,
          left: width / 20,
          top: height / 20,
        },
        animated: true,
      });
    }
  };

  // Handler for errors in directions
  const onError = (errorMessage) => {
    console.error('MapViewDirections Error:', errorMessage);
  };

  // Handler for when directions start
  const onStartDirections = (params) => {
    console.log(
      `Started routing between "${params.origin}" and "${params.destination}"`
    );
  };

  // Render Loading Screen
  if (initialLoading) {
    return (
      <ImageBackground
        source={home}
        style={styles.loadingContainer}
        resizeMode="cover"
      >
        <ActivityIndicator size="large" color="#FFA100" />
      </ImageBackground>
    );
  }

  // Render Main Content
  return (
    <ImageBackground source={home} style={styles.imageBackground}>
      {/* Uncomment and use TestComponent if needed */}
      {/* <TestComponent /> */}

      <SafeAreaView

  style={{
    flex:1,
    position:"relative"
  }}>
     <View
                    style={{
                     flex:1,
                     width:"100%"
                    }}>
                    <MapView
                    provider={PROVIDER_GOOGLE}
                    ref={mapRef}
                      style={{ width: "100%", height: "100%", flex:1}}
                      zoomTapEnabled={true}
                    >

                      
                        <Marker
                          anchor={{ x: 0.5, y: 0.5 }}
                          onPress={(e) => { console.log(e) }}
                          coordinate={{
                            latitude: eventCoords.latitude,
                            longitude: eventCoords.longitude,
                          }}>
                          <View >
                            <Image
                              source={redChilli}
                              style={[{ width: scale(50), height: scale(50) }]}
                            />
                          </View>
                        </Marker>
             

                 
                        <Marker
                          anchor={{ x: 0.5, y: 0.5 }}
                          onPress={(e) => { console.log(e) }}
                          coordinate={{
                            latitude: currentCoords.latitude,
                            longitude: currentCoords.longitude,
                          }}>
                          <View >
                            <Image
                              source={yellowChilli}
                              style={[{ width: scale(50), height: scale(50) }]}
                            />
                          </View>
                        </Marker>
                    
                     <MapViewDirections
                          origin={{
                            latitude: currentCoords.latitude,
                            longitude: currentCoords.longitude,
                          }}
                          destination={{
                            latitude: eventCoords.latitude,
                            longitude: eventCoords.longitude,
                          }}
                          apikey={GOOGLE_MAP_API_KEY}
                             strokeWidth={6}
            strokeColor="#FFA100"

            onReady={onReady}
            onError={(errorMessage) => {
              console.error('MapViewDirections Error:', errorMessage);
              alert(`Directions Error: ${errorMessage}`);
            }}

                        />
        
                    </MapView>

                  </View>
  </SafeAreaView>
    </ImageBackground>
  );
};

export default Test;
