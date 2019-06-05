import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import { Divider, Input, Button, Card } from 'react-native-elements';

// import {Modal, TouchableHighlight, TextInput, KeyboardAvoidingView, Alert} from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import LottieView from 'lottie-react-native';

import { Camera, Permissions } from 'expo';
// import { FaceDetector } from 'expo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FacePlusPlusApi from '../backend/FacePlusPlusApi';
import CompressImage from '../backend/CompressImage'; 
import firebase from "firebase"; 
require("firebase/firestore");

import Database from '../backend/Database'; 
import ImageCompressor from '../backend/CompressImage';
import Crowdsource from '../backend/Crowdsource'; 



var loadingText = ['Composing face', 'Predicting the political climate','Whiz bang AI magic', 'Detecting the invisible hand', 'Reading facial expressions', 'Searching for lizard people', 'Just Google it', 'Not all faces are what they appear', 'Isolating face', 'Contacting the intertubes', 'Almost done', 'Any day now']

export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.renderSource = this.renderSource.bind(this);
    this.renderAmount = this.renderAmount.bind(this);
    }

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
    resultUnknownVisible: false, 
    name: "Unknown",
    party: "Unknown",
    funding: [],
    image: null,
    notable: "N/A",
    loading: false, 
    tableHead: ['Funding Source', 'Amount'],
    amount: [],
    widthArr: [220, 130],
    yes: false,
    no: false,
    didSubmit: false,
    scannedFace: null,
    photoURL: "",
    smallPic: "Unknown"

  };

  renderSource() {
  return this.state.funding.map(([source, amount], i) => (<Text key={i} style={styles.tableData} 
  textStyle={styles.tableText}>{source}</Text>))}

  renderAmount() {
  return this.state.funding.map(([source, amount], i) => (<Text key={i} style={styles.tableData}
  textStyle={styles.tableText}>{amount}</Text>))} 
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

  setUnknownModal(visible) {
    this.setState({
      resultUnknownVisible: visible
    })
  }

  async componentDidMount(){
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted"});
    if (!firebase.apps.length) { firebase.initializeApp(Database.FirebaseConfig)};
    
    intervalID = setInterval(()=>{
      if (this.state.loadingIndex === (loadingText.length - 1))
      {
        this.setState({loadingIndex: 0})
      }
      this.setState({loadingIndex: this.state.loadingIndex+1})
    }, 1500);
  
  }



