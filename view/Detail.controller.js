jQuery.sap.require("sap.sousa.Processo.util.Formatter");
jQuery.sap.require("sap.sousa.Processo.util.Controller");
jQuery.sap.require("sap.sousa.Processo.util.Tables");
jQuery.sap.require("sap.sousa.Processo.util.Modelo");

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
			
			if(!this.entity || this.entity !== oParameters.arguments.entity){
			    this.clearTableBinding();
                sap.sousa.Processo.util.Modelo.loadForEntity(oParameters.arguments.entity, this);
			}

			var oIconTabBar = oView.byId("idIconTabBar");
			var selected = oParameters.arguments.tab;
			if (!selected){
			    oIconTabBar.setExpanded(false);
			}
			else{
			    var expanded = oIconTabBar.getProperty("expanded");
			}
			
			if(selected){
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
            sap.sousa.Processo.util.Tables.setCustoTable(this.entity, oTable, this);
        }
        if (key === "FacturasSet"){
            var oTable2 = this.getView().byId("TabelaFacturas");
            sap.sousa.Processo.util.Tables.setFacturasTable(this.entity, oTable2);

        }
        if (key === "ContentoresSet"){
            var oTable3 = this.getView().byId("TabelaContentores");
            sap.sousa.Processo.util.Tables.setContentoresTable(this.entity, oTable3);
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


        sap.ui.core.UIComponent.getRouterFor(this).navTo("detail", {
                entity: oEvent.getSource().getBindingContext().getPath().slice(1),
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
                    sap.m.MessageToast.show("Gravado com sucesso");
                }, function(){  
                    sap.m.MessageToast.show("Falhou gravação");
                });  
	},

    handleFornecedorHelp : function (oEvent) {
        this.inputField = oEvent.getSource();
        // create value help dialog
        if (!this._valueHelpDialog) {
            this._valueHelpDialog = sap.ui.xmlfragment(
                "sap.sousa.Processo.view.Dialog",
                this
            );
            this.getView().addDependent(this._valueHelpDialog);
        }

        // open value help dialog
        this._valueHelpDialog.open();
    },

    _handleValueHelpSearch : function (evt) {
        var sValue = evt.getParameter("value");
        var oFilter = new sap.ui.model.Filter(
            "Descritivo",
            sap.ui.model.FilterOperator.Contains, sValue
        );
        evt.getSource().getBinding("items").filter([oFilter]);
    },

    _handleValueHelpClose : function (evt) {
        var oSelectedItem = evt.getParameter("selectedItem");
        if (oSelectedItem) {
            var codigo  = oSelectedItem.getDescription();
            var oModel = this.getView().getModel();
            this.inputField.setProperty("value", codigo);
        }
        evt.getSource().getBinding("items").filter([]);
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