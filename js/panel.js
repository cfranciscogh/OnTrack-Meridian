// JavaScript Document
// JavaScript Document
$(document).ready(function(e) {  
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
		$(".itemUsuario").parent().find("li").css("width","33%");
		$(".itemUsuario").hide();
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
						
						
					var css = "";
					if (resultado[i].IDEstado == 3)
						css = "verde";
					if (resultado[i].IDEstado == 4)
						css = "ambar";
					if (resultado[i].IDEstado == 5) //NO
						css = "rojo";
					if (resultado[i].IDEstado == 6)
						css = "azul";
					
					css = css + " " + cssGrupo;
					var href = "";
					if (  resultado[i].IDEstado == 2  || resultado[i].IDEstado == 3  || resultado[i].IDEstado == 4 )
						href = 'href="detalle.html?IDPedido='+resultado[i].IDPedido+'&idChofer='+$.QueryString["idChofer"]+'&empresa='+$.QueryString["empresa"] +  paramGrupo + '"'; 
						
					
					if (!flagGrupo)
					$("#listProgramacion").append('<li data-estado="'+resultado[i].IDEstado+'" data-grupo="'+resultado[i].GrupoCode+'"><a '+href+' class="'+css+'" data-ajax="false">' + orden + ' - ' + resultado[i].NombreCliente +'</a></li> ');
					
				}
				$( "#listProgramacion" ).listview( "refresh" );
				$( "#listProgramacionDAD" ).listview( "refresh" );
			}
			else{
				$("#contentProgramaciones").find("h3").remove();
				//$("#contentProgramaciones #divTABS").fadeOut("fast", function(){
					$("#contentProgramaciones").append("<h3>No se encontraron programaci&oacute;nes para el dia de hoy</h3>").hide().fadeIn("fast");
				//});
				//$("#contentProgramaciones").find("h3").remove();
				
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
