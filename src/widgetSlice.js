import { createSlice } from "@reduxjs/toolkit";

export const widgetSlice = createSlice({
	name: "listOfWidgets",
	initialState: {
		value: []
	},
	reducers: {
		// Adds a widget to the layout
		addWidget: (state, action) => {
			const newListOfWidget = [...state.value];
			newListOfWidget.push(action.payload);
			state.value = newListOfWidget;
		},
		// Remove a widget from the layout
		removeWidget: (state, action) => {
			//action.payload is the index of the widget to remove
			const newListOfWidget = [...state.value];
			newListOfWidget.splice(action.payload, 1);
			state.value = newListOfWidget;
		},
		// Adds a widget to a group
		addWidgetToListOfDescendant: (state, action) => {
			// action.payload contains the index of the group in the layout
			// and the widget item to add to this group 
			const newListOfWidget = [...state.value];
			newListOfWidget[action.payload.index].children.push(action.payload.newDescendant)
			state.value = newListOfWidget
		},
		// Update widget position
		updateWidgetPosition: (state, action) => {
			// action.payload contains a dropped widget item with index and new position 
			const newListOfWidget = [...state.value];
			newListOfWidget[action.payload.index].clientOffset = action.payload.clientOffset;
			state.value = newListOfWidget;
		},
		// Remove a widget from a group
		removeWidgetFromGroup: (state, action) => {
			// action.payload contains the index of the group 
			// and the index in the grid of the widget to remove
			const newListOfWidget = [...state.value];
			newListOfWidget[action.payload.index].children.splice(action.payload.indexInGrid, 1);
			state.value = newListOfWidget;
		}
	}
})

export const { addWidget, removeWidget, removeWidgetFromGroup, updateWidgetPosition, addWidgetToListOfDescendant } = widgetSlice.actions

export default widgetSlice.reducer