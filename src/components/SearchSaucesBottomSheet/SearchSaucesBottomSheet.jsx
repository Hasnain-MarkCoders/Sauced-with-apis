import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Image, TextInput, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import useAxios from "../../../Axios/useAxios";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

const SearchSaucesBottomSheet = ({photo={}, fn=()=>{}, setCapturedImage=()=>{}}) => {
  const sheetRef = useRef(null);
  const [sauces, setSauces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSauce, setSelectedSauce] = useState(null); // State for selected sauce
  const axiosInstance = useAxios();
  const navigation = useNavigation();

  const fetchSauces = async (currentPage = 1, term = "") => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/search-sauces`, {
        params: { searchTerm: term, page: currentPage },
      });
      const { sauces: fetchedSauces, pagination } = response.data;
      if (currentPage === 1) {
        setSauces(fetchedSauces); // Reset sauces for the first page
      } else {
        setSauces((prevSauces) => [...prevSauces, ...fetchedSauces]); // Append sauces for subsequent pages
      }
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching sauces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSauces(nextPage, searchTerm);
    }
  };

  const handleSearch = useCallback(() => {
    setPage(1); // Reset page to 1 when performing a new search
    setSauces([]); // Clear existing sauces
    fetchSauces(1, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

  const snapPoints = ["90%"];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if(selectedSauce?._id === item._id){
          setSelectedSauce(null)
          return
        }
        setSelectedSauce(item); // Set selected sauce
      }}
    >
      <View style={[styles.itemContainer, selectedSauce?._id === item._id && styles.selectedItem]}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
          <Text numberOfLines={1}  style={styles.description}>{item?.owner?.name?.trim()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loading && page > 0) {
      return <ActivityIndicator size="large" color="black" />;
    } else if (!loading && sauces.length === 0) {
      return <Text style={styles.noResultsText}>No sauces found.</Text>;
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <BottomSheet 
        ref={sheetRef} 
        snapPoints={snapPoints} 
        animateOnMount={true}
      >
        <TouchableOpacity 
          onPress={() => {
            if (selectedSauce) {
              setCapturedImage(null)
                navigation.navigate("Checkin", {_id:selectedSauce?._id, item:selectedSauce,routerNumber:4, photo, fn})
            }
            
          }}
          disabled={!selectedSauce} // Disable button if no sauce is selected
        >
          <Text style={[styles.button, !selectedSauce && styles.disabledButton]}>
            Quick Check-ins
          </Text>
        </TouchableOpacity>

        <View style={{
    marginBottom: scale(10),

        }}>

        <TextInput
        placeholderTextColor ={"#000"}
          style={styles.input}
          placeholder="Search Sauces"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
        <Text
        
        style={{
          color:!!selectedSauce?"#FFA100":"gray",
          fontSize:scale(10),
          paddingHorizontal:scale(10),
          textAlign:"left",
          marginTop:scale(10),
          marginBottom:scale(10),
          fontWeight:"bold"
        }}>
          {!!selectedSauce? `${selectedSauce.name} is selected for quick check-in`:"Select a sauce for quick check-in"}
        </Text>
        </View>
        
        
        <BottomSheetFlatList
          data={sauces}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter()}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    minHeight: scale(500),
    flex: 1,
    width: "100%"
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selectedItem: {
    backgroundColor: "#f0f0f0", // Highlight color for selected item
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color:"black"
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  input: {
    height: scale(50),
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    marginHorizontal: scale(10),
    color:"black",

  },
  noResultsText: {
    textAlign: "center",
    paddingVertical: 10,
    fontSize: 16,
    color: "#888",
  },
  button: {
    marginHorizontal: scale(10),
    color:"black",
    textAlign: "center",
    paddingVertical: scale(17),
    marginBottom: scale(20),
    backgroundColor: "#FFA100",
    fontSize: scale(14),
    borderRadius: scale(8)
  },
  disabledButton: {
    backgroundColor: "#ddd", // Change color for disabled state
  }
});

export default SearchSaucesBottomSheet;
