jQuery.sap.declare("sap.sousa.Processo.util.Formatter");

sap.sousa.Processo.util.Formatter = {

	_statusStateMap : {
	    "1" : "Error" ,
		"2" : "Error"
	},
	
	uppercaseFirstChar : function(sStr) {
		return sStr.charAt(0).toUpperCase() + sStr.slice(1);
	},

	discontinuedStatusState : function(sDate) {
		return sDate ? "Error" : "None";
	},

	discontinuedStatusValue : function(sDate) {
		return sDate ? "Discontinued" : "";
	},

	currencyValue : function (value) {
		return parseFloat(value).toFixed(2);
	},
	
	dateConvert : function (value) {
	    if(value){
	        return value.substring(0,4) + "/" + value.substring(4,6) + "/" + value.substring(6,8);
	    }
	    else{
	        return "";
	    }
	},
	
	statusValue : function (value) {
	    var bundle = this.getModel("i18n").getResourceBundle();
	    return bundle.getText("StatusText" + value, "?");
	},
	
	statusState : function (value) {
		var map = sap.sousa.Processo.util.Formatter._statusStateMap;
		return (value && map[value]) ? map[value] : "None";  	    
	}

};