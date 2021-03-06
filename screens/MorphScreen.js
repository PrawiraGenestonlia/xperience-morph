import React, { useState, useEffect } from 'react';
import {
  ScrollView, StyleSheet, View, Image, Text, Button, ImageBackground,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import BackgroundImage from '../assets/images/background.jpg';
import { TitleLogo } from '../components';


export default function MorphScreen(props) {
  const { navigation } = props;
  const [images, setImages] = useState([]);
  const [camera, setCamera] = useState({
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    type: Camera.Constants.Type.back,
  });
  const [players, setPlayers] = useState(navigation.getParam('players', 2));
  const askCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setCamera({ ...camera, hasCameraPermission: status === 'granted' });
  };
  const askCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    setCamera({ ...camera, hasCameraRollPermission: status === 'granted' });
  };
  const _morph = () => {
    var picked_images = [Math.floor(Math.random() * players), Math.floor(Math.random() * players)];
    while (picked_images[0] == picked_images[1]) {
      picked_images[1] = Math.floor(Math.random() * players);
    }
    navigation.navigate('Result', {
      chosenId: picked_images,
      images: images
    });
  }
  const _pickImage = async () => {
    var currentImages = [];
    for (let i = 0; i < players; i++) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
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
    <View style={styles.container}>
      {/* <ScrollView style={styles.container}> */}
      <ImageBackground source={BackgroundImage} style={{ width: '100%', height: '100%' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {camera.hasCameraPermission === false ?
            <Text style={{ alignItems: 'center', textAlign: 'center', paddingTop: 15 }}>No access to camera</Text>
            :

            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(250,250,250,0.8)', width: '90%', maxHeight: 160, borderRadius: 50 }}>
              <Text style={{ alignItems: 'center', textAlign: 'center', paddingTop: 15, fontSize: 17 }}>Number of players: {players}</Text>
              <Text style={{ alignItems: 'center', textAlign: 'center', marginVertical: 15, fontSize: 17 }}>Take a portrait picture with your faces in the center of the photo.</Text>
              {
                images.length < players ?
                  <Button title="Pick an image" onPress={() => { _pickImage().catch(err => console.log(err)) }} /> :
                  <>
                    <Button title="Retake" onPress={() => { _pickImage().catch(err => console.log(err)) }} />
                    <Button title="Morph" onPress={_morph} />
                  </>
              }
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {
                  images.map((image, index) => {
                    return <Image key={index} source={{ uri: image.content }} style={{ width: 100, height: 100, padding: 1 }} />
                  })
                }
              </View>
            </View>

          }
        </View>
      </ImageBackground>
      {/* </ScrollView> */}
    </View>
  );
}

MorphScreen.navigationOptions = {
  title: 'Morph',
  headerTitle: <TitleLogo />,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 15,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center'
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
