// JavaScript Document
var dominio = "http://www.meridian.com.pe/ServiciosWEB/"; 
var  latitude = "";
var longitude = "";
function onSuccess(position) {
   latitude = position.coords.latitude;
   longitude = position.coords.longitude;
}
function onError(error) {
    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}
function miubicacion() {
    alerta("Geolocalizaci\u00F3n: " + latitude + " | " + longitude);
}
//var dominio = "http://localhost:34927/"; 
$(document).ready(function(e) {
	watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
	$("#irPanel").attr("href","panel.html?idChofer=" + $.QueryString["idChofer"] +'&empresa='+ $.QueryString["empresa"] );
	
	$("#config").click(function(e) {
        e.preventDefault();
		
		if ( $("#fecha_inicio").val() == "" ){
			alerta('Ingresar fecha de ingreso');
			$("#fecha_inicio").focus();
			return;
		}
		
		if ( $("#hora_inicio").val() == "" ){
			alerta('Ingresar hora de ingreso');
			$("#hora_inicio").focus();
			return;
		}
	
		var paramEmbarque = new Object();
		paramEmbarque.IDEmbarque = $("#IDEmbarque").val();	
		paramEmbarque.IDEstado = $("#estado").val();	
		paramEmbarque.FechaInicio = $("#fecha_inicio").val();				 
		paramEmbarque.HoraInicio = $("#hora_inicio").val();		
		paramEmbarque.FechaFin = $("#fecha_fin").val();				 
		paramEmbarque.HoraFin = $("#hora_fin").val();		
		$.mobile.loading('show');
		$.ajax({
			url : dominio + "TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/CerrarEmbarque",
			type: "POST",
			dataType : "json",
			data : JSON.stringify(paramEmbarque),
			contentType: "application/json; charset=utf-8",
			success : function(data, textStatus, jqXHR) {
				resultado = $.parseJSON(data.d);
				$.mobile.loading('hide');
				 if ( resultado.code == 1){
					 mostrarEmbarque($.QueryString["idChofer"],0,$.QueryString["empresa"]);
				 }			 
				 alerta(resultado.message);
			},	
			error : function(jqxhr) 
			{
			  alerta('Error de conexi\u00f3n, contactese con sistemas!');
			}	
		});	
			
		
    });
	
	mostrarEmbarque($.QueryString["idChofer"],0,$.QueryString["empresa"]);
	
});

function mostrarEmbarque(IDChofer,IDPlaca,IDEmpresa){

	$.ajax({
		url :dominio +  "TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ConsultarEmbarque",
		//url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ConsultarEmbarque",
		type: "POST",
		crossDomain: true,
		dataType : "json",
		data : '{"IDChofer" : "' + IDChofer +  '", "IDPlaca" : ' + IDPlaca + '}',
		contentType: "application/json; charset=utf-8",
		success : function(data, textStatus, jqXHR) {
		  empresas = $.parseJSON(data.d);
			if ( empresas.length > 0){
				for (var i = 0; i<empresas.length;i++){
					$("#fecha_inicio").val(empresas[i].FechaInicioAlmacen);
					$("#hora_inicio").val(empresas[i].HoraInicioAlmacen);
					
					if ( empresas[i].FechaSalidaAlmacen != "01/01/1900" )
						$("#fecha_fin").val(empresas[i].FechaSalidaAlmacen);
					if ( empresas[i].HoraSalidaAlmacen != "00:00:00" )
						$("#hora_fin").val(empresas[i].HoraSalidaAlmacen);
					
					
					$("#estado").val(empresas[i].IDEstado);
					$("#recepcionado").slider('refresh');
					$("#IDEmbarque").val(empresas[i].IDEmbarque);	
					$(".titulo").html("Embarque #" + empresas[i].NumEmbarqueCODE)			   
				}
			}
			else
				$(".contentAtencion").html("<h3>No se encontró ningún embarque abierto.</h3>")
		},
		error : function(jqxhr) 
		{
			alerta('Error de conexi\u00f3n, contactese con sistemas!');
		}
	});		
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