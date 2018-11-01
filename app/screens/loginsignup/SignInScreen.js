import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase'
import { grey } from 'ansi-colors';
import { Toast } from 'native-base';

export class SignInScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            isSignIn: true
        }
        this.doSignIn = this.doSignIn.bind(this);
        this.doSignUp = this.doSignUp.bind(this);
    }

    render() {
        return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.inputItemContainer}>
                <TextInput style={styles.textTitleWithMargin} 
                    placeholder="email"
                    value={this.state.email} 
                    autoCorrect={false}  
                    onChangeText={(text) => this.setState({email:text})} 
                />
            </View>
            <View style={styles.inputItemContainer}>
                <TextInput style={styles.textTitleWithMargin} 
                    value={this.state.password}
                    onChangeText={(text) => this.setState({password:text})} 
                    keyboardType="email-address"
                    secureTextEntry={true}
                    placeholder="password"/>
            </View>
            <TouchableOpacity 
                style={styles.itemContainer}
                onPress={() => {
                    if(this.state.isSignIn)
                        this.doSignIn();
                    else
                        this.doSignUp();    
                }
            }>
                <Text style={styles.textTitle}>{this.state.isSignIn?"SignIn":"Signup"}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.textTitleWithMargin}
                onPress={() => {
                    if(this.state.isSignIn)
                        this.setState({"isSignIn":false});
                    else
                        this.setState({"isSignIn":true});
                }
            }>
                <Text style={styles.textTitle}>{this.state.isSignIn?"New user? Click here to Signup.":"Click here to Signin!"}</Text>
            </TouchableOpacity>
        </View>
        );
    }

    doSignUp(){
        var email = this.state.email.trim();
        var password = this.state.password;
        if(email === "" || password === ""){
            Toast.show({
                text: "Email and Password cannot be null",
                position: 'bottom',
                buttonText: 'Okay'
            });
        }
        else{
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
                console.log("User id " + user.id);
                console.log("User id " + user.email);

                Toast.show({
                    text: "Signup Successful..",
                    position: 'bottom',
                    buttonText: 'Okay'
                });
            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {

                }
                Toast.show({
                    text: "Error: " + errorMessage,
                    position: 'bottom',
                    buttonText: 'Okay'
                });
            });

            Toast.show({
                text: "User created....",
                position: 'bottom',
                buttonText: 'Okay'
            });
        }
    }

    doSignIn(){
        var email = this.state.email.trim();
        var password = this.state.password;
        if(email === "" || password === ""){
            Toast.show({
                text: "Email and Password cannot be null",
                position: 'bottom',
                buttonText: 'Okay'
            });
        }
        else{
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
                
                Toast.show({
                    text: "Signin Successful..",
                    position: 'bottom',
                    buttonText: 'Okay'
                });
             }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {

                }
                Toast.show({
                    text: "Error: " + errorMessage,
                    position: 'bottom',
                    buttonText: 'Okay'
                });
            });

            
        }
    }
}

const styles = StyleSheet.create({
    textTitle: {
        textAlign:'center',
        fontStyle:'normal',
        fontFamily:'HelveticaNeue-Medium',
        fontSize:16,
        margin:10,
        borderRadius: 5,
        borderColor: '#1e1e1e',
    },
    textTitleWithMargin: {
        textAlign:'center',
        fontStyle:'normal',
        fontFamily:'HelveticaNeue-Medium',
        fontSize:16,
        margin:10,
        borderRadius: 5,
        borderColor: '#1e1e1e',
        margin:10
    },
    itemContainer: {
        justifyContent: 'center',
        textAlign:'center',
        borderRadius: 5,
        borderWidth:1,
        height:50,
        width:300,
        borderColor: '#1e1e1e',
        margin:20
    },
    inputItemContainer: {
        justifyContent: 'center',
        textAlign:'center',
        borderRadius: 5,
        borderBottomWidth:2,
        height:50,
        width:300,
        borderColor: '#1A1A1A',
        margin:10
    }
});