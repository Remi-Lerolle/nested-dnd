import React, {Children, useState} from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import { ItemTypes } from "./ItemTypes";
import { removeWidget,	updateWidgetListOfDescendant, removeWidgetInGrid } from "./widgetSlice"

export const WidgetToDrag = ({ widgetKey, index, indexInGrid=null }) => {

	const listOfWidgets = useSelector( (state) => state.listOfWidgets.value );
	const dispatch = useDispatch();

	let thisWidgetObj;

	if ( index === null){
		// comes from sidebar read it from props
		thisWidgetObj = { type: ItemTypes[widgetKey], clientOffset:{x:0, y:0}, sideBar: true }
	} else if (indexInGrid !== null) {
		// comes from pagelayout read it from the state
		thisWidgetObj = { ...listOfWidgets[index].children[indexInGrid], sideBar: false }
	} else {
		thisWidgetObj = { ...listOfWidgets[index], sideBar: false }
	}

	const [ dragCollected, drag ] = useDrag( () => (
		{
			type: thisWidgetObj.type,
			item: { itemType: thisWidgetObj.type, addOrUpdatePos: thisWidgetObj.sideBar ? "add" : index },
			collect: (monitor) => ({
				isDragging: monitor.isDragging()
			}),
			previewOptions: {backgroundColor: "red"}
		}))

	const [ dropCollected, drop  ] = useDrop( () => ({
		accept:[ItemTypes.SIMPLEWIDGET],
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
	if (thisWidgetObj.type.includes("simple")) {
		bgColor = "grey"
	} else if (thisWidgetObj.type === "gridwidget" ){
		bgColor = "lightblue"
	} else if (dropCollected.isOver){
		bgColor = "red"
	} else {
		bgColor = "lightblue"
	}

	const style = {
		padding: "15px",
		backgroundColor: bgColor,
		border: dragCollected.isDragging ? "1px solid blue" : "1px solid red",
		opacity: dragCollected.isDragging ? "0.5" : "1",
		margin: "5px",
		width: "fit-content",
		position: thisWidgetObj.sideBar || indexInGrid !== null ? "relative" : "absolute",
		top: indexInGrid === null ? thisWidgetObj.clientOffset.y : "0px",
		left: indexInGrid === null ? thisWidgetObj.clientOffset.x : "0px"
	}

	const handleDrop = (obj) => {
		dispatch(updateWidgetListOfDescendant( {index, newDescendant: obj} ))
	};

	const handleRemove = (index, indexInGrid) => {
		if ( indexInGrid !== null ){
			dispatch(removeWidgetInGrid( {index, indexInGrid} ))
		}
		else{
			dispatch(removeWidget(index))
		}
	}

	return (
		<div
			ref={
				ItemTypes[widgetKey] === "griddropped"
					? (node) => drag(drop(node))
					: drag
			}
			style={style}
		>
			{ItemTypes[widgetKey]}
			{index ? ` - ${index}` : null}
			{indexInGrid !== null ? ` - ${indexInGrid}` : null}
			{widgetKey === 'SIMPLEDROPPED' || widgetKey === "GRIDDROPPED"
				? <button onClick={() => handleRemove( index, indexInGrid )}>x</button>
					: null }
			{ indexInGrid === null && thisWidgetObj.children
				? thisWidgetObj.children.map( (dropped, iInGrid) => <WidgetToDrag
					key={`grid-${index}-descendant-${iInGrid}`}
					index={index}
					indexInGrid={iInGrid}
					widgetKey="SIMPLEDROPPED"
					/>)
				:null
			}
		</div>
	)
}