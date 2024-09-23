import { useNavigation, useRoute } from "@react-navigation/native";
import { Circle, CircleX, X } from "lucide-react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Dimensions,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { scale } from "react-native-size-matters";
import {
  Camera as VisionCamera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import SearchSaucesBottomSheet from "../../components/SearchSaucesBottomSheet/SearchSaucesBottomSheet";

const { width, height } = Dimensions.get("window");

const CameraScreen = () => {
  const route = useRoute();
  const camera = useRef(null); // Initialize camera ref as null
  const _id = route?.params?._id;
  const [capturedImage, setCapturedImage] = useState(null); // New state for captured image
  const navigation = useNavigation();
  const [isActive, setIsActive] = useState(true);
  const handleNavigateBack = ()=>{
    setCapturedImage(null)
    // setIsActive(false)
    navigation.goBack()
  }

  const { hasPermission, requestPermission } = useCameraPermission(); // Hook to check and request camera permission
  const device = useCameraDevice("back"); // Get the back camera

  useEffect(() => {
    // Request permission if not already granted
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const GetPlatformSpecificURL = (platform, uri) => {
    return platform.OS == "ios" ? uri : "file://" + uri;
  };

  // const handleCapture = async () => {
  //   try {
  //     if (camera.current) {
  //       const options = { quality: 0.5, base64: true, exif: true };
  //       const photo = await camera.current.takePhoto(options);
  //       const name = photo.path.split("/").pop()
  //       const type ="image/"+photo.path.split(".").pop()

  //       const uri = GetPlatformSpecificURL(Platform, photo.path);
  //       setCapturedImage({ ...photo,uri, name,type });
  //     }
  //   } catch (error) {
  //     console.error("Error capturing photo:", error);
  //   }
  // };


  const handleCapture = async () => {
    try {
      if (camera.current) {
        const options = { quality: 0.5, base64: true, exif: true };
        const photo = await camera.current.takePhoto(options);
        
        // Extract filename and extension
        const filename = photo.path.split("/").pop() || `photo_${Date.now()}.jpg`;
        const extension = filename.split(".").pop().toLowerCase();
        
        // Determine MIME type with fallback
        const mimeTypes = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          // Add more types if needed
        };
        const type = mimeTypes[extension] || "image/jpeg";
        
        // Format URI correctly
        const uri = Platform.OS === "ios" ? photo.path : `file://${photo.path}`;
        
        setCapturedImage({ ...photo, uri, name: filename, type });
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  if (!device || !hasPermission) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <Text style={{ color: "white" }}>
          {!device
            ? "Camera not found..."
            : !hasPermission
            ? "Permission denied"
            : ""}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <VisionCamera
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={isActive}
          photo={true}
        />
      ) : (
        <Image source={capturedImage} style={styles.capturedImage} />
      )}

      <TouchableOpacity
        onPress={() => {
          capturedImage ? setCapturedImage(null) : (setIsActive(false), navigation.goBack());
        }}
        style={styles.closeButton}
      >
        <View style={styles.closeButtonInner}>
          <X color="#fff" />
        </View>
      </TouchableOpacity>

      {!capturedImage && (
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity onPress={handleCapture}>
            <Circle size={80} color={"white"} />
          </TouchableOpacity>
        </View>
      )}

      {capturedImage && (
        <View style={styles.bottomSheetContainer}>
          <SearchSaucesBottomSheet
          fn={handleNavigateBack}
          photo={capturedImage} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: "black",
    position: "relative",
  },
  camera: {
    flex: 1,
    width: width,
  },
  capturedImage: {
    width: width,
    height: height / 2, // Show image in top 50%
    resizeMode: "cover",
  },
  closeButton: {
    top: scale(30),
    position: "absolute",
    zIndex: 1,
    right: scale(30),
  },
  closeButtonInner: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: scale(7),
    borderRadius: 100,
  },
  captureButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  bottomSheetContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: height / 2, // Occupy bottom 50% of the screen
  },
});

export default CameraScreen;
