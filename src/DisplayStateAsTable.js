
// For later migration to typescript
// Items are the draggable elements
// They pass information to the drag or drop hook
const itemDescription = ["#", "type", "clientOffset", "addOrUpdatePos", "children"];

export function DisplayStateAsTable({ state }) {
	return <div style={{ "clear": "both" }} >
		<table>
			<thead>
				<tr>
					<th colSpan={5}>Redux State</th>
				</tr>
				<tr>
					{
						itemDescription.map(key =>
							<th key={`th-${key}`}>{key}</th>)
					}
				</tr>
			</thead>
			<tbody>
				{state.length
					? state.map((dropped, droppedIndex) => (
						<tr key={`tr-${droppedIndex}`}>
							<td>{droppedIndex}</td>
							{
								Object.keys(dropped).map((droppedKey, droppedIndex) => {
									if (droppedKey === "type" || droppedKey === "addOrUpdatePos") {
										return <td key={droppedIndex} >{dropped[droppedKey]}</td>
									}
									else if (droppedKey === "clientOffset") {
										return <td key={`${droppedIndex}-clientOffset`} >
											<p>x: {dropped.clientOffset.x}</p>
											<p>y: {dropped.clientOffset.y}</p>
										</td>
									} else if (droppedKey === "children") {
										return <td key={`${droppedIndex}-children`}  >
											<ol>
												{
													dropped.children.map(
														(_, childIndex) =>
															<li key={`${droppedIndex}-children-${childIndex}`}>NESTED WIDGET</li>
													)
												}
											</ol>
										</td>
									}
								}
								)
							}
						</tr>
					))
					: <tr><td colSpan="6">empty state : drag and drop item to the layout</td></tr>
				}
			</tbody>
		</table>
	</div >

}