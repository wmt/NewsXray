//credit: https://docs.expo.io/versions/v32.0.0/sdk/camera/

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

import {Modal, TouchableHighlight, Alert} from 'react-native';

import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';

import { Camera, Permissions } from 'expo';
import { FaceDetector } from 'expo';
import { Button } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator, createAppContainer } from 'react-navigation';


export default class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  
  //Camera and Face Detector configurations
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    faceDetecting: true,
    faceDetected: false,
    pictureTaken: false,
    modalVisible: false,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  async componentDidMount(){
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted"});
  }

  //switches the boolean values, essentially controls
  //the messages displayed which tell us if there is a face
  //detected
  handleFacesDetected = ({faces}) => {
    if (faces.length === 1) 
    {
      this.setState({
        faceDetected: true
      });
    }
    else
    {
      this.setState({
        faceDetected: false
      })
    }
  }

//handles taking the picture & returns Object with URI
  takePicture = () => {
    this.setState({
      pictureTaken: true,
    });
    if (this.camera) {
      console.log('take picture');
      this.camera.takePictureAsync({onPictureSaved: (result)=> {
        this.pic = result["uri"];
        return result;
      }});
    }
  };


 //what the application is displaying
  render() {
    const { hasCameraPermission } = this.state;
  
    if (hasCameraPermission === null)
    {
      return <View />;
    }
    else if (hasCameraPermission === false)
    {
      return <Text> No access to camera</Text>;
    }
    else {
      return (
        <View style={{flex: 1}}>
          <Camera 
           style={{flex: 1}} 
           type={this.state.type}
           onFacesDetected = {this.state.faceDetecting ? this.handleFacesDetected: undefined }
           onFaceDetectionError = {this.handleFaceDetectionErorr}
           faceDetectorSettings = {{
             mode: FaceDetector.Constants.Mode.fast,
             detectLandmarks: FaceDetector.Constants.Landmarks.all,
             runClassifications: FaceDetector.Constants.Classifications.none,
           }}
           ref = {ref => {
             this.camera = ref;
           }}>

        <View style= {styles.viewContainer}>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={()=>{
              Alert.alert("Modal has been closed.");
            }}>

            <View style={styles.modalContainer}>            
              <View style={styles.innerModalContainer}>
                <View style={styles.navBar}>
                  <TouchableOpacity
                    onPress={()=>{
                      this.setModalVisible(!this.state.modalVisible);
                    }}>

                    <MaterialCommunityIcons
                      onPress={()=>{
                        this.setModalVisible(!this.state.modalVisible);
                      }}
                      name="close-circle-outline"
                      style={styles.navBarButton}>
                    </MaterialCommunityIcons>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalContent}>  
                  <Button 
                    onPress = {()=>{
                      console.log("a clicked")
                    }}
                    title="About application">
                  </Button>
            
                  <Button 
                    onPress = {()=>{
                      console.log("b clicked")
                    }}
                    title="Tutorial">
                  </Button>
                </View>
              </View>
            </View>
          </Modal>

            <TouchableOpacity
              onPress={()=>{
                this.setModalVisible(true);
              }}>
              <Image source = {require('../assets/images/NewsXRayLogo.png')}></Image> 
            </TouchableOpacity>

        </View>

          <View style={styles.cameraButtonsContainer}>
            <TouchableOpacity style={styles.cameraTouchableOpacity}>
              <Text style = {styles.faceDetectedText}>
                {this.state.faceDetected ? 'Face Detected' : 'No face detected'}
              </Text> 
              
              <MaterialCommunityIcons 
                onPress={this.takePicture}
                name="circle-outline"
                style={styles.takePictureButton}>
                </MaterialCommunityIcons>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({

  viewContainer: {
    flex: 2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginTop: 40,
    marginLeft: 20
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  navBar: {
    flexDirection: 'row',
    height: 70,
    //backgroundColor: "#1eaaf1",
    borderRadius: 10,
  },

  navBarButton: {
    color: "white",
    fontSize: 40,
    marginLeft: 325,
    marginTop: 15,
    marginRight: 5,
  },

  innerModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15, 
    height: '90%',
  },

  cameraButtonsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },

  cameraTouchableOpacity: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },

  takePictureButton: {
    color: 'white',
    fontSize: 100
  },

  faceDetectedText: {
    fontSize: 20, 
    marginBottom: 10, 
    color: 'white'
  },
  modalContent: {
    alignItems: 'center',
    alignSelf: 'center',
  }
});

