$(document).ready(function(){
	$('#result').load('http://www.spigotmc.org #AlertsMenu_Counter', function(){
		alert($("#result").text());
	});
});
