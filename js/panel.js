// JavaScript Document
var latitude = "";
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
$(document).ready(function(e) {  
	watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
	getProgramaciones();
	$("#actualizar").click(function(e) {
        getProgramaciones();
    });
	
	//$("#tituloEmpresa").html($.QueryString["empresa"]);
	
	$("#regresarEmpresa").attr("href","empresa.html?idChofer=" + $.QueryString["idChofer"]);
	$("#irPicking").attr("href","picking.html?idChofer=" + $.QueryString["idChofer"] +'&empresa='+ $.QueryString["empresa"] );
	$("#irEmbarque").attr("href","embarque.html?idChofer=" + $.QueryString["idChofer"] +'&empresa='+ $.QueryString["empresa"] );
	
	if ( $.QueryString["idChofer"] != 0 ){
		$(".itemAdmin").parent().find("li").css("width","33%");
		$(".itemAdmin").hide();
	}
	else{
		$(".itemUsuario").parent().find("li").css("width","25%");
		//$(".itemUsuario").hide();
	}
		

});

 

function alertDismissed(){
}
//  

function getProgramaciones(){
	
	$.mobile.loading('show');
	//alert($.QueryString["idChofer"]);   
	$("#listProgramacion").html("");  
	$("#listProgramacionDAD").html("");  
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ConsultarPedidos",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"IDChofer":"'+$.QueryString["idChofer"]+'", "Empresa":"'+$.QueryString["empresa"]+'"}',
        //contentType: "xml",
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
		resultado = $.parseJSON(data.d);
			//console.log(resultado);
			$.mobile.loading('hide');
			if ( resultado.length > 0 ){
				$("#contentProgramaciones").find("h3").remove();
				$("#contentProgramaciones #divTABS").fadeIn("fast");
				var count = 0;
				var strStyle = "";
				for (var i = 0; i<resultado.length;i++){
					var cssGrupo = "";
					var orden = ""
					var paramGrupo = "&grupo=0";
					var flagGrupo = false;
					if ( resultado[i].GrupoCode != ""){
						orden = "GRUPO #" + resultado[i].GrupoCode;
						cssGrupo = "grupo" + resultado[i].GrupoCode; 
						var paramGrupo = "&grupo=1";
						if ( $("#listProgramacion li a." + cssGrupo).length > 0 ){
							flagGrupo = true;
						}
					}
					else
						orden = resultado[i].NroOrdenCompra;
						
						
				 	var href = "";
					if (  resultado[i].IDEstado == 2  || resultado[i].IDEstado == 3  || resultado[i].IDEstado == 4 )
						href = 'href="detalle.html?IDPedido='+resultado[i].IDPedido+'&idChofer='+$.QueryString["idChofer"]+'&empresa='+$.QueryString["empresa"] +  paramGrupo + '"'; 
					
					strStyle +="<style> #item" + resultado[i].IDPedido + ".ui-btn-icon-right:after{ background-color: " + resultado[i].Estado_Color + " !important;}</style>"
					
					if (!flagGrupo)
					$("#listProgramacion").append('<li data-estado="'+resultado[i].IDEstado+'" data-grupo="'+resultado[i].GrupoCode+'"><a id="item'+resultado[i].IDPedido+'" '+href+' class="item '+cssGrupo+'" data-ajax="false" data-color="' + resultado[i].Estado_Color +'">' + orden + ' - ' + resultado[i].NombreCliente +'</a></li> ');
					
				}
				
				$("#listProgramacion").listview("refresh");
				$("body").append(strStyle);
				
				/*setTimeout(function(){ 
					$("#listProgramacion li").each(function(a,b){
						var color = $(b).find("a").data("color");
						//alert(color);
						$(b).find("a:after").remove();
						$(b).find("a:after").css("background-color",color);
					});					
				}, 3000);
				*/
			}
			else{
				$("#contentProgramaciones").find("h3").remove();
				$("#contentProgramaciones").append("<h3>No se encontraron programaciónes</h3>").hide().fadeIn("fast");
			}
        },

        error : function(jqxhr) 
        {
		   console.log(jqxhr);	
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
