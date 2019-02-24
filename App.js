import React, { Component } from "react";
import { StyleSheet, View ,Touchable,Text,Button, TouchableHighlight,Image} from "react-native";

import PlaceInput from "./src/components/PlaceInput/PlaceInput";
import PlaceList from "./src/components/PlaceList/PlaceList";
import TestButton from "./src/components/TestButton";
import ImagePicker from "react-native-image-picker";

export default class App extends Component {


  state = {
    places: [],
    buttonTurn:true,
    photo:null,

  };
  

  placeAddedHandler = placeName => {
    this.setState(prevState => {
      return {
        places: prevState.places.concat(placeName)
      };
    });
  };
  handleClickMe =() =>{

    const options={
      noData:true
    };
     ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);

          if (response.uri){
            this.setState({photo:response})
          }
          else {
            const source = { uri: response.uri };

            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };
            this.setState({
              avatarSource: source,
            });
          }
      });
  };

  render() {
    const {photo} = this.state;
    //? = if (this.state.buttonTurn = true) -> red, else blue
    const Buttoncolor = this.state.buttonTurn ? 'red' : 'blue'

    return (
      
        <View style={styles.letsnewsxray}>
          {photo && (<Image source ={{uri:photo.uri}}
                            style={{width:300,height:300}}/>
                            )}
          <Button
          title="Lets NewsXray"
          onPress={this.handleClickMe}

          />
        </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  messup:{
    flex:0.1,
    padding:5,
    backgroundColor: "#eee",
    alignItems:"center"
    
  },
  letsnewsxray:{
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent:"center"
  }
});
