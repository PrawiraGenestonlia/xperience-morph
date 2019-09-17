import React from 'react';
import {
  View, Image, Text
} from 'react-native';
import Logo from '../assets/images/Logo.png';

export default function TitleLogo() {
  return (
    <View style={{ flex: 1, width: '100%', alignItems: 'center', }}>
      <Image source={Logo} style={{ width: 120 }} resizeMode='contain' resizeMethod='scale' />
      {/* <Text>Xperience@EEE</Text> */}
    </View>
  )
}