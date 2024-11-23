import { configureStore } from "@reduxjs/toolkit";
import widgetSlice from "./widgetSlice"

export default configureStore({
	reducer: {
		listOfWidgets: widgetSlice
	},
})