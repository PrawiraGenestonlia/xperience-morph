import React from 'react';
import { Platform, Image } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MorphScreen from '../screens/MorphScreen';
import ResultsScreen from '../screens/ResultsScreen';
import HowManyPlayerScreen from '../screens/HowManyPlayerScreen';

import Logo from '../assets/images/Logo.png'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

LinksStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const MorphStack = createStackNavigator(
  {
    HowManyPlayerScreen: HowManyPlayerScreen,
    Morph: MorphScreen,
    Result: ResultsScreen
  },
  {
    ...config,
    initialRouteName: 'HowManyPlayerScreen',
  }

);

MorphStack.navigationOptions = {
  tabBarLabel: 'Morph',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-analytics' : 'md-analytics'} />
  ),
};

MorphStack.path = '';

const tabNavigator = createBottomTabNavigator({
  MorphStack,
  // HomeStack,
  // LinksStack,
  // SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
