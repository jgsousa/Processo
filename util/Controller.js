jQuery.sap.declare("sap.sousa.Processo.util.Controller");

sap.ui.core.mvc.Controller.extend("sap.sousa.Processo.util.Controller", {
	getEventBus : function () {
		return sap.ui.getCore().getEventBus();
	},

	getRouter : function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	}
});