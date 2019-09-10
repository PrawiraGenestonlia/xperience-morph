import React, { useState, useEffect } from 'react';
import {
  ScrollView, StyleSheet, View, Image, Text,
} from 'react-native';

export default function ResultsScreen(props) {
  const { navigation } = props;
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text>Results Screen</Text>
      </View>
    </ScrollView>
  )
}

ResultsScreen.navigationOptions = {
  title: 'Morph',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
