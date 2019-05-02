export default class FacePlusPlusApi {

    async upload(photo) {

        try {

            console.log('DEV_MSG: inside upload()');

            let form =  await new FormData();
 
            form.append('api_key', 'sKUgqY-L4It4eegMbUkzrv5M5HCvJ7qk');
            form.append('api_secret', 'XLiKoeCYL1v7iLz0E6ISlE2mUo4m2Kid');
            form.append('image_base64', photo); 
            form.append('outer_id', 'myface_1'); 
      
            let jsonResponse = await fetch('https://api-us.faceplusplus.com/facepp/v3/search', {
                headers:  {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                method: 'POST',
                body: form,
            }); 

            console.log(jsonResponse); 

            let jsonDict = await jsonResponse.json();

            if ( jsonDict.hasOwnProperty('error_message') || jsonDict.faces.length == 0 || jsonDict.results[0].confidence <= 70)  {

                if ( jsonDict.error_message == 'CONCURRENCY_LIMIT REACHED' ) {
                    return 'Server busy!';
                }
                return 'Unknown';
            }
        
            return jsonDict.results[0].user_id; 
        }
    
        catch (e) {
            console.log(e); 
        } 
    }
}
