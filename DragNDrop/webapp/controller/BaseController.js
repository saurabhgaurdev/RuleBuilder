sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("com.sap.mfg.pqm.DescriptiveAnalytics.controller.BaseController", {

        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function() {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} name : the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function(name) {
            return this.getView().getModel(name);
        },

        /**
         * Convenience method for getting the property of view model by model name path.
         * @public
         * @param {string} name : the model name
         * @param {string} path : the path
         * @returns {object} data
         */
        getModelData: function(name, path) {
            return this.getView().getModel(name).getProperty(path);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel : the model instance
         * @param {string} name : the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function(oModel, name) {
            return this.getView().setModel(oModel, name);
        },

        /**
         * Convenience method for getting the property of view model by model name path.
         * @public
         * @param {string} name : the model name
         * @param {string} path : the path
         * @param {object} data : data to be set
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModelData: function(name, path, data) {
            return this.getView().getModel(name).setProperty(path, data);
        },

        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Getter for text from the resource bundle.
         * @public
         * @param {string} sKey : the property name
         * @param {array} args : i18n arguments
         * @returns {string} i18n Text
         */
        getI18nText: function(sKey, args) {
            var msg = '';
            try {
                msg = this.getResourceBundle().getText(sKey, args);
            } catch (e) {
                if (this.oParentBlock && this.oParentBlock.getModel('i18n')) {
                    msg = this.oParentBlock.getModel('i18n').getResourceBundle().getText(sKey, args);
                }
            } finally {
                return msg;
            }
        },

        /**
         * Convenience method for changing hash.
         * @public
         * @param {string} hash : new hash route
         */
        hashChanger: function(hash) {
            this._hashChanger.setHash(hash);
        },

        /**
         * Convenience method for changing route.
         * @public
         * @param {string} path : new path
         * @param {string} data : data to be passed
         */
        route: function(path, data) {
            this.getRouter().navTo(path, data);
        }

    });

});
