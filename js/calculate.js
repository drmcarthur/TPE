
// Generate a table with desired material properties
function addRow(material) {
    $("#dataTable").append("<tbody>");
    var trow = "<tr>";
    	//alert(window[material].props["T"][0]);
	//var myArray = [Infinity,NaN,10];
	//alert(1 + myArray[1] );
    for (var prop in window[material])
    {

	if (prop == Array) {
	    trow += "<td data-pname='" + window[material][prop][0] + "'>" + window[material].props[prop][0] + "</td>";
	    alert("got here...");
	}
	else {
	    trow += "<td data-pname='" + window[material][prop] + "'>" + window[material][prop] + "</td>";
	}
	
    }
    trow += "</tr>"
    $("#dataTable").append(trow);
    $("#dataTable").append("</tbody>");
    $("#dataTable").css("display", "block");
}

$( document ).ready(function() {
    // Load tables
});

$(".material").click(function() {
    //window.alert(this.innerHTML);
    //$("#matSelector").hide();
    $("#materialText").html('Properties of <em>' + this.innerHTML + '</em><br/>');
    $("#tempRange").html('T = ' + window[this.dataset.material].tMin + ' - ' +
			 window[this.dataset.material].tMax + ' K'); 
});