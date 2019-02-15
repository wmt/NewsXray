import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';


export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: HomeScreen,
  About: AboutScreen
}));