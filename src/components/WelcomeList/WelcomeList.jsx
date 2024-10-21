import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { welcomeLists } from "../../../utils";
import CustomListItem from "../CustomListItem/CustomListItem";
import { scale } from "react-native-size-matters";

const renderItem = ({ item }) =>
    (<CustomListItem text={item}  showDot={false}/>)
  ;
const WelcomeLists = ({
  data=[]
}) => {
    return (
        <FlatList
         showsVerticalScrollIndicator={false}
         showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
  };

  const styles = StyleSheet.create({
    separator: {
      height: scale(20),
    }
  })


  export default WelcomeLists