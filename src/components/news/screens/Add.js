import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {uploadImage, addNews} from '../NewsService';

const Add = props => {
  const {navigation} = props;
  const [image, setImage] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [imgPath, setimgPath] = useState(null);

  const [title, settitle] = useState(null);
  const [content, setcontent] = useState(null);

  const goback = () => {
    navigation.goBack();
}
  const onTakePhoto = useCallback(async data => {
    if (data.didCancel) {
      setIsShowModal(false);
    } else if (data.errorCode) {
      setIsShowModal(false);
    } else if (data.errorMessage) {
      setIsShowModal(false);
    } else {
      setImage(data.assets[0].uri);
      setIsShowModal(false);
      // upLoad hình ảnh lên sever
      const formData = new FormData();
      formData.append('image', {
        uri: data.assets[0].uri,
        type: data.assets[0].type,
        name: data.assets[0].fileName,
      });
      const result = await uploadImage(formData);
      console.log('result', result);
      setimgPath(result.path);
    }
  }, []);

  const openCamera = useCallback(async () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra: true,
    };
    await launchCamera(options, onTakePhoto);
  }, []);

  const onSave = useCallback(async () => {
    const data = {
      title: title,
      content: content,
      image: imgPath,
    };
    const result = await addNews(data);
    console.log('result', result);
    Alert.alert('Thông báo', 'Thêm thành công');
    setcontent(null);
    settitle(null);
    setImage(null);
    setimgPath(null);
    // navigation.navigate('Home');
  }, [title, content, imgPath]);

  const openGallery = useCallback(async () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra: true,
    };
    await launchImageLibrary(options, onTakePhoto);
  }, []);

  return (
    <ScrollView KeyboardAvoidingView={true} style={styles.container}>
      <View style={styles.toolContainer}>
        <TouchableOpacity onPress={goback}>
        <Image source={require('../../../media/close.png')} />
        </TouchableOpacity>
        <Text style={styles.textProfile}>Create News</Text>
        <Image source={require('../../../media/bacham.png')} />
      </View>
      {!image ? (
        <TouchableOpacity
          style={styles.launchCameraButton}
          onPress={() => setIsShowModal(true)}>
          <Image style={{height:200,resizeMode:'contain'}} source={require('../../../media/ImportImg.png')} />
        </TouchableOpacity>
      ) : (
        <Image source={{uri: image}} style={{width: 320, height: 200,borderRadius:20,marginTop:20,marginStart:20}} />
      )}
      <TextInput
        style={styles.inputTitle}
        onChangeText={settitle}
        value={title}
        placeholder="New Title"
      />
      <Image source={require('../../../media/gach.png')} />
      <TextInput
        style={styles.inputContent}
        onChangeText={setcontent}
        value={content}
        placeholder="Add New/Article"
        multiline={true}
        numberOfLines={10}
      />

<View style={styles.boxFooter}>
        <View style={styles.boxFooter_1}>
          <TouchableOpacity style={styles.buttonStyleText} >
            <Image source={require('../../../media/B.png')} style={styles.imgStyleText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyleText} >
            <Image source={require('../../../media/I.png')} style={styles.imgStyleText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyleText} >
            <Image source={require('../../../media/Vector_123.png')} style={styles.imgStyleText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyleText} >
            <Image source={require('../../../media/Vector_3cham.png')} style={styles.imgStyleText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyleText} >
            <Image source={require('../../../media/Vector_HyberLink.png')} style={styles.imgStyleText} />
          </TouchableOpacity>
        </View>
        <View style={styles.boxFooter_2}>
          <Image source={require('../../../media/ImageFooterPostNews.png')} style={styles.imgFooter} />
          <TouchableOpacity style={styles.buttonPublish} onPress={onSave} >
            <Text style={styles.textbuttonPublish} >
              Publish
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShowModal}
        onRequestClose={() => {
          setIsShowModal(!isShowModal);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text1} onPress={openCamera}>Open Camera</Text>
            <Text style={styles.text1} onPress={openGallery}>Open Gallery</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Add;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
  },
  closeText: {
    marginTop: 10,
    color: 'blue',
  },
  buttonPublish: {
    width: 100,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1877F2',
    borderRadius: 6,
    marginStart: 50,
  },
  textbuttonPublish: {
    fontFamily: 'Poppins',
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: '400',
    color: 'white',
    lineHeight: 24,
    letterSpacing: 0.12,
  },

  boxFooter: {

    width: 200,
    height: 300,
    
    top: 120,
    
    
  },
  boxFooter_1: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    marginStart: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  boxFooter_2: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'gray',
    padding: 20,
    backgroundColor: 'white',
  },
  buttonStyleText: {
    width: '20%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imgFooter: {
    width: 180,
    height: 20
  },
  text1: {
    width: 200,
    height: 50,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: '#eff5f1',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 30,
  },
  toolContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textProfile: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.12,
    color: '#4E4B66',
  },
  imgProfile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 16,
  },
  modalContent: {
    width: '100%',
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
  },
  launchCameraButton: {
    width: '100%',
    height: 200,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
  },
  buttonSaveContent: {
    width: '100%',
    height: 50,
    marginBottom: 30,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  inputTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 10,
    letterSpacing: 0.12,
    
  },
  inputContent: {
    width: '100%',
    height: 100,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.12,
    marginTop: 20,
    
    padding: 10,
  },
});
