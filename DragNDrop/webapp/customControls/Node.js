sap.ui.define(["sap/suite/ui/commons/networkgraph/Node"], function (Node) {

	var oNode = Node.extend("DragNDrop.customControls.Node", {
		metadata: {
			dnd: {
				droppable: true,
				draggable: true
			},
			library: "sap.suite.ui.commons",
			aggregations: {}
		},
		renderer: {}
	});

	oNode.prototype._mouseDown = function (bIsCtrlKey) {
		this.fireEvent("press", {}, true);
		this.showActionButtons(true);
	};
	oNode.prototype._mouseOut = function(){};

	Node.prototype._mouseOut = function () {
		this.$().removeClass(this.HIGHLIGHT_CLASS);
		this._setStatusColors("");
	};

	return oNode;
}, true);