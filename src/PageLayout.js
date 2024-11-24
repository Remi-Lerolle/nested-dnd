import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import { ItemTypes } from "./ItemTypes";
import { WidgetToDrag } from "./Widget";
import { addWidget, updateWidgetPosition } from "./widgetSlice"
import "./widgets.css"

export function PageLayout() {

	const boundingBox = useRef(null);

	const listOfWidgets = useSelector((state) => state.listOfWidgets.value)
	const dispatch = useDispatch();

	const [collected, dropRef] = useDrop(() => ({
		accept: Object.keys(ItemTypes).filter(key => key !== "SIMPLENESTED"),
		drop(_item, monitor) {
			if (monitor.isOver({ shallow: true })) {

				const initialClientOffset = monitor.getInitialClientOffset();
				const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
				// InitialOffset is the position of the click relative to the source widget
				const initialOffsetX = initialClientOffset.x - initialSourceClientOffset.x
				const initialOffsetY = initialClientOffset.y - initialSourceClientOffset.y

				//Offset is the position where the widget has been dropped inside the web page (client)
				const offset = monitor.getClientOffset();

				//Calculates where the widget has been droped inside the pageLayout( boundingBox )
				const deltaX = offset.x - boundingBox.current.x - initialOffsetX;
				const deltaY = offset.y - boundingBox.current.y - initialOffsetY;

				handleDrop({
					type: monitor.getItem().itemType,
					clientOffset: { x: deltaX, y: deltaY },
					action: monitor.getItem().action,
					index: monitor.getItem().pos
				})
			}
		},
		collect: (monitor) => ({
			highlighted: monitor.canDrop(),
			isOver: monitor.isOver(),
			isOverCurrent: monitor.isOver({ shallow: true }),
			itemType: monitor.getItemType(),
			item: monitor.getItem(),
			dropped: monitor.didDrop(),
			dropResult: monitor.getDropResult(),
		})
	})
	)

	function combineRef(el) {
		dropRef(el);
		if (el) {
			boundingBox.current = el.getBoundingClientRect()
		}
	}

	const handleDrop = (dropped) => {
		const newDropped = { ...dropped }
		switch (dropped.type) {
			case 'SIMPLEWIDGET':
				newDropped.type = "SIMPLEDROPPED"
				break;
			case 'GROUPWIDGET':
				newDropped.type = "GROUPDROPPED"
				break;
			default: break
		}

		newDropped.children = []
		if (newDropped.action === "add") {
			dispatch(addWidget(newDropped));
		} else if (newDropped.action === "move") {
			dispatch(updateWidgetPosition(newDropped))
		}
	}

	let backgroundColor = "";
	if (collected.isOverCurrent) {
		backgroundColor = "green"
	} else if (collected.highlighted) {
		backgroundColor = "lightgreen"
	} else {
		backgroundColor = "lightcyan"
	}

	return (
		<div
			id="pageLayoutDiv"
			ref={combineRef}
			style={{
				backgroundColor: backgroundColor
			}}>
			{listOfWidgets ?
				listOfWidgets.map((dropped, i) => {
					return (
						<WidgetToDrag
							widgeType={dropped.type}
							key={`pageLayout-widget-${i}`}
							index={i}
							clientOffset={dropped.clientOffset}
						/>
					)
				})
				: null
			}
		</div >
	)
}