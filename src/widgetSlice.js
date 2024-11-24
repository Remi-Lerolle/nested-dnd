import { createSlice } from "@reduxjs/toolkit";

export const widgetSlice = createSlice({
	name: "listOfWidgets",
	initialState: {
		value: []
	},
	reducers: {
		addWidget: (state, action) => {
			const newState = [...state.value];
			newState.push(action.payload);
			state.value = newState
		},
		removeWidget: (state, action) => {
			const index = action.payload;
			const newState = [...state.value];
			newState.splice(index, 1);
			state.value = newState;
		},
		updateWidgetListOfDescendant: (state, action) => {
			const newState = [...state.value];
			newState[action.payload.index].children.push(action.payload.newDescendant)
			state.value = newState
		},
		updateWidgetPosition: (state, action) => {
			const dropped = action.payload;

			const newState = [...state.value];
			newState[dropped.addOrUpdatePos].clientOffset = dropped.clientOffset;
			state.value = newState;
		},
		removeWidgetInGrid: (state, action) => {
			const gridIndex = action.payload.index;
			const indexInGrid = action.payload.indexInGrid;

			const newChildren = [...state.value[gridIndex].children];
			newChildren.splice(indexInGrid, 1)

			const newState = [...state.value];
			newState[gridIndex].children = newChildren;
		}
	}
})

export const { addWidget, removeWidget, removeWidgetInGrid, updateWidgetPosition, updateWidgetListOfDescendant } = widgetSlice.actions

export default widgetSlice.reducer