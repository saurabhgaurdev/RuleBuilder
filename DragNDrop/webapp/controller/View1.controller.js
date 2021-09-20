sap.ui.define([
	"DragNDrop/controller/BaseController",
	'sap/ui/model/json/JSONModel',
	"sap/ui/core/mvc/Controller",
	"DragNDrop/helper/Utils",
	'sap/suite/ui/commons/networkgraph/Graph',
	'sap/suite/ui/commons/networkgraph/Node',
	'sap/suite/ui/commons/networkgraph/Line',
	'sap/suite/ui/commons/networkgraph/GraphMap',
	'sap/suite/ui/commons/networkgraph/ActionButton',
	'sap/m/MessageToast',
	'sap/m/MultiComboBox',
	'sap/m/MessageBox',
	"DragNDrop/helper/Formatters",
	'sap/ui/core/Fragment',
	'sap/ui/core/dnd/DragInfo'

], function (BaseController, JSONModel, Controller, Utils, Graph, Node, Line, GraphMap, ActionButton, MessageToast, MultiComboBox,
	MessageBox,
	Formatters, Fragment, DragInfo) {
	"use strict";

	return BaseController.extend("DragNDrop.controller.View1", {

		Formatters: Formatters,
		onInit: function (evt) {
			var oThis = this;
			oThis._setModels();
			oThis._setNewNodeModel();

		},

		_setModels: function () {
			var oThis = this;
			var oModel = new JSONModel(sap.ui.require.toUrl("DragNDrop/localService/mockdata") + "/Warehouse.json");
			oThis.setModel(oModel, "Model");
			var oProduct = new JSONModel(sap.ui.require.toUrl("DragNDrop/localService/mockdata") + "/Product.json");
			oThis.setModel(oProduct, "Product");
			var oRule = new JSONModel(sap.ui.require.toUrl("DragNDrop/localService/mockdata") + "/Rules.json");
			oThis.setModel(oRule, "Rule");
			var oStrategies = new JSONModel(sap.ui.require.toUrl("DragNDrop/localService/mockdata") + "/Strategy.json");
			oThis.setModel(oStrategies, "Strategies");
			var oGraph = new JSONModel(sap.ui.require.toUrl("DragNDrop/localService/mockdata") + "/graph.json");
			oThis.setModel(oGraph, "Graph");
		},

		_setNewNodeModel: function () {

			var oThis = this;
			oThis.setModel(new JSONModel({
				"from": "",
				"to": "",
				"key": -1,
				"isFilterBox": false,
				"title": "",
				"icon": 'sap-icon://product',
				"shape": "Box",
				"status": "Standard",
				"attributes": [{
					"label": "Category",
					"value": ""
				}, {
					"label": "Supplier Name",
					"value": ""
				}, {
					"label": "Price",
					"value": ""
				}, {
					"label": "UoM",
					"value": ""
				}, {
					"label": "Quantity",
					"value": ""
				}],

				"sources": [],
				"rules": []
			}), "newProduct");

			oThis.setModel(new JSONModel({
				"label": "",
				"value": ""

			}), "newAttribute");

			oThis.setModel(new JSONModel({
				"showMessage": true,
				"parentId": '',
				"key": -1,
				"actionBtnParentNode": -1,
				"prodLen": -1,
				"whLen": -1,
				"isWH": false,
				"isProd": false,
				"newAttr": true,
				"sPath": "",
				"isXVal": false,
				"isNewAttrName": false,
				"isNewAttrValue": false,
				"isStgName": false,
				"isStgDesc": false,
				"pKeys": []
			}), 'view');

			oThis.setModel(new JSONModel({}), 'SelectedList');

		},

		onStrategySelection: function (oEvent) {
			var oThis = this;
			var oGraph = oThis.getView().byId('strategyGraph');
			// var oWhList = oThis.getView().byId('whList');
			// var oRuleList = oThis.getView().byId('ruleList');
			// var oStgList = oThis.getView().byId('strategyList');
			// var stgAddBtn = oThis.getView().byId('panel-add-btn');
			var midColPage = oThis.getView().byId('mid_column_page');
			var i;
			var oData;
			var stKey = oEvent.getSource().getSelectedItem().data('stKey');
			var objCopy = Utils.objectCopy(oThis.getModelData('Strategies', '/strategies'));
			for (i in objCopy) {
				if (objCopy[i].name === stKey) {
					oData = (Utils.objectCopy(objCopy[i]));
					break;
				}
			}
			midColPage.setShowFooter(false);
			// stgAddBtn.setEnabled(false);
			midColPage.setShowHeader(false);
			oGraph.setVisible(true);
			oThis.setModelData('Graph', '/', oData);
			oThis.getModel("Graph").refresh(true);
			oThis.setModelData('view', '/showMessage', false);
			// oWhList.removeAllDragDropConfig();
			// oRuleList.removeAllDragDropConfig();
			// oStgList.removeAllDragDropConfig();

		},

		onNewStrategyAdd: function (oEvent) {
			var oThis = this;
			var stgAddBtn = oThis.getView().byId('panel-add-btn');
			// var oWhList = oThis.getView().byId('whList');
			// var oRuleList = oThis.getView().byId('ruleList');
			// var oStgList = oThis.getView().byId('strategyList');
			var oGraph = oThis.getView().byId('strategyGraph');
			var oCreatedStgList = oThis.getView().byId('stg_list');
			oThis.setModelData('view', '/showMessage', false);
			var midColPage = oThis.getView().byId('mid_column_page');
			oCreatedStgList.removeSelections();
			oThis._resetGraph();
			midColPage.setShowFooter(true);
			midColPage.setShowHeader(false);
			stgAddBtn.setEnabled(false);
			oGraph.setVisible(true);
			// oWhList.addDragDropConfig(new DragInfo({
			// 	sourceAggregation: "items",
			// 	groupName: "moveSource",
			// 	dragStart: "onSourceDrag"
			// }));
			// oRuleList.addDragDropConfig(new DragInfo({
			// 	sourceAggregation: "items",
			// 	groupName: "moveRule",
			// 	dragStart: "onRuleDrag"
			// }));
			// oStgList.addDragDropConfig(new DragInfo({
			// 	sourceAggregation: "items",
			// 	groupName: "movedata",
			// 	dragStart: "onDragStart"
			// }));
		},

		//reset the graph model

		_resetGraph: function () {
			var oThis = this;
			oThis.setModelData('Graph', '/', {
				"nodeBoxWidth": 200,
				"name": "",
				"desc": "",
				"nodes": [{
					"key": 0,
					"type": "cart",
					"title": "",
					"icon": "sap-icon://cart",
					"shape": "Circle",
					"status": "Success"
				}],
				"lines": [],
				"groups": [{
					"key": "A",
					"title": "Strategy"
				}]
			});
			oThis.getModel("Graph").refresh(true);
		},

		// Continue Button Pressed 
		onContPress: function (oEvent) {
			var oThis = this;
			var oView = oThis.getView();
			if (!oThis._oSaveDialog) {
				oThis._oSaveDialog = sap.ui.xmlfragment("DragNDrop.fragment.SaveStrategy", oThis);
				oView.addDependent(oThis._oSaveDialog);
			}
			oThis._oSaveDialog.open();
		},

		//Cancel Button Pressed
		onStgCancelPress: function () {
			var oThis = this;
			var stgAddBtn = oThis.getView().byId('panel-add-btn');
			var oGraph = oThis.getView().byId('strategyGraph');
			oThis._resetGraph();
			oThis.setModelData('view', '/pKeys', []);
			// oThis.setModelData('ProductList', '/nodes', []);
			oThis.setModelData('view', '/showMessage', true);
			var midColPage = oThis.getView().byId('mid_column_page');
			midColPage.setShowFooter(false);
			stgAddBtn.setEnabled(true);
			midColPage.setShowHeader(true);
			oGraph.setVisible(false);

		},

		//Pop-up Save Button Pressed 
		onSavePress: function (oEvent) {
			var oThis = this;
			var stgAddBtn = oThis.getView().byId('panel-add-btn');
			var midColPage = oThis.getView().byId('mid_column_page');
			var oGraph = oThis.getView().byId('strategyGraph');
			var oPanel = oThis.getView().byId('stg_panel');
			var objCopy = Utils.objectCopy(oThis.getModelData('Graph', '/'));
			var oData = Utils.objectCopy(oThis.getModelData('Strategies', '/strategies'));
			oData.push(objCopy);
			oThis.setModelData('Strategies', '/strategies', oData);
			oThis._resetGraph();
			// oThis.setModelData('ProductList', '/nodes', []);
			oThis.setModelData('view', '/pKeys', []);
			oThis.setModelData('view', '/showMessage', true);

			midColPage.setShowFooter(false);
			stgAddBtn.setEnabled(true);
			midColPage.setShowHeader(true);
			oGraph.setVisible(false);
			oThis._oSaveDialog.close();
			oPanel.setExpanded(true);
			MessageToast.show("Strategy has been saved successfuly");
		},

		//Pop-up Cancel Button Pressed
		onCancelSave: function () {
			var oThis = this;
			oThis._oSaveDialog.close();
		},

		// handleSelectionChange: function (oEvent) {
		// 	var oThis = this;
		// 	oThis.setModelData('view', '/selectedNodes', oEvent.getSource().getSelectedKeys());
		// },

		// onCancelProdSelection: function () {
		// 	var oThis = this;
		// 	oThis._oLinkDialog.close();
		// },

		//when Rule is dragged from the list
		onRuleDrag: function (oEvent) {},

		//when Rule is drpped to the Product

		onRuleDrop: function (oEvent) {
			var oThis = this;
			var oDraggedItem = oEvent.getParameter("draggedControl");
			var oData = oDraggedItem.data();
			var node = oEvent.getParameter("dragSession").getDropControl().getParent().getParent();
			var key = node.getProperty("key");
			var oNodes = Utils.objectCopy(oThis.getModelData('Graph', '/nodes'));
			var ruleKey = oData.key;
			var oAllRules = Utils.objectCopy(oThis.getModelData('Rule', '/Rules'));

			for (var i in oNodes) {
				if (oNodes[i].hasOwnProperty('key') && oNodes[i].key == key) {
					var oRules = oNodes[i].rules;

					for (var j in oRules) {
						if (oRules[j].hasOwnProperty('key') && oRules[j].key == ruleKey) {
							MessageToast.show("Rule is already added");
							return;
						}
					}

					for (var k in oAllRules) {
						if (oAllRules[k].hasOwnProperty('key') && oAllRules[k].key == ruleKey) {
							oRules.push(oAllRules[k]);
						}
					}
					// oRules.push(oData);
					oNodes[i].rules = oRules;
				}
			}

			oThis.setModelData('Graph', '/nodes', oNodes);
			// oThis.getModel("Graph").refresh(true);

		},

		//when Source is dragged from the list
		onSourceDrag: function (oEvent) {

		},

		//when Source is dropped to the product
		onSourceDrop: function (oEvent) {
			var oThis = this;
			var oDraggedItem = oEvent.getParameter("draggedControl");
			var oData = oDraggedItem.data();
			var node = oEvent.getParameter("dragSession").getDropControl().getParent().getParent();
			var key = node.getProperty("key");

			var oNodes = Utils.objectCopy(oThis.getModelData('Graph', '/nodes'));
			var oSource = oData.key;
			for (var i in oNodes) {
				if (oNodes[i].hasOwnProperty('key') && oNodes[i].key == key) {
					var oSources = oNodes[i].sources;

					for (var j in oSources) {
						if (oSources[j].hasOwnProperty('key') && oSources[j].key == oSource) {
							MessageToast.show("Source is already added");
							return;
						}
					}

					oSources.push(oData);
					oNodes[i].sources = oSources;
				}
			}

			oThis.setModelData('Graph', '/nodes', oNodes);
			// oThis.getModel("Graph").refresh(true);
		},

		//when Product is dragged from the list
		onDragStrategy: function (oEvent) {

		},

		//Set the details of dragged product from the list
		_setProductDetails: function (oThis) {
			oThis.setModelData('view', '/prodLen', oThis.getModelData('Product', '/StrategyCollection').length);
			oThis.setModelData('view', '/isProd', true);
			for (var i = 0; i < oThis.getModelData('view', '/prodLen'); i++) {

				if (oThis.getModelData('view', '/key') === oThis.getModelData('Product', '/StrategyCollection')[i].key) {
					oThis.setModelData('newProduct', '/key', oThis.getModelData('view', '/key'));
					oThis.setModelData('newProduct', '/key', oThis.getModelData('view', '/key'));
					oThis.setModelData('newProduct', '/title', oThis.getModelData('Product', '/StrategyCollection')[i].Name);
					oThis.getModelData('newProduct', '/attributes')[0].value = oThis.getModelData('Product', '/StrategyCollection')[i].Category;
					oThis.getModelData('newProduct', '/attributes')[1].value = oThis.getModelData('Product', '/StrategyCollection')[i].SupplierName;
					oThis.getModelData('newProduct', '/attributes')[2].value = oThis.getModelData('Product', '/StrategyCollection')[i].Price;
					oThis.getModelData('newProduct', '/attributes')[3].value = oThis.getModelData('Product', '/StrategyCollection')[i].UoM;
					oThis.getModelData('newProduct', '/attributes')[4].value = oThis.getModelData('Product', '/StrategyCollection')[i].Quantity;
					break;
				}
			}
		},

		//when product is dropped to the canvas
		onDropStrategy: function (oEvent) {
			var oThis = this;
			var oDraggedItem = oEvent.getParameter("draggedControl");
			oThis.setModelData('view', '/key', oDraggedItem.data('key'));
			oThis._setProductDetails(oThis);
			var i = 0;
			if (oThis.getModelData('view', '/')['pKeys'].length === oThis.getModelData('view', '/prodLen')) {
				MessageToast.show("Information: All products are already added");
				return;
			} else {
				for (i = 0; i < oThis.getModelData('view', '/')['pKeys'].length; i++) {
					if (oThis.getModelData('view', '/')['pKeys'][i] === oThis.getModelData('view', '/key')) {
						MessageToast.show("Product is already added");
						return;
					}
				}
			}

			var oData = Utils.objectCopy(oThis.getModelData('view', '/pKeys'));
			var objCopy = Utils.objectCopy(oThis.getModelData("newProduct", "/key"));
			var lastNodeKey;
			oData.push(objCopy);
			oThis.setModelData('view', '/pKeys', oData);
			var oCopy = Utils.objectCopy(oThis.getModelData('newProduct', '/'));
			oData = Utils.objectCopy(oThis.getModelData('Graph', '/nodes'));
			lastNodeKey = oData[oData.length - 1].key;
			oData.push(oCopy);
			oThis.setModelData('Graph', '/nodes', oData);

			oData = Utils.objectCopy(oThis.getModelData('Graph', '/lines'));
			oData.push({
				'from': lastNodeKey,
				'to': oThis.getModelData('newProduct', '/key')
			});
			oThis.setModelData('Graph', '/lines', oData);

		},

		onRuleAddCancel: function (oEvent) {
			var oThis = this;
			oThis._oAddRuleDialog.close();
		},

		onRuleAdd: function (oEvent) {
			var oThis = this;
			var oView = oThis.getView();
			if (!oThis._oAddRuleDialog) {
				oThis._oAddRuleDialog = sap.ui.xmlfragment("DragNDrop.fragment.AddRule", oThis);
				oView.addDependent(oThis._oAddRuleDialog);
			}
			oThis._oAddRuleDialog.open();
		},

		onAddAttributePop: function (oEvent) {
			var oThis = this;
			var node = oEvent.getSource().getParent();
			var key = node.getProperty("key");
			oThis.setModelData('view', '/actionBtnParentNode', key);
			if (!oThis._oAddAttrPop) {
				oThis._oAddAttrPop = sap.ui.xmlfragment("addAttributePop", "DragNDrop.fragment.AddAttribute", oThis);
				oThis.getView().addDependent(this._oAddAttrPop);
			}
			oThis._oAddAttrPop.openBy(oEvent.getSource());
		},

		onAddAttribute: function (oEvent) {
			var oThis = this;
			var nodeKey = oThis.getModelData('view', '/actionBtnParentNode');
			var oNodes = Utils.objectCopy(oThis.getModelData('Graph', '/nodes'));
			var oNewAttribute = oThis.getModelData('newAttribute', '/');
			for (var i in oNodes) {
				if (oNodes[i].hasOwnProperty('key') && oNodes[i].key == nodeKey) {
					var oAttributes = oNodes[i].attributes;
					oAttributes.push(oNewAttribute);
					oNodes[i].attributes = oAttributes;
				}
			}

			oThis.setModelData('Graph', '/nodes', oNodes);
			// oThis.getModel("Graph").refresh(true);

			oThis._oAddAttrPop.close();
			oThis.setModelData('newAttribute', '/label', '');
			oThis.setModelData('newAttribute', '/value', '');
		},
		onCancelAttribute: function (oEvent) {
			var oThis = this;
			oThis._oAddAttrPop.close();
		},

		onAttrNameInput: function (oEvent) {
			var oThis = this;
			var val = oEvent.getSource().getValue();
			if (val === "") {
				oThis.setModelData('view', '/isNewAttrName', false);
			} else {
				oThis.setModelData('view', '/isNewAttrName', true);
			}
		},

		onAttrValueInput: function (oEvent) {
			var oThis = this;
			var val = oEvent.getSource().getValue();
			if (val === "") {
				oThis.setModelData('view', '/isNewAttrValue', false);
			} else {
				oThis.setModelData('view', '/isNewAttrValue', true);
			}
		},

		onStrategyNameChange: function (oEvent) {
			var oThis = this;
			var val = oEvent.getSource().getValue();
			if (val === "") {
				oThis.setModelData('view', '/isStgName', false);
			} else {
				oThis.setModelData('view', '/isStgName', true);
			}
		},

		onStrategyDescChange: function (oEvent) {
			var oThis = this;
			var val = oEvent.getSource().getValue();
			if (val === "") {
				oThis.setModelData('view', '/isStgDesc', false);
			} else {
				oThis.setModelData('view', '/isStgDesc', true);
			}
		},

		onFilterBtnClick: function (oEvent) {
			var oThis = this;
			var key = oEvent.getSource().getParent().getProperty("key");
			var oNodes = Utils.objectCopy(oThis.getModelData('Graph', '/nodes'));
			for (var i in oNodes) {
				if (oNodes[i].hasOwnProperty('key') && oNodes[i].key == key) {
					if (oNodes[i].isFilterBox === false) {
						oNodes[i].isFilterBox = true;
					} else {
						oNodes[i].isFilterBox = false;
					}
				}
			}

			oThis.setModelData('Graph', '/nodes', oNodes);
			// oThis.getView().byId('strategyGraph').getBinding('lines').getModel().refresh();
			// oThis.getView().byId('strategyGraph').getBinding('lines').refresh();
			// oThis.getView().byId('strategyGraph').getBinding('nodes').refresh();
			// oThis.getModel("Graph").refresh(true);
		},

		onWRDltPressed: function (oEvent) {
			var oThis = this;
			var path = oEvent.getParameter("listItem").getBindingContext('Graph').sPath;
			var temp = path.split("/");
			var nodeIndex = temp[2];
			var wrIndex = temp[temp.length - 1];
			var oNodes = Utils.objectCopy(oThis.getModelData('Graph', '/nodes'));
			oNodes[nodeIndex].sources.splice(wrIndex, 1);
			oThis.setModelData('Graph', '/nodes', oNodes);
			// oThis.getModel("Graph").refresh(true);
		},

		onRuleDltPressed: function (oEvent) {
			var oThis = this;
			var path = oEvent.getParameter("listItem").getBindingContext('Graph').sPath;
			var temp = path.split("/");
			var nodeIndex = temp[2];
			var ruleIndex = temp[temp.length - 1];
			var oNodes = Utils.objectCopy(oThis.getModelData('Graph', '/nodes'));
			oNodes[nodeIndex].rules.splice(ruleIndex, 1);
			oThis.setModelData('Graph', '/nodes', oNodes);
			// oThis.getModel("Graph").refresh(true);
		},

		onEditRuleVal: function (oEvent) {
			var oThis = this;
			if (!oThis._oSetValToRule) {
				oThis._oSetValToRule = sap.ui.xmlfragment("setValToRule", "DragNDrop.fragment.SetValToRule", oThis);
				oThis.getView().addDependent(this._oSetValToRule);
			}
			oThis._oSetValToRule.openBy(oEvent.getSource());
			var path = oEvent.getSource().getBindingContext('Graph').sPath;
			oThis.setModelData('view', '/sPath', path);
			var currValLbl = sap.ui.core.Fragment.byId("setValToRule", "curr-val-lbl");
			var currVal = oEvent.getSource().getAggregation('customData')[0].getProperty('value');
			currValLbl.setText(currVal ? ' = ' + currVal : '');
		},

		onSortRulesRank: function (oEvent) {
			var oThis = this;
			if (!oThis._oChangeSequence) {
				oThis._oChangeSequence = sap.ui.xmlfragment("changeSequence", "DragNDrop.fragment.ChangeSequence", oThis);
				oThis.getView().addDependent(this._oChangeSequence);
			}
			var path = oEvent.getSource().getBindingContext('Graph').sPath;
			oThis.setModelData('view', '/sPath', path);
			var temp = path.split("/");
			var nodeIndex = temp[2];
			var oNodes = Utils.objectCopy(oThis.getModelData('Graph', '/nodes'));
			oThis.setModelData('SelectedList', '/', oNodes[nodeIndex].rules);
			oThis._oChangeSequence.open();
		},

		onPressOk: function () {
			var oThis = this;
			oThis._oChangeSequence.close();
		},

		onChangeSequence: function (oEvent) {
			var oThis = this;
			var oDroppedItem = oEvent.getParameter("droppedControl");
			var oDraggedItem = oEvent.getParameter("draggedControl");
			var sDropPosition = oEvent.getParameter("dropPosition");
			var oList = oDroppedItem.getParent();
			var iDraggedItemIndex = oList.indexOfItem(oDraggedItem);
			var iDroppedItemIndex = oList.indexOfItem(oDroppedItem);
			var iNewItemIndex;
			if (iDraggedItemIndex === iDroppedItemIndex) {
				return;
			}

			var oRules = oThis.getModelData('SelectedList', '/');
			if (iDroppedItemIndex === 0) {
				iNewItemIndex = iDroppedItemIndex + (sDropPosition === "After" ? 1 : 0);
			} else {

				iNewItemIndex = iDroppedItemIndex + (sDropPosition === "After" ? (iDroppedItemIndex < iDraggedItemIndex ? 1 : 0) : (iDroppedItemIndex > iDraggedItemIndex ? -1 : 0));
			}
			var tempItem = oRules[iDraggedItemIndex];
			oRules.splice(iDraggedItemIndex, 1);
			oRules.splice(iNewItemIndex, 0, tempItem);
			oThis.setModelData('SelectedList', '/', oRules);
			var path = oThis.getModelData('view', '/sPath');
			var temp = path.split("/");
			var nodeIndex = temp[2];
			var oNodes = Utils.objectCopy(oThis.getModelData('Graph', '/nodes'));
			oNodes[nodeIndex].rules = oRules;
			oThis.setModelData('Graph', '/nodes', oNodes);

		},

		onLiveXValChange: function (oEvent) {
			var oThis = this;
			var bval = oEvent.getSource().getValue() ? true : false;
			oThis.setModelData('view', '/isXVal', bval);
		},

		onSetValToRule: function () {
			var oThis = this;
			var path = oThis.getModelData('view', '/sPath');
			var oInputField = sap.ui.core.Fragment.byId("setValToRule", "var-value");
			var secExpVal = oInputField.getValue();
			var temp = path.split("/");
			var nodeIndex = temp[2];
			var ruleIndex = temp[temp.length - 1];
			var oNodes = Utils.objectCopy(oThis.getModelData('Graph', '/nodes'));
			oNodes[nodeIndex].rules[ruleIndex].second_expression = secExpVal;
			oThis.setModelData('Graph', '/nodes', oNodes);
			// oThis.getModel("Graph").refresh(true);
			oInputField.setValue('');
			oThis.setModelData('view', '/isXVal', false);
			oThis._oSetValToRule.close();
		},

		onEditRuleValCancel: function () {
			var oThis = this;
			var oInputField = sap.ui.core.Fragment.byId("setValToRule", "var-value");
			oInputField.setValue('');
			oThis.setModelData('view', '/isXVal', false);
			oThis._oSetValToRule.close();
		}
		
		// This code is to stop propagation of the event
		// blockEvent: function (oEVent) {

		// 	oEVent.preventDefault();
		// },
		// listPressed: function (oEvent) {
		// 	oEvent.stopPropagation();
		// 	alert();
		// 	console.log(oEvent.getSource().getSelectedItem());
		// },

		// onWarehouseAdd: function () {},

		// onDragSample: function (oEvent) {

		// },
		// onDropSample: function (oEvent) {}

	});

});