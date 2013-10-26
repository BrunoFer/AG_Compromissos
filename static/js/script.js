$(document).ready(function(){

	function suporta_html5_storage(){
		try{
			return 'localStorage' in window && window ['localStorage'] !== null;
		} catch (e){
			return false;
		}
	}

	function cadastro_compromisso(){
		titulo = "".concat($("#titulo").val());
		texto = "".concat($("#texto").val());
		titulo=titulo.replace(/</g,"");
		texto=texto.replace(/</g,"");
		titulo=titulo.replace(/>/g,"");
		texto=texto.replace(/>/g,"");
		registro = {
			"titulo": titulo,
			"texto": texto,
			"data": $("#data").val()
		}
		//regis = JSON.stringify(registro);
		lista.push(registro);
		localStorage['lista'] = JSON.stringify(lista);
		alert("Registro adicionado!");
		$("#titulo").val("");
		$("#texto").val("");
		$("#data").val("");
		listar();
	}

	function listar(){
		$("#listComp").html("");
		$("#listCompDia").html("");
		var num_compromissos_dia = 0;

		for (var i in lista){
			var dataComp = new Date(Date.parse(lista[i]["data"]));
			var diaComp = dataComp.getUTCDate()+""; if (diaComp.length==1) diaComp = "0"+diaComp;
			var mesComp = dataComp.getUTCMonth()+1+""; if (mesComp.length==1) mesComp = "0"+mesComp;
			var anoComp = dataComp.getUTCFullYear()+""; if (anoComp.length==1) anoComp = "0"+anoComp;
			var horaComp = dataComp.getHours()+""; if (horaComp.length==1) horaComp = "0"+horaComp;
			var minComp = dataComp.getMinutes()+""; if (minComp.length==1) minComp = "0"+minComp;
			var dataformatada = diaComp+"/"+mesComp+"/"+anoComp+" "+horaComp+":"+minComp;

			//incrementa na pagina de todos os compromissos
			item = '<li><a href="#"><img src="static/img/agen.png" width="70px"/><span class="class_title">' + lista[i]["titulo"] + '</span><span class="class_data">'+
			dataformatada+'</span><p>'+lista[i]["texto"]+'</p></a><a href="#aviso" data-rel="dialog" data-transition="pop" name="'+i+
			'" id="deleta">Apagar</a></li>';
			$("#listComp").append(item);

			//incrementa na pagina dos compromissos do dia
			if (dia==diaComp && mes+1==mesComp && ano==anoComp){
				num_compromissos_dia += 1;
				item = '<li><a href="#"><img src="static/img/agen.png"/><span class="class_title">'+lista[i]["titulo"]+'</span><p>'+
				lista[i]["texto"]+'</p></a><a href="#aviso" data-rel="dialog" data-transition="pop" name="'+i+'" id="deleta">Apagar</a></li>';
				$("#listCompDia").append(item);
			}
		}
		$('#linkComp').append('<span class="ui-li-count">'+lista.length+'</span>');
		$('#linkCompDia').append('<span class="ui-li-count">'+num_compromissos_dia+'</span>');
		$("#page1").page();
		$("#page3").page();
		$("#page4").page();
		$('#listComp').listview('refresh');
		$('#listCompDia').listview('refresh');
		$('#listFuncoes').listview('refresh');
	}

	function remove(indice){
		lista.splice(indice, 1);
		localStorage.setItem("lista", JSON.stringify(lista));
		alert("Registro excluído.");
		listar();
	}

	if (suporta_html5_storage()){
		var lista = localStorage.getItem("lista");
		
		//Pegando a data atual para verificar se o compromisso será listado na página de compromisso do dia
		var dataAtual = new Date();
		var dia = dataAtual.getUTCDate();
		var mes = dataAtual.getUTCMonth();
		var ano = dataAtual.getUTCFullYear();

		localStorage.setItem("id",-1);
		lista = JSON.parse(lista);
		if (lista == null) // Caso não haja conteúdo, inicia um vetor vazio 
			lista = [];
		else { listar(); }

		$("#btn_cadastro").click( function(){
		if ($("#titulo").val()){
			if ($("#data").val())
				cadastro_compromisso();
			else
				alert("Campo data incorreto!");
		} else
			alert("Campo titulo obrigatório!");
		});

		$("#listFuncoes").on("click","#removeAll", function(){
			$("#title_aviso").html("Deseja apagar todos os registros?");
			$("#ok").attr("href","#page1");
		});

		$("#listComp").on("click","#deleta",function(){
			var indice = parseInt($(this).attr("name"));
			$("#title_aviso").html("Deseja apagar o registro?");
			localStorage.setItem("id",indice);
			$("#ok").attr("href","#page3");
		});

		$("#listCompDia").on("click","#deleta",function(){
			var indice = parseInt($(this).attr("name"));
			$("#title_aviso").html("Deseja apagar o registro?");
			localStorage.setItem("id",indice);
			$("#ok").attr("href","#page4");
		});

		$("#ok").click( function(){
			var id = localStorage.getItem("id");
			if (id==-1){
				localStorage.clear();
				localStorage.setItem("id",-1);
				location.reload();
			} else {
				remove(id);
				localStorage.setItem("id",-1);
			}
		});

	} else {
		alert("Navegador não suporta LocalStorage");
	}

});