// Basis Javascript HT Kanban 

(function (window, undefined) {
	var
	// Version of this script
	version = '2018.10.',

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,
	navigator = window.navigator,

	// Map over htgl in case of overwrite
	_htgl = window.htgl;

	// ---------------------------------------------------------------------------


	htgl = window.htgl || {};

	// ---------------------------------------------------------------------------
	
	htgl.server = "" ; // der Name oder die IP vom Request
	htgl.params = [] ; // die Parameter vom request
	
	// ---------------------------------------------------------------------------
	// Kanban data:
	
	htgl.mainboxes = [
	{"id":"1","text":"Backlog","headerline":"Buntes Sammelsorium"}
	,{"id":"2","text":"Plan","headerline":"wird umgesetzt"}
	,{"id":"3","text":"Develop","headerline":"ist aktiv"}
	,{"id":"4","text":"QS","headerline":"zumtesten"}
	,{"id":"5","text":"Done","headerline":"ist rum"}
	] ;
	
	//htgl.mainboxes = ["Backlog","Plan","Develop","QS","Done"] ;
	
	//htgl.headerlines = ["Buntes Sammelsorium","wird umgesetzt","ist aktiv","zumtesten","ist rum"] ;

	//htgl.itemlists = ["Item 0","Item 1","Item 2","Item 3","Item 4","Item 5"]; 
	
	htgl.itemlists2 = [
						{"id":"1","text":"Item 0a","ul_number":1}
	                   ,{"id":"2","text":"Item 1a","ul_number":1}
	                   ,{"id":"3","text":"Item 2a","ul_number":1}
	                   ,{"id":"4","text":"Item 3a","ul_number":1}
	                   ,{"id":"5","text":"Item 5","ul_number":1}
					   ,{"id":"6","text":"Item 6","ul_number":2}
	                   ,{"id":"7","text":"Item 7","ul_number":2}
	                   ,{"id":"8","text":"Item 8","ul_number":2}
	                   ,{"id":"9","text":"Item 9","ul_number":2}
	                   ,{"id":"10","text":"Item 10","ul_number":2}
					   ,{"id":"11","text":"Item 11","ul_number":3}
	                   ,{"id":"12","text":"Item 12","ul_number":3}
	                   ,{"id":"13","text":"Item 13","ul_number":3}
	                   ,{"id":"14","text":"Item 14","ul_number":4}
	                   ,{"id":"15","text":"Item 15b","ul_number":5}
					   ]; 
	
	// ---------------------------------------------------------------------------

	htgl.fx = {

	// ---------------------------------------------------------------------------
		get_items: function () {
			
			$.ajax({method:"POST", 
				 url: 'wwv_flow.show', 
				 data : { "p_request" : "APPLICATION_PROCESS=get_items",
					 "p_flow_id" : $v('pFlowId'),
					 "p_flow_step_id" : $v('pFlowStepId'),
					 "p_instance" : $v('pInstance'),
					 //"x01" :  1, // GROUP_ID
					 //"f07" : arr_f07 ,
					 //"f11": Array(2,22,3,4,56,6),
					 //"p_arg_names" : lArgNames,
					 //"p_arg_values" : lArgVals
					 },
				 success : function(data){ 
					   //console.log(data);
					   htgl.data = data ;
						$.each(htgl.data.row,function(a,b){ // console.log(i + ' - ' + v );})
							$( '#sortable_' + b.BOX_ID  ).append('<li id="ITEM_' + b.ID + '" class="ui-state-default ">' + b.TEXT + '</li>');
						}); 
					 },
				 dataType : 'json'
				 });
				 
		}, // get_items function
 	// ---------------------------------------------------------------------------
		get_all: function (p_group_id, p_div_id) {
			
			console.log('search for group id = '+p_group_id);
			console.log('with p_div_id = '+p_div_id);
			$('#kanban02_heading').html("Kanban2 for Group = " + $("#P5_GROUP option:selected").text() );
			
			$.ajax({method:"POST", 
				 url: 'wwv_flow.show', 
				 data : { "p_request" : "APPLICATION_PROCESS=get_all",
					 "p_flow_id" : $v('pFlowId'),
					 "p_flow_step_id" : $v('pFlowStepId'),
					 "p_instance" : $v('pInstance'),
					 "x01" :  p_group_id, // GROUP_ID
					 //"f07" : arr_f07 ,
					 //"f11": Array(2,22,3,4,56,6),
					 //"p_arg_names" : lArgNames,
					 //"p_arg_values" : lArgVals
					 },
				 dataType : 'json',
				 success : function(data){ 
					   //console.log(data);
					   htgl.all_data = data ;
/*
						$.each(htgl.all_data.boxes,function(a,b){ 
							console.log('Box ' +a + ' - ' + b.TEXT );
						    $.each(b.items,function(c,d){console.log(c + ' -I- ' + d.TEXT )});
						}); 
*/						
						// prepare the second div 
						$(p_div_id).children().remove();
						 $.each(htgl.all_data.boxes ,function(i,v){ 
						 console.log(i + ' - ' + v.TEXT +  ' - ' + v.HEADERLINE  );

							var maindiv2 = document.createElement('div');
							$(maindiv2).addClass("mainbox").attr("id","MAIN_"+v.ID).appendTo($(p_div_id)) //main div
							
							var headerline2 = document.createElement('div');
							$(headerline2).addClass("headerline").html(v.TEXT).appendTo($(maindiv2)) //main div
							
							var description2 = document.createElement('div');
							$(description2).addClass("description").html(v.HEADERLINE).appendTo($(maindiv2)) //main div
							
							$(maindiv2).append('<ul id="stbl_' + v.ID + '" class="sort droptrue"></ul>');
							
							// prepare the children of each box
							$.each(v.items,function(c,d){  console.log('I ID = ' + d.ID + ' -I TEXT- ' + d.TEXT + ' -BOXID- ' + d.BOX_ID)
								$( '#stbl_' + d.BOX_ID  ).append('<li id="ITEMID_' + d.ID + '" class="ui-state-default ">' + d.TEXT + '</li>');
							});
							
							// initiales sortable widget erstellen 
							$( '#stbl_' + v.ID + ".droptrue" ).sortable({ connectWith: "ul" });

						});  // prepare the second div
						
					 } // success
				 });
				 
		}, // get_items function
 	// ---------------------------------------------------------------------------

		init: function (p_div_id) {
			
         //console.log("object id   = " + p_div_id );
		 $.each(htgl.mainboxes ,function(i,v){  // console.log(i + ' - ' + v );})

			var maindiv = document.createElement('div');
			$(maindiv).addClass("mainbox").attr("id","M_"+v.id).appendTo($(p_div_id)) //main div
			
			var headerline = document.createElement('div');
			$(headerline).addClass("headerline").html(v.text).appendTo($(maindiv)) //main div
			
			var description = document.createElement('div');
			$(description).addClass("description").html(v.headerline).appendTo($(maindiv)) //main div
			
			$(maindiv).append('<ul id="sortable_' + v.id + '" class="sort droptrue"></ul>');

		});
		
		// zusammengesetze items einlesen und einsetzen
		$.each(htgl.itemlists2,function(a,b){ // console.log(i + ' - ' + v );})
			$( '#sortable_' + b.ul_number  ).append('<li id="ITEM_' + a + '" class="ui-state-default ">' + b.text + '</li>');
		}); 

		 // initiales sortable widget erstellen 
		 $( "ul.droptrue" ).sortable({ connectWith: "ul" });
		 
		 // prevent sortable3 from sortable2 class number 
		 $('#sortable_3').sortable({
			connectWith: 'ul',
			receive: function(ev, ui) {
				if(ui.item.hasClass("number"))
				  ui.sender.sortable("cancel");
			}
		});    
	
		},
		
		get_version: function () {
         console.log("Version of Script is = " + version);
		},

		// welcher Browser wird verwendet ???
		welcherBrowser: function () {
			var ua = navigator.userAgent,
			tem,
			M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
			if (/trident/i.test(M[1])) {
				tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
				return 'IE ' + (tem[1] || '');
			}
			if (M[1] === 'Chrome') {
				tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
				if (tem != null)
					return tem.slice(1).join(' ').replace('OPR', 'Opera');
			}
			M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
			if ((tem = ua.match(/version\/(\d+)/i)) != null)
				M.splice(1, 1, tem[1]);
			return M.join(' ');
		},

		// schreibt alle URL Parameter in das Array htgl.params
		storeUrlVars: function () {
			var hash;

			// window.location.href  -> "https://mc-dwh-e.automation.siemens.com/htsandbox/index.html?mada=23"

			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				htgl.params.push(hash);
			}
			return htgl.params;
		}
	}; // end htgl.fx
	// ---------------------------------------------------------------------------
	// Bereitet schonmal die Parameterverarbeitung der aktuellen Page vor
	htgl.fx.storeUrlVars();
	htgl.fx.get_version();
	// ---------------------------------------------------------------------------
})(window);
