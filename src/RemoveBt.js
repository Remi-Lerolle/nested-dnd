export function RemoveBt({ stateHandler, index, indexInGrid }) {
	return <><span className="spacer" /><button
		className="removeWidgetButton"
		onClick={() => stateHandler(index, indexInGrid)}>x</button>
	</>
}