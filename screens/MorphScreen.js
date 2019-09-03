import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Image, Text, TouchableOpacity, Button, Modal, Alert, TextInput, TouchableHighlight } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from "react-native-elements";


export default function MorphScreen() {
  const [images, setImages] = useState([]);
  const [camera, setCamera] = useState({
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    type: Camera.Constants.Type.back,
  });
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [players, setPlayers] = useState(0);
  const askCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setCamera({ ...camera, hasCameraPermission: status === 'granted' });
  };
  const askCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    setCamera({ ...camera, hasCameraRollPermission: status === 'granted' });
  };
  const _morph = () => {

  }
  const _numberOfPlayers = (e) => {
    console.log("number of players input", players);
    setIsModalVisible(false);
  }
  const _pickImage = async () => {
    var currentImages = [];
    for (let i = 0; i < players; i++) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true
      });
      // console.log(result);
      if (!result.cancelled) {
        result.content = `data:image/png;base64,${result.base64}`;
        currentImages.push(result);
        console.log("currentImages:", currentImages);
        if (i === players - 1) {
          setImages(currentImages);
        }
      }
    }
  };
  useEffect(() => {
    askCameraPermission().catch(err => console.log(err));
    askCameraRollPermission().catch(err => console.log(err));
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Image
          source={
            __DEV__
              ? require('../assets/images/robot-dev.png')
              : require('../assets/images/robot-prod.png')
          }
          style={styles.welcomeImage}
        />
      </View>
      <Modal
        style={{ flex: 1 }}
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
          // Alert.alert('Modal has been closed.');
        }}>
        <View style={{
          flex: 1,
          // flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            width: 300
          }}>
            <TextInput
              style={{ width: 200, borderColor: 'blue', borderWidth: 1 }}
              textAlign="center"
              placeholder="&nbsp;&nbsp;Enter the number of players&nbsp;&nbsp;&nbsp;"
              underlineColorAndroid='transparent'
              style={styles.TextInputStyle}
              keyboardType={'numeric'}
              onSubmitEditing={_numberOfPlayers}
              onChangeText={e => setPlayers(e)}
              maxLength={2}
            />
            <Button title="Submit" onPress={_numberOfPlayers} />
          </View>
        </View>
      </Modal>


      {camera.hasCameraPermission === false ?
        <Text style={{ alignItems: 'center' }}>No access to camera</Text>
        :
        <View style={{ flex: 1 }}>
          <Text style={{ alignItems: 'center', textAlign: 'center' }}>Number of players: {players}</Text>
          {
            images.length < players ?
              <Button title="Pick an image" onPress={() => { _pickImage().catch(err => console.log(err)) }} /> :
              <>
                <Button title="Retake" onPress={() => { _pickImage().catch(err => console.log(err)) }} />
                <Button title="Morph" onPress={_morph} />
              </>
          }
          <View style={{ flex: 1, flexDirection: 'row', }}>
            {
              images.map((image, index) => {
                return <Image key={index} source={{ uri: image.content }} style={{ width: 100, height: 100, padding: 1 }} />
              })
            }
          </View>
        </View>
      }
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
        <Avatar
          rounded
          size="large"
          title="X"
          onPress={() => console.log("Works!")}
          activeOpacity={0.7}
        // showEditButton
        />
        <Avatar
          rounded
          size="xlarge"
          title="X"
          onPress={() => console.log("Works!")}
          activeOpacity={0.7}
        // showEditButton
        />
        <Avatar
          rounded
          size="xlarge"
          title="X"
          onPress={() => console.log("Works!")}
          activeOpacity={0.7}
        // showEditButton
        />
        <Avatar
          rounded
          size="xlarge"
          title="X"
          onPress={() => console.log("Works!")}
          activeOpacity={0.7}
        // showEditButton
        />

      </View>
    </ScrollView>
  );
}

MorphScreen.navigationOptions = {
  title: 'Morph',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  TextInputStyle: {
    textAlign: 'center',
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#009688',
    marginBottom: 10
  }
});
