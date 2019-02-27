
export default class FacePlusPlusApi {

    async upload(photo) {

        try {

            console.log('DEV_MSG: inside upload()');

            //console.log(photo); 


            
        let form =  await new FormData();
 
        form.append('api_key', 'ULjlEEDH1KmpJ-lDVTmDd9wagpCS1lkq');
        form.append('api_secret', '2UBc7muQ9rQD9mzyE_2XzLzsEFUxIhbv');
        //uncomment the next line to get no match
        //form.append('image_url', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Mitch_McConnell_2016_official_photo.jpg/220px-Mitch_McConnell_2016_official_photo.jpg');
        //uncomment the next line to get a match
        //form.append('image_url', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Alexandria_Ocasio-Cortez_Official_Portrait.jpg/220px-Alexandria_Ocasio-Cortez_Official_Portrait.jpg');
        form.append('image_base64', photo); 
        form.append('outer_id', 'NewsXrayFaces'); 
      
        let jsonResponse = await fetch('https://api-us.faceplusplus.com/facepp/v3/search', {
            headers:  {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              },
            method: 'POST',
            body: form,
            
            
            /*JSON.stringify(
                {
                    api_key: 'ULjlEEDH1KmpJ-lDVTmDd9wagpCS1lkq',
                    api_secret: '2UBc7muQ9rQD9mzyE_2XzLzsEFUxIhbv',
                    image_base64: photo,
                    outer_id: 'NewsXrayFaces',
                }
            ) */
            }); 
/*
        console.log(JSON.stringify(
            {
                api_key: 'ULjlEEDH1KmpJ-lDVTmDd9wagpCS1lkq',
                api_secret: '2UBc7muQ9rQD9mzyE_2XzLzsEFUxIhbv',
                image_base64: photo,
                outer_id: 'NewsXrayFaces',
            }
        )); 
*/
        console.log(jsonResponse); 

        let jsonDict = await jsonResponse.json();
        
        //console.log(jsonDict); 

        
        if ( jsonDict.results.length == 0 ) {
            return 'Unknown';
        }
        return jsonDict.results[0].user_id; 
      }
    
    catch (e) {
        console.log(e); 
    } 
    
}

}
