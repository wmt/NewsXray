import firebase from "firebase"; 
require("firebase/firestore");
import Database from '../backend/Database'; 


export default class Crowdsource {

    static sendUnverified( nameInput, partyInput, jobInput, notesInput, base64Input ) {

        if (!firebase.apps.length) 
            firebase.initializeApp(Database.FirebaseConfig);

        const db = firebase.firestore();

        db.collection("unverified").add({
            name: nameInput,
            party: partyInput,
            job: jobInput,
            notes: notesInput,
            image64: base64Input
        })
    }
}
