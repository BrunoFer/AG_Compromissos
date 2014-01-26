$(document).ready(function(){

    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
    var db;

    function suporta_indexedDB(){
        if (!window.indexedDB) {
            return false;
        } else {
            return true;
        }
    }

    function bdCompromissos(){
        var request = indexedDB.open("compromissos",3);
        request.onsuccess = function (evt) {
            db = request.result;
            listarCompromissos();
        };

        request.onerror = function (evt) {
            console.log("IndexedDB error: " + evt.target.errorCode);
        };

        request.onupgradeneeded = function (evt) {
            var storeItens = evt.currentTarget.result.createObjectStore("compromissos", { keyPath: "id", autoIncrement: true });
            storeItens.createIndex("titulo", "titulo", { unique: false });
            storeItens.createIndex("descricao","descricao", {unique: false});
            storeItens.createIndex("dataComp","dataComp", {unique: false});
        };
    }

    function cadastro_compromisso(){
		titulo = "".concat($("#titulo").val());
		texto = "".concat($("#texto").val());
		titulo=titulo.replace(/</g,"");
		texto=texto.replace(/</g,"");
		titulo=titulo.replace(/>/g,"");
		texto=texto.replace(/>/g,"");
		dataComp = $("#data").val()

        var transaction = db.transaction("compromissos", "readwrite");
        var objectStore = transaction.objectStore("compromissos");                    
        var request = objectStore.add({titulo: titulo, texto: texto, dataComp: dataComp});
        request.onsuccess = function (evt) {
            $("#titulo").val("");
            $("#texto").val("");
            $("#data").val("");
            listarCompromissos();
            alert("Registro adicionado!");
        };
	}

    function listarCompromissos() {
        var compromissos = $('#listComp');
        compromissos.empty();        
        var transaction = db.transaction("compromissos", "readwrite");
        var objectStore = transaction.objectStore("compromissos");

        var req = objectStore.openCursor();
        var qtde=0;
        req.onsuccess = function(evt) {
            var cursor = evt.target.result;
            if (cursor) {

                var linha = '<li><a href="#"><img src="static/img/agen.png" width="70px"/><span class="class_title">' + cursor.value.titulo + '</span><span class="class_data">'+
                cursor.value.dataComp+'</span><p>'+cursor.value.texto+'</p></a><a href="#aviso" data-rel="dialog" data-transition="pop" name="'+cursor.key+
                '" id="deleta">Apagar</a></li>';
                qtde += 1;
                $('#listComp').append(linha);
                cursor.continue();
            }
            $('#linkComp').append('<span class="ui-li-count">'+qtde+'</span>');
            $("#page1").page();
            $("#page3").page();
            $('#listComp').listview('refresh');
            $('#listFuncoes').listview('refresh');
        };        
    }

	function remove(indice){
        var transaction = db.transaction("compromissos", "readwrite");
        var store = transaction.objectStore("compromissos");
        var req = store.delete(+indice);
        req.onsuccess = function(evt) {
            listarCompromissos();
            alert("Registro excluído.");
        };
	}

	if (suporta_indexedDB()){

        bdCompromissos();

		$("#btn_cadastro").click( function(){
            if ($("#titulo").val()){
			    if ($("#data").val())
			        cadastro_compromisso();
			    else
				    alert("Campo data incorreto!");
		    } else
		      alert("Campo titulo obrigatório!");
		});

		$("#listComp").on("click","#deleta",function(){
			var indice = parseInt($(this).attr("name"));
			$("#title_aviso").html("Deseja apagar o registro?");
			localStorage.setItem("id",indice);
			$("#ok").attr("href","#page3");
		});

		$("#ok").click( function(){
			var id = localStorage.getItem("id");
            remove(id);
			localStorage.setItem("id",-1);
		});

	} else {
		alert("Navegador não suporta a API indexedDB!");
	}

});