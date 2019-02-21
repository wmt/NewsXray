import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';

  import { createStackNavigator, createAppContainer } from 'react-navigation';
  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


  export default class AboutScreen extends React.Component {
    static navigationOptions = {
      header: null,
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View
            style = {{
                backgroundColor: '#333333',
                flex: 1
            }}>
                <TouchableOpacity
                    style={{
                        marginTop: 20,
                        marginLeft: 20
                    }}>
                <MaterialCommunityIcons 
                    onPress={()=>{
                        return navigate("Main");
                    }}
                    name="close-circle-outline"
                    style={{color: 'white', fontSize: 40}}
                >
                </MaterialCommunityIcons>
                </TouchableOpacity>
            </View>
        );
      }
  }

      
