import React from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Platform, Button } from 'react-native';
import colors from '../colors';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import axios from '../axiosRequest'
import DateTimePicker from '@react-native-community/datetimepicker'

export default class TodoModal extends React.Component {
    state = {
        newTodo: "", 
        tasks: this.props.task,
        mode: 'date',
        show: false,
        date: new Date(),
        time: null
    };

    onChange = (event, selectedDate) => {
        // console.log('This is the event', event)
        // console.log('This is the selected Date', selectedDate)
        const currentDate = selectedDate || this.state.date;
        this.setState({show : Platform.OS === 'ios'});
        this.setState({date: currentDate})
        console.log('Current Date', new Date())
        console.log('This is the selected date', this.state.date)
        // console.log('This is the selected time', this.state.date)
    };

    showMode = (currentMode) => {
        this.setState({show: true})
        this.setState({mode: currentMode})
    };
    
    showDatepicker = () => {
        this.showMode('date')
    };
    
    showTimepicker = () => {
        this.showMode('time')
    };

    toggleTodoComplete = (todo) =>{
        let task = todo
        console.log('This is the toggle', task)
        const completeTodo = {
            taskId: task.id
        }
        console.log('Task Id',completeTodo)
        axios.put('/task', completeTodo)
        .then((response) => {
            console.log('This is the response', response.data)
            if(response.data.status === 'success'){
                this.setState({tasks: response.data.data})
            }
        })
        .catch((error) => {
            console.log(error)
        })
        // task.completed = !task.completed
        // this.props.updateList(task);
    }
    getTask(){
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
    }
    // updateList = task => {
    //     this.setState({
    //       tasks: this.state.tasks.map(item => {
    //         return item.id === list.id ? list : item;
    //       })
    //     });
    //   };

    componentDidMount(){
        this.getTask()
    }

    addTodo = () => {
        let task = this.state.newTodo
        console.log(task)
        // console.log(typeof(this.state.tasks))
        // this.setState({tasks: [...this.state.tasks,{id: this.state.tasks.length + 1, title: task}]});
        const addNewTask = {
            title: task,
            listId: this.props.list.id
          }
          console.log(addNewTask)
          axios.post('/task', addNewTask)
          .then((response) => {
            console.log('Response data of post',response.data)
            if(response.data.status === 'success'){
              console.log(response.data.status)
              this.getTask()
              // this.setState({rerender: true})
              // this.forceUpdate()
            }
          })
          .catch((error) => {
            console.log(error)
          })
        this.setState({newTodo: ""});

        Keyboard.dismiss();
    };

    renderTodo = (todo,index) => {
        // console.log('This is the value of todo and index' ,todo, index)
        return(
            <View style={styles.todoContainer}>
                <TouchableOpacity onPress={() => this.toggleTodoComplete(todo)}>
                    <Ionicons 
                        name={todo.completed ? "ios-square" : "ios-square-outline"} 
                        size={24} 
                        color={colors.gray} 
                        style={{width: 32}} 
                    />
                </TouchableOpacity>
                <Text 
                    style={[
                        styles.todo,
                        {
                            textDecorationLine: todo.completed ? 'line-through' : 'none', 
                            color: todo.completed ? colors.gray : colors.black
                        }
                    ]}
                >
                    {todo.title}
                </Text>
            </View>
        );
    }; 

    render(){
        // const taskCount = list.todos.length;
        // const completeCount = list.todos.filter(todo => todo.completed).length;
        // console.log('This is the takssssss', this.state.tasks)
        // console.log('TodoModal list',this.props.list)
        return (
            <KeyboardAvoidingView style={{flex:1}}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity 
                    style={{position: 'absolute', top:64, right: 32, zIndex: 10}} 
                    onPress={this.props.closeModal}
                >
                    <AntDesign name="close" size={24} color={colors.black} />
                </TouchableOpacity>

                <View style={[styles.section, styles.header, {borderBottomColor: colors.blue }]}>
                    <View>
                        <Text style={styles.title}>{this.props.list.title}</Text>
                        <Text style={styles.taskCount}>
                            Tasks
                        </Text>
                    </View>
                </View>

                <View style={[styles.section, {flex:3}]}>
                    <FlatList 
                        data={this.state.tasks} 
                        renderItem={({item, id}) => this.renderTodo(item, item.id)} 
                        keyExtractor={item =>item.id.toString()} 
                        contentContainerStyle={{paddingHorizontal: 32, paddingVertical: 64}}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.buttonContainer}>
                        <Button onPress={this.showDatepicker} title="Show date picker!" />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button onPress={this.showTimepicker} title="Show time picker!" />
                    </View>
                    {this.state.show && ( <DateTimePicker
                                        testID="dateTimePicker"
                                        value={this.state.date}
                                        mode={this.state.mode}
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.onChange}
                                    />
                    )}
                </View>
                

                <View style={[styles.section, styles.footer]} >
                    

                    <TextInput 
                        style={[styles.input, {borderColor: colors.blue}]} 
                        onChangeText={text => this.setState({newTodo: text})} 
                        value={this.state.newTodo} 
                    />
                    <TouchableOpacity 
                        style={[styles.addTodo, {backgroundColor: colors.blue}]}
                        onPress={() => this.addTodo()}
                        
                    >
                        <AntDesign name="plus" size={16} color={colors.white} />
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    },
    section: {
        flex: 1,
        alignSelf: "stretch"
    },
    header: {
        justifyContent: "flex-end",
        marginLeft: 64,
        borderBottomWidth: 3
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: colors.black
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colors.gray,
        fontWeight: '600'
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: "row",
        alignItems: "center"

    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: "center"
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center"
    },
    todo: {
        color: colors.black,
        fontWeight: '700',
        fontSize: 16
    },
    buttonContainer: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 6,
        marginHorizontal: 6,
        alignItems: 'center',
        width: 150
      },

});