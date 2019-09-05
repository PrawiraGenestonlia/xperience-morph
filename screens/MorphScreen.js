import React, { useState, useEffect } from 'react';
import {
  ScrollView, StyleSheet, View, Image, Text,
  TouchableOpacity, Button, Modal, Alert, TextInput, TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Overlay } from "react-native-elements";
import config from '../xperience-moprh.config';
import axios from 'axios';

export default function MorphScreen() {
  const [images, setImages] = useState([]);
  const [camera, setCamera] = useState({
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    type: Camera.Constants.Type.back,
  });
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [players, setPlayers] = useState(2);
  const [morphResults, setMorphResults] = useState('');
  const [isMorphinging, setIsMorphinging] = useState(false);
  const askCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setCamera({ ...camera, hasCameraPermission: status === 'granted' });
  };
  const askCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    setCamera({ ...camera, hasCameraRollPermission: status === 'granted' });
  };
  const _morph = () => {
    setOverlayVisible(true);
    setIsMorphinging(true);
    console.log("Morphing starts");
    var picked_images = [Math.floor(Math.random() * players), Math.floor(Math.random() * players)];
    while (picked_images[0] == picked_images[1]) {
      picked_images[1] = Math.floor(Math.random() * players);
    }
    axios.post(config.backend_uri + config.morph_api.combinecontent, {
      "image1": images[picked_images[0]].content,
      "image2": images[picked_images[1]].content,
    }).then(function (response) {
      // console.log(response.data);
      setMorphResults(response.data);
      console.log("Morphing done!");
    }).catch(function (error) {
      console.log(error);
    });
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
        // aspect: [1, 1],
        quality: 0.7,
        base64: true
      });
      // console.log(result);
      if (!result.cancelled) {
        result.content = `data:image/png;base64,${result.base64}`;
        currentImages.push(result);
        console.log("image taken!");
        // console.log("currentImages:", currentImages);
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
      {/* MODAL */}
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

      {/* OVERLAY */}

      <Overlay animationType="zoomIn" isVisible={isOverlayVisible} overlayStyle={{ justifyContent: 'center', alignItems: 'center' }}>
        {
          morphResults ?
            <View style={{}}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0)', height: 120 }}></View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ marginTop: 5 }}>
                  <Avatar
                    rounded
                    size="xlarge"
                    title="X"
                    onPress={() => console.log("Works!")}
                    activeOpacity={0.7}
                    source={{ uri: morphResults }}
                  // showEditButton
                  />
                </View>
                <View style={{ marginTop: 1 }}>
                  <Text style={{ fontSize: 20 }}>Who is this?</Text>
                  <Text>(Select two faces and click at the top avatar)</Text>
                </View>
                <View style={{ marginTop: 1 }}>
                  <View style={{ flex: 1, flexDirection: 'row', }}>
                    {
                      images.map((image, index) => {
                        return <Avatar key={index} source={{ uri: image.content }}
                          rounded size="large" placeholderStyle={{ borderColor: "#000000", borderWidth: 3 }} />
                      })
                    }
                  </View>
                </View>
              </View>

            </View> :
            <View>
              <ActivityIndicator size="large" color="#aaaaaa" />
            </View>
        }

      </Overlay>

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
                <Button title="Morph" disabled={isMorphinging} onPress={_morph} />
              </>
          }
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {
              images.map((image, index) => {
                return <Image key={index} source={{ uri: image.content }} style={{ width: 100, height: 100, padding: 1 }} />
              })
            }
            {
              morphResults ?
                <Image key={50} source={{ uri: morphResults }} style={{ width: 100, height: 100, margin: 2 }} /> : <></>
            }
          </View>
        </View>
      }
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
