import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native';
import colors from '../colors';
import TodoModal from "./TodoModal.js"
import axios from '../axiosRequest'
import tempTasks from '../tempTasks'

export default class TodoList extends React.Component {
    state = {
        showListVisible: false,
        tasks: []
    }
    
    toggleListModal(){
        this.setState({showListVisible: !this.state.showListVisible});
    }

    componentDidMount(){
        // const headers = {
        //     'Content-Type': 'application/json;charset=UTF-8',
        //     'Access-Control-Allow-Origin': '*'
        // }
        // console.log('This is the list id',this.props.list.id)
        // // const json = JSON.stringify({listId: this.props.list.id})
        axios.get(`/list/${this.props.list.id}`)
        .then((response) => {
            // console.log('These are the tasks', response.data)
            if(response.data.status === 'success'){
                this.setState({tasks: response.data.data})
            }
        })
        .catch((error) => {
            console.log(error)
        })
        // console.log(tempTasks)
        // console.log('Component Did Mount is Working')
        // if(tempTasks.status === 'success'){
        //     console.log('Request Accepted')
        //     console.log(tempTasks.data)
        //     this.setState({tasks: tempTasks.data})
        //     console.log('This is the tasks after setting state', this.state.tasks)
        // }
    }

    render(){
        const list = this.props.list
        const task = this.state.tasks
        // console.log('This is the list in todo', list)
        // console.log('This is the task in todo', task)

        // const completedCount = list.todos.filter(todo => todo.completed).length;
        // const remainingCount = list.todos.length - completedCount;

        return (
            <View>
                <Modal 
                    animationType="slide" 
                    visible={this.state.showListVisible} 
                    onRequestClose={() => this.toggleListModal()}
                >
                    <TodoModal 
                        task ={task}
                        list = {list} 
                        closeModal={() => this.toggleListModal()} 
                        updateList ={this.props.updateList}
                    /> 
                </Modal>
                <TouchableOpacity 
                    style ={[styles.listContainer, {backgroundColor: colors.blue }]}
                    onPress={() => this.toggleListModal()}
                >
                    <Text style={styles.listTitle} numberOfLines={1}>
                        {list.title}
                    </Text>
                    {/* <View> */}
                        {/* <View style={{ alignItems: "center" }}> */}
                            {/* <Text style={styles.count}>{remainingCount}</Text> */}
                            {/* <Text style={styles.subtitle}>Remaining</Text> */}
                        {/* </View> */}
                        {/* <View style={{alignItems: "center"}}> */}
                            {/* <Text style={styles.count}>{completedCount}</Text> */}
                            {/* <Text style={styles.subtitle}>Completed</Text> */}
                        {/* </View> */}
                    {/* </View> */}
                </TouchableOpacity>
                <View style={styles.buttonContainer}>
                    <Button title="Delete" onPress={() => this.props.deleteList(this.props.list.id)}/>
                    <Button title="Complete" onPress={() => this.props.updateList(this.props.list.id)}/>
                </View>
                
            </View>
            
        );

    }
    
};

const styles = StyleSheet.create({
    listContainer: {
      paddingVertical: 32,
      paddingHorizontal: 16,
      borderRadius: 6,
      marginHorizontal: 12,
      alignItems: 'center',
      width: 200
    },
    listTitle:{
        fontSize: 24,
        fontWeight: '700',
        color : colors.white,
        marginBottom: 18

    },
    count: {
        fontSize: 48,
        fontWeight: '200',
        color: colors.white

    },
    subtitle: {
        fontWeight: '700',
        fontSize: 12,
        color: colors.white
    },
    buttonContainer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginRight: 30,
        marginHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 200,
        flexDirection: 'row'
      }
});