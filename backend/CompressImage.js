import { ImageManipulator } from 'expo'; 

export default class ImageCompressor {

    static async compressImage( imageURI ) {

        console.log("DEV_MSG: inside compressImage()")

        let imageManip = await ImageManipulator.manipulateAsync(
            imageURI, [{resize: { width: 600 } } ], { // maximum 
              compress : 1.0, 
              format : 'png',
              base64 : true, }
        ); 

        return imageManip.base64; 

    }

} 
