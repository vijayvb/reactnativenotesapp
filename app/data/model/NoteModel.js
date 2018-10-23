import {guid} from '../../net/firebase/FireBaseUtils'
import firebase from 'react-native-firebase';
import { RootScreen } from '../../screens/RootScreen';

export class NoteModel{

    constructor(){
        //unique identifier
        this.id = guid();
        //note text
        this.noteText = "....";
        //add function to add todays date and time automatically
        this.title = "New Title" ;
        //names of the attendees
        this.attendees = "";
        //images attached with the note - taken as a photo and uploaded
        this.images = [];
        //date time 
        this.datetime = new Date();

    }

    writeToDb(noteData, onCompleted, onError){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("User id " + user.uid);
                console.log("this id " + noteData.id);
                console.log("json of note is " + JSON.stringify(noteData));

                var rootRef = firebase.database().ref();
                var storesRef = rootRef.child(user.uid + '/notes/' + noteData.id);
                storesRef.set({
                    id:noteData.id,
                    noteText:noteData.noteText,
                    title:noteData.title,
                    attendees:noteData.attendees,
                    images:noteData.images,
                    datetime:noteData.datetime
                }).then(()=>{
                    if(onCompleted)
                        onCompleted();
                }).catch((error) => {
                    if(onError)
                        onError(error);
                });
            }
            else{
                if(onError)
                    onError("User not logged in");
            }
        });
    }

}

export function getNotesRefForUser(onReturnRef){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("User id " + user.uid);
            var rootRef = firebase.database().ref();
            var storesRef = rootRef.child(user.uid + '/notes/');
            if(onReturnRef)
                onReturnRef(storesRef);
        }
        else{
            onError("User not logged in");
        }        
    });
}