componentWillUnmount() {
  this._isMounted = false;
  clearInterval(intervalID);
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
    photoURL: "",
    funding: [],
    image: null,
    loading: true,
    loadingIndex: 0,
    smallPic: "Unknown"
   });
   const db = firebase.firestore();

   this.camera.takePictureAsync( { base64: true } )
   .then( async function(result) {
     a = new FacePlusPlusApi();
     let pic64 = await ImageCompressor.compressImage(result.uri);
     let smallPic = await ImageCompressor.compressSmallImage(result.uri); 
     let targetName = await a.upload(pic64);
     return [smallPic,targetName];
   }).then( result => {
     this.setState({
       pic: result[0]
     }); 
     return result[1]; 
   }).then( result =>  {
     this.setState({
       name: result,
    });
     return result; })
   .then( async function(result) {
     if ( result == 'Unknown') 
     { // text input goes here 
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
         photoURL: doc.data().url,
       })
       this.setResultModal(true,this.state.name);
       this.setState({
         loading: false,
       });
      }) 
    }
    else {
      this.setUnknownModal(true);
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
                {/* <View style={styles.navBar}> */}
                  {/* <View style={{width: '50%', height: '50%'}}> */}
                    <TouchableOpacity
                      onPress={()=>{
                        this.setResultModal(!this.state.resultModalVisible);
                      }}>

                      <MaterialCommunityIcons
                        onPress={()=>{
                          this.setResultModal(!this.state.resultModalVisible);
                        }}
                        name="close-circle"
                        style={styles.navBarButton}>
                      </MaterialCommunityIcons>
                    </TouchableOpacity>
                  {/* </View> */}
                {/* </View> */}

                {/* Information returned from back-end goes here */}
                <ScrollView
                  showVerticalScrollIndicator={true} 
                  contentContainerStyle={styles.modalContent}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{width: '50%', height: '100%'}}>
                    
                      {this.state.photoURL === undefined ? 
                      
                      <Image style={styles.resultImage} source={require("../assets/images/robot-dev.png")}></Image> : 
                      <Image style={styles.resultImage} source={{uri: this.state.photoURL}}></Image> }
                    </View>

                    <View style={{width: '50%', height: '100%'}}>
                      <Text style={styles.resultNamePerson}> {this.state.name} </Text>
                      <Divider style={{backgroundColor: 'black', marginRight: 10}} />

                      <Text style={styles.resultTitle}> Occupation </Text>
                      <View style={{backgroundColor: 'rgba(91,127,177, 0.1)', borderRadius: 10, marginRight: 15, paddingTop: 5, borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1}}>
                        <Text style={styles.resultName}> {this.state.occupation} </Text>
                      </View>

                      <Text style={styles.resultTitle}> Party </Text>
                      <View style={{backgroundColor: 'rgba(91,127,177, 0.1)', borderRadius: 10, marginRight: 15, paddingTop: 5, borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1}}>
                        <Text style={styles.resultName}> {this.state.party} </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.notableTitle}>Notable Information</Text>
                  <View style={{backgroundColor: 'rgba(91,127,177, 0.1)', borderRadius: 10, paddingTop: 5, marginLeft: 15, marginRight: 15, borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1}}>
                    <Text style={styles.resultName}> {this.state.notable} </Text>
                  </View>
                  {/* NEW TABLE GOES RIGHT HERE */}
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, marginBottom: 0}}>
                    <View style={{width: '54.5%', height: 50, backgroundColor: '#5B7FB1', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableHeaderTexts}>Funding Source</Text>
                    </View>
                  
                    <View style={{width: '32.5%', height: 50, backgroundColor: '#5B7FB1', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableHeaderTexts}>Amount</Text>
                    </View> 
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 0}}>
                    <View style={{width: '54.5%', backgroundColor: 'white', borderColor: 'black', borderWidth: 1, alignItems: 'center'}}>{this.renderSource()}</View>
                    <View style={{width: '32.5%', backgroundColor: 'white', borderColor: 'black', borderWidth: 1, alignItems: 'center'}}>{this.renderAmount()}</View>
                  </View>
                  {/* ENDS */}
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
                    name="close-circle"
                    style={styles.navBarButton}>
                  </MaterialCommunityIcons>
                </TouchableOpacity>
                

                <View style={styles.modalContent}>  
                    {/* button for tutorial pages*/}
                    {/* logo for application would go here */}
                    {/* <Text style={styles.aboutTitle}> About News X-Ray </Text> */}
                    <View style={styles.unknownContent}>
                    <Image style={{width: "50%", height: "50%", alignSelf: 'center'}}source={require('../assets/images/logo.png')} />
                    <Text style={styles.aboutText}> News X-Ray allows you to scan a pundit's face in real-time.  </Text>
                    {/* <Divider style={{ backgroundColor: 'blue', height: 10 }} /> */}
                    <Text style={styles.aboutLine2}>Get transparent facts instantly.</Text>
                    <Text style={styles.aboutLine2}>Data taken from official government sources and watchdog sites.</Text>
                    </View>
                </View>
              </View>
            </View>
          </Modal>

        <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.resultUnknownVisible}
            onRequestClose={()=>{
              Alert.alert("modal has been closed.");
            }}>
          <View style={styles.modalContainer}>
            <View style={styles.innerModalContainer}>
              {/* <View style={styles.navBar}> */}
                <TouchableOpacity
                  onPress={()=>{
                    this.setUnknownModal(!this.state.resultUnknownVisible);
                  }}>

                <MaterialCommunityIcons
                  onPress={()=>{
                    this.setUnknownModal(!this.state.resultUnknownVisible);
                    if (this.state.yes == true)
                    {
                      this.setState({yes: false});
                    }
                  }}
                  name="close-circle"
                  style={styles.navBarButton}>
                </MaterialCommunityIcons>
                </TouchableOpacity>
              {/* </View> */}

                  {/* unknown modal */}
              { this.state.yes === false ?
                <View style={styles.modalContent}>
                  <View style={styles.unknownContent}>
                    <Image style={{height: '50%', width: '100%'}} source={require('../assets/images/question.png')} />
                    <Text style={styles.resultTitle}> Face is not in our database.</Text>
                    <Text style={styles.resultTitle}> Do you recognize this person? </Text>
              
                    <View style={{flex: 1, flexDirection: 'row'}}>                      
                      <View style={{width: '50%', height: '100%'}}>
                        <Button
                          buttonStyle = {{alignSelf: 'flex-end', width: '65%', backgroundColor: 'rgba(255, 0, 0, 0.7)', marginRight: 5, marginTop: 10}} 
                          title="No"
                          onPress={()=>{
                            this.setState({
                              no: true,
                              yes: false,
                            })
                            Alert.alert(
                              'Oops!',
                              'Our team does not currently have information on this face. Try scanning another face.',
                              [
                                {text: 'Okay',
                                 onPress: ()=>{
                                   this.setModalVisible(this.state.resultUnknownVisible = false)
                                   this.setState({no: false})
                                  }
                              }
                              ]
                            )
                          }}
                          />
                      </View>

                      <View style={{width: '50%', height: '100%'}}>
                        <Button 
                          buttonStyle = {{alignSelf: 'flex-start', width: '65%', backgroundColor: 'rgba(0, 128, 0, 0.7)', marginLeft: 5, marginTop: 10}}
                          title="Yes"
                          onPress={()=>(this.setState({
                            yes: true,
                          }))}
                          />
                      </View>
                    </View>      
                  </View>
                 </View> 

                  // if yes -> display input data
                  : <View style={styles.modalContent}>
                      <Text style={styles.knownTitle}> Please input what you know about the person. </Text>
                      <Input
                        placeholder=" Name"
                        onChangeText= { (text) => this.setState({name: text})}
                        leftIcon={
                          <Icon
                            name='user'
                            size={24}
                            color='black'
                            />
                        } /> 

                        
                        <Input
                          placeholder=" Occupation"
                          onChangeText= { (text) => this.setState({occupation: text})}
                          leftIcon={
                            <Icon
                              name='briefcase'
                              size={24}
                              color='black'
                              />
                          } />
                        
                        <Input 
                          placeholder=" Political Affiliation"
                          onChangeText= { (text) => this.setState({party: text})}
                          leftIcon={
                            <Icon
                              name='flag'
                              size={24}
                              color='black'
                              />
                          } />
                        
                        <Input 
                          placeholder=" Notable information"
                          onChangeText= { (text) => this.setState({notable: text})}
                          leftIcon={
                            <Icon
                              name='quote-right'
                              size={24}
                              color='black'
                              />
                          } />
                        
                        <Button
                          buttonStyle = {{marginTop: 20, alignSelf: 'center', width: '50%'}}
                          title="Submit"
                          onPress={()=> {
                            Alert.alert(
                              'Success',
                              'Information has been submitted! Our team will vet the data.',
                              [
                                {text: 'Okay',
                                 onPress: ()=>{
                                   Crowdsource.sendUnverified(this.state.name, this.state.party, this.state.occupation, this.state.notable, this.state.smallPic)
                                   this.setModalVisible(this.state.resultUnknownVisible=false)
                                   this.setState({
                                     yes: false,
                                   })
                                  }
                                }
                              ]
                            )
                          }}
                          />
                                                  
                   </View> }
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

            {this.state.loading === true ? 
                <View style={loading_style.container}>
                  <View style={loading_style.animationContainer}>
                    <LottieView
                      // style={loading_style.animationContainer}
                      source={require('../assets/images/scanning2.json')}
                      autoPlay={true}
                      loop={true}
                      />
                  </View>
                  <Text style={{fontSize: 20, textAlign: 'center', color: 'white', fontFamily:'lato-reg'}}> {loadingText[this.state.loadingIndex]} </Text>
                </View> : null}

          </View>

        </View>

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
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'purple',
    // marginBottom: '15%'
  },

  navBarButton: {
    color: "black",
    fontSize: 30,
    alignSelf: 'flex-end',
    // marginBottom: '10%',
    marginLeft: '50%',
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
    alignItems: 'center',
    paddingTop: 15,
  },

  tableData: {
    height: 25,
    backgroundColor: 'white',
  },

  tableHeaderTexts: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 11
    },

  tableText: {
    textAlign: 'center'
  },

  modalContent: {
    //alignItems: 'center',
   // alignSelf: 'center',
  //  height: '75%'

  },

  modalImage: {
    height: '50%',
    width: '50%',
    resizeMode: 'contain',
  },

  resultName: {
    fontSize: 18,
    fontFamily: 'lato-reg',
    marginLeft: 15,
    paddingBottom: 5,
    textAlign: 'auto',
  },

  resultTitle: {
    marginLeft: 5,
    fontSize: 22.5,
    fontFamily: 'lato-bold',
    paddingTop: 15,
    paddingBottom: 2,
  },

  resultNamePerson: {
    marginLeft: 5,
    fontSize: 25,
    fontFamily: 'lato-bold',
    paddingBottom: 10,
    color: '#5B7FB1',
  },

  notableTitle: {
    marginLeft: 15,
    fontSize: 22.5,
    fontFamily: 'lato-bold',
    paddingTop: 30,
    paddingBottom: 2,
  },

  //new I added
  resultImage: {
    padding: 15,
    marginLeft: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    width: 150,
    height: 200,
    alignSelf: 'center',
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
    width: '100%',
    // flex: 1,
    // flexDirection: 'row'
  },

  unknownContent: {
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    // borderWidth: 2,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 5,
    height: '88%',
    width: '95%'
  },

  knownTitle: {
    marginLeft: 5,
    fontSize: 22.5,
    fontFamily: 'lato-bold',
    // paddingTop: 15,
    paddingBottom: 2,
    textAlign: 'center',
  }
});

const loading_style = StyleSheet.create({
  container: {
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // backgroundColor: 'purple',
    justifyContent: 'center',
    height: '100%',
  },

  animationContainer: {
    // backgroundColor: 'pink',
    alignSelf: 'center',
    width: '50%',
    height: '50%',
  }
})
