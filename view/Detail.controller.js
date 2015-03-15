jQuery.sap.require("sap.sousa.Processo.util.Formatter");
jQuery.sap.require("sap.sousa.Processo.util.Controller");

sap.sousa.Processo.util.Controller.extend("sap.sousa.Processo.view.Detail", {

	onInit : function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		if(sap.ui.Device.system.phone) {
			//don't wait for the master on a phone
			this.oInitialLoadFinishedDeferred.resolve();
		} else {
			this.getView().setBusy(true);
			this.getEventBus().subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		}

		this.getRouter().attachRouteMatched(this.onRouteMatched, this);

	},

	onMasterLoaded :  function (sChannel, sEvent, oData) {
		if(oData.oListItem){
			this.bindView(oData.oListItem.getBindingContext().getPath());
			this.getView().setBusy(false);
			this.oInitialLoadFinishedDeferred.resolve();
		}
	},

	onRouteMatched : function(oEvent) {
		var oParameters = oEvent.getParameters();

		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function () {
			var oView = this.getView();

			// when detail navigation occurs, update the binding context
			if (oParameters.name !== "detail") { 
				return;
			}

			var sEntityPath = "/" + oParameters.arguments.entity;
			this.bindView(sEntityPath);
			
			if(this.entity && this.entity !== oParameters.arguments.entity){
			    this.clearTableBinding();
			}

			var oIconTabBar = oView.byId("idIconTabBar");
			var selected = oParameters.arguments.tab;
			if (!selected){
			    oIconTabBar.setExpanded(false);
			}
			else{
			    var expanded = oIconTabBar.getProperty("expanded");
			}
			
			if(selected && expanded){
			    var path = oIconTabBar.getBindingContext().getPath() + "/" + selected;
			    this.setTableData(selected, path);
			}

			this.entity = oParameters.arguments.entity;
			// Which tab?
			var sTabKey = oParameters.arguments.tab;
			this.getEventBus().publish("Detail", "TabChanged", { sTabKey : sTabKey });

			if (oIconTabBar.getSelectedKey() !== sTabKey) {
				oIconTabBar.setSelectedKey(sTabKey);
			}
		}, this));

	},

	bindView : function (sEntityPath) {
		var oView = this.getView();
		oView.bindElement(sEntityPath);

		

		//Check if the data is already on the client
		if(!oView.getModel().getData(sEntityPath)) {

			// Check that the entity specified actually was found.
			oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
				var oData = oView.getModel().getData(sEntityPath);
				if (!oData) {
					this.showEmptyView();
					this.fireDetailNotFound();
				} else {
					this.fireDetailChanged(sEntityPath);
				}
			}, this));

		} else {
			this.fireDetailChanged(sEntityPath);
		}

	},

	showEmptyView : function () {
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "sap.sousa.Processo.view.NotFound",
			targetViewType : "XML"
		});
	},

	fireDetailChanged : function (sEntityPath) {
		this.getEventBus().publish("Detail", "Changed", { sEntityPath : sEntityPath });
	},

	fireDetailNotFound : function () {
		this.getEventBus().publish("Detail", "NotFound");
	},

	onNavBack : function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

    setTableData : function(key, path) {

	    
	    if (key === "CustosSet"){
	        var oTable = this.getView().byId("TabelaCustos");
            var info = oTable.getBindingContext();
            if(info){
                var currentEntity = info.getPath();
                var newEntity = "/" + this.entity;
            }
            var items = oTable.getBinding("items");
	        if (oTable &&  ( !items || currentEntity !== newEntity ) ){

	  	        var oTemplate = new sap.ui.core.Item({
                     text: "{MoedaID}",
                      key: "{MoedaID}"
                });
                var select = new sap.m.Select({
                     selectedKey: "{Moeda}", 
                     items: {path: "/MoedaSet", template: oTemplate} });
                
                oTable.bindAggregation("items", {
                path: path,
                template: new sap.m.ColumnListItem({
                cells: [
                        new sap.m.Label({ text: "{Descritivo}" }),
                        new sap.m.Input({
                            value: {
                                path: "Valor",
                                type: new sap.ui.model.type.Float({ minFractionDigits: 2, maxFractionDigits: 2 })
                            }
                        }),
                        select,
                        new sap.m.Input({ value: "{Cambio}" }),
                        new sap.m.Label({ text: "{FornecedorID}" })
                ] }) });
	        }  
        }
        if (key === "FacturasSet"){
	        var oTable2 = this.getView().byId("TabelaFacturas");
	        var info2 = oTable2.getBindingContext();
	        if(info2){
                var currentEntity2 = info2.getPath();
                var newEntity2 = "/" + this.entity;
            }
            var items2 = oTable2.getBinding("items");
	        if (oTable2 && ( !items2 || currentEntity2 !== newEntity2 )){
                oTable2.bindAggregation("items", {
                path: path,
                template: new sap.m.ColumnListItem({
                cells: [
                        new sap.m.Label({ text: "{FacturaID}" }),
                        new sap.m.Label({
                            text: {
                                path: "FOB",
                                type: new sap.ui.model.type.Float({ minFractionDigits: 2, maxFractionDigits: 2 })
                            }}),
                        new sap.m.Label({
                            text: {
                                path: "Frete",
                                type: new sap.ui.model.type.Float({ minFractionDigits: 2, maxFractionDigits: 2 })
                            }}),
                        new sap.m.Label({
                            text: {
                                path: "Seguro",
                                type: new sap.ui.model.type.Float({ minFractionDigits: 2, maxFractionDigits: 2 })
                            }}),
                        new sap.m.Label({
                            text: {
                                path: "CIF",
                                type: new sap.ui.model.type.Float({ minFractionDigits: 2, maxFractionDigits: 2 })
                            }})
                ] }) });
	        }  
        }        
        if (key === "ContentoresSet"){
	        var oTable3 = this.getView().byId("TabelaContentores");
            var info3 = oTable3.getBindingContext();
	        if(info3){
                var currentEntity3 = info3.getPath();
                var newEntity3 = "/" + this.entity;
            }
            var items3 = oTable3.getBinding("items");
	        if (oTable3 && ( !items3 || currentEntity3 !== newEntity3 )){
                oTable3.bindAggregation("items", {
                path: path,
                template: new sap.m.ColumnListItem({
                cells: [
                        new sap.m.Label({ text: "{Matricula}" }),
                        new sap.m.Label({ text: "{Tipo}" }),
                        new sap.m.Label({ text: "{Localizacao}" }),
                        new sap.m.Label({ text: "{DataDescarga}" }),
                        new sap.m.Label({ text: "{DataGateout}" }),
                        new sap.m.Label({ text: "{Sobrestadia}" })
                ] }) });
	        }  
        }
    },
    
    clearTableBinding : function() {
        var oTable = this.getView().byId("TabelaContentores");
        oTable.unbindAggregation("items", false);
        
        oTable = this.getView().byId("TabelaFacturas");
        oTable.unbindAggregation("items", false);
        
        this.getView().byId("TabelaCustos");
        oTable.unbindAggregation("items", false);
    },
    
	onDetailSelect : function(oEvent) {

	    var key = oEvent.getParameter("selectedKey");
	    var path = oEvent.getSource().getBindingContext().getPath() + "/" + key;

	    this.setTableData(key,path);
	    
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail",{
			entity : oEvent.getSource().getBindingContext().getPath().slice(1),
			tab: oEvent.getParameter("selectedKey")
		}, true);	    
	    

	},
	
	onSave : function(oEvent) {
	    this.update();
	},
	
	update : function() {
	    var oModel = this.getView().getModel();
        var Context = "/" + this.entity;  
        var object = this._buildObject();
        oModel.update(Context, object, null, function(){  
                    sap.m.MessageToast.show("Updated Successfully");  
                }, function(){  
                    sap.m.MessageToast.show("Update Failed");  
                });  
	},
	
	_buildObject : function(){
	    var object = this.getView().getModel().getObject("/" + this.entity);
	    object.Descritivo = this.getView().byId("idDescritivo").getValue();
	    object.BL = this.getView().byId("idBL").getValue();
	    object.ATA = this.getView().byId("idATA").getValue();
	    object.NavioPartida = this.getView().byId("idNavioPartida").getValue();
	    object.NavioChegada = this.getView().byId("idNavioChegada").getValue();
	    object.RececaoDoc = this.getView().byId("idRececaoDoc").getValue();
	    object.CNCA = this.getView().byId("idCNCA").getValue();
	    object.DU = this.getView().byId("idDU").getValue();
	    object.TerminalID = this.getView().byId("idTerminal").getProperty("selectedKey");	    
	    return object;
	}
	
});