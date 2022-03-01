import React, {useContext, useEffect, useState} from "react";
import {act} from "react-dom/test-utils";

let state = undefined
let reducer = undefined
let listeners = []
const setState = (newState) =>{
    state = newState
    listeners.map(fn => fn(state))
}

const store = {
    getState(){
        return state
    },
    dispatch :(action) => {
        setState(reducer(state, action))
        // update({})
    },

    subscribe(fn) { //订阅
        listeners.push(fn)
        return () => {
            const index = listeners.indexOf(fn)
            listeners.splice(index, 1) //返回一个取消订阅的函数
        }
    }
}

//规范 state 创建流程
// let _reducer = (state, {type, payload}) => {
//     if (type === 'updateUser') {
//         return {
//             ...state,
//             user: {
//                 ...state.user,
//                 ...payload
//             }
//         }
//     } else {
//         return state
//     }
// }

//改造 dispatch，使他支持异步 action（函数）
let dispatch = store.dispatch
const preDispatch = dispatch
dispatch =(action)=>{ //支持异步的函数action
    if (typeof action === 'function'){
        action(dispatch)
    }else{
        preDispatch(action)
    }
}
const preDispatch2 = dispatch
dispatch = (action)=>{ //支持异步的 Promise 的 action
    if (action.payload instanceof Promise){
        action.payload.then(data => {
            dispatch({...action, payload: data})
        })
    }else{
        preDispatch(action)
    }
}

const createStore = (_reducer, initState)=>{
    state = initState
    reducer = _reducer
    return store
}


const changed = (oldState, newState) => {
    let changed = false
    for (let key in oldState) {
        if (oldState[key] !== newState[key]) {
            changed = true
        }
    }
    return changed
}

//让组件与全局状态连接起来
const connect = (selector, mapDispatchToProps) => (Component) => { //高阶组件，接受一个组件，然后返回一个组件
    //dispatch 规范 setState 流程
    return (props) => {
        const [, update] = useState({}) //用来刷新 Wrapper,只能实现一个组件的渲染
        const data = selector ? selector(state) : {state}
        const dispatchers = mapDispatchToProps? mapDispatchToProps(dispatch) :{dispatch}
        useEffect(() => store.subscribe(() => {
                const newData = selector ? selector(state) : {state}
                if (changed(data, newData)) {
                    update({})
                }
            })
            // 这里最好取消订阅，否则在 selector 变化时会出现重复订阅
            , [selector]) //取消之前的订阅，开启新订阅,实现精准渲染

        return <Component {...props} {...data} {...dispatchers}/>
    }
}

const appContext = React.createContext(null)

const Provider = ({store,children})=>{
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
}

export {store, appContext, connect,createStore,Provider}