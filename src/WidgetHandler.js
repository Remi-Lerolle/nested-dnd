export function addWidgetToState(state, widget, stateHandler) {
	stateHandler([...state, widget])
}