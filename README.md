# News X-Ray
Imagine someone is watching the news and sees a pundit advocating for a new policy. Unbeknownst to the viewer, that person is currently taking tons of money from donors lobbying to get that policy passed. Thus, the pundit could be advocating for the policy not because they honestly support it but for self-gain. In such situations, it is very rare for the news network and the pundit to disclose such information to viewers. And not every viewer has the time to find such shadowy, financial connections through watchdog sites and relevant databases. 

It is this missing and not easily obtainable context, where money causes people with authority to support things they don’t believe in, that the app will provide to users. 

Essentially, the way that the app works is that when the user sees a pundit they don’t know (be it in the newspaper, real life, or on a screen), they should be able to open the app, point their camera at the person, and see their funding sources and commitments. 

In conclusion, there are currently too many talking heads on news channels advocating for some particular policy and there is no easy way for people to know that they are in in the pockets of lobbyists interested in pushing their perspectives onto the public. There is no transparency with these pundits and we want to be able to bring that information to users. By having an AR app with facial recognition that can easily detect a pundit’s face and provide information of their donors, our users will become more knowledgeable of the people involved in politics.

The app works by using the Face++ face recognition API to match pictures to names and these names are used to retrieve data from a Firebase Cloudstore. This data is returned back to the user. 

# Privacy Policy
No personal or usage data will be collected from users. The only exception to this is when users decide to submit new information to users about certain pundits and politicians recognized by the app. 

# Adding People to the App
1) Use Ryan's Java program (JAR file link here: https://drive.google.com/open?id=1QW93s893JZhLwl6oJZP6O88DggFvLUuX) to:
    - Add new person's photo to Face++ using a URL (URL must end in JPG or PNG, cannot be larger than 2MB, and must be between 48x48 to 4096x4096 pixels)
    - Associate photo with name of target
2) Create document in Firebase Cloudstore "TestDatabase" containing the following fields (case-sensitive): 
    - docID [string] : recommend it matches person's name to help with UI
    - name [string] : must match name you inputted in Java program
    - party [string]
    - occupation [string]
    - notable [string]
    - funding [map{string,string}] : must be a map of string values
    - url [string] : must be a valid URL to image

# Face++ (Face Recognition API) Login Credentials
username: ryanzhang

password: 123456

# Current Database
[Name] [# of Photos Used in Face++]

Ralph Abraham

Glenn Beck

Joe Biden

Deirdre Bolton

George Bush

Ted Cruz

Andrew Cuomo

John Delaney

Sean Hannity

Nan Hayworth

Jared Kushner

Rush Limbaugh

Kevin McCarthy

Mitch McConnell

Robert Mueller

Benjamin Netanyahu

Gavin Newsom

Michelle Obama

Ilhan Omar

Nancy Pelosi

Mike Pompeo

Bernie Sanders

Sarah Sanders

Rick Scott

Eric Trump

Melania Trump

Elizabeth Warren

William F. Weld

Alexandria Ocasio-Cortez (x2)

Hillary Clinton (x2)

Jessica Tarlov (x2)

John Yoo (x2)

Josh Holmes (x2)

Katilan Collins (x2)

Mike Pence (x2)

Neal Katyal (x2)

Symone Sanders (x2)

Donald Trump (x2)

Barack Obama (x3)

Jen Psaki (x3)

Andrew Yang

Angela Rye

April Ryan

David Gregory

Gina Loudon

Amanda Carpenter

Matt Schlapp

Maire Harf

Byron York


Senior project:	

 import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';	

 run in project folder:	
npm install react-native-table-component	
npm install react-native-elements	
npm i --save lottie-react-native	
(dont do:npm install expo-face-detector)	

 react-native link lottie-ios	
react-native link lottie-react-native
