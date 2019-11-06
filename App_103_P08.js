// Basis Javascript HT Kanban
/*
!!!!!!!!!!!!!!!  TODO !!!!!!!!!!!!!!!!!!

$('.modal-backdrop').click(function(e){this.remove()});

$('.modal-backdrop').click(function(e){this.remove();$('.item-menu').hide();$('.custom-menu').hide();});

!!!!!!!!!!!!!!!  TODO !!!!!!!!!!!!!!!!!!

Auf der APEX Page wird benötigt:

1- APEX select ITEM ( P6_GROUP ) = List of Values = "select title d, id r from kb_group order by id asc"
2- Region mit APEX TEXT ITEM  ( P6_TEXT ) , wird in den dialog eingebaut.
2a- Javascript Aufruf: htgl.fx.close_dialog();  for Button Cancel 
3- DIV mit korrekter ID <div id="myKanban2"></div>
4- Javascript Aufruf: htgl.fx.get_all_items(apex.item('P6_GROUP').getValue(),'#myKanban2');
   for Event -> Change on  SELECT ITEM P6_GROUP
5- Javascript Aufruf: htgl.fx.save_item();
   for Button Save 
-------------------------------------
On rightclick from ITEM:

$("#ITEMID_124").attr("data-boxid") liefert die BOXID 
   
*/
(function (document, undefined) {
	var
	// Version of this script
	version = '2018.12.19',

	/* / Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,
	navigator = window.navigator,
*/
	// Map over htgl in case of overwrite
	_htgl = document.htgl;

	// ---------------------------------------------------------------------------


	htgl = document.htgl || {};

	// ---------------------------------------------------------------------------
	
	// APEX select ITEM ( P6_GROUP )  = List of Values = "select title d, id r from kb_group order by id asc"
	htgl.APEX_AKTUELLE_PAGE = 'P8_';
	
	htgl.APEX_GROUP_ITEM = htgl.APEX_AKTUELLE_PAGE + 'GROUP' ;
	
	// Region mit APEX TEXT ITEM  ( P6_TEXT ) , wird in den dialog eingebaut.
	htgl.APEX_TEXT_ITEM =  htgl.APEX_AKTUELLE_PAGE + 'TEXT' ;
	htgl.APEX_TASK_ITEM =  htgl.APEX_AKTUELLE_PAGE + 'TASK' ;
	htgl.APEX_MYCHECK_ITEM =  htgl.APEX_AKTUELLE_PAGE + 'MYCHECK' ;
	htgl.APEX_MYFIX_ITEM =  htgl.APEX_AKTUELLE_PAGE + 'MYFIX' ;
	
	// ---------------------------------------------------------------------------

	htgl.server = ""; // der Name oder die IP vom Request
	htgl.params = []; // die Parameter vom request

	// ---------------------------------------------------------------------------
	// Kanban data:
	
	htgl.item_mousedown_id = "" ; // an welchem item war der rechtsclick
	htgl.item_mousedown_boxid = "" ; // box id von welchem item war der rechtsclick
	htgl.item_mousedown_clone_id = "" ; // item id von zu clonendem item
	htgl.flag_item_dialog_modus = 0 ;  // 1 = new, 2 = edit, 0 = klone/copy
	

	// ---------------------------------------------------------------------------

	htgl.fx = {
		
	// ---------------------------------------------------------------------------
		close_dialog: function(){
			$("#dialog007").hide();
			$(".modal-backdrop").remove();
		},
	// ---------------------------------------------------------------------------
		show_history_dialog: function(P_text){
			console.log("now history from item =" + htgl.item_mousedown_id );
			
					$.ajax({
						method: "POST",
						url: 'wwv_flow.show',
						data: {
							"p_request": "APPLICATION_PROCESS=get_item_hist",
							"p_flow_id": $v('pFlowId'),
							"p_flow_step_id": $v('pFlowStepId'),
							"p_instance": $v('pInstance'),
							"x01" :  htgl.item_mousedown_id  // ITEM_ID
						},
						success: function (data) {

							htgl.data_up_item = data;
							
							$(".modal-backdrop").remove();
							
							$(htgl.dialogdata).dialog({ 
								open: function(event, ui){
									$(".ui-dialog-titlebar-close").hide(); 
									if (htgl.data_up_item.items){
										
										if (htgl.data_up_item.items.length > 0 ) {
											for (var i=0 ; i < htgl.data_up_item.items.length ; i++){
												$("#list01").append('<li>Datum = ' + htgl.data_up_item.items[i].UPDATE_DATE 
												+ ', ROWNUM= ' + htgl.data_up_item.items[i].ROWNUM
												+ ', Text= ' + htgl.data_up_item.items[i].TEXT
												+ ', Task= ' + htgl.data_up_item.items[i].TASK
												+ ', Tooltip= ' + htgl.data_up_item.items[i].TOOLTIP
												+ ', BOX_ID =' + htgl.data_up_item.items[i].BOX_ID
												+ '</li>');
											}
											
										}else{
												$("#list01").append('<li>Keine Einträge vorhanden !');
										}
									}
								},
								modal: true , 
								dialogClass: 'noTitle', 
								title: 'History for Item ID = ' + htgl.item_mousedown_id , 
								width : 920 , 
								height: 380, 
								buttons: { 
									"Close": function(){ 
										// window.parent.doSubmit('REFRESH');
										$(this).dialog("close");
										$("#list01").children().remove();
										} 
								},
								closeOnEscape: false 
								});
							
							
							
						},
						dataType: 'json'
					});
		},
		
	// ---------------------------------------------------------------------------
	// ---------------------------------------------------------------------------
		create_dialog: function(P_text){
			
			
				switch (P_text) {

					// A case for each action. Your actions here
				case "new":

					apex.item(htgl.APEX_TEXT_ITEM).setValue('');
					apex.item(htgl.APEX_TASK_ITEM).setValue('');
					apex.item(htgl.APEX_MYCHECK_ITEM).setValue('');
					apex.item(htgl.APEX_MYFIX_ITEM).setValue('');
					htgl.flag_item_dialog_modus = 1 ;

					break;
				case "edit":
					htgl.klon = $('#ITEMID_'+htgl.item_mousedown_clone_id.substr(4)).clone();
					apex.item(htgl.APEX_TEXT_ITEM).setValue($('#'+htgl.item_mousedown_clone_id).text() );
					apex.item(htgl.APEX_TASK_ITEM).setValue($('#TASK_'+htgl.item_mousedown_clone_id.substr(4)).html() );
					apex.item(htgl.APEX_MYCHECK_ITEM).setValue($('#CHECK_'+htgl.item_mousedown_clone_id.substr(4)).text()  );
					apex.item(htgl.APEX_MYFIX_ITEM).setValue($('#FIX_'+htgl.item_mousedown_clone_id.substr(4)).text()  );
					
					htgl.flag_item_dialog_modus = 2 ;
					break;
				default :   // copy
					htgl.klon = $('#'+htgl.item_mousedown_clone_id).closest("div").clone();
					apex.item(htgl.APEX_TEXT_ITEM).setValue($('#'+htgl.item_mousedown_clone_id).text() + "_cp" );
					apex.item(htgl.APEX_TASK_ITEM).setValue($('#TASK_'+htgl.item_mousedown_clone_id.substr(4)).text()  );
					
					apex.item(htgl.APEX_MYCHECK_ITEM).setValue($('#CHECK_'+htgl.item_mousedown_clone_id.substr(4)).text()  );
					apex.item(htgl.APEX_MYFIX_ITEM).setValue($('#FIX_'+htgl.item_mousedown_clone_id.substr(4)).text()  );
					
					htgl.flag_item_dialog_modus = 0 ;

				}

			

			$("#dialog007").show();
			$("#P7_TEXT").focus();
			
			htgl.dialog_height = document.getElementById('eingabe01').offsetHeight / 2;
			htgl.dialog_width = document.getElementById('eingabe01').offsetWidth / 2;
			htgl.my_top = ($(window).height()/2) - htgl.dialog_height ;
			htgl.my_left = ($(window).width()/2) - htgl.dialog_width ;
			$("#dialog007").css({ position: "absolute",
									top: htgl.my_top + "px",
									left: htgl.my_left + "px"
			});
			
		},
	// ---------------------------------------------------------------------------
	// unterstuetzt add_element, hier ist der eigentliche aufbau der elementstruktur 
	// das TASK_ Element wird in der Struktur benötigt, für edit,  jedoch angezeigt nur via hover ( display:none )
	
		add_element_2_sub: function(p_arameter){
			
			//console.log("ID = " + p_arameter.ID + '" title=BOX_ID = "'  + p_arameter.BOX_ID);
			
			return '<div class="span4"><table><tbody>'
						+'<tr><td id="HID_' + p_arameter.ID + '" title="BOX_ID = '  + p_arameter.BOX_ID +  '" class="head_item grabbing itemmenue" colspan="2">'
							+ p_arameter.textvalue + '</td><td style="text-align:center;vertical-align:middle"><span id="SPAN_' + p_arameter.ID + '" class="fa fa-binoculars"></span></td></tr>'
						+'<tr style="display:none;"><td id="TASK_' + p_arameter.ID + '" colspan="3">'  + p_arameter.taskvalue +  '</td></tr>'
						+'<tr><td id="ZWEI_' + p_arameter.ID + '" colspan="2" >LOP-NR: ' + p_arameter.ID + '</td><td id="VER_' + p_arameter.ID + '" rowspan="2" class="pzwei">Verantwortlich</td></tr>'
						+'<tr><td id="STA_' + p_arameter.ID + '" colspan="2" >Start: ' + p_arameter.CREATE_DATE + '</td></tr>'
						
						+'<tr style="display:none;"><td id="FIX_' + p_arameter.ID + '">'+ p_arameter.myfix + '</td><td colspan="2" id="CHECK_' + p_arameter.ID + '">'+ p_arameter.mycheck + '</td></tr>'
						+'<tr style="display:none;"><td id="END_' + p_arameter.ID + '">Ende: </td><td colspan="2" style="text-align:center;vertical-align:middle"></td></tr>'
						+'</tbody></table></div>' ;			
		},
	// ---------------------------------------------------------------------------
		add_element_2_sub_ohne_ids: function(p_id){
			
			return '<div class="span22"><table style="width:100%;height:100%;"><tbody>'
						+'<tr><td class="head_item grabbing itemmenue" colspan="2">Title= ' + $("#HID_" + p_id ).html()  + '</td></tr>'
						+'<tr ><td colspan="2" title="' + $("#TASK_" + p_id ).html() + '">Task= '  + $("#TASK_" + p_id ).html().substr(0,20) +  '</td></tr>'
						+'<tr><td>LOP-NR= ' +  p_id  + '</td><td rowspan="2" class="pzwei">Verantwortlich= </td></tr>'
						+'<tr><td>' + $("#STA_" + p_id ).html() + '</td></tr>'
						+'<tr ><td>Fix= '+ $("#FIX_" + p_id ).html() + '</td><td>Check= '+ $("#CHECK_" + p_id ).html() + '</td></tr>'
						+'<tr><td>Ende= </td><td></td></tr>'
						+'</tbody></table></div>' ;			
		},
	// ---------------------------------------------------------------------------
	// beendet das zeitfenster um mit der maus in den infobereich zu gehen
	
	  end_timeslot: function(){
		  
		  if (htgl.set_timeout > 0 ) {
			  
			  $('.info007').css({'left':-9999});
			  
		  }
	  },
	// ---------------------------------------------------------------------------
	// Zeigt ein vorbereitetes DIV mit ID uns Task vom Item an
	
		showInfo: function(event, p_id){
			//function showInfo(event, button){
			//$('.info007').html( "ID = " + p_id + '<br>Task = ' + $("#TASK_" + p_id ).html() + '<br>Fix = ' + $("#FIX_" + p_id ).html()+ '<br>Check = '+ $("#CHECK_" + p_id ).html()				);
			$('.info007').html(htgl.fx.add_element_2_sub_ohne_ids(p_id));
			
			/*if the event is mouseenter*/
			if (event.type=="mouseenter"){
			/*get the coordinates of the button element using jquery offset*/
			var offset = $("#ITEMID_" + p_id ).offset();	
			/*get the top Position of the info element. $(window).scrollTop() is used to calculate the right top coordinate of the button element after the window is scrolled*/
			var topOffset = $("#ITEMID_" + p_id ).offset().top- $(window).scrollTop();
			  
			  /*set the position of the info element*/
				 $(".info007").css({
					position: "fixed",
					top: (topOffset - 155)+ "px",
					left: (offset.left) + "px",
				});
			}
			if (event.type=="mouseleave"){
				/*hide info element on mouseout*/
				//console.log("now out");
				htgl.set_timeout = 1 ;
				setTimeout(htgl.fx.end_timeslot, 300);
			}
		},
	// ---------------------------------------------------------------------------
	// fuegt ein element in den dom ein
	
		add_element: function(py_aramter){
			
			$('#BOXID_' + py_aramter.BOX_ID).append('<li  id="ITEMID_'+py_aramter.ID+'" data-id="'+py_aramter.ID+'" data-boxid="' 
					 + py_aramter.BOX_ID 
					 + '" class="ui-state-default itemtext" data-is_new="'+py_aramter.data_is_new+'" >'
					 + htgl.fx.add_element_2_sub(py_aramter)
					 +'</li>');
					 
			// SPAN_ = SPAN von der Anzeige mit class = fa fa-binoculars   
			$("#SPAN_"+ py_aramter.ID).on('mouseenter mouseleave', function(event) { 
				//console.log("here hitting id = " + p_aramter.ID );
				htgl.fx.showInfo(event,py_aramter.ID);
			});
					 
		},
	// ---------------------------------------------------------------------------
	// ---------------------------------------------------------------------------
	// ---------------------------------------------------------------------------
	// Event nach Button SAVE vom dialog pressed
		save_item: function(){
			
			switch( htgl.flag_item_dialog_modus ){   // 1 = new, 2 = edit, 0 = klone/copy
				case 	2:                         // 
						console.log( "new text = " +  apex.item(htgl.APEX_TEXT_ITEM).getValue() );
				break;
				case 	1:                         // 
						htgl.fx.add_element({"ID":"-1","BOX_ID": htgl.item_mousedown_boxid 
                                ,"data_is_new":"Y","textvalue":apex.item(htgl.APEX_TEXT_ITEM).getValue()
								,"taskvalue":apex.item(htgl.APEX_TASK_ITEM).getValue()
								,"mycheck":apex.item(htgl.APEX_MYCHECK_ITEM).getValue()
								,"myfix":apex.item(htgl.APEX_MYFIX_ITEM).getValue()
								});
					
				break;
				default :
						htgl.klon.removeAttr("id").attr('data-is_new', 'Y' ).html( apex.item(htgl.APEX_TEXT_ITEM).getValue() );
						htgl.fx.add_element({"ID":"-1","BOX_ID": htgl.item_mousedown_boxid 
                                ,"data_is_new":"Y","textvalue":apex.item(htgl.APEX_TEXT_ITEM).getValue()
								,"mycheck":apex.item(htgl.APEX_MYCHECK_ITEM).getValue()
								,"myfix":apex.item(htgl.APEX_MYFIX_ITEM).getValue()
								});

			}
			
			$("#dialog007").hide();
			//$(".modal-backdrop").remove();

			// inserte den neuen item kandidaten
			switch( htgl.flag_item_dialog_modus ){
				case 	2:                         // // 1 = new, 2 = edit, 0 = klone/copy
					$.ajax({
						method: "POST",
						url: 'wwv_flow.show',
						data: {
							"p_request": "APPLICATION_PROCESS=update_item",
							"p_flow_id": $v('pFlowId'),
							"p_flow_step_id": $v('pFlowStepId'),
							"p_instance": $v('pInstance'),
							"x01" :  apex.item(htgl.APEX_TEXT_ITEM).getValue() , // TEXT Value
							"x03" :  apex.item(htgl.APEX_TASK_ITEM).getValue() , // TASK Value
							"x04" :  apex.item(htgl.APEX_MYCHECK_ITEM).getValue() , // MYCHECK Value
							"x05" :  apex.item(htgl.APEX_MYFIX_ITEM).getValue() , // MYFIX Value
							"x02" :  htgl.item_mousedown_clone_id.substr(4)  // ITEM_ID
						},
						success: function (data) {
							// Update den Textvalue vom aktuellen ITEM
							$("#" + htgl.item_mousedown_clone_id ).html( apex.item(htgl.APEX_TEXT_ITEM).getValue() ) ;
							// Update den Taskvalue vom aktuellen ITEM
							$("#TASK_" + htgl.item_mousedown_clone_id.substr(4) ).html( apex.item(htgl.APEX_TASK_ITEM).getValue() ) ;
							// Update den Taskvalue vom aktuellen ITEM
							$("#CHECK_" + htgl.item_mousedown_clone_id.substr(4) ).html( apex.item(htgl.APEX_MYCHECK_ITEM).getValue() ) ;
							// Update den Taskvalue vom aktuellen ITEM
							$("#FIX_" + htgl.item_mousedown_clone_id.substr(4) ).html( apex.item(htgl.APEX_MYFIX_ITEM).getValue() ) ;
							htgl.data_up_item = data;
							
							$(".modal-backdrop").remove();
							
						},
						dataType: 'json'
					});
				break;
				default :                         // 1 = new, 2 = edit, 0 = klone/copy
					$.ajax({
						method: "POST",
						url: 'wwv_flow.show',
						data: {
							"p_request": "APPLICATION_PROCESS=create_item",
							"p_flow_id": $v('pFlowId'),
							"p_flow_step_id": $v('pFlowStepId'),
							"p_instance": $v('pInstance'),
							"x01" :  apex.item(htgl.APEX_TEXT_ITEM).getValue() , // TEXT Value
							"x03" :  apex.item(htgl.APEX_TASK_ITEM).getValue() , // TASK Value
							"x04" :  apex.item(htgl.APEX_MYCHECK_ITEM).getValue() , // MYCHECK Value
							"x05" :  apex.item(htgl.APEX_MYFIX_ITEM).getValue() , // MYFIX Value
							"x02" :  htgl.item_mousedown_boxid  // BOX_ID
						},
						success: function (data) {
							
							htgl.data_up_item = data;

							var new_param = {"ID": data.ID    //,"BOX_ID": htgl.item_mousedown_boxid 
                                ,"data_is_new":"Y","textvalue":apex.item(htgl.APEX_TEXT_ITEM).getValue()
								,"CREATE_DATE":data.DATUM
								,"taskvalue":apex.item(htgl.APEX_TASK_ITEM).getValue()
								,"mycheck":apex.item(htgl.APEX_MYCHECK_ITEM).getValue() 
								,"myfix":apex.item(htgl.APEX_MYFIX_ITEM).getValue() 
								} ;
																							  
							 $("li[data-is_new='Y']").attr("id", "ITEMID_" + data.ID ).html(  htgl.fx.add_element_2_sub(new_param) ) ;
							 
							 
							// auch for the new element set the item menue
							htgl.fx.set_one_items_menue( $("li[data-is_new='Y']") );
							
							// bei neu und clone muss noch der span mit dem mouseenter event verbunden werden
							$("#SPAN_"+ data.ID).on('mouseenter mouseleave', function(event) { 
								//console.log("here hitting id = " + data.ID );
								htgl.fx.showInfo(event,data.ID);
							});
							
							// entfernen nach erfolgreichem speichern
							$("li[data-is_new='Y']").removeAttr("data-is_new");
							$(".modal-backdrop").remove();
						},
						dataType: 'json'
					});
			}
			
		},
	// ---------------------------------------------------------------------------

		create_box_menue: function () {

			var clickmenue = document.createElement('ul');

			$(clickmenue).addClass("custom-menu").attr("id", "menue007").appendTo($("body")) //main div
			$(clickmenue).append('<li class="kpress" data-action="create">create New Item</li>');
			$(clickmenue).append('<li class="kpress" data-action="cancel">cancel</li>');
			
				
			$(".custom-menu li").click(function () {

				// This is the triggered action name
				switch ($(this).attr("data-action")) {

					// A case for each action. Your actions here
				case "create":

					htgl.fx.create_dialog('new'); 

					break;
				case "cancel":
					$(".modal-backdrop").remove();
					break;
				}

				// Hide it AFTER the action was triggered
				$(".custom-menu").hide(100);
				//$(".modal-backdrop").remove();

			});


		},
		// ---------------------------------------------------------------------------
		create_item_menue: function () {

			var item_menue = document.createElement('ul');

			$(item_menue).addClass("item-menu").attr("id", "item_menue007").appendTo($("body")) //main div
			$(item_menue).append('<li data-actioni="create">Create New Item</li>');
			$(item_menue).append('<li data-actioni="edit">Edit Item</li>');
			$(item_menue).append('<li data-actioni="show">History of Item</li>');
			$(item_menue).append('<li data-actioni="clone">Copy Item</li>');
			$(item_menue).append('<li data-actioni="delete">Delete Item</li>');
			$(item_menue).append('<li data-actioni="cancel">Cancel</li>');

			$(".item-menu li").click(function () {

				// This is the triggered action name
				switch ($(this).attr("data-actioni")) {

					// A case for each action. Your actions here
				case "create":
					//console.log("create New Item");
					
					htgl.fx.create_dialog('new'); 

					break;
				case "edit":
					//console.log("create New Item");
					
					htgl.fx.create_dialog('edit'); 

					break;
				case "show":
					htgl.fx.show_history_dialog(); 
					break;
				case "clone":
					//console.log("clone");
					htgl.fx.create_dialog(); 
					break;
				case "delete":
					//console.log("clone");
					htgl.fx.delete_item(); 
					$(".modal-backdrop").remove();
					break;
				case "cancel":
					console.log("cancel");
					$(".modal-backdrop").remove();
					break;
				}

				// Hide it AFTER the action was triggered
				$(".item-menu").hide();
				//$(".modal-backdrop").remove();
			});

		},
		// ---------------------------------------------------------------------------
		
		delete_item: function () {
			
			//console.log("clone id = "+htgl.item_mousedown_clone_id);
			
			$.ajax({
				method: "POST",
				url: 'wwv_flow.show',
				data: {
					"p_request": "APPLICATION_PROCESS=delete_item",
					"p_flow_id": $v('pFlowId'),
					"p_flow_step_id": $v('pFlowStepId'),
					"p_instance": $v('pInstance'),
					"x01" :  htgl.item_mousedown_clone_id.substr(4) // HID_22
					//"f01": htgl.write_items
				},
				success: function (data) {
					//console.log(data);
					htgl.data = data;
					$('#ITEMID_'+htgl.item_mousedown_clone_id.substr(4)).remove();
				},
				dataType: 'json'
			});
			
		},
		// ---------------------------------------------------------------------------
		
		write_items: function () {

			
			/*
			htgl.write_items array wird beim schreiben benoetigt, aufgebaut aus den items die sich verschoben haben
			wenn ein item nicht mehr in der richtigen box(ul) plaziert ist, dann stimmt vom ul die id nicht 
			mit der data-boxid überein.
			*/
			
			// ermittelt alle li elements, bei denen der tag data-boxid nicht mit der ul ID überinstimmt
			
			htgl.write_items = []; 
			$.each(htgl.all_data.boxes, function (i, v) {
				$.each($('#BOXID_' + v.ID + ' li'), function (k,n) {
					 console.log("BOX_ID = " + v.ID + ", ITEM_ID = " + $(this).attr("data-boxid"));
					if ( $(this).attr("data-boxid") != v.ID){ 
						console.log($(this).attr("data-boxid")); 					
						htgl.write_items.push(v.ID + ':' + $(this).attr("id").substr(7) + ',' + $(this).attr("data-boxid") );
					}else{ 
						//console.log( "OK =" + $(this).attr("data-boxid") +" == "+v.ID )
					}
				})
			});
			
			$.ajax({
				method: "POST",
				url: 'wwv_flow.show',
				data: {
					"p_request": "APPLICATION_PROCESS=write_items",
					"p_flow_id": $v('pFlowId'),
					"p_flow_step_id": $v('pFlowStepId'),
					"p_instance": $v('pInstance'),
					//"x01" :  1, // GROUP_ID
					"f01": htgl.write_items
				},
				success: function (data) {
					//console.log(data);
					htgl.data = data;
					// überprüfen !!!!!!!!!!!!!!!!!
					$.each(htgl.data.row, function (a, b) { // console.log(i + ' - ' + v );})
						$('#sortable_' + b.BOX_ID).append('<li id="ITEM_' + b.ID + '" class="ui-state-default ">' + b.TEXT + '</li>');
					});
					htgl.fx.do_success_move_message();
				},
				dataType: 'json'
			});

		}, 
		// ---------------------------------------------------------------------------
		// -----------------------------------------------
		do_success_move_message: function(){
		 // HPSM Migration Message
		 apex.message.showPageSuccess( "Success !" );
		 window.setTimeout(function(){ apex.message.hidePageSuccess();}, 3000);
		},
		// ----------------------------------------------------
		// ---------------------------------------------------------------------------
		// setzt for only one items das  contextmenu
		set_one_items_menue: function (p_this_item) {
						$(p_this_item).contextmenu(function () {
							return false
						}).mousedown(function (event) {
							
							htgl.hoehe=$("#item_menue007").css("height");
							
							console.log("Height Menue = " + htgl.hoehe.substr(0,htgl.hoehe.indexOf("px")) );
							console.log("klick on x = " + event.pageX +", y = " + event.pageY +", diff = " 
							+ ( window.innerHeight - event.pageY ));
							
							htgl.clickevent = event;
							
							if (event.which == 3) { // mousekey right
								event.preventDefault();
								event.stopPropagation();
								console.log("rechtsklick von clone ITEM_ID =" + $(event.target).attr("id")  );
								console.log("rechtsklick von BOX ID =" + $(htgl.clickevent.target).parent().parent().parent().parent().parent().attr("data-boxid") );
								// an welcher BOX_ID war der Mousedown
								
								htgl.item_mousedown_clone_id = $(htgl.clickevent.target).attr("id");
								htgl.item_mousedown_id  = $(htgl.clickevent.target).attr("id").substr(4);
								htgl.item_mousedown_boxid = $(htgl.clickevent.target).parent().parent().parent().parent().parent().attr("data-boxid");
								
								//if ( window.innerHeight - event.pageY )
								$(".item-menu").show().css({
									top: event.pageY + "px",
									left: event.pageX + "px"
								});
								// verhindert weitere öffnungen anderer dialoge
								$('<div class="modal-backdrop"></div>').appendTo(document.body).contextmenu(function () {
									return false
								}).click(function(e){this.remove();$('.item-menu').hide();$('.custom-menu').hide();});
							}
							//return false;
						}); //headerline context menue div
		}, 
		// ---------------------------------------------------------------------------
		// setzt forall items das  contextmenu
		set_all_items_menue: function () {
						// unterbinden des normalen contextmenues für das Element
						
					$('.itemmenue').each(function(i,v){
						htgl.fx.set_one_items_menue($(this) );
					}); // each item
		}, 
		// ---------------------------------------------------------------------------
		/* // get_all_items function, baut alles auf 

			  Beispiel = htgl.fx.get_all(apex.item('P5_GROUP').getValue(),'#myKanban2');
			  Parameter 1 = GROUP_ID der KanbanGroup ( siehe Tabelle KB_GROUP )
			  Parameter 2 = die Element ID eines DIV der HTML Region, hier wird aufgebaut
			  
		*/
		// ---------------------------------------------------------------------------
		get_all_items: function (p_group_id, p_div_id) {

			/* verhindert rechte mouseclick contextmenue auf der ganzen page
						$(document).bind("contextmenu", function() {
			return false;
			});
			 */
			//console.log('search for group id = ' + p_group_id);
			if (p_group_id.length == 0) {
				p_group_id = $("#"+htgl.APEX_GROUP_ITEM+" option:selected").val();
				//console.log('length was 0 , set to 1 ,search for group id = ' + p_group_id);
			};
			//console.log('with p_div_id = ' + p_div_id);
			$('#kanban02_heading').html("Kanban2 for Group = " + $("#"+htgl.APEX_GROUP_ITEM+" option:selected").text());

			$.ajax({
				method: "POST",
				url: 'wwv_flow.show',
				data: {
					"p_request": "APPLICATION_PROCESS=get_all",
					"p_flow_id": $v('pFlowId'),
					"p_flow_step_id": $v('pFlowStepId'),
					"p_instance": $v('pInstance'),
					"x01": p_group_id // GROUP_ID der KanbanGroup ( siehe Tabelle KB_GROUP )
				},
				dataType: 'json',
				success: function (data) {

					htgl.all_data = data;
					 
					// prepare the second div
					$(p_div_id).children().remove();
					
					$.each(htgl.all_data.boxes, function (i, v) {
						//console.log(i + ' - ' + v.TEXT + ' - ' + v.HEADERLINE);

						var maindiv2 = document.createElement('div');
						$(maindiv2).addClass("mainbox").attr("id", "MAIN_" + v.ID).appendTo($(p_div_id)) //main div

						var headerline2 = document.createElement('div');
						$(headerline2).addClass("headerline").addClass("grabbing").html(v.TEXT).attr("id", "HDL_" + v.ID)
						.appendTo($(maindiv2)); //headerline  div
						
						// unterbinden des normalen contextmenues für das Element
						$(headerline2).contextmenu(function () {
							return false
						}).mousedown(function (event) {
							//console.log("klick on x = " + event.pageX +", y = " + event.pageY);
							htgl.clickevent = event;
							
							if (event.which == 3) { // mousekey right
								event.preventDefault();
								event.stopPropagation();
								//console.log("rechtsklick von " + $(event.target).attr("id").substr(4)  );
								
								// an welcher BOX_ID war der Mousedown
								htgl.item_mousedown_boxid = $(event.target).attr("id").substr(4);
								htgl.item_mousedown_clone_id = "" ;
								htgl.item_mousedown_id =  "";
								
								$(".custom-menu").show(100).css({
									top: event.pageY + "px",
									left: event.pageX + "px"
								});
								// verhindert weitere öffnungen anderer dialoge
								$('<div class="modal-backdrop"></div>').appendTo(document.body).contextmenu(function () {
									return false
								}).click(function(e){this.remove();$('.item-menu').hide();$('.custom-menu').hide();});
								//$('.modal-backdrop').click(function(e){});
							}  // mousekey right
						//	return false;
						}); //headerline context menue div

						var description2 = document.createElement('div');
						$(description2).addClass("description").html(v.HEADERLINE).appendTo($(maindiv2)) //main div

						$(maindiv2).append('<ul id="BOXID_' + v.ID + '" class="sort droptrue"></ul>');

						// prepare the children of each box
						$.each(v.items, function (c, d) {
							
							//console.log('I ID = ' + d.ID + ' -I TEXT- ' + d.TEXT + ' -BOXID- ' + d.BOX_ID + ' -mycheck- ' + d.MYCHECK);
							
		 					 htgl.fx.add_element({"ID": + d.ID , "BOX_ID": d.BOX_ID  ,"data_is_new":"N","textvalue":d.TEXT 
							 ,"taskvalue":(!d.TASK?'':d.TASK), "mycheck": (!d.MYCHECK ? '' : d.MYCHECK) , "myfix": (!d.MYFIX ? '' : d.MYFIX)
							 , "CREATE_DATE":d.CREATE_DATE});
							
						});
						

						// initiales sortable widget erstellen
						$('#BOXID_' + v.ID + ".droptrue").sortable({
							connectWith: "ul"
						});
						


					}); // prepare the second div
					
					htgl.fx.set_all_items_menue();
				} // success
			});

		}, // get_items function
		// ---------------------------------------------------------------------------
		// ---------------------------------------------------------------------------

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
	
	// schliessen der Dialoge wenn Escape pressed
	$(document).keydown(function(event) { 
		if (event.keyCode == 27) { 
			$('.custom-menu').hide();
			$('.item-menu').hide();
			$("#dialog007").hide();
			$(".modal-backdrop").remove();
		}
	});

	$( document ).ready(function() {
		
		// hover infobox die etwas text anzeigt
		var myhover = document.createElement('div');
		$(myhover).addClass("info007").attr("id", "info007").appendTo($("body")); //info div
		
		$(myhover).on("mouseenter",function(){ //console.log("yeahhhh");
			htgl.set_timeout = 0 ;
		});
		
		$(myhover).on("mouseleave",function(){ //console.log("raus");  
			$('.info007').css({'left':-9999});
		});
		   
		var mydialog = document.createElement('div');
		$(mydialog).addClass("my_dialog").attr("id", "dialog007").appendTo($("body")) //main div
		// verschieben der Region
		$("#eingabe01").prependTo("#dialog007");
		
		htgl.fx.create_box_menue();
		htgl.fx.create_item_menue();
		htgl.fx.storeUrlVars();
		htgl.fx.get_version();
		
		// der history dialog
		htgl.dialogdata = $('<div id="ModalFacPenDiv" style="overflow:auto;overflow-y: auto;"><ul id="list01"></ul></div>');
		


	});
	// ---------------------------------------------------------------------------
})(document);
