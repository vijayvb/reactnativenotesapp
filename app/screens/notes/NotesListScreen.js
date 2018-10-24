import React from 'react';
import { StyleSheet, View, FlatList, Text, Button, TouchableOpacity } from 'react-native';
import Moment from 'moment';
import { NoteModel, getNotesRefForUser } from '../../data/model/NoteModel';

export class NotesListScreen extends React.Component {

    
    static navigationOptions = ({ navigate, navigation }) => ({
        title: 'Notes',
        
        headerRight: (
            <Button
              onPress={() => navigation.navigate('NotesEditor')}
              title="New+"
              color="#000"
            />
        ),
        headerLeft: (
            <Button
              onPress={() => alert('Open filter')}
              title="Filter"
              color="#000"
            />
        ),
    });

    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
          notesList: [],
          refreshing: false,
        };
        this.notesRef;
        this.initNotesData = this.initNotesData.bind(this);
        this.renderNotesItem = this.renderNotesItem.bind(this);
    }

    componentDidMount(){
        console.log("component did load");
        this.initNotesData();
    }

    initNotesData(){
        var _my = this;
           
        getNotesRefForUser(function(ref) {
            this.notesRef = ref;
            this.notesRef.on('value', function(snapshot) {
                _my.state.notesList = [];
                for (var key in snapshot.val()) {
                    console.log("key is " + JSON.stringify(snapshot.val()[key]));
                    _my.state.notesList.push(snapshot.val()[key]);
                }
                
                //in memory sort
                _my.state.notesList.sort(function(a, b){
                    var keyA = new Date(a.datetime),
                    keyB = new Date(b.datetime);
                    // Compare the 2 dates
                    if(keyA < keyB) return 1;
                    if(keyA > keyB) return -1;
                    return 0;
                })

                _my.forceUpdate();
            });
        }); 
    }

    renderNotesItem(notesDataItem){
        console.log("notesDataItem " + JSON.stringify(notesDataItem));
        return(
            <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('NotesEditor', {noteObj:notesDataItem.item});
                }
            }>
                <View style={styles.listItemContainer}>
                    <Text numberOfLines={1} style={styles.textTitle}>{notesDataItem.item.title}</Text>
                    <Text numberOfLines={2} style={styles.textNotes}>{notesDataItem.item.noteText}</Text>
                    <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between', alignSelf: 'stretch'}}>
                        <Text numberOfLines={1} style={styles.textDateTime}>Images: {notesDataItem.item.images?notesDataItem.item.images.length:0}</Text>
                        <Text numberOfLines={1} style={styles.textDateTime}>{Moment(notesDataItem.item.datetime).format('YYYY-MM-DD HH:mm')}</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
        <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
            <FlatList
                data={this.state.notesList}          
                renderItem={this.renderNotesItem} 
                keyExtractor={item => (item.id + "")}  
            />  
        </View>
        );
    }
}

const styles = StyleSheet.create({
    listItemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#F1D352',
        margin: 10,
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
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
});