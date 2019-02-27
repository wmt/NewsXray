import { ImageManipulator } from 'expo'; 

export default class ImageCompressor {

    static async compressImage( imageURI ) {

        console.log("DEV_MSG: inside compressImage()")

        //console.log( imageURI );

        let imageManip = await ImageManipulator.manipulateAsync(
            imageURI, [{resize: { width: 100 } } ], {
              compress : 1.0, 
              format : 'png',
              base64 : true, }
        ); 


        //console.log(imageManip.base64); 

        return imageManip.base64; 

    }

} 