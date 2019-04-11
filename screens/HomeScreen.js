import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Modal, TouchableHighlight, Alert} from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';

import { Camera, Permissions } from 'expo';
import { FaceDetector } from 'expo';
import { Button } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import FacePlusPlusApi from '../backend/FacePlusPlusApi';
import CompressImage from '../backend/CompressImage'; 
import firebase from "firebase"; 
require("firebase/firestore");

import Database from '../backend/Database'; 
import ImageCompressor from '../backend/CompressImage';
import Crowdsource from '../backend/Crowdsource'; 
import Spinner from 'react-native-loading-spinner-overlay';




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
    funding: [],
    image: null,
    notable: "N/A",
    loading: false, 
    tableHead: ['Funding Source', 'Amount'],
    amount: [],
    widthArr: [220, 130]

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
    loading: true,
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
     if ( result == 'Unknown') 
     { // text input goes here 
      //  await Crowdsource.sendUnverified('Tester', 'Testing notes');
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
         notable: doc.data().notable,
       })
       console.log(doc.data().name);
       console.log(doc.data().occupation);
       console.log(doc.data().party);
       console.log(doc.data().funding);
       console.log(doc.data().notable)
       this.setResultModal(true,this.state.name);
       this.setState({
         loading: false,
       });
      }) 
    }
    else {
      this.setResultModal(true, this.state.name);
      this.setState({
        loading: false,
      });
    }
   }); 
   };

 }  
  

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
        <View style={styles.viewContainer}>
           <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.resultModalVisible}
            onRequestClose={()=>{
              Alert.alert("Modal has been closed.");
            }}>

            <View style={styles.modalContainer}>
              <View style={styles.infoInnerModalContainer}>
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
                <ScrollView
                  showVerticalScrollIndicator={true} 
                  contentContainerStyle={styles.modalContent}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{width: 170, height: 200}}>
                  <Image style={styles.resultImage} source={require('../assets/images/robot-dev.png')}></Image>
                  </View>
                  <View style={{width: 220, height: 200}}>
                  <Text style={styles.resultNamePerson}> {this.state.name} </Text>
                  <Text style={styles.resultTitle}> Occupation: </Text>
                  <Text style={styles.resultName}> {this.state.occupation} </Text>
                  <Text style={styles.resultTitle}> Party: </Text>
                  <Text style={styles.resultName}> {this.state.party} </Text>
                  </View>
                  </View>
                  {/* <Image style={{width: "50%", height: "100%", alignSelf: 'center', borderRadius: 3, borderColor: 'black', borderWidth: 5}}source={require('../assets/images/aoc.png')} /> */}
                  <Text style={styles.resultTitle}>Notable Information:</Text>
                  <Text style={styles.resultName}> {this.state.notable} </Text>

                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'}}>

                    <View style={{width: 350, height: 200, marginTop: 20}}>
                    <Table borderStyle={{borderColor: '#707070'}}>
                    <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.tableHeader} textStyle={styles.tableHeaderText}></Row>
                  </Table>
                  <Table borderStyle={{borderColor: '#707070'}}>
                    {
                      this.state.funding.map(
                        ([source, amount]) => (
                        <Row
                        widthArr={this.state.widthArr}
                        style={styles.tableData}
                        textStyle={styles.tableText}
                        data={[source,amount]}
                        ></Row>
                      ))
                    }
                  </Table>                  
                    </View>
                  </View>

                  <View style={styles.textContainer}>
                      
                  </View>
                  
                </ScrollView>

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
                

                <View style={styles.modalContent}>  
                    {/* button for tutorial pages*/}
                    {/* logo for application would go here */}
                    {/* <Text style={styles.aboutTitle}> About News X-Ray </Text> */}
                    <Image style={{width: "50%", height: "50%", alignSelf: 'center'}}source={require('../assets/images/logo.png')} />
                    <Text style={styles.aboutText}> News X-Ray allows you to scan a pundit's face in real-time.  
                    </Text>
                    <Text style={styles.aboutLine2}>Get transparent facts instantly.</Text>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.loadingContainer}>
            <TouchableOpacity
              onPress={()=>{
                this.setModalVisible(true);
              }}>
              <Image source = {require('../assets/images/NewsXRayLogo2.png')}></Image> 
            </TouchableOpacity>

            
              <ActivityIndicator size="large" color="#ffffff" animating={this.state.loading} style={{justifyContent: 'center', marginTop: 250,}}/>
          </View>

        </View>

          {/* <View style={styles.cameraButtonsContainer}> */}
            <Text style = {styles.faceDetectedText}>
              {this.state.faceDetected ? 'Face Detected' : 'No face detected'}
            </Text> 

            <TouchableOpacity>
              <MaterialCommunityIcons 
                onPress={this.takePicture}
                name="circle-outline"
                style={styles.takePictureButton}>
              </MaterialCommunityIcons>
            </TouchableOpacity>
          {/* </View> */}
          </Camera>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({

  viewContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    // marginBottom: 40,
  },

  modalContainer: {
    flex: 1,
    //backgroundColor: "rgba(0,0,0,0.5)",
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

  infoInnerModalContainer: {
    height: '75%',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginTop: 125,
    marginLeft: 15,
    marginRight: 15
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
    fontSize: 100,
    alignSelf: 'center',
  },

  faceDetectedText: {
    fontSize: 20, 
    marginBottom: 10, 
    color: 'white',
    textAlign: 'center',
  },
  
  fundingSource: {
    fontSize: 18,
    //fontFamily: 'lato-reg',
    alignItems: 'center',
    paddingTop: 15,
    //paddingRight: 30,
  },

  //also new!
  tableHeader: {
    height: 50,
    backgroundColor: '#5B7FB1',
  },

  tableData: {
    height: 25,
    backgroundColor: 'white',
  },

  tableHeaderText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white'
    
  },

  tableText: {
    textAlign: 'center'
  },

  fundingMoney: {
    //marginLeft: 30,
  },

  modalContent: {
    //alignItems: 'center',
   // alignSelf: 'center',

  },

  modalImage: {
    height: '50%',
    width: '50%',
    resizeMode: 'contain',
  },

  resultName: {
    fontSize: 18,
    fontFamily: 'lato-reg',
    marginLeft: 5
  },

  resultTitle: {
    marginLeft: 5,
    fontSize: 20,
    fontFamily: 'lato-bold',
    paddingTop: 10,
  },

  resultNamePerson: {
    marginLeft: 5,
    fontSize: 20,
    fontFamily: 'lato-bold',
    paddingTop: 10,
    color: '#5B7FB1'
  },

  //new I added
  resultImage: {
    padding: 15,
    marginLeft: 10,
    borderRadius: 10,
    width: 150,
    height: 200
  },

  textContainer: {
    alignItems: 'flex-start',
  },

  aboutTitle: {
    textAlign: 'center',
    fontFamily: 'slabo-reg',
    fontSize: 35,
    fontWeight: 'bold'
  },

  fundingSource: {
    justifyContent: 'space-evenly',
    fontSize: 18,
    fontFamily: 'lato-reg',
    paddingLeft: 5,
    paddingTop: 15,
    paddingRight: 5,
  },

  aboutText: {
    fontFamily: 'lato-bold',
    fontSize: 20,
    textAlign: 'center',
    paddingLeft: 16,
    paddingRight: 16,

  },

  aboutLine2: {
    paddingTop: 20,
    fontFamily: 'lato-bold',
    fontSize: 20,
    textAlign: 'center',
  },

  loadingContainer: {
    // paddingRight: 210,
    // marginTop: 100,
    width: 400,
    // height: 200,
    // backgroundColor: 'pink',
    // alignSelf: 'center',
    // marginRight: 50,
  }
});
