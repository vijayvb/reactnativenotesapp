import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { FireBaseTest } from './app/screens/firebase/FireBaseTest';
import { RootScreen } from './app/screens/RootScreen';
import { Root } from 'native-base'
//remove if not using 
import firebase from 'react-native-firebase';
import { NotesListScreen } from './app/screens/notes/NotesListScreen';
import { NotesEditorScreen } from './app/screens/notes/NotesEditorScreen';
import { SignInScreen } from './app/screens/loginsignup/SignInScreen';


const RootStack = createStackNavigator({
    Root: {
      screen: RootScreen
    },
    FirebaseTest: {
      screen: FireBaseTest
    },
    NotesList: {
      screen: NotesListScreen
    },
    NotesEditor: {
      screen: NotesEditorScreen
    },
    SignIn: {
      screen: SignInScreen
    }
  },
  {
    initialRouteName: 'Root',
  }
);


export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());

    // await firebase.analytics().logEvent('foo', { bar: '123'});
  }

  render() {
    return (
      <Root>
        <RootStack />
      </Root>
    );
  }
}
