import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase'
import { StackActions, NavigationActions } from 'react-navigation';

export class RootScreen extends React.Component {

  static userId = null;
  
  static navigationOptions = {
    header: null,
  };



  componentDidMount(){
    var nav = this.props.navigation;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //go to notes list
        RootScreen.userId = user.id;
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'NotesList' })],
        });
        nav.dispatch(resetAction);
      } else {
        // No user is signed in.
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'SignIn' })],
        });
        nav.dispatch(resetAction);
      }
    });  
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.textTitle}>Easy Notes</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textTitle: {
      textAlign:'center',
      fontStyle:'normal',
      fontFamily:'HelveticaNeue-Medium',
      fontSize:18,
      margin:10,
  }
});