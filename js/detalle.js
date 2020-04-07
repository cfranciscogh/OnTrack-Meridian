// JavaScript Document
var check = true;
var dominio = "http://www.meridian.com.pe/ServiciosWEB/"; 
var dominio_extranet = "http://www.meridian.com.pe/GT_Extranet/";
//var dominio = "http://localhost:34927/";

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
// onError Callback receives a PositionError object
//
 
function quitarFoto(IDFoto, ctr){
	if ( confirm('Desea quitar esta foto?')){
		$(ctr).parent().parent().remove();
	}
}


function base64toBlob(base64Data, contentType) {
    contentType = contentType || 'image/jpeg';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

function sendImage(src) {
    src = (src == 'library') ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA;
    navigator.camera.getPicture(success, fail, { 
        quality: 70,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        sourceType: src,
        encodingType: navigator.camera.EncodingType.JPEG,
        saveToPhotoAlbum: false
    });
}
 
function success(imageData) {
    $.mobile.loading('show');
    if (window.FormData !== undefined) {
        var data = new FormData();
        data.append("IDPedido", $("#IDPedido").val());
        var blob = b64toBlob(imageData, 'image/jpeg');
        data.append("file", blob);
        //alert(data);
        $.ajax({
            type: "POST",
            //url: dominio_extranet + '/Public/Servicios/UploadImageTracking.ashx?IDPedido=' + $("#IDPedido").val(),
			  url: dominio_extranet + 'TransportesMeridian/Util/UploadImageTracking.ashx?IDPedido=' + $("#IDPedido").val(),
            contentType: false,
            processData: false,
            data: data,
            success: function (result) {
                resp = result.toString().split("|");
                console.log(resp);
                if (resp[0] == 0) {
                    alerta(resp[1]);
                    setFotosPedido($.QueryString["IDPedido"]);
                }
                else {
                    //alerta("Error, no se pudo subir la foto");
                    alerta(resp[1]);
                    alerta(resp[2]);
                }
                    

                $.mobile.loading('hide');
                $('#fileFoto').val("");
            },
            error: function (xhr, status, p3, p4) {
                var err = "Error " + " " + status + " " + p3 + " " + p4;
                if (xhr.responseText && xhr.responseText[0] == "{")
                    err = JSON.parse(xhr.responseText).Message;

                $('#file').val("");
                console.log(xhr);
                console.log(status);
                alerta("Error, no se pudo subir la foto");
                $.mobile.loading('hide');
            }
        });
    } else {
        alert("This app doesn't support file uploads!");
        $.mobile.loading('show');
    }
    /*
    var url = dominio_extranet + '/Public/Servicios/UploadImageTracking.ashx?IDPedido=' + $("#IDPedido").val();
    var params = { image: imageData };
    // send the data
    $.post(url, params, function (data) {
        console.log(data)
        alert(data);
    });
    */
}
function fail(message) {
    //alert(message);
}

//document.addEventListener("deviceready", onDeviceReady, false);
var watchID = null;

$(document).ready(function(e) {
	
	
  $('#btnFoto').click(function (e) { e.preventDefault(); sendImage("camera"); });
    
 
 $('#fileFoto').on('change', function (e) {
	 $.mobile.loading('show'); 
    var files = e.target.files;
    //var myID = 3; //uncomment this to make sure the ajax URL works
    if (files.length > 0) {
       if (window.FormData !== undefined) {
           var data = new FormData();
		   data.append("IDPedido", $("#IDPedido").val());
           for (var x = 0; x < files.length; x++){
               data.append("file" + x, files[x]);
           }
		  //console.log($("#IDPedido").val());
           $.ajax({
               type: "POST",
               url: dominio_extranet + 'TransportesMeridian/Util/UploadImageTracking.ashx?IDPedido=' + $("#IDPedido").val(),
               contentType: false,
               processData: false,
               data: data,
               success: function(result) {
                   resp = result.toString().split("|");
				   if ( resp[0] == 0) {
				   		alerta(resp[1]);
						setFotosPedido($.QueryString["IDPedido"]);
				   }
					else
						alerta("Error, no se pudo subir la foto");
						
				   $.mobile.loading('hide'); 
				   $('#file').val("");
               },
               error: function (xhr, status, p3, p4){
                   var err = "Error " + " " + status + " " + p3 + " " + p4;
                   if (xhr.responseText && xhr.responseText[0] == "{")
                       err = JSON.parse(xhr.responseText).Message;
                       
					   $('#file').val("");
					   //console.log(xhr);
					    //console.log(status);
					   alerta("Error, no se pudo subir la foto");
					   $.mobile.loading('hide'); 
                    }
                });
        } else {
            alert("This browser doesn't support HTML5 file uploads!");
          }
     }
});
 
 $("#registrarIncidencia").click(function(e) {
        e.preventDefault();
		
		if ( latitude == "" ||  longitude == ""){
			//alert("Ingrese DNI");
			//alerta("No se puede obtener información de ubicación, revise si su GPS se encuentra activo o tenga cobertura de red");
			//return;
		}
			
			
		if ( $("#hora").val() == "" ){
			//alert("Ingrese Tiempo Aprox. de llegada");
			alerta("Ingrese Tiempo Aprox. de llegada");
			$("#hora").focus();
			return;
		}
		
		if ( $("#recepcionado").val() == 1 ){			
			if ( $("#nombre").val() == "" ){
				//alerta("Ingrese Nombre");
				//$("#nombre").focus();
				//return;
			}			
			if ( $("#dni").val() == "" ){
				//alerta("Ingrese DNI");
				//$("#dni").focus();
				//return;
			}			
		} 
		
		if ( $("input[name*=tipoIncidencia]:checked").val() ==  null ){			 
				alerta("Seleccionar incidencia");
				$("input[name*=tipoIncidencia").focus();
				return;
		
		}
		
		
	var parametros = new Object();
	parametros.IDTranking = $("#IDTranking").val();	
	parametros.IDPedido = $("#IDPedido").val();	
	parametros.TiempoAproxLlegada = $("#hora").val();	
	parametros.Recepcionado = $("#recepcionado").val();	
	parametros.Nombre = $("#nombre").val();	
	parametros.DNI = $("#dni").val();	
	parametros.IDEstado = $("#estado").val();	
	parametros.Observacion = $("#detalle").val();	
	parametros.Latitud = latitude;	
	parametros.Longitud = longitude;	
	parametros.Incidencia = $("input[name*=tipoIncidencia]:checked").val();	 
	parametros.FlagMail = 0;
	parametros.HoraInicio = $("#hora_inicio").val();	 
	parametros.HoraFin = $("#hora_fin").val();	 
	//console.log(parametros);
	//console.log(parametros);
	//return;
		
	$.mobile.loading('show'); 
	$.ajax({
        url : dominio + "TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/GenerarTrakingV2",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : JSON.stringify(parametros),
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');
			 if ( resultado.code == 1){
				 $("#myPopup").popup("close");
				 $("#detalle").val("");
				 $("input[name*=tipoIncidencia]").removeAttr("checked");
				 //$("#IDTranking").val(resultado.codigo);	
				 //setTracking($("#IDPedido").val());
			 }			 
			 //alert(resultado.message);
			 alerta(resultado.message);
			 
        },

        error : function(jqxhr) 
        {
		  //console.log(jqxhr);	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		
		
		//
		
		
    });
	
	
	
	$("input[id*='opcion']").change(function(e) {	 
		//console.log($("label[for*='" + $(this).attr("id") + "']").find("img").attr("title") );
        $("#txtIncidencia").html( $("label[for*='" + $(this).attr("id") + "']").find("img").attr("title") );
    });

	setPedido($.QueryString["IDPedido"]);
	setTracking($.QueryString["IDPedido"]);
	setFotosPedido($.QueryString["IDPedido"]);
	$("#IDPedido").val($.QueryString["IDPedido"]);
	$("#regresarPanel").attr("href","panel.html?idChofer=" + $.QueryString["idChofer"] + "&empresa=" + $.QueryString["empresa"]);
	
	//$("#tituloEmpresa").html($.QueryString["empresa"]);
	
 
	
	
	
	watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
	 
	
	$("#guardarTracking").click(function(e) {
        e.preventDefault();
		
		if ( latitude == "" ||  longitude == ""){
			//alert("Ingrese DNI");
			//alerta("No se puede obtener información de ubicación, revise si su GPS se encuentra activo o tenga cobertura de red");
			//return;
		}
			
			
		if ( $("#hora").val() == "" ){
			alerta("Ingrese Tiempo Aprox. de llegada");
			$("#hora").focus();
			return;
		}
		
		if ( $("#recepcionado").val() == 1 ){			
			if ( $("#nombre").val() == "" ){
				//alerta("Ingrese Nombre");
				//$("#nombre").focus();
				//return;
			}			
			if ( $("#dni").val() == "" ){
				//alerta("Ingrese DNI");
				//$("#dni").focus();
				//return;
			}
			if ( $("#hora_inicio").val() == "" ){
				alerta("Ingrese hora de inicio de atención");
				$("#hora_inicio").focus();
				return;
			}			
			if ( $("#hora_fin").val() == "" ){
				alerta("Ingrese hora de fin de atención");
				$("#hora_fin").focus();
				return;
			}	
		}
		
		if ( $("#estado").val() == 5 || $("#estado").val() == 7 ){
			if ( $("#hora_inicio").val() == "" ){
				alerta("Ingrese hora de inicio de atención");
				$("#hora_inicio").focus();
				return;
			}			
			if ( $("#hora_fin").val() == "" ){
				alerta("Ingrese hora de fin de atención");
				$("#hora_fin").focus();
				return;
			}	
			if ( $("#incidencia").val() == "0" ){
				alerta("Seleccionar incidencia");
				$("#incidencia").focus();
				return;
			}
		}
		
		
	var parametros = new Object();
	parametros.IDTranking = $("#IDTranking").val();	
	parametros.IDPedido = $("#IDPedido").val();	
	parametros.TiempoAproxLlegada = $("#hora").val();	
	parametros.Recepcionado = $("#recepcionado").val();	
	parametros.Nombre = $("#nombre").val();	
	parametros.DNI = $("#dni").val();	
	parametros.IDEstado = $("#estado").val();	
	parametros.Observacion = $("#observacion").val();	
	parametros.Latitud = latitude;	
	parametros.Longitud = longitude;	
	parametros.Incidencia = ( parametros.IDEstado == 9 ? $("#motivo_arribo").val() : ( parametros.IDEstado == 11 ?  $("#motivo_descarga").val() : $("#incidencia").val() ) );	 
	parametros.FlagMail = 1;
	//parametros.Incidencia3 = $("#demora").val();
	//parametros.Incidencia2 = $("#demora").val();
	//parametros.HoraLlegada = $("#hora_inicio").val();
	parametros.HoraInicio = $("#hora_inicio").val();	 
	parametros.HoraFin = $("#hora_fin").val();	
	parametros.ParcialGrupo = 0;	 
	console.log(parametros);
	//return;
		
	$.mobile.loading('show'); 
	
	
	if ( parametros.IDEstado == 7){
		
		 //Confirmar Detalle de Productos
		$("input[id*='chkProdcuto']").each(function(index, element) {
			
			var paramDetalle = new Object();
			paramDetalle.IDPedido = 0;//$("#IDPedido").val();	
			paramDetalle.IDDetalle = $(this).val();	
			paramDetalle.IDEstado = ($(this).is(':checked') ? 6 :5);	
			paramDetalle.Cantidad = $(this).parent().parent().parent().find("input[type='number']").val();	
			cantidadReal = $(this).parent().parent().parent().find("input[type='number']").attr("max");
			
			//if ( paramDetalle.IDEstado == 6){
			if ( parseInt(paramDetalle.Cantidad)  < parseInt(cantidadReal) )
				paramDetalle.IDEstado = 7;
			if ( parseInt(paramDetalle.Cantidad) == 0)
				paramDetalle.IDEstado = 5;
			//}
			//console.log(paramDetalle);
            $.ajax({
				url : dominio + "/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/TrackinkDetalle",
				type: "POST",
				dataType : "json",
				data : JSON.stringify(paramDetalle),
				contentType: "application/json; charset=utf-8",
				success : function(data, textStatus, jqXHR) {
					//resultado = $.parseJSON(data.d);alerta(resultado.message);if ( resultado.code == 1){}	
				},	
				error : function(jqxhr) 
				{
				  alerta('Error de conexi\u00f3n, contactese con sistemas!');
				}	
			});	
        });
		
		var totalOC = $("input[id*='checkOC']").length;
		if ( $.QueryString["grupo"] == 1 ){
			$("input[id*='checkOC']").each(function(index, element) {
			
			parametros.IDPedido = $(this).val();	
			parametros.IDEstado = ($(this).is(':checked') ? 6:5);	
			
			var totalProductos = $(this).parent().parent().parent().find("input[id*='chkProdcuto']").length;
			var totalProductosMarcados = $(this).parent().parent().parent().find("input[id*='chkProdcuto']:checked").length;
			
			if ( totalProductosMarcados<totalProductos){
				parametros.IDEstado = 7;
			}
			if ( totalProductosMarcados == 0 )
				parametros.IDEstado = 5;
			
			if ( index == (totalOC-1)){ //Es el ultimo
				
				if ( parametros.IDEstado != 7 )
					parametros.ParcialGrupo = 1;
					
				$.ajax({
				   url : dominio + "TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/GenerarTrakingGrupo",
					type: "POST",
					dataType : "json",
					data : JSON.stringify(parametros),
					contentType: "application/json; charset=utf-8",
					success : function(data, textStatus, jqXHR) {
						resultado = $.parseJSON(data.d);
						$.mobile.loading('hide');
						 alerta(resultado.message);				 
						 if ( resultado.code == 1){			 
							 $("#IDTranking").val(resultado.codigo);	
							 setTracking($("#IDPedido").val());
						 }	
					},	
					error : function(jqxhr) 
					{
					  alerta('Error de conexi\u00f3n, contactese con sistemas!');
					}	
				});	
			}
			else{
				$.ajax({
				   url : dominio + "TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/GenerarTrakingGrupo_Simple",
					type: "POST",
					dataType : "json",
					data : JSON.stringify(parametros),
					contentType: "application/json; charset=utf-8",
					success : function(data, textStatus, jqXHR) {
						resultado = $.parseJSON(data.d);
						$.mobile.loading('hide');
						// alerta(resultado.message);				 
						 if ( resultado.code == 1){
						 }	
					},	
					error : function(jqxhr) 
					{
					  alerta('Error de conexi\u00f3n, contactese con sistemas!');
					}	
				});	
			}
			
		});			
		}
		else{ 
		
			$.ajax({
			   url : dominio + "TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/GenerarTrakingV3",
				type: "POST",
				dataType : "json",
				data : JSON.stringify(parametros),
				contentType: "application/json; charset=utf-8",
				success : function(data, textStatus, jqXHR) {
					resultado = $.parseJSON(data.d);
					$.mobile.loading('hide');
					 alerta(resultado.message);				 
					 if ( resultado.code == 1){			 
						 $("#IDTranking").val(resultado.codigo);	
						 setTracking($("#IDPedido").val());
					 }	
				},	
				error : function(jqxhr) 
				{
				  alerta('Error de conexi\u00f3n, contactese con sistemas!');
				}	
			});		
			
		}
		
		}	
	else {
		$.ajax({
		   //url : dominio + "TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/GenerarTraking_App",
			//url : dominio + "/TransportesMeridan/Servicios/OnTrack/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/GenerarTraking_App",
			url : "http://localhost:34927/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/GenerarTraking_App",
			type: "POST",
			dataType : "json",
			data : JSON.stringify(parametros),
			contentType: "application/json; charset=utf-8",
			success : function(data, textStatus, jqXHR) {
				resultado = $.parseJSON(data.d);
				$.mobile.loading('hide');
				 alerta(resultado.message);				 
				 if ( resultado.code == 1){
					 
					if( $("#recepcionado").val() == 1 || $("#estado").val() == 5 ) {
						$("input[id*='chkProdcuto']").each(function(index, element) {				
							var paramDetalle = new Object();
							paramDetalle.IDPedido = 0;//$("#IDPedido").val();	
							paramDetalle.IDDetalle = $(this).val();	
							paramDetalle.IDEstado = ( $("#recepcionado").val() == 1 ? 6 : 5);	
							cantidadReal = $(this).parent().parent().parent().find("input[type='number']").attr("max");
							paramDetalle.Cantidad = ( paramDetalle.IDEstado == 5 ? 0 : cantidadReal);	
							$.ajax({
								url : dominio + "/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/TrackinkDetalle",
								//http://localhost:34927/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx
								type: "POST",
								dataType : "json",
								data : JSON.stringify(paramDetalle),
								contentType: "application/json; charset=utf-8",
								success : function(data, textStatus, jqXHR) {
								},	
								error : function(jqxhr) 
								{
								  alerta('Error de conexi\u00f3n, contactese con sistemas!');
								}	
							});	
						});
					 }
					 
					 			 
					 $("#IDTranking").val(resultado.codigo);	
					 setTracking($("#IDPedido").val());
				 }	
			},	
			error : function(jqxhr) 
			{
				console.log(jqxhr);
			  alerta('Error de conexi\u00f3n, contactese con sistemas!');
			}	
		});		
	}//
		
		
    });
	
//};

});



function HabilitarIncidencia(control){
 $(" #btnIncidencia").hide();
 $("#DIVIncidencia, #panelParcial").hide();
 
 if ( $(control).val() == 5 ){
	 $("#DIVIncidencia").show();
 }
 else if ( $(control).val() == 4 ){
	$(" #btnIncidencia").show("fast");
 }
 else if (  $(control).val() == 7 ){
	 $("#DIVIncidencia, #panelParcial").show();
 }
 else{
 	
 } 
 
 setIncidencias_Tracking($.QueryString["empresa"],$(control).val());
 setIncidencias_Tracking2("TM",9,"#motivo_arribo");
 setIncidencias_Tracking2("TM",11,"#motivo_descarga");

}


function setTracking(idPedido){
	
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ObtenerTraking",
        type: "POST",
		cache: false,
		//crossDomain: true,
        dataType : "json",
        data : '{"IDPedido":"'+idPedido+'"}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			//console.log(data.d);
			resultado = $.parseJSON(data.d);
			console.log(resultado);
			$.mobile.loading('hide');
			 
			if ( resultado.length > 0 ){
				
				for (var i = 0; i<resultado.length;i++){	
					
					
					
					//$(".titulo").val(resultado[i].IDTraking);
					$("#IDTranking").val(resultado[i].IDTraking);
					$("#IDPedido").val(resultado[i].IDPedido);
					$("#observacion").val(resultado[i].Observacion.trim());
					if (resultado[i].Recepcionado){
						$("#recepcionado").val(1);
						$("#recepcionado").slider('refresh');
						$(".contentDatos").slideDown("fast");
						$("#nombre").val(resultado[i].Nombre.trim());
						$("#dni").val(resultado[i].DNI.trim());
					}
					HabilitarIncidencia($("#estado"));
					
					 
					
					$("#estado").html("");
					$("#estado").append("<option selected value='"+resultado[i].IDEstado+"'>"+resultado[i].Estado+"</option>");
					
					if ( resultado[i].IDEstado == 3 ) {
						$("#btnIncidencia").fadeIn("fast");	
						$("#estado").append("<option value='4'>EN RUTA</option>"); 
						$("#estado").append("<option value='5'>NO ENTREGADO</option>");
					}
					
					if ( resultado[i].IDEstado == 4 ) { 
						$("#estado").append("<option value='9'>ARRIBO</option>"); 
						$("#estado").append("<option value='5'>NO ENTREGADO</option>");
					}
					
					if ( resultado[i].IDEstado == 9 ) { 
						$("#estado").append("<option value='11'>DESCARGANDO</option>"); 
						$("#estado").append("<option value='5'>NO ENTREGADO</option>");
					}
					
					if ( resultado[i].IDEstado == 11 ) {
						$("#btnIncidencia").fadeIn("fast");	
						$("#estado").append("<option value='6'>ENTREGADO</option>");
						$("#estado").append("<option value='5'>NO ENTREGADO</option>");
						$("#estado").append("<option value='7'>ENTREGA PARCIAL</option>");
					}
					 
					
					if ( resultado[i].IDEstado > 3 ) {
						$("#DIVEstado").fadeIn("fast");
						$("#DIVRecepcionado").fadeIn("fast");
						$(".contentAtencion").fadeIn("fast");
						$("#hora").val(resultado[i].TiempoAproxLlegadaFormat);
						$("#hora_inicio").val(resultado[i].Hora_Inicio);
						$("#hora_fin").val(resultado[i].Hora_Termino);						
							
						/*
						//$("#btnRuta").val("EN RUTA - " + resultado[i].TiempoAproxLlegadaFormat);
						$("#btnRuta").attr("data-icon","check");
						//$("#btnRuta").button('refresh');
						$("#btnRuta").parent().addClass("ui-icon-check");	
						var html = $("#btnRuta").parent().html();
						html = html.replace("hh:mm",resultado[i].TiempoAproxLlegadaFormat);
						alert(html);
						//$("#btnRuta").parent().html(html);
						//$("#btnRuta").button('refresh');
						*/
					}
					
					if ( resultado[i].Orden > 4 ){
						$("#btnRuta").parent().addClass("ui-icon-check");	
					}
					if ( resultado[i].Orden > 5 ){
						$("#btnArribo").parent().addClass("ui-icon-check");	
					}
					if ( resultado[i].Orden > 6 ){
						if(resultado[i].Hora_Inicio != "")
							$("#btnDescarga1").parent().addClass("ui-icon-check");	
						if(resultado[i].Hora_Termino != "")
							$("#btnDescarga2").parent().addClass("ui-icon-check");	
					}
					if ( resultado[i].Orden > 7 ){
						$("#btnEntregado").parent().addClass("ui-icon-check");	
						$("#btnEntregado").parent().show();
						$("#btnNoEntregado").parent().hide();
						$("#btnParcial").parent().hide();					
					}
					if ( resultado[i].Orden > 8 ){
						$("#btnParcial").parent().addClass("ui-icon-check");	
						$("#btnParcial").parent().show();
						$("#btnNoEntregado").parent().hide();
						$("#btnEntregado").parent().hide();	
					}
					if ( resultado[i].Orden > 9 ){
						$("#btnNoEntregado").parent().addClass("ui-icon-check");
						$("#btnNoEntregado").parent().show();
						$("#btnParcial").parent().hide();
						$("#btnEntregado").parent().hide();	
					}
					 
					
					$("#estado").selectmenu( "refresh" )		
					break;
				}
			}
			else{
			}
        },

        error : function(jqxhr) 
        {	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}



function setIncidencias_Tracking(empresa, idestado){
		
	$("#incidencia").html("<option value='0'>Seleccionar Incidencia</option>");
	//$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/Obtener_IncidenciaPorEstado",
        type: "POST",
		cache: false,
		//crossDomain: true,
        dataType : "json",
        data : '{"Empresa":"'+empresa+'", "IDEstado" : '+idestado+'}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			//console.log(data.d);
			resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');			 
			if ( resultado.length > 0 ){				
				for (var i = 0; i<resultado.length;i++){					
					$("#incidencia").append("<option value='"+resultado[i].IDIncidencia+"'>"+resultado[i].Descripcion+"</option>");					
				}
				$("#incidencia").selectmenu('refresh', true);
			}
			else{
			}
        },

        error : function(jqxhr) 
        {	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}

function setIncidencias_Tracking2(empresa, idestado, control){
		
	$("#incidencia").html("<option value='0'>Seleccionar Incidencia</option>");
	//$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/Obtener_IncidenciaPorEstado",
        type: "POST",
		cache: false,
		//crossDomain: true,
        dataType : "json",
        data : '{"Empresa":"'+empresa+'", "IDEstado" : '+idestado+'}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			//console.log(data.d);
			resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');			 
			if ( resultado.length > 0 ){				
				for (var i = 0; i<resultado.length;i++){					
					$(control).append("<option value='"+resultado[i].IDIncidencia+"'>"+resultado[i].Descripcion+"</option>");					
				}
				$(control).selectmenu('refresh', true);
			}
			else{
			}
        },

        error : function(jqxhr) 
        {	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}


function valirRecepcion(ctrlSelect){
$("#btnIncidencia").show();
$("#estado").val(4);
$("#estado").selectmenu( "refresh" );
 $("#DIVIncidencia, #panelParcial").hide();
	$(".contentDatos").slideUp("fast");
	if ( $(ctrlSelect).val() == 1 )
		$(".contentDatos").slideDown("fast");
}

function alertDismissed(){
}
//

function setPedido(idPedido){
	
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ObtenerPedido",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"IDPedido":"'+idPedido+'"}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
		resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');
			if ( resultado.length > 0 ){
				
				for (var i = 0; i<resultado.length;i++){
					$(".oc").html(resultado[i].NroOrdenCompra);
					$(".titulo").html(resultado[i].NroOrdenCompra);
		 		 	$(".cliente").html(resultado[i].NombreCliente);
					$(".dni").html(resultado[i].DocumentoCliente);
					$(".blt").html(resultado[i].BLT_FME);
					$(".fch_entrega").html(resultado[i].FechaEntregaFormat);
					$(".provincia").html(resultado[i].NomProvincia);
					$(".distrito").html(resultado[i].NomDistrito);
					$(".direccion").html(resultado[i].DireccionEntrega);
					$(".referencia").html(resultado[i].Referencia);
					$(".telefono").html(resultado[i].Telefono);
					$(".mail").html(resultado[i].Email);
					$(".observacion").html(resultado[i].Observacion);
					
					if ( $.QueryString["grupo"] == 1 ){// resultado[i].GrupoCode != "" ){
						setDetallePedidoGrupo(resultado[i].GrupoCode,resultado[i].IDChofer,resultado[i].ENT_CODI);
					}
					else {
						
						$("#panelOCs").append('<div data-role="collapsible"><h3>' + resultado[i].NroOrdenCompra +'</h3><div id="panel' + resultado[i].IDPedido  + '" class="content-panel"></div></div>');
						$("#panelOCs").collapsibleset("refresh");
						$("#panelOCs .ui-collapsible").last().append('<span class="checkSpan"><input data-role="flipswitch" type="checkbox" onChange="setCheck(this)" style="display:none;" checked name="checkOC_'+resultado[i].IDPedido+'" id="checkOC_'+resultado[i].IDPedido+'" value="'+resultado[i].IDPedido+'" /></span>');
						
						$("#panelOCs .content-panel").last().append('<ul data-filter="false" class="listview" id="lista' + resultado[i].IDPedido  + '" data-role="listview" data-text="" data-filter="true" data-inset="true"></ul>');           
						$( "#lista" + resultado[i].IDPedido ).listview();
						$("#panelOCs input[type='checkbox']:last").checkboxradio();
					
						setDetallePedido(idPedido);	
					}
										
									
					break;
				}
				//$( "#listProgramacion" ).listview( "refresh" );
			}
			else{
				//$("#contentProgramaciones").html("");
//				$("#contentProgramaciones").html("<h3>No se encontraron programaciónes para el dia de hoy</h3>");
//				//Mensaje
			}
        },

        error : function(jqxhr) 
        {
		   //console.log(jqxhr);	
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}





function setDetallePedido(idPedido){
 
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ObtenerDetallePedido",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"IDPedido":"'+idPedido+'"}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			resultado = $.parseJSON(data.d);
			//console.log(resultado);
			$.mobile.loading('hide');
			if ( resultado.length > 0 ){				
				for (var i = 0; i<resultado.length;i++){
					
					var html = "<table cellpadding='0' cellspacing='0' width='100%'>";
					html += "<tr><td class='titulo'> " + resultado[i].Descripcion +  "</td><td width='30' class='titulo'><input style='width:22px; height:22px;' data-role='flipswitch' checked type='checkbox' name='chkProdcuto_" + resultado[i].IDDetalle +  "' id='chkProdcuto_" + resultado[i].IDDetalle +  "' value='" + resultado[i].IDDetalle +  "' /></td></tr>";
					html += "<tr><td colspan='2'><b>SKU: </b>" +  resultado[i].SKU +  "</td></tr>";
					html += "<tr><td colspan='2'><b>Cantidad:</b> " + resultado[i].Cantidad +  "<div style='float:right;' class=''><b>Confirmar: </b><input type='number' value='" + resultado[i].Cantidad +  "' pattern='[0-9]*' min='0' max='" + resultado[i].Cantidad +  "' /></div></td></tr>";
					html += "</table>";
					$("#lista" + idPedido).append('<li>' + html +  '</li> ');	
					
					//$(".contentDetalle").append("<p><b>"+resultado[i].Descripcion+"</b><br><b>Tipo: </b>"+resultado[i].Tipo+"<br><b>SKU: </b>"+resultado[i].SKU+"<br><b>Cantidad: </b>"+resultado[i].Cantidad+"</p>");	
					$(".contentDetalle").append("<p><b>"+resultado[i].Descripcion+"</b><br><b>SKU: </b>"+resultado[i].SKU+"<br><b>Cantidad: </b>"+resultado[i].Cantidad+"</p>");				 
				}
			}
			else{
				$("#contentProgramaciones").html("");
				$("#contentProgramaciones").html("<h3>No se encontro información</h3>");
//				//Mensaje
			}
        },

        error : function(jqxhr) 
        {
		   //console.log(jqxhr);	
		   alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}

function setCheck(chk){
	check = !check;
	if ($(chk).is(':checked')){
		$(chk).parent().parent().parent().find("input[id*='chkProdcuto']").prop('checked', true);
	}
	else{
		$(chk).parent().parent().parent().find("input[id*='chkProdcuto']").removeAttr('checked');
	}
}

function setDetallePedidoGrupo(grupo,chofer,entidad){

	$.mobile.loading('show'); 
	//
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ConsultarPedidosGrupo",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"Grupo":"' + grupo + '", "IDChofer" : ' + chofer + ', "Empresa": "' + entidad + '"}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			pedidos = $.parseJSON(data.d);
			//console.log(resultado);
			$.mobile.loading('hide');
			if ( pedidos.length > 0 ){	
				$(".oc").html("");			
				for (var i = 0; i<pedidos.length;i++){
					if(i==(pedidos.length-1))
						$(".oc").html($(".oc").html() + pedidos[i].NroOrdenCompra);	
					else
						$(".oc").html($(".oc").html() + pedidos[i].NroOrdenCompra + ", ");	
					
					$("#panelOCs").append('<div data-role="collapsible"><h3>' + pedidos[i].NroOrdenCompra +'</h3><div id="panel' + pedidos[i].IDPedido  + '" class="content-panel"></div></div>');
					$("#panelOCs").collapsibleset("refresh");
					$("#panelOCs .ui-collapsible").last().append('<span class="checkSpan"><input data-role="flipswitch" type="checkbox" onChange="setCheck(this)" checked name="checkOC_'+pedidos[i].IDPedido+'" id="checkOC_'+pedidos[i].IDPedido+'" value="'+pedidos[i].IDPedido+'" /></span>');
					
					$("#panelOCs .content-panel").last().append('<ul data-filter="false" class="listview" id="lista' + pedidos[i].IDPedido  + '" data-role="listview" data-text="" data-filter="true" data-inset="true"></ul>');           
					$( "#lista" + pedidos[i].IDPedido ).listview();
					$("#panelOCs input[type='checkbox']:last").checkboxradio();
					
					setDetallePedidoTrackingGrupo(pedidos[i].IDPedido, pedidos[i].NroOrdenCompra);
					
					 			 
				}
			}
			else{
				$("#contentProgramaciones").html("");
				$("#contentProgramaciones").html("<h3>No se encontro información</h3>");
			}
        },

        error : function(jqxhr) 
        {
		   //console.log(jqxhr);	
		   alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });	
	
	
	
	
	
	
		 
	
}

function setDetallePedidoTrackingGrupo(IDPedido,NroOrdenCompra){

	$.ajax({
		url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ObtenerDetallePedido",
		type: "POST",
		//crossDomain: true,
		dataType : "json",
		data : '{"IDPedido":"'+ IDPedido +'"}',
		contentType: "application/json; charset=utf-8",
		success : function(data, textStatus, jqXHR) {
			detalle = $.parseJSON(data.d); 
			//console.log(detalle);
			if ( detalle.length > 0 ){				
				for (var i = 0; i<detalle.length;i++){
					
				var html = "<table cellpadding='0' cellspacing='0' width='100%'>";
					html += "<tr><td class='titulo'> " + detalle[i].Descripcion +  "</td><td width='30' class='titulo'><input style='width:22px; height:22px;' data-role='flipswitch' checked type='checkbox' name='chkProdcuto_" + detalle[i].IDDetalle +  "' id='chkProdcuto_" + detalle[i].IDDetalle +  "' value='" + detalle[i].IDDetalle +  "' /></td></tr>";
					html += "<tr><td colspan='2'><b>SKU: </b>" +  detalle[i].SKU +  "</td></tr>";
					html += "<tr><td colspan='2'><b>Cantidad:</b> " + detalle[i].Cantidad +  "<div style='float:right;' class=''><b>Confirmar: </b><input type='number' value='" + detalle[i].Cantidad +  "' min='0' max='" + detalle[i].Cantidad +  "' /></div></td></tr>";
					html += "</table>";
					$("#lista" + IDPedido).append('<li>' + html +  '</li> ');	
					
					$(".contentDetalle").append("<p>[" + NroOrdenCompra + "]<br><b>"+detalle[i].Descripcion+"</b><br><b>SKU: </b>"+detalle[i].SKU+"<br><b>Cantidad: </b>"+detalle[i].Cantidad+"</p>");	
					//$("#lista" + IDPedido + " input[type='checkbox']:last").checkboxradio().checkboxradio("refresh");			 
				}
			} 
		},
		error : function(jqxhr) 
		{	
		   alerta('Error de conexi\u00f3n, contactese con sistemas!');
		}

	});

}


function setFotosPedido(idPedido){
	
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosWEB/TransportesMeridian/Sodimac/Pedido/WSPedido.asmx/ConsultarFotos",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"IDPedido":"'+idPedido+'"}',
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			resultado = $.parseJSON(data.d);			
			$(".panelFotos").html("");
			//console.log(resultado);
			$.mobile.loading('hide');
			var html = "";
			if ( resultado.length > 0 ){
				html = "<table width='100%'><tr>";		
				for (var i = 0; i<resultado.length;i++){
					html += "<td style='vertical-align:top;' width='50%'><div class='imgPanel'><img src='"+ resultado[i].Ubicacion.replace("~","http://www.meridian.com.pe/GT_Extranet") + "' width='100%'/> <a onclick='quitarFoto("+ resultado[i].IDFoto + ", this)'>Borrar</a></div></td>";
					if ( (i%2)!=0 && i>0 )
						html += "</tr><tr>"; 			 
				}
				html += "</tr></table>";		
				$(".panelFotos").append(html);	
			}
			else
				$(".panelFotos").html("<h3>No se encontro información</h3>");
			
        },

        error : function(jqxhr) 
        {
		   //console.log(jqxhr);	
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

function alertDismissed(){
}

function setHoraActual(control){
	
	var d = new Date();
	var hora = d.getHours() + ":" + d.getMinutes();
 	$(control).val(hora);
	
}

function setControl(estado){
	$('#estado').val(estado);
	$('#estado').selectmenu('refresh', true);
	HabilitarIncidencia($('#estado'));
	
	$('.contentDatos').hide();
	$('#DIVIncidencia').hide();
	$('#panelParcial').hide();
	if (estado == 6)
		$('.contentDatos').show();
	if (estado == 5 || estado == 7)
		$('#DIVIncidencia').show();
	if (estado == 7)
		$('#panelParcial').show();
}
