sap.ui.define(["sap/suite/ui/commons/networkgraph/Graph"], function (Graph, Node) {
	var oGraph = Graph.extend("DragNDrop.customControls.Graph", {
		metadata: {
			dnd: {
				droppable: true,
				draggable: false
			},
			aggregations: {
				nodes: {
					type: "DragNDrop.customControls.Node",
					multiple: true,
					singularName: "node"
				},
			}
		},
		renderer: {}
	});

	Graph.prototype._wheel = function (mArguments) {
		if (this.getEnableWheelZoom() || mArguments.ctrl) {
			mArguments.div.css("opacity", "0");
			this._zoom({
				point: {
					x: mArguments.x,
					y: mArguments.y
				},
				deltaY: -mArguments.deltaY
			});

			this._zoomLabel.setText(this._getZoomText());
			return true;

		}

		return false;
	};

	return oGraph;
}, true);