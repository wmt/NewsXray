package test2;

import java.net.URI;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class detect {

    public static void main(String[] args) {
        
        HttpClient httpclient = HttpClients.createDefault();
        
        //�����������
        String api_key = "uz651RUhKY9QBGbs5CeesNu_yFxhv8Cu";
        String api_secret = "e6JX8i1qA6t99CLuGAUpbBG0osZJ-bOE";
        String image_url = "https://pbs.twimg.com/profile_images/666964356106731520/kspGOtS1_400x400.jpg";
        String return_attributes = "gender,age";
        
        try
        {
            URIBuilder builder = new URIBuilder("https://api-us.faceplusplus.com/facepp/v3/detect");
            URI uri = builder.build();
            HttpPost request = new HttpPost(uri);  
                     
            StringEntity reqEntity = new StringEntity("api_key="+api_key+"&api_secret="+api_secret+"&image_url="+image_url+"&return_attributes="+return_attributes+"");
            reqEntity.setContentType("application/x-www-form-urlencoded"); 
            request.setEntity(reqEntity);
            
            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();

            if (entity != null) 
            {
                System.out.println(EntityUtils.toString(entity));
            }
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}