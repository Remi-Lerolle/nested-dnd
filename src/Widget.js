import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import { ItemTypes } from "./ItemTypes";
import { removeWidget, updateWidgetListOfDescendant, removeWidgetInGrid } from "./widgetSlice"

export const WidgetToDrag = ({ widgetKey, index, indexInGrid = null }) => {

	const listOfWidgets = useSelector((state) => state.listOfWidgets.value);
	const dispatch = useDispatch();

	let thisWidgetObj;

	if (index === null) {
		// comes from sidebar read it from props
		thisWidgetObj = { type: ItemTypes[widgetKey], clientOffset: { x: 0, y: 0 }, sideBar: true }
	} else if (indexInGrid !== null) {
		// comes from pagelayout read it from the state
		thisWidgetObj = { ...listOfWidgets[index].children[indexInGrid], sideBar: false }
	} else {
		thisWidgetObj = { ...listOfWidgets[index], sideBar: false }
	}

	const [dragCollected, drag] = useDrag(() => (
		{
			type: thisWidgetObj.type,
			item: { itemType: thisWidgetObj.type, addOrUpdatePos: thisWidgetObj.sideBar ? "add" : index },
			collect: (monitor) => ({
				isDragging: monitor.isDragging()
			}),
			previewOptions: { backgroundColor: "red" }
		}))

	const [dropCollected, drop] = useDrop(() => ({
		accept: [ItemTypes.SIMPLEWIDGET],
		drop(_item, monitor) {
			console.log("drop")
			handleDrop({
				type: monitor.getItem().itemType,
			})
		},
		collect: (monitor) => ({
			isOver: monitor.isOver()
		})
	}))

	let bgColor;
	if (dropCollected.isOver) {
		bgColor = "green"
	}

	const style = {
		backgroundColor: bgColor,
		top: indexInGrid === null ? thisWidgetObj.clientOffset.y : "0px",
		left: indexInGrid === null ? thisWidgetObj.clientOffset.x : "0px"
	}

	const handleDrop = (obj) => {
		dispatch(updateWidgetListOfDescendant({ index, newDescendant: obj }))
	};

	const handleRemove = (index, indexInGrid) => {
		if (indexInGrid !== null) {
			dispatch(removeWidgetInGrid({ index, indexInGrid }))
		}
		else {
			dispatch(removeWidget(index));
		}
	}

	return (
		<div
			ref={
				ItemTypes[widgetKey] === "griddropped"
					? (node) => drag(drop(node))
					: drag
			}
			className={`widgetToDrag
				${indexInGrid != null ? " inGrid" : ""}
				${dragCollected.isDragging ? " isDragging" : " notDragging"}
				${thisWidgetObj.type.includes("simple") ? " simpleWidget" : " isGrid"}
				${thisWidgetObj.sideBar ? " inSideBar" : ""}
				`}
			style={style}
		>
			{ItemTypes[widgetKey]}
			{index ? ` - ${index}` : null}
			{indexInGrid !== null ? ` - ${indexInGrid}` : null}
			{widgetKey === 'SIMPLEDROPPED' || widgetKey === "GRIDDROPPED"
				? <button onClick={() => handleRemove(index, indexInGrid)}>x</button>
				: null}
			{indexInGrid === null && thisWidgetObj.children
				? thisWidgetObj.children.map((dropped, iInGrid) => <WidgetToDrag
					key={`grid-${index}-descendant-${iInGrid}`}
					index={index}
					indexInGrid={iInGrid}
					widgetKey="SIMPLEDROPPED"
				/>)
				: null
			}
		</div>
	)
}