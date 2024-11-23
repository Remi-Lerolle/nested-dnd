import { createSlice } from "@reduxjs/toolkit";

export const widgetSlice = createSlice({
	name: "listOfWidgets",
	initialState: {
		value: []
	},
	reducers: {
		addWidget: (state, action) => {
			// console.log("-- in addWidget reducer ")
			// console.log(action.payload)
			const newState = [...state.value];
			// console.log(newState)
			newState.push(action.payload);
			state.value = newState
		},
		removeWidget: (state, action) => {
			console.log("-- in removeWidget reducer ")
			console.log(action.payload)

			const index = action.payload;

			const newState = [...state.value];
			newState.splice(index, 1);
			state.value = newState;

		},
		updateWidgetListOfDescendant: (state, action) => {
			console.log("-- in updateWidgetListOfDescendant reducer ")
			console.log(action)

			const newState = [...state.value];
			console.log(newState)
			newState[action.payload.index].children.push(action.payload.newDescendant)
			console.log(newState)
			state.value = newState
		},
		updateWidgetPosition: (state, action) => {
			const dropped = action.payload;
			console.log(dropped)

			const newState = [...state.value];
			newState[dropped.addOrUpdatePos].clientOffset = dropped.clientOffset;
			console.log(newState[dropped.addOrUpdatePos])
			state.value = newState;
		},
		removeWidgetInGrid: (state, action) => {
			const gridIndex = action.payload.index;
			const indexInGrid = action.payload.indexInGrid;

			const newChildren = [...state.value[gridIndex].children];
			newChildren.splice(indexInGrid, 1)

			const newState = [...state.value];
			newState[gridIndex].children = newChildren;
			console.log(newState)
		}
	}
})

export const { addWidget, removeWidget, removeWidgetInGrid, updateWidgetPosition, updateWidgetListOfDescendant } = widgetSlice.actions

export default widgetSlice.reducer