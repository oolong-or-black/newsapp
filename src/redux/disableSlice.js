import { createSlice } from '@reduxjs/toolkit'

const disableSlice = createSlice({
    name: 'disable',
    initialState:{
        isDisabled: false
    },
    reducers:{
        DisableOn: (state,action)=>{
            state.isDisabled = true
        },
        DisableOff: (state,action)=>{
            state.isDisabled = false
        }
    }
})

export default disableSlice.reducer

const { DisableOn, DisableOff } = disableSlice.actions
export { DisableOn, DisableOff }

// export const SetDisable = ()=> async dispatch =>{
//     dispatch(DisableOn())
// }

// export const CancelDisable = ()=> async dispatch =>{
//     dispatch(DisableOff())
// }