import React, { useState, useEffect, Fragment } from 'react';
import {
  ScrollView, StyleSheet, View, Text, ActivityIndicator, Easing, Image, Modal, Button, Alert
} from 'react-native';
import config from '../xperience-moprh.config';
import axios from 'axios';
import { Avatar, } from "react-native-elements";
import ZoomImage from 'react-native-zoom-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import { TitleLogo } from '../components';
import { makeEmptyAggregatedTestResult } from '@jest/test-result';


export default function ResultsScreen(props) {
  const { navigation } = props;
  const [images, setImages] = useState(navigation.getParam('images', [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }, { index: 5 }, { index: 6 }, { index: 7 }, { index: 8 }]));
  const [morphResults, setMorphResults] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [chosenId, setChosenId] = useState(navigation.getParam('chosenId', [0, 1]));
  const [selectedImage, setSelectedImage] = useState([]);
  const [numOfTries, setNumOfTries] = useState(0);

  useEffect(() => {
    let isMorphing = true;
    getProps().then(() => {
      console.log("Morphing starts!");
      axios.post(config.backend_uri + config.morph_api.combinecontent, {
        "image1": images[chosenId[0]].content,
        "image2": images[chosenId[1]].content,
      }, {
        timeout: 15000,
      }).then(function (response) {
        // console.log(response.data);
        isMorphing && setMorphResults(response.data);
        isMorphing && console.log("Morphing done!");
      }).catch(function (error) {
        console.log(error);
        Alert.alert("Error", "Images are not morphable. Please retake clearer image");
        navigation.navigate('Morph');
      });
    }).catch(err => {
      console.log(err);
      Alert.alert("Error", "Images are not morphable. Please retake clearer image");
      navigation.navigate('Morph');
    });
    return () => { isMorphing = false }
  }, []);

  // useEffect(() => {
  //   images.forEach((image, index) => {
  //     if (selectedImage.includes(index))
  //       image.selected = true;
  //     else
  //       image.selected = false;
  //   })
  //   console.log(images);
  // });

  const getProps = async () => {
    // setImages(navigation.getParam('images', []));
    // setChosenId(navigation.getParam('chosenId', [0, 1]));
    return new Promise((res, rej) => {
      setTimeout(() => { res(1) }, 50);
    })
  }
  const assignSelectedImage = (num) => {
    // fruits.shift();
    let temp = selectedImage;
    if (!temp.includes(num)) {
      if (temp.length < 2) {
        temp.push(num);
        setSelectedImage([...temp]);
        // setSelectedImage(prevState => prevState.push(num));
      }
      else if (temp.length === 2) {
        temp.shift();
        temp.push(num);
        setSelectedImage([...temp]);
      }
    }
    images.forEach((image, index) => {
      if (selectedImage.includes(index))
        image.selected = 3;
      else
        image.selected = 0;
    })
    // console.log(selectedImage);
  }
  const checkAnswer = () => {
    if (selectedImage.length < 2) {
      Alert.alert("Select two faces!", "You have not selected two faces!");
      return true;
    }

    setNumOfTries(numOfTries + 1);
    if (chosenId[0] == selectedImage[0] && chosenId[1] == selectedImage[1]) {
      Alert.alert("You are right!", "The passcode is xperience@eee");
      return true;
    }

    else if (chosenId[1] == selectedImage[0] && chosenId[0] == selectedImage[1]) {
      Alert.alert("You are right!", "The passcode is xperience@eee");
      return true;
    }
    Alert.alert("You are wrong!", `You have tried ${numOfTries} times. Please try again!`);
  }

  return (
    <View style={styles.container}>
      {/* <ScrollView style={styles.container}> */}
      <View style={styles.welcomeContainer}>
        {
          morphResults ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 }}>
              <Modal visible={isModal} transparent={true} onRequestClose={() => setIsModal(false)}>

                <ImageViewer
                  imageUrls={[
                    {
                      url: morphResults,
                      // width: 250,
                      // height: 250,
                      props: {
                        // source: morphResults,
                      },
                    }]}
                  onSwipeDown={() => setIsModal(false)}
                  onDoubleClick={() => setIsModal(false)}
                  onSave={() => setIsModal(false)}
                  // onMove={() => setIsModal(false)}
                  enableSwipeDown={true}
                  swipeDownThreshold={2}
                >
                  <Text onPress={() => setIsModal(false)}>Close</Text>
                </ImageViewer>
              </Modal>

              <Avatar key={50}
                source={{ uri: morphResults }}
                rounded size="xlarge" placeholderStyle={{ borderColor: "#000000", borderWidth: 3 }}
                onPress={() => setIsModal(true)}
              />
              <Text style={{ fontSize: 20, marginTop: 2 }}>Who is this?</Text>
              <Text style={{ marginTop: 2 }}>(Select two faces)</Text>
              <View style={{ marginTop: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {
                    images.map((image, index) => {
                      return <Avatar key={index}
                        source={{ uri: image.content }}
                        rounded size="large" containerStyle={{ margin: 3, borderColor: "#0000ff", borderWidth: image.selected }}
                        onPress={() => assignSelectedImage(index)}
                      />
                    })
                  }
                </View>
                <View style={{ flex: 1, marginTop: 10 }}>
                  <Button title="Check answer" onPress={() => checkAnswer()}></Button>
                </View>
              </View>
            </View>
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#aaaaaa" />
            </View>
        }
      </View>
      {/* </ScrollView> */}
    </View>
  )
}

ResultsScreen.navigationOptions = {
  title: 'Morph Results',
  // headerTitle: <TitleLogo />,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    // backgroundColor: '#fff',
  },
  welcomeContainer: {
    height: '100%',
    width: '100%',
    marginTop: 10,
  },
});
