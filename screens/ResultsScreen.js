import React, { useState, useEffect, Fragment } from 'react';
import {
  ScrollView, StyleSheet, View, Image, Text, ActivityIndicator, Easing
} from 'react-native';
import config from '../xperience-moprh.config';
import axios from 'axios';
import { Avatar, } from "react-native-elements";
import ZoomImage from 'react-native-zoom-image';

export default function ResultsScreen(props) {
  const { navigation } = props;
  const [images, setImages] = useState(navigation.getParam('images', []));
  const [morphResults, setMorphResults] = useState('');
  const [chosenId, setChosenId] = useState(navigation.getParam('chosenId', [0, 1]));
  const [selectedImage, setSelectedImage] = useState([]);
  const [numOfTries, setNumOfTries] = useState(0);

  useEffect(() => {
    getProps().then(() => {
      console.log("Morphing starts!");
      axios.post(config.backend_uri + config.morph_api.combinecontent, {
        "image1": images[chosenId[0]].content,
        "image2": images[chosenId[1]].content,
      }).then(function (response) {
        // console.log(response.data);
        setMorphResults(response.data);
        console.log("Morphing done!");
      }).catch(function (error) {
        console.log(error);
      });
    }).catch(err => console.log(err));
  }, []);

  const getProps = async () => {
    // setImages(navigation.getParam('images', []));
    // setChosenId(navigation.getParam('chosenId', [0, 1]));
    return new Promise((res, rej) => {
      setTimeout(() => { res(1) }, 50);
    })
  }
  const assignSelectedImage = (num) => {
    // fruits.shift();
    if (selectedImage.length === 2) {
      setSelectedImage(selectedImage.shift());
      setSelectedImage(oldArray => [...oldArray, num]);
    }
    else if (selectedImage.length < 2) {
      setSelectedImage(oldArray => [...oldArray, num]);
    }
  }
  const checkAnswer = () => {
    if (chosenId[0] == selectedImage[0] && chosenId[1] == selectedImage[1])
      return true
    else if (chosenId[1] == selectedImage[0] && chosenId[0] == selectedImage[1])
      return true
    return false
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.welcomeContainer}>
          {
            morphResults ?
              <View style={{}}>
                <View style={{ backgroundColor: 'rgba(255,255,255,0)', height: 120 }}></View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ marginTop: 5 }}>
                    <ZoomImage
                      source={{ uri: morphResults }}
                      imgStyle={{ width: 250, height: 230 }}
                      duration={200}
                      enableScaling={true}
                      easingFunc={Easing.ease}
                    />
                  </View>
                  <View style={{ marginTop: 1 }}>
                    <Text style={{ fontSize: 20, justifyContent: 'center' }}>Who is this?</Text>
                    <Text>(Select two faces and click at the top avatar)</Text>
                  </View>
                  <View style={{ marginTop: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                      {
                        images.map((image, index) => {
                          return <Avatar key={index} source={{ uri: image.content }}
                            rounded size="large" placeholderStyle={{ borderColor: "#000000", borderWidth: 3 }}
                            onPress={() => assignSelectedImage(index)}
                          />
                        })
                      }
                    </View>
                  </View>
                </View>
              </View>
              :
              <View style={{ alignContent: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#aaaaaa" />
              </View>
          }
        </View>
      </ScrollView>
    </View>
  )
}

ResultsScreen.navigationOptions = {
  title: 'Results',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  welcomeContainer: {
    alignItems: 'center',
    flex: 1
    // marginTop: 10,
    // marginBottom: 20,
  },
});
