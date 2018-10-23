import React from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import GridView from 'react-native-super-grid';
import { Toast } from 'native-base'

import {uploadImageToCloud} from '../../net/firebase/FireBaseUtils';
import { NoteModel } from '../../data/model/NoteModel';
var ImagePicker = require('react-native-image-picker');


export class NotesEditorScreen extends React.Component {

    static navigationOptions = ({ navigate, navigation }) => {
        let postHandleCallback = null;
        if (navigation.state.params && navigation.state.params.hasOwnProperty('handleSave')) {
            postHandleCallback = navigation.state.params.handleSave;
        } else {
            postHandleCallback = () => {};
        }
        return ({
            title: 'New Note',
            headerRight: (
                <Button
                    onPress={postHandleCallback}
                title="Save"
                color="#000"
                />
            ),
        });
    };

    constructor(props){
        super(props);
        this.state = {
            text: "some text",
            noteText: "",
            attendees: "",
            gridItems: [""]
        };
        this.openImagePickerForUpload = this.openImagePickerForUpload.bind(this);
        this.renderImageGridItem = this.renderImageGridItem.bind(this);
        this.printToast = this.printToast.bind(this);
        this.saveNotesData = this.saveNotesData.bind(this);
        this.getTitleFromText = this.getTitleFromText.bind(this);
        this.getImagesFromGridItemState = this.getImagesFromGridItemState.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleSave: this.saveNotesData });
    }

    renderImageGridItem(imageItem){
        console.log("item is :: " + JSON.stringify(imageItem));

        return(
            <TouchableOpacity onPress={() => {
                itemCopy = imageItem;
                if(itemCopy=="")
                    this.openImagePickerForUpload();
                else{
                    ///open image
                }    
              }
            }>
                <View style={[styles.itemContainer, { backgroundColor: '#C8CFD4'}]} >
                    <Image source={imageItem==""? require('../../images/notes/upload.png') : {uri:imageItem}} 
                        style={{ height: 170, width: 170, alignSelf:'center'}} resizeMode={'center'}/>
                    <View style={[styles.itemContainer, {position: 'absolute'}]}>
                        <Text style={styles.itemName}></Text>
                        <Text style={styles.itemCode}></Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
          <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'space-evenly' }}>
            <TextInput style={styles.textTitle} 
                placeholder="Attendees"
                onChangeText={(text) => this.setState({attendees:text})}
                value={this.state.attendees}
                />
            <TextInput
                style={styles.noteTextEditor}
                multiline={true}
                onChangeText={(text) => this.setState({noteText:text})}
                value={this.state.noteText}
                placeholder="Type in your notes...."
            />
            <Text style={{height:20, paddingLeft:10}}>Upload Images:</Text>
            <GridView
                itemDimension={130}
                items={this.state.gridItems}
                style={styles.notesImageView}
                renderItem={this.renderImageGridItem}
            />
          </View>
        );
    }

    saveNotesData(){
        
        var _newNote = new NoteModel();
        _newNote.title = this.getTitleFromText();
        _newNote.noteText = this.state.noteText;
        _newNote.attendees = this.state.attendees;
        _newNote.images = this.getImagesFromGridItemState();
        _newNote.writeToDb(_newNote, () => {
                //on completed go back;
                this.props.navigation.goBack();
            },
            () => {
                //show toast
                Toast.show({
                    text: "Error while saving note",
                    position: 'bottom',
                    buttonText: 'Okay'
                });
                
            }
        );
    }

    getTitleFromText(){
        var firstLine = this.state.noteText.split('\n')[0];
        if(firstLine.length > 15){
            firstLine = firstLine.substring(0,14);
        }
        return firstLine
    }

    getImagesFromGridItemState(){
        var images = [];
        var itr = 0;
        for (var imageUrl in this.state.gridItems) {
            //skip zero;
            if(itr == 0){
                itr++;
                continue;
            }
            images.push(this.state.gridItems[itr]);
            itr++;
        }
        console.log("images are " + JSON.stringify(images));
        return images;
    }

    printToast(){
        console.log("print.....................");
        Toast.show({
            text: "Uploading..",
            position: 'bottom',
            buttonText: 'Okay'
        });
    }

    openImagePickerForUpload(){
        var options = {
            title: 'Select Image',
            storageOptions: {
              skipBackup: true,
              path: 'images'
            }
        };
        
        ImagePicker.showImagePicker(null, (response) => {
            if (response.didCancel) {
            }
            else if (response.error) {
            }
            else if (response.customButton) {
            }
            else {
                let uri = response.uri;
                let name = response.fileName;
                console.log('uri ' + uri);
                let fileUri = decodeURI(uri);
                console.log('uri after devode ' + uri);
                console.log('filename ' + name);

                uploadImageToCloud(uri, name, (url) => {
                    this.setState(prevState => ({
                        gridItems: [...prevState.gridItems, url]
                      }))
                    Toast.show({
                        text: "Completed",
                        position: 'bottom',
                        buttonText: 'Okay'
                    });
                });

                Toast.show({
                    text: "Uploading..",
                    position: 'bottom',
                    buttonText: 'Okay'
                });
            }
        });
    }

}


const styles = StyleSheet.create({
    rootContainer: {
        
    },
    notesImageView: {
        flex:1, 
        borderColor: 'gray', 
        borderWidth: 1, 
        alignSelf:'stretch', 
        backgroundColor: '#f9f9f9'
    },
    noteTextEditor: {
        flex:2, 
        borderColor: 'gray', 
        borderWidth: 1, 
        textAlign:'left', 
        alignSelf:'stretch', 
        backgroundColor:'#F9F9F9', 
        textAlignVertical:'top',
        fontFamily:'HelveticaNeue-Medium',
        fontSize:16,
        marginBottom:10,
        padding:10
    },
    textTitle: {
        textAlign:'left',
        fontStyle:'normal',
        fontFamily:'HelveticaNeue-Medium',
        fontSize:16,
        margin:10
    },
    textNotes: {
        textAlign:'left',
        fontStyle:'normal',
        fontSize:14,
        margin:10,
    },
    textDateTime: {
        textAlign:'right',
        alignSelf:'flex-end',
        fontStyle:'normal',
        fontSize:10,
        margin:10
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
      },
      itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
    },
});