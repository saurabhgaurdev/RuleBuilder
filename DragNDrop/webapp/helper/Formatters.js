sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";

	var isItemSelected = function (list) {
		var enable = false;
		if (list.length > 0) {
			enable = true;
		}
		return enable;
	};

	var isEnableTwoArgs = function (boolVal1, boolVal2) {
		var enable = false;
		if (boolVal1 && boolVal2) {
			enable = true;
		}
		return enable;
	};

	var ruleText = function (first_expression, second_expression, condition) {

		var ruleStr = first_expression + " " + condition + " " + (second_expression ? second_expression : "(X)");
		return ruleStr;
	};


	var isCreateBtnEnable = function (msgPageEnable, strategySelected) {};

	return {
		isItemSelected: isItemSelected,
		isCreateBtnEnable: isCreateBtnEnable,
		isEnableTwoArgs: isEnableTwoArgs,
		ruleText: ruleText
	};
});