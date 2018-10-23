import firebase from 'react-native-firebase';

export function uploadImageToCloud(filePath, fileName, onCompleted, onError){
    var storageRef = firebase.storage().ref();
    var metadata = {
        contentType: 'image/jpeg'
      };
    var uploadTask = storageRef.child(fileName).put(filePath, metadata);
    var _snapshot = null;

    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
        _snapshot = snapshot;
      }, function(error) {
        // Handle unsuccessful uploads
        console.log("could not upload file")
        onError(error);
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            console.log('obj ' + _snapshot );
            _snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            onCompleted(downloadURL);
        });
      });
      
}

export function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}