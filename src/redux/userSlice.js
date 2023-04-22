import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
     user: JSON.parse(localStorage.getItem('token')),
     currentPath:'/home'
    },
    reducers: {
      // when login success, update the user state with the token info of localStorage  
      loginSuccess: (state, action) => {
        state.user = action.payload;
      },
      logoutSuccess: (state, action) =>  {
        state.user = null;
      },
      getPath: (state, action) =>{
        state.currentPath = action.payload
      }
    },
  });
  export default userSlice.reducer

  // Actions
  const { loginSuccess, logoutSuccess, getPath } = userSlice.actions
  export const login = () =>async dispatch => {     
    dispatch(loginSuccess(JSON.parse(localStorage.getItem('token'))))
  }

  export const logout = () => async dispatch => {
   dispatch(logoutSuccess())
  }

  export const beforeLogin = (data) => async dispatch =>{
    dispatch(getPath(data))
  }