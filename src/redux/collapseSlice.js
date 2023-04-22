import { createSlice } from "@reduxjs/toolkit"

const collapseSlice = createSlice({
    name:'collapse',
    initialState:{
        isCollapsed: false
    },
    reducers:{
        changeCollapse: (state,action)=>{
            state.isCollapsed = action.payload
        }
    }
})

export default collapseSlice.reducer

const { changeCollapse } = collapseSlice.actions
export const handleCollapse = (data)=> async dispatch =>{
    dispatch(changeCollapse(data))
}