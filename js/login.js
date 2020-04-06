// JavaScript Document
// JavaScript Document
$(document).ready(function(e) {
    	$("#ingresar").click(function(e) {
            e.preventDefault();
			$.mobile.loading('show');
			setTimeout(loginValidar, 500);
        });
});

var loginValidar = function(){
	
	  if ( $("#usuario").val() == "" && $("#clave").val() == "" )
   	{
		$.mobile.loading('hide');
		alerta('Complete los campos');
		return;
   	} 
	 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Autenticacion/LoginChofer.asmx/LoginChofer",
        type: "POST",
		crossDomain: true,
        dataType : "json",
        data : '{"usuario" : "' + $("#usuario").val() + '", "clave" : "' + $("#clave").val() + '"}',
        contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
          resultado = $.parseJSON(data.d);
		  if ( resultado.code == 1){			
			window.localStorage.setItem("page","panel.html");
			$.ajax({
				url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ConsultarEmpresas_PorChofer",
				type: "POST",
				crossDomain: true,
				dataType : "json",
				data : '{"IDChofer" : "' + resultado.datos[0].codigo +  '"}',
				contentType: "application/json; charset=utf-8",
				success : function(data, textStatus, jqXHR) {
				  empresas = $.parseJSON(data.d);
				  //console.log(empresas);
					if ( empresas.length > 0)
				  		location.href = "panel.html?idChofer=" + resultado.datos[0].codigo + "&empresa=" + empresas[0].ENT_CODI;
					else
						location.href = "panel.html?idChofer=" + resultado.datos[0].codigo + "&empresa=TMERDI";
				},
				error : function(jqxhr) 
				{
					alerta('Error de conexi\u00f3n, contactese con sistemas!');
				}
			});			
			 
		  }
		  else{			  
			$.mobile.loading('hide');
			if ( $("#usuario").val() == "admin" && $("#clave").val() == "meridian" ){
				window.localStorage.setItem("page","empresa.html");
				location.href = "empresa.html?idChofer=0";
			}
			else
				{
					alerta('Usuario y/o clave son incorrectos.');
					$("#usuario").val("");
					$("#clave").val("");
					$("#usuario").focus();
					$(".loadLogin").fadeOut("fast");
				}
		  }
        },

        error : function(jqxhr) 
        {
			alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });	
	
	
	
/*   if ( $("#usuario").val() == "admin" && $("#clave").val() == "1234" )
   {
	  
   }
   else{
	   $.mobile.loading('hide');
	   navigator.notification.alert(
            'Usuario y/o clave son incorrectos!',  // message
            alertDismissed,         // callback
            'Informaci\u00f3n',            // title
            'Aceptar'                  // buttonName
        );
	   $("#usuario").val("");
	   $("#clave").val("");
	   $("#usuario").focus();
	   $(".loadLogin").fadeOut("fast");
   }*/
   
};

function alertDismissed(){
}


function alerta(mensaje){
	if ( navigator.notification == null)
		alert(mensaje);
 	else
	 navigator.notification.alert(
            mensaje,  // message
            alertDismissed,         // callback
           'Informaci\u00f3n',            // title
            'Aceptar'                  // buttonName
        	);
	
}