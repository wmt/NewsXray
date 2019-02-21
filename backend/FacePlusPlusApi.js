
export default class FacePlusPlusApi {

    async upload(photo) {
      
        let form =  await new FormData();
 
        form.append('api_key', 'ULjlEEDH1KmpJ-lDVTmDd9wagpCS1lkq');
        form.append('api_secret', '2UBc7muQ9rQD9mzyE_2XzLzsEFUxIhbv');
        form.append('image_url', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Alexandria_Ocasio-Cortez_Official_Portrait.jpg/220px-Alexandria_Ocasio-Cortez_Official_Portrait.jpg');
        form.append('outer_id', 'NewsXrayFaces');
      
        let jsonResponse = await fetch('https://api-us.faceplusplus.com/facepp/v3/search', {
            headers:  {
                'Content-Type': 'multipart/form-data'
              },
            method: 'POST',
            body: form, } ); 


        let jsonDict = await jsonResponse.json(); 
        console.log(jsonDict.results[0].user_id); 
        return jsonDict.results[0].user_id; 

      }
        
    
}

