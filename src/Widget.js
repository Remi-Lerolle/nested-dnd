import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import { ItemTypes } from "./ItemTypes";
import { removeWidget, addWidgetToListOfDescendant, removeWidgetFromGroup } from "./widgetSlice"
import { RemoveBt } from "./RemoveBt";

export const WidgetToDrag = ({ widgeType, index, indexInGrid = null }) => {
	const listOfWidgets = useSelector((state) => state.listOfWidgets.value);
	const dispatch = useDispatch();

	let thisWidgetObj;

	if (index === null) {
		// comes from sidebar read it from props
		thisWidgetObj = { type: widgeType, clientOffset: { x: 0, y: 0 }, sideBar: true }
	} else if (indexInGrid !== null) {
		// comes from pagelayout read it from the state
		thisWidgetObj = { ...listOfWidgets[index].children[indexInGrid], sideBar: false }
	} else {
		thisWidgetObj = { ...listOfWidgets[index], sideBar: false }
	}

	const [dragCollected, drag] = useDrag(() => (
		{
			type: thisWidgetObj.type,
			item: {
				itemType: thisWidgetObj.type,
				action: thisWidgetObj.sideBar ? "add" : "move",
				pos: thisWidgetObj.sideBar ? null : index
			},
			collect: (monitor) => ({
				isDragging: monitor.isDragging()
			})
		}))

	const [dropCollected, drop] = useDrop(() => ({
		accept: ["SIMPLEWIDGET"],
		drop(_item, monitor) {
			dispatch(addWidgetToListOfDescendant({
				index,
				newDescendant: { type: "SIMPLENESTED" }
			}
			))
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

	const handleRemove = (index, indexInGrid) => {
		if (indexInGrid !== null) {
			dispatch(removeWidgetFromGroup({ index, indexInGrid }))
		}
		else {
			dispatch(removeWidget(index));
		}
	}

	return (
		<div
			ref={
				widgeType === "GROUPDROPPED"
					? (node) => drag(drop(node))
					: drag
			}
			className={`widgetToDrag
				${indexInGrid != null ? " inGrid" : ""}
				${dragCollected.isDragging ? " isDragging" : " notDragging"}
				${thisWidgetObj.type.includes("SIMPLE") ? " simpleWidget" : " isGrid"}
				${thisWidgetObj.sideBar ? " inSideBar" : ""}
				`}
			style={style}
		>
			<p>
				<span className="widgetType">{ItemTypes[widgeType]}</span>
				{index !== null ? ` ${index}` : null}
				{indexInGrid !== null ? ` - ${indexInGrid}` : null}
				{widgeType === 'SIMPLEDROPPED' || widgeType === "GROUPDROPPED" || widgeType === "SIMPLENESTED"
					? <RemoveBt
						stateHandler={handleRemove}
						index={index} indexInGrid={indexInGrid} />
					: null}
			</p>
			{indexInGrid === null && thisWidgetObj.children
				? thisWidgetObj.children.map((_, iInGrid) => <WidgetToDrag
					key={`grid-${index}-descendant-${iInGrid}`}
					index={index}
					indexInGrid={iInGrid}
					widgeType="SIMPLENESTED"
				/>)
				: null
			}
		</div>
	)
}