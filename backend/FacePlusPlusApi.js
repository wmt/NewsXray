export default class FacePlusPlusApi {

    async upload(photo) {

        try {

            console.log('DEV_MSG: inside upload()');

            let form =  await new FormData();
 
            form.append('api_key', 'uz651RUhKY9QBGbs5CeesNu_yFxhv8Cu');
            form.append('api_secret', 'e6JX8i1qA6t99CLuGAUpbBG0osZJ-bOE');
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

            if ( jsonDict.hasOwnProperty('error_message') || jsonDict.faces.length == 0 )  {

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