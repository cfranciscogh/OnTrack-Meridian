// JavaScript Document
$(document).ready(function(e) {
	
	/*$("#listEmpresas li a").eq(0).attr("href","panel.html?idChofer="+$.QueryString["idChofer"]+"&empresa=SODIMA");
	$("#listEmpresas li a").eq(1).attr("href","panel.html?idChofer="+$.QueryString["idChofer"]+"&empresa=MAESTR");
	$("#listEmpresas li a").eq(2).attr("href","panel.html?idChofer="+$.QueryString["idChofer"]+"&empresa=SOLTRA");
	$("#listEmpresas li a").eq(3).attr("href","panel.html?idChofer="+$.QueryString["idChofer"]+"&empresa=INGRAM");*/
	mostrarEmpresas($.QueryString["idChofer"]);
	
});

function mostrarEmpresas(IDChofer){
	$.ajax({
		url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ConsultarEmpresas_PorChofer",
		type: "POST",
		crossDomain: true,
		dataType : "json",
		data : '{"IDChofer" : "' + IDChofer +  '"}',
		contentType: "application/json; charset=utf-8",
		success : function(data, textStatus, jqXHR) {
		  empresas = $.parseJSON(data.d);
		  //console.log(empresas);
			if ( empresas.length > 0){
				for (var i = 0; i<empresas.length;i++){
				$("#listEmpresas").append('<li><a data-ajax="false"  href="panel.html?idChofer='+IDChofer+'&empresa='+empresas[i].ENT_CODI+'"   style="padding-left:50px;"><table width="100%" height="100%"><tr><td><img style="position:static; max-width:80%;" src="http://www.meridian.com.pe/gt_extranet/images/TransportesMeridian/cuentas/'+empresas[i].ImagenPublica+'"></td></tr></table></a></li>');
				}
				$( "#listEmpresas" ).listview( "refresh" );
				//location.href = "panel.html?idChofer=" + resultado.datos[0].codigo + "&empresa=" + empresas[0].ENT_CODI;
			}
		},
		error : function(jqxhr) 
		{
			alerta('Error de conexi\u00f3n, contactese con sistemas!');
		}
	});		
}

   