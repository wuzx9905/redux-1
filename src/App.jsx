// 请从课程简介里下载本代码
import React from 'react'
import { connect, createStore, Provider} from "./redux";
import {connectToUser} from "./connectors/connectToUser";

const reducer = (state,{type,payload})=>{
    if (type === 'updateUser'){
        return {
            ...state,
            user:{
                ...state.user,
                ...payload
            }
        }
    }else{
        return state
    }
}
const initState = {
    user:{name:'frank',age:18},
    group:{name:'前端组'}
}
const store = createStore(reducer,initState)

export const App = () => {
  return (
      <Provider store={store}>
        <大儿子/>
        <二儿子/>
        <幺儿子/>
      </Provider>
  )
}
const 大儿子 = () => <section>大儿子<User/></section>
const 二儿子 = () => <section>二儿子<UserModifier/></section>
const 幺儿子 = connect(state =>{
  return {group: state.group}
})(({group}) => <section>幺儿子<div>Group:{group.name}</div></section>)



const User = connectToUser(({user}) => {
  return <div>User:{user.name}</div>
})
//如何支持异步 action
// const ajax = ()=>{}
//
// const fetchUser = (dispatch)=>{
//     ajax('/user').then(response=>{
//         dispatch({type:'updateUser',payload:response.data})
//     })
// }
//
// const UserModifier= connect(null,null)(({state,dispatch}) => {
//   const onChange = (e) => {
//     // appState.user.name = e.target.value
//     // fetchUser(dispatch)
//       dispatch(fetchUser) //fetchUser is an action -- async function
//   }
//   return <div>
//     <div>User: {state.user.name}</div>
//     <button
//            onClick={onChange}>异步获取 user</button>
//   </div>
// })

const UserModifier= connectToUser(({updateUser,user,children}) => {
    const onChange = (e) => {
        // appState.user.name = e.target.value
        updateUser({name:e.target.value})
    }
    return <div>
        {children}
        <input value={user.name}
               onChange={onChange}/>
    </div>
})
