import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import LoadingScreen from './screens/LoadingScreen'
import HomeScreen from './screens/Home'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'

// import * as firebase from 'firebase'

// var firebaseConfig = {
//   apiKey: "AIzaSyAi4gVoINYVHz4y7gT9pqewQkGa1GOOVfc",
//   authDomain: "loginscreen-87599.firebaseapp.com",
//   databaseURL: "https://loginscreen-87599.firebaseio.com",
//   projectId: "loginscreen-87599",
//   storageBucket: "loginscreen-87599.appspot.com",
//   messagingSenderId: "372420824684",
//   appId: "1:372420824684:web:35e95b32b7a033f4679249",
//   measurementId: "G-0PCJ9LVK4J"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

const AppStack = createStackNavigator({
  Home: HomeScreen
})

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen
})

export default createAppContainer(
  createSwitchNavigator({
    Loading: LoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: "Auth"
  }
  )
)