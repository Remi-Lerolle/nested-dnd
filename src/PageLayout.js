import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import { ItemTypes } from "./ItemTypes";
import { WidgetToDrag } from "./Widget";
import { addWidget, updateWidgetPosition } from "./widgetSlice"
import { DisplayStateAsTable } from "./DisplayStateAsTable";
import "./widgets.css"

export function PageLayout() {

	const boundingBox = useRef(null);

	const listOfWidgets = useSelector((state) => state.listOfWidgets.value)
	const dispatch = useDispatch();

	const [collected, dropRef] = useDrop(() => ({
		accept: Object.keys(ItemTypes).map(key => (ItemTypes[key])),
		drop(_item, monitor) {
			if (monitor.isOver({ shallow: true })) {

				const initialClientOffset = monitor.getInitialClientOffset();
				const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
				/*
						InitialOffset is the position of the click relative to the source widget
				*/
				const initialOffsetX = initialClientOffset.x - initialSourceClientOffset.x
				const initialOffsetY = initialClientOffset.y - initialSourceClientOffset.y

				/*
						Offset is the position where the widget has been dropped inside the web page (client)
				*/
				const offset = monitor.getClientOffset();

				/*
						Calculates where the widget has been droped inside the pageLayout( boundingBox )
				*/
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
			case 'simplewidget':
				newDropped.type = "simpledropped"
				break;
			case 'gridwidget':
				newDropped.type = "griddropped"
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

	return (
		<>
			<div
				id="pageLayoutDiv"
				ref={combineRef}
				style={{
					backgroundColor: collected.isOverCurrent ? "lightgreen" : "lightcyan"
				}}>
				{listOfWidgets ?
					listOfWidgets.map((dropped, i) => {

						let newWidgetType;
						switch (dropped.type) {
							case 'simple widget': newWidgetType = "SIMPLEDROPPED"
								break;
							case 'group widget': newWidgetType = "GRIDDROPPED"
								break;
							default: break;
						}
						return (
							<WidgetToDrag
								widgetKey={newWidgetType}
								key={`pageLayout-widget-${i}`}
								index={i}
								clientOffset={dropped.clientOffset}
							/>
						)
					})
					: null
				}
			</div >
			<DisplayStateAsTable
				state={listOfWidgets} />
		</>
	)
}