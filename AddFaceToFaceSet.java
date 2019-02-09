package test2;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

public class AddFaceToFaceSet {
	public static void main(String[] args) throws Exception {
//      ������ַ
        String url = "https://api-us.faceplusplus.com/facepp/v3/faceset/addface";
//        ������������    
        List<BasicNameValuePair> formparams = new ArrayList<>();  
        formparams.add(new BasicNameValuePair("api_key", "uz651RUhKY9QBGbs5CeesNu_yFxhv8Cu"));  
        formparams.add(new BasicNameValuePair("api_secret", "e6JX8i1qA6t99CLuGAUpbBG0osZJ-bOE")); 
        formparams.add(new BasicNameValuePair("outer_id", "myface_1"));  
        formparams.add(new BasicNameValuePair("face_tokens", "9f7672c1bd8597668e39dc529abd3a7b"));    
//      ��������
        post(formparams,url);
    }

    /** 
     * ���� post������ʱ���Ӧ�ò����ݴ��ݲ�����ͬ���ز�ͬ��� 
     */  
    public static void post(List<BasicNameValuePair> formparams,String url) {  
        // ����Ĭ�ϵ�httpClientʵ��.    
        CloseableHttpClient httpclient = HttpClients.createDefault();  
        // ����httppost    
        HttpPost httppost = new HttpPost(url);  
        UrlEncodedFormEntity uefEntity;  
        try {  
            uefEntity = new UrlEncodedFormEntity(formparams, "UTF-8");  
            httppost.setEntity(uefEntity);  
            System.out.println("executing request " + httppost.getURI());  
            CloseableHttpResponse response = httpclient.execute(httppost);  
            try {  
                HttpEntity entity = response.getEntity();  
                if (entity != null) {  
                    System.out.println("--------------------------------------");  
                    System.out.println("Response content: " + EntityUtils.toString(entity, "UTF-8"));  
                    System.out.println("--------------------------------------");  
                }  
            } finally {  
                response.close();  
            }  
        } catch (ClientProtocolException e) {  
            e.printStackTrace();  
        } catch (UnsupportedEncodingException e1) {  
            e1.printStackTrace();  
        } catch (IOException e) {  
            e.printStackTrace();  
        } finally {  
            // �ر�����,�ͷ���Դ    
            try {  
                httpclient.close();  
            } catch (IOException e) {  
                e.printStackTrace();  
            }  
        }  
    }
}
