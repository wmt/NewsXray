import {Buffer} from 'buffer';

export default class Twitter {

    async getTweets() {

        try {
            'use strict';

            console.log('DEV_MSG: inside getTweets()');


            var apiKey = encodeURI('RdkjXJsLVc5kLhpc3lLIlTvZN');
            var apiSecret = encodeURI('NNCVbJzltx8twXfhFYfxiIAEXtCjMeXVUaPLf2EMFiT1rivi3V');

            let keySecret = await apiKey + ':' + apiSecret;

            let buff = new Buffer(keySecret);

            let encodedData = buff.toString('base64');

            /*
            let jsonResponse = await fetch('https://api.twitter.com/oauth2/token', {
                headers: {
                    

                }

            } */
            


        }

        catch (e) {
            console.log(e); 
        }

    }
}