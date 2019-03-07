//credit: https://docs.expo.io/versions/v32.0.0/sdk/camera/

import React, { Component } from 'react';
import {
  Button,
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

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import FacePlusPlusApi from '../backend/FacePlusPlusApi';
import Crowdsource from '../backend/Crowdsource'; 
import firebase from "firebase"; 
require("firebase/firestore");

import Database from '../backend/Database'; 
import ImageCompressor from '../backend/CompressImage';
import Twitter from '../backend/Twitter';

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
    resultModalVisible: false,
    name: "Unknown",
    party: "Unknown",
    occupation: "Unknown",
    funding: [],
    image: null, 
  };

  //opens the modal for app information and tutorial
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  //opens modal for returned data
  setResultModal(visible, returnedName) {
    this.setState({
      resultModalVisible: visible,
      name: returnedName
    });
  }

  async componentDidMount(){
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted"});
    if (!firebase.apps.length) { firebase.initializeApp(Database.FirebaseConfig)};
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
     this.setState({
      name: "Unknown",
      party: "Unknown",
      occupation: "Unknown",
      funding: [],
      image: null,
     });
     console.log('DEV_MSG: picture taken');
     const db = firebase.firestore();

     this.camera.takePictureAsync( { base64: true } )
     .then( async function(result) {
       a = new FacePlusPlusApi();
       let pic64 = await ImageCompressor.compressImage(result.uri);
       let targetName = await a.upload(pic64);

       return targetName;
     }).then( result =>  {
       this.setState({
         name: result,
      });
       return result; })
     .then( async function(result) {
       console.log('name: '+ result);
       if ( result == 'Unknown') {
         await Crowdsource.sendUnverified('Tester', 'Testing notes');
         return 'Unknown';
       }
       else {
          let congressRef = await db.collection('congress').where("name", "==", result).get();
          return congressRef;
       }
     })
     .then( snapshot => {
       if ( snapshot != 'Unknown') {
       snapshot.forEach(doc => {
         this.setState( {
           name: doc.data().name,
           party: doc.data().party,
           occupation: doc.data().occupation,
           funding: Object.entries(doc.data().funding),
         })
         console.log(doc.data().name);
         console.log(doc.data().occupation);
         console.log(doc.data().party);
         console.log(doc.data().funding);
         this.setResultModal(true,this.state.name);
        }) 
      }
      else {
        this.setResultModal(true, this.state.name);
      }
     })
     .then( async function() {
       t = new Twitter();
       t.getTweets();
     } ); 
     };

   }    

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
           ratio="1:1"
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

        {/* Modal for returned back-end info */}
        <View style= {styles.viewContainer}>
           <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.resultModalVisible}
            onRequestClose={()=>{
              Alert.alert("Modal has been closed.");
            }}>

            <View style={styles.modalContainer}>
              <View style={styles.innerModalContainer}>
                <View style={styles.navBar}>
                  <TouchableOpacity
                    onPress={()=>{
                      this.setResultModal(!this.state.resultModalVisible);
                    }}>

                    <MaterialCommunityIcons
                      onPress={()=>{
                        this.setResultModal(!this.state.resultModalVisible);
                      }}
                      name="close-circle-outline"
                      style={styles.navBarButton}>
                    </MaterialCommunityIcons>
                  </TouchableOpacity>
                </View>

                {/* Information returned from back-end goes here */}
                <View style={styles.modalContent}>
                  {/*<Text style={styles.resultTitle}> Name </Text>*/}
                  <Text style={styles.resultTitle}> {this.state.name} </Text>
                  <Text style={styles.resultName}> {this.state.party} </Text>
                  <Text style={styles.resultName}> {this.state.occupation} </Text>
                  <Text style={styles.fundingSource}> 
                  {this.state.funding.map(
                    ([source, amount]) =>

                    source + '\t' + amount + '\n' 

                  )} </Text>


                {/*  <View style={styles.textContainer}>
                    <Text style={styles.resultTitle}> Funding source </Text>
                    <Text style={styles.fundingSource}> City University of New York  <Text style={styles.fundingMoney}>               $6,847 </Text> </Text>
                    <Text style={styles.fundingSource}> Columbia University  <Text style={styles.fundingMoney}>                             $10,867 </Text> </Text>
                    <Text style={styles.fundingSource}> Justice Democrats <Text style={styles.fundingMoney}>                                     $7,712 </Text> </Text>
                    </View>  */}
                </View>

              </View>
            </View>
           </Modal>

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
                    {/* button for tutorial pages*/}
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
    borderRadius: 10,
  },

  navBarButton: {
    color: "black",
    fontSize: 40,
    marginLeft: 325,
    marginTop: 15,
    marginRight: 5,
  },

  innerModalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    marginTop: 150,
    marginLeft: 15,
    marginRight: 15, 
    height: '50%',
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
  
  fundingSource: {
    justifyContent: 'space-evenly',
    fontSize: 18,
    fontFamily: 'lato-reg',
    paddingLeft: 5,
    paddingTop: 15,
    paddingRight: 5,
  },

  fundingMoney: {
    marginLeft: 30,
  },

  modalContent: {
    alignItems: 'center',
    alignSelf: 'center',
  },

  modalImage: {
    height: '50%',
    width: '50%',
    resizeMode: 'contain',
  },

  resultName: {
    fontSize: 25,
    fontFamily: 'lato-reg',
    alignSelf: 'center',
  },

  resultTitle: {
    alignSelf: 'center',
    fontSize: 30,
    fontFamily: 'lato-bold',
    paddingTop: 30,
  },

  textContainer: {
    alignItems: 'flex-start',
  },

});