import React from "react";
import { ItemTypes } from "./ItemTypes";
import { WidgetToDrag } from "./Widget";

export function SideBar(){
	return(
		<div
			style={{
				backgroundColor: "yellow",
				padding: "5px",
				width: "fit-content",
				position: "relative",
				float: "left"
				}}>
			<div
				style={{marginBottom: "5px"}} >Side Bar</div>
			{
				Object.keys(ItemTypes)
					.map( itemKey => {
						if (itemKey !== "GRIDDROPPED" && itemKey !== "SIMPLEDROPPED" ) {
							return(
								<WidgetToDrag
									index={null}
									key={`drag-${itemKey}`}
									widgetKey={ itemKey }
								/>
					)}})
			}
		</div>
	)
}