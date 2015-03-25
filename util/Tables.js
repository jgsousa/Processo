jQuery.sap.declare("sap.sousa.Processo.util.Tables");

sap.sousa.Processo.util.Tables = {

    setCustoTable : function(entity, oTable, oController){
        var info = oTable.getBindingContext();
        if(info){
            var currentEntity = info.getPath();
            var newEntity = "/" + entity;
        }
        var items = oTable.getBinding("items");
        if (oTable &&  ( !items || currentEntity !== newEntity ) ){

            var oTemplate = new sap.ui.core.Item({
                text: "{CurrencyModel>key}",
                key: "{CurrencyModel>key}"
            });
            var select = new sap.m.Select({
                selectedKey: "{Custos>Moeda}", enabled:"{Custos>Editavel}",
                items: {path: "CurrencyModel>/items", template: oTemplate} });

            oTable.bindAggregation("items", {
                path: "Custos>/results",
                vAlign: "Middle",
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Label({ text: "{Custos>Grupo}"}),
                        new sap.m.Label({ text: "{Custos>Descritivo}" }),
                        new sap.m.Input({
                            value: {
                                path: "Custos>Valor",
                                type: new sap.ui.model.type.Float({ minFractionDigits: 2, maxFractionDigits: 2 }
                                )},
                            editable:"{Custos>Editavel}"
                        }),
                        select,
                        new sap.m.Input({ value: "{Custos>Cambio}", editable:"{Custos>Editavel}"}),
                        new sap.m.Input({ value: "{Custos>FornecedorID}", showValueHelp: true ,
                            valueHelpRequest : [oController.handleFornecedorHelp, oController]  })
                    ] }) });
        }
    },

    setFacturasTable : function(entity, oTable2){
        var info2 = oTable2.getBindingContext();
        if(info2){
            var currentEntity2 = info2.getPath();
            var newEntity2 = "/" + entity;
        }
        var items2 = oTable2.getBinding("items");
        if (oTable2 && ( !items2 || currentEntity2 !== newEntity2 )){
            oTable2.bindAggregation("items", {
                path: "Facturas>/results",
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Label({ text: "{Facturas>FacturaID}" }),
                        new sap.m.Label({
                            text: {
                                path: "Facturas>FOB",
                                type: new sap.ui.model.type.Float({ minFractionDigits: 2, maxFractionDigits: 2 })
                            }}),
                        new sap.m.Label({
                            text: {
                                path: "Facturas>Frete",
                                type: new sap.ui.model.type.Float({ minFractionDigits: 2, maxFractionDigits: 2 })
                            }}),
                        new sap.m.Label({
                            text: {
                                path: "Facturas>Seguro",
                                type: new sap.ui.model.type.Float({ minFractionDigits: 2, maxFractionDigits: 2 })
                            }}),
                        new sap.m.Label({
                            text: {
                                path: "Facturas>CIF",
                                type: new sap.ui.model.type.Float({ minFractionDigits: 2, maxFractionDigits: 2 })
                            }})
                    ] }) });
        }
    },

    setContentoresTable : function(entity, oTable3){
        var info3 = oTable3.getBindingContext();
        if(info3){
            var currentEntity3 = info3.getPath();
            var newEntity3 = "/" + entity;
        }
        var items3 = oTable3.getBinding("items");
        if (oTable3 && ( !items3 || currentEntity3 !== newEntity3 )){
            oTable3.bindAggregation("items", {
                path: "Contentores>/results",
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Label({ text: "{Contentores>Matricula}" }),
                        new sap.m.Label({ text: "{Contentores>Tipo}" }),
                        new sap.m.Label({ text: "{Contentores>Localizacao}" }),
                        new sap.m.Label({ text: "{Contentores>DataDescarga}" }),
                        new sap.m.Label({ text: "{Contentores>DataGateout}" }),
                        new sap.m.Label({ text: "{Contentores>Sobrestadia}" })
                    ] }) });
        }
    }
};