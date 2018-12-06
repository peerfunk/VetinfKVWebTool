
$( ".right" ).on("click", "table :not(thead) tr",function() {
	$(this).find( "input" ).select();
});
$( ".right" ).on("keydown","table tr",function( event ) {
		if(event.which == 13){
			add_table(this);
		}
});

$( ".right" ).on("dblclick","table tr",function() {
	add_table(this);
});

$( ".left" ).on("click","table tr",function() {
	$(this).find( "input" ).select();
});

$( ".left" ).on("input", "input[name='count']",function(event) {
	var curval =  $(this).closest($('input[name="count"]')).val();
	var val = $(this).closest('tr').find('td:eq(3)').text()
	if(curval >0){
		$(this).closest('tr').find('td:eq(4)')[0].innerHTML =  curval*val;
		calc_sum();
	}else{
		if (confirm('Wollen Sie diesen Eintrag wirklich löschen?')) {
			$(this).closest('tr').remove();
			load_data($(this).closest('tr'));
			if($('.left table tr:not(.total)').length < 2){
					$('.left table .total').remove();
				
			}
		}else{
			$(this).val(1);			
		}
		calc_sum();
		
	}
	
});


$(".left table thead input[name='selector']").click( function(){
	$(".left table input[name='selector']").text()="1";
});
		

$('input[name="search"]').keydown( function( event ) {
	if(event.which == 13){
		load_data(this);
	}
});

function del_all(){
	location.reload();
	//$('.left table tr:not(#head)').each(function(){$(this).remove();reset_colors()})
}
function reset_colors(){
	$('.right table tr').each(function (){$(this).css( "background-color", "" )});	
}
function mark_right(){
	var right_table = $('.right tr ');
	var left_table = $('.left tr');
	for (var i=1; i < right_table.length; i++){
		for (var j=1; j < left_table.length; j++){
			if($(right_table[i]).find('td:nth-child(1)')[0].innerHTML == $(left_table[j]).find('td:nth-child(1)')[0].innerHTML && $(right_table[i]).find('td:nth-child(3)')[0].innerHTML == $(left_table[j]).find('td:nth-child(3)')[0].innerHTML ){							
				$('.right tr:not(#head):nth-child(' + i + ')' ).css({backgroundColor: 'green'});
			}
		};
	};
}
$('input[name="type"]').on("input", function(event){
	var curval =  ($(this).val()).toUpperCase();
	if(curval != 'M' && curval != 'L'){
		$(this).select();
		$(this).addClass("wrong");
	}else{
		$('input[name="search"]').val("");
		$(this).removeClass("wrong");
		$('#results').load( "lib/search.php?id=" + curval );
		$('input[name="search"]').focus();
	}
});
	
function load_data(obj){
		$('#results').html("<img src='img/load.gif'>");
		$('#results').load( "lib/search.php?id=" + ($('input[name="type"]').val()).toUpperCase() + "&search=" + $(obj).val() + "&level=" + $('input[name="level"]:checked').val(), function (){mark_right();});
}
function add_table(cur){
	var current_row = $(cur).closest("tr:not(#head)");
		var canInsert = true;
		$('.left tr ').each(function() {
			if( $(this).find('td:nth-child(1)')[0] != undefined && $(this).find('td:nth-child(3)')[0] != undefined){
				if (current_row.find('td:nth-child(1)')[0].innerHTML == $(this).find('td:nth-child(1)')[0].innerHTML && current_row.find('td:nth-child(3)')[0].innerHTML== $(this).find('td:nth-child(3)')[0].innerHTML ){ 
					canInsert=false;
				}
			}
		});
	if (canInsert && !$('.left .total:last').length){
		$('.left tr:last').after(current_row.clone());
		$(cur).closest("tr:not(#head)").css( "background-color", "green" );
		calc_sum();
	  }else if(canInsert && $('.left .total:last').length){
		$('.left tr:last').before(current_row.clone());
		$(cur).closest("tr:not(#head)").css( "background-color", "green" );
		calc_sum();
	  }

}


function calc_sum(){
	var value;
	var theTotal = 0;
		$(".left table tr:not(.total) td:nth-child(5)").each(function () {
			value = $(this).html();
			theTotal += parseInt(value);
		});
	if (!$('.left .total:last').length && $('.left tr td').length){
	//alert("first");
			$('.left tr:last').addClass("last");
			$('.left tr:last').after("<tr class='total'><td></td><td></td><td></td><td>Summe:</td><td>"+ theTotal + "</td></tr>");
	}else if( $('.left .total:last').length && $('.left tr td').length){
		//alert(theTotal);
		//console.log($('.left .total:last td:nth-child(5)')[0].innerHTML  );
		$('.left .total:last td:nth-child(5)')[0].innerHTML =  theTotal ;
	}
	
}
$('#search input').focus(function() { 
  $(this).val(''); 
});	

function printDiv(divName) {
	var originalContents = $('body');
     var printContents = $('#' + divName).parent();
	 //printContents = $(printContents).attr("id" , "printer");
     var inputVars = printContents.find("input").each(function(){
			$(this).replaceWith($(this).val());
	 });
	//var printContents = printContents;
	//console.log(printContents);
	 //console.log(inputVars);
    var originalContents = document.body.innerHTML;
     //console.log(printContents);
	 document.body.innerHTML = printContents.html();

	 window.print();
     document.body.innerHTML = originalContents;
}