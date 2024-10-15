import React, { useState } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import Snackbar from 'react-native-snackbar';
import { useDispatch, useSelector } from 'react-redux';

// import {
//   handleRemoveSauceFromListOne,
//   handleSaucesListOne,
// } from '../../../android/app/Redux/saucesListOne';
// import {
//   handleRemoveSauceFromListTwo,
//   handleSaucesListTwo,
// } from '../../../android/app/Redux/saucesListTwo';
// import {
//   handleRemoveSauceFromListThree,
//   handleSaucesListThree,
// } from '../../../android/app/Redux/saucesListThree';
import useAxios from '../../../Axios/useAxios';
import CustomButton from '../../../src/components/CustomButtom/CustomButtom';
import closeIcon from './../../../assets/images/close.png';
import { handleSaucesListOne, handleRemoveSauceFromListOne } from '../../Redux/saucesListOne';
import { handleSaucesListTwo, handleRemoveSauceFromListTwo } from '../../Redux/saucesListTwo';
import { handleSaucesListThree , handleRemoveSauceFromListThree} from '../../Redux/saucesListThree';



const CustomSelectListModal = ({
  modalVisible = false,
  setModalVisible = () => {},
  sauce = {},
}) => {
  const [loading, setLoading] = useState({ 1: false, 2: false, 3: false });
  const [isEnabled, setIsEnabled] = useState(true);
  const axiosInstance = useAxios();
  const dispatch = useDispatch();
  const sauceId = sauce?._id;

  const list1 = useSelector((state) => state?.saucesListOne || []);
  const list2 = useSelector((state) => state?.saucesListTwo || []);
  const list3 = useSelector((state) => state?.saucesListThree || []);

  const listStatus = {
    1: list1.some((item) => item._id === sauceId),
    2: list2.some((item) => item._id === sauceId),
    3: list3.some((item) => item._id === sauceId),
  };

  const titles = {
    1: listStatus[1] ? 'Remove from List 1' : 'Add to List 1',
    2: listStatus[2] ? 'Remove from List 2' : 'Add to List 2',
    3: listStatus[3] ? 'Remove from List 3' : 'Add to List 3',
  };

  const handleLoading = (listNumber, action) => {
    setLoading((prev) => ({ ...prev, [listNumber]: action }));
  };

  const modifyList = async (listNumber) => {
    if (!isEnabled) return;

    try {
      setIsEnabled(false);
      handleLoading(listNumber, true);

      const type =
        listNumber === 1
          ? 'triedSauces'
          : listNumber === 2
          ? 'toTrySauces'
          : 'favoriteSauces';

      const isInList = listStatus[listNumber];
      Snackbar.show({
        text: `Sauce ${isInList ? 'removing from' : 'adding to'} List ${listNumber}`,
        duration: Snackbar.LENGTH_SHORT,
      });

      const action = isInList
        ? (listNumber === 1 ? handleRemoveSauceFromListOne : listNumber === 2 ? handleRemoveSauceFromListTwo : handleRemoveSauceFromListThree)
        : (listNumber === 1 ? handleSaucesListOne : listNumber === 2 ? handleSaucesListTwo : handleSaucesListThree);
      
      dispatch(action(isInList ? sauceId : [sauce]));

     const response = await axiosInstance.post('/bookmark', {
        sauceId,
        listType: type,
      });
      console.log("response.data=========================>", response.data)
    } catch (error) {
      console.error('Failed to update the list:', error);
      Snackbar.show({
        text: 'Failed to update the list. Please try again.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } finally {
      handleLoading(listNumber, false);
      setModalVisible(false);
      setIsEnabled(true);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => setModalVisible(false)}
            >
              <Image style={styles.closeIcon} source={closeIcon} />
            </TouchableOpacity>
            {[1, 2, 3].map((listNumber) => (
              <CustomButton
                key={listNumber}
                loading={loading[listNumber]}
                buttonTextStyle={styles.buttonText}
                buttonstyle={styles.button}
                onPress={() => modifyList(listNumber)}
                title={titles[listNumber]}
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 22, 10, 0.85)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    borderWidth: scale(0.5),
    borderColor: '#FFA100',
    borderRadius: scale(12),
    backgroundColor: '#2E210A',
    paddingVertical:scale(20),
    padding: scale(50),
    shadowColor: '#000',
    minHeight: scale(200),
    width: '90%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  closeIconContainer: {
    position: 'absolute',
    right: scale(20),
    top: scale(20),
    zIndex: 1,
  },
  closeIcon: {
    width: scale(20),
    height: scale(20),
  },
  button: {
    width: '100%',
    borderColor: 'red',
    padding: scale(15),
    marginTop: scale(20),
    backgroundColor: '#2E210A',
    borderWidth: scale(1),
  },
  buttonText: {
    color: '#FFA100',
    fontSize: scale(12),
  },
});

export default CustomSelectListModal;
