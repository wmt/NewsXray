import { ImageManipulator } from 'expo'; 

export default class ImageCompressor {

    static async compressImage( imageURI ) {

        let imageManip = await ImageManipulator.manipulateAsync(
            imageURI, [{resize: { width: 600 } } ], { // maximum 
              compress : 1.0, 
              format : 'png',
              base64 : true, }
        ); 

        return imageManip.base64; 

    }
    
    static async compressSmallImage( imageURI ) {


        let imageManip = await ImageManipulator.manipulateAsync(
            imageURI, [{resize: { width: 100 } } ], { // maximum 
              compress : 1.0, 
              format : 'png',
              base64 : true, }
        ); 

        return imageManip.base64; 

    }

} 
