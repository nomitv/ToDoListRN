import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList,Modal } from 'react-native';
import {AntDesign} from'@expo/vector-icons'
import colors from "../colors.js"
import tempData from "../tempData"
import TodoList from '../components/TodoList'
import AddListModal from "../components/AddListModal"
import axios from '../axiosRequest'

export default class App extends React.Component {
  state = {
    addTodoVisible: false,
    lists: [],
    rerender: false,
  }

  toggleAddTodoModal(){
    this.setState({addTodoVisible: !this.state.addTodoVisible});
  };

  getList() {
    axios.get("/allLists")
    .then((response) => {
      console.log('Response from home',response.data)
      console.log('component did mount working')
      if(response.data.status === 'success'){
        this.setState({
          lists: response.data.data,
          rerender: false
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  deleteList = (listId) => {
    console.log('List to be deleted', listId)
    // const delList = { listId: listId }
    // console.log('DelList Object',delList)
    axios({
      method: 'DELETE',
      url: '/list',
      data: {
        listId: listId
      }
    })
    .then((response) => {
      console.log('Response data of post',response.data)
      if(response.data.status === 'success'){
        console.log(response.data.status)
        this.getList()
        // this.setState({rerender: true})
        // 
      }
    })
    .catch((error) => {
      console.log(error)
    }) 
    // this.forceUpdate()
    // this.getList()
  }


  renderList = list => {
    return <TodoList key={list.id} list = {list} updateList={this.updateList}  deleteList={this.deleteList}/>
  };

  addList = list =>{
    console.log('Add new list ', list)
    const addNewList = {
      title: list.name
    }
    console.log(addNewList)
    axios.post('/list', addNewList)
    .then((response) => {
      console.log('Response data of post',response.data)
      if(response.data.status === 'success'){
        console.log(response.data.status)
        this.getList()
        // this.setState({rerender: true})
        // this.forceUpdate()
      }
    })
    .catch((error) => {
      console.log(error)
    })
    // this.setState({lists: [...this.state.lists,{...list,id: this.state.lists.length + 1, todos: [] }]});
  };

  updateList = list => {
    console.log('Put list',list)
    axios.put('/list', {listId: list})
        .then((response) => {
            console.log('This is the response', response.data)
            if(response.data.status === 'success'){
                this.setState({tasks: response.data.data})
            }
        })
        .catch((error) => {
            console.log(error)
        })
  };

  componentDidMount(){
    this.getList()
  }


  render() {
    return (
      <View style={styles.container}>
        <Modal 
          animationType="slide" 
          visible ={this.state.addTodoVisible} 
          onRequestClose={() => this.toggleAddTodoModal()}
        >
          <AddListModal closeModal ={() => this.toggleAddTodoModal()} addList={this.addList}/>
        </Modal>
        <View style = {{flexDirection: "row"}}>
          <View style ={styles.divider} />
          <Text style ={styles.title}>
            Todo <Text style ={{ fontWeight: '300', color: colors.blue }}>Lists</Text> 
          </Text>
          <View style ={ styles.divider} />
        </View>

        <View style = {{marginVertical: 48}}>
          <TouchableOpacity style ={styles.addList} onPress={() => this.toggleAddTodoModal()}>
            <AntDesign name="plus" size={16} color ={colors.blue} />
          </TouchableOpacity>

          <Text style={styles.add}>Add List</Text>
        </View>

        <View style ={{height: 275, paddingLeft: 32}}>
          <FlatList 
            data = {this.state.lists} 
            keyExtractor={item => item.id.toString()}
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => this.renderList(item)}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: "center"
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.black,
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  add: {
    color: colors.blue,
    fontWeight: '600',
    fontSize: 14,
    marginTop:8
  }
});