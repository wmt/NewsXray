import React, { PureComponent } from 'react';
import { Button,Text,StyleSheet,View} from 'react-native';


const TestButton = (props) =>{

    return (
      <Button title ="click here"
        onPress={()=> props.onPress()}
      />
    );
}
export default TestButton;

