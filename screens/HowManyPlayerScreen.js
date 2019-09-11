import React, { useState, } from 'react';
import {
  ScrollView, StyleSheet, View, Button, TextInput, ImageBackground,
} from 'react-native';
import BackgroundImage from '../assets/images/background.jpg'
export default function HowManyPlayerScreen(props) {
  const { navigation } = props;
  const [players, setPlayers] = useState(2);
  const _numberOfPlayers = (e) => {
    console.log("number of players input", players);
    navigation.navigate('Morph', {
      players: players
    });
  }
  return (
    <View style={styles.container}>
      {/* <ScrollView style={styles.container}> */}
      <ImageBackground source={BackgroundImage} style={{ width: '100%', height: '100%' }}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          // justifyContent: 'center',
          alignItems: 'center',
          marginTop: 320
        }}>
          <View style={{ borderColor: 'blue', borderWidth: 1, borderRadius: 4, backgroundColor: 'white', fontSize: 3 }}>

            <TextInput
              style={{ width: 250, padding: 2, textAlign: 'center', fontSize: 24 }}
              placeholder="Number of players"
              underlineColorAndroid='transparent'
              keyboardType={'numeric'}
              onChangeText={e => setPlayers(e)}
              maxLength={2}
              onSubmitEditing={() => { _numberOfPlayers }}
              onEndEditing={() => { _numberOfPlayers }}
              onBlur={() => { _numberOfPlayers }}
            />

          </View>
          <Button style={{ marginBottom: 3 }} title="Submit" onPress={_numberOfPlayers} />
        </View>
      </ImageBackground>
      {/* </ScrollView> */}
    </View>
  );
}

HowManyPlayerScreen.navigationOptions = {
  title: 'Morph',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});