import React, { Component } from "react";
import { StyleSheet, View ,Touchable,Text,Button, TouchableHighlight} from "react-native";

import PlaceInput from "./src/components/PlaceInput/PlaceInput";
import PlaceList from "./src/components/PlaceList/PlaceList";
import TestButton from "./src/components/TestButton"

export default class App extends Component {


  state = {
    places: [],
    buttonTurn:true,

  };

  placeAddedHandler = placeName => {
    this.setState(prevState => {
      return {
        places: prevState.places.concat(placeName)
      };
    });
  };

  render() {
    //? = if (this.state.buttonTurn = true) -> red, else blue
    const Buttoncolor = this.state.buttonTurn ? 'red' : 'blue'

    return (
      <View style={styles.container}>
        <PlaceInput onPlaceAdded={this.placeAddedHandler} />
        <PlaceList places={this.state.places} />

        <Text style={styles.messup}>imjustmessup</Text>

        <TouchableHighlight
          style={{backgroundColor:Buttoncolor}}
          onPress={()=> this.setState({buttonTurn:!this.state.buttonTurn})}>
          {/* 1,we had Buttoncolor set up  and pass it here as a variable ,
              2, assign onPress to a setState everytime to opposite value T/F
          */}

          
          <Text>what</Text>
        </TouchableHighlight>



        {/* <Text>{this.state.counter}</Text>
        <TestButton/> */}



        
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
    
  }
});
