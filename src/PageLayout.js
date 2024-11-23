import React, { useState, useRef } from "react";
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

	const [listOfDropped, setListOfDropped] = useState([]);

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
					addOrUpdatePos: monitor.getItem().addOrUpdatePos
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
	}),
		[listOfDropped]
	)

	function combineRef(el) {
		dropRef(el);
		if (el) {
			boundingBox.current = el.getBoundingClientRect()
		}
	}

	const handleDrop = (dropped) => {
		console.log("---- in pageLayout handledrop")

		const newDropped = { ...dropped }

		switch (dropped.type) {
			case 'simplewidget':
				newDropped.type = "simpledropped"
				break;
			case 'gridwidget':
				newDropped.type = "griddropped"
				break;
		}
		newDropped.children = []
		if (newDropped.addOrUpdatePos === "add") {
			dispatch(addWidget(newDropped));
			console.log(listOfDropped)
			setListOfDropped([...listOfDropped, newDropped])
		} else if (typeof newDropped.addOrUpdatePos === "number") {
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
							case 'simpledropped': newWidgetType = "SIMPLEDROPPED"
								break;
							case 'griddropped': newWidgetType = "GRIDDROPPED"
								break;
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
			<div style={{ "clear": "both" }}
			>
				{/* STATE AND REDUX STORE */}
				{
					[listOfWidgets, listOfDropped].map(state => {
						return state.length
							? <table >
								<thead>
									<tr>
										<th>#</th>
										{
											Object.keys(state[0]).map(key => (
												<th
													key={`th-${key}`}>{key}</th>
											))
										}
									</tr>
								</thead>
								<tbody>
									{state.map((dropped, index) => (
										<tr key={`tr-${index}`}>
											<td>{index}</td>
											{
												Object.values(dropped).map((v, index) => {
													if (typeof v === "string") {
														return <td key={index} >{v}</td>
													} else {
														return <td key={index} >
															{Object.entries(v).map((ok, ov) => <p>{`${ok}: ${ov}`}</p>)}
														</td>
													}
												}
												)
											}
										</tr>
									))}
								</tbody>
							</table>
							: null
					})
				}

			</div >
		</>
	)

}