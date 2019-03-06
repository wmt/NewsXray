
export default class FacePlusPlusApi {

    async upload(photo) {

        try {

            console.log('DEV_MSG: inside upload()');

            let form =  await new FormData();
 
            form.append('api_key', 'ULjlEEDH1KmpJ-lDVTmDd9wagpCS1lkq');
            form.append('api_secret', '2UBc7muQ9rQD9mzyE_2XzLzsEFUxIhbv');
            form.append('image_base64', photo); 
            form.append('outer_id', 'NewsXrayFaces'); 
      
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
                return 'Unknown';
            }
        
            return jsonDict.results[0].user_id; 
        }
    
        catch (e) {
            console.log(e); 
        } 
    }
}
