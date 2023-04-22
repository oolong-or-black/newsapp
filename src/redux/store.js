import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import user from './userSlice'
import collapse from './collapseSlice'
import disable from './disableSlice'

const reducer = combineReducers({
    user,
    collapse,
    disable
})

const store = configureStore({reducer})

export default store