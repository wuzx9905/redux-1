import {connect, store} from "../redux";

const userSelector = state =>{
    return {user: state.user}
}
const userDispatcher = (dispatch)=>{
    return {
        updateUser: (attrs)=>dispatch({type:'updateUser', payload: attrs})
    }
}
const connectToUser = connect(userSelector,userDispatcher)

export {connectToUser}