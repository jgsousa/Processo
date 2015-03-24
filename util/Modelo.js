jQuery.sap.declare("sap.sousa.Processo.util.Modelo");

sap.sousa.Processo.util.Modelo = {

    loadForEntity : function(entity, oController){

        var sEntityPath = "/" + entity;
        var custosPath = sEntityPath + "/CustosSet";
        var facturasPath = sEntityPath + "/FacturasSet";
        var contentoresPath = sEntityPath + "/ContentoresSet";
        var oModel = oController.getView().getModel();

        var cModel = new sap.ui.model.json.JSONModel();
        oController.getView().setModel(cModel,"Custos");
        oModel.read(custosPath,null, null, true, function(oData, oResponse){
            cModel.setData(oData);
        });

        var tModel = new sap.ui.model.json.JSONModel();
        oController.getView().setModel(tModel,"Contentores");
        oModel.read(contentoresPath,null, null, true, function(oData, oResponse){
            tModel.setData(oData);
        });

        var fModel = new sap.ui.model.json.JSONModel();
        oController.getView().setModel(fModel,"Facturas");
        oModel.read(facturasPath,null, null, true, function(oData, oResponse){
            fModel.setData(oData);
        });

    },

    loadFornecedores : function(oController){
        var oModel = oController.getModel();
        var sModel = new sap.ui.model.json.JSONModel();
        oController.setModel(sModel,"Fornecedores");
        oModel.read("/FornecedorSet",null, null, true, function(oData, oResponse){
            sModel.setData(oData);
        });
    }
}