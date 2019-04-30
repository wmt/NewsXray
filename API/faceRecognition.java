package face;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class faceRecognition {

        static String api_key = "sKUgqY-L4It4eegMbUkzrv5M5HCvJ7qk";
        static String api_secret = "XLiKoeCYL1v7iLz0E6ISlE2mUo4m2Kid";
        static String return_attributes = "gender,age";

    public static void main(String[] args) {
        try{
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            String userId;
            String imageUrl;
            System.out.println("What is the image url?");
            imageUrl = br.readLine();
            System.out.println("What is the person's name?");
            userId = br.readLine();
            String token = detect(imageUrl);
            setUserId(token, userId);
            addfaceTofaceSet(userId);

        }catch (IOException e){

            e.printStackTrace();
        }
    }

    public static String detect (String image_url){
        String detectApi  ="https://api-us.faceplusplus.com/facepp/v3/detect";
        String jsonString = httpRequest.sendPost(detectApi,"api_key="+api_key+"&api_secret="+api_secret+"&image_url="+image_url+"&return_attributes="+return_attributes+"");
        System.out.println("detect接口的返回："+jsonString);
        JSONObject jsonObject = JSONObject.fromObject(jsonString);
        JSONArray faces = jsonObject.getJSONArray("faces");
        JSONObject firstItem =  faces.getJSONObject(0);
        String firstToken = firstItem.getString("face_token");
        return firstToken;
    }

    public static void setUserId(String token,String userId){
        String setUserId = "https://api-us.faceplusplus.com/facepp/v3/face/setuserid";
        String res = httpRequest.sendPost(setUserId,"api_key="+api_key+"&api_secret="+api_secret+"&face_token="+token+"&user_id="+userId+"");
        System.out.println("setuserid接口的返回："+res);
    }

    public static void addfaceTofaceSet(String token){
        String addfaceTofaceSet = "https://api-us.faceplusplus.com/facepp/v3/faceset/addface";
        String res = httpRequest.sendPost(addfaceTofaceSet,"api_key="+api_key+"&api_secret="+api_secret+"&face_tokens="+token+"&outer_id=myface_1"+"");
        System.out.println("addfaceTofaceSet接口的返回："+res);
    }
}