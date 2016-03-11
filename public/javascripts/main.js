function WebSafe(string) {
	return string.replace(" ", "_");
}

function PopulateTable(jsonobj, location) {
 // find the table that has the location to add the data to as its data-bind property
	var top = $("table[data-bind='" + location + "']");
	var inpoint = top.children('tbody:last-child');
	var binders = Array();
	var i = 0;
	//console.log(jsonobj)
	// this each function finds the data that we want to bind to each column from the th data-bind property
	$("table[data-bind='" + location + "'] thead tr th").each(function () {
		binders[i] = $(this).attr('data-bind');
		i++;
	});
	Items = jsonobj;
	// iterate through the items and look for the property value for each column
	for (num in Items) {
		var obj = Items[num];
		htmlstr = "<tr ";
		if ("ID" in obj) {
			htmlstr += ' data-id="' + obj.ID + '"';
		}
		htmlstr += ">";
		for (var j = 0; j < binders.length; j++) {
			if (binders[j] in obj) {
				prop = binders[j];
				//console.log(obj[prop])
				htmlstr += "<td data-type=\"" + prop + "\">" + obj[prop] + "</td>";
			}
			else if (binders[j] == "Quantity") {
				var a = 0;
				if ("Size" in obj) {
					a = parseInt(obj["Size"]) * parseInt(obj["Number"])
				}
				else {
					a = obj["Amount"];
				}
				htmlstr += "<td>" + a + " " + obj["Units"];
				if (a > 1) {
					htmlstr += "s";
				}
				htmlstr += "</td>";
			}
			else if (binders[j] == "Controls") {
				htmlstr += "<td id=\"controls\" data-id=\"" + obj.ID + "\"></td>";
			}
			else {
				htmlstr += "<td data-type=\"" + binders[j] + "\"></td>";
			}
		}
		htmlstr += "</tr>";
		// add it to the table
		inpoint.append(htmlstr);
	}
}

function PopulateShoppingList(jsonobj, location) {
 // find the table that has the location to add the data to as its data-bind property
	var top = $("table[data-bind='" + location + "']");
	var inpoint = top.children('tbody:last-child');
	var binders = Array();
	var i = 0;
	// this each function finds the data that we want to bind to each column from the th data-bind property
	$("table[data-bind='" + location + "'] thead tr th").each(function () {
		binders[i] = $(this).attr('data-bind');
		i++;
	});
	Items = jsonobj;
	// iterate through the items and look for the property value for each column
	for (num in Items) {
		var obj = Items[num];
		var alreadythere = false;
		$("tr[data-id='" + obj.ID + "']").each(function() {
			var current = parseInt($(this).attr('data-quant'));
			//alert(current);
			var toadd = parseInt(obj.Amount);
			var n  = current + toadd;
			//console.log(n);
			$(this).attr('data-quant',n);
			$(this).children().children('span[data-link="Quantity"]').text(n);
			alreadythere = true;
		});
		if (!alreadythere) {
			htmlstr = "<tr ";
			if ("ID" in obj) {
				htmlstr += ' data-id="' + obj.ID + '"';
			}
			htmlstr += ' data-quant="' + obj.Amount + '">';
			for (var j = 0; j < binders.length; j++) {
				if (binders[j] in obj) {
					prop = binders[j];
					htmlstr += "<td data-type=\"" + prop + "\">" + obj[prop] + "</td>";
				}
				else if (binders[j] == "Quantity") {
					htmlstr += '<td><span data-link="Quantity">' + obj["Amount"] + "</span> " + obj["Units"];
					if (obj.Amount > 1) {
						htmlstr += "s";
					}
					htmlstr += "</td>";
				}
				else {
					htmlstr += "<td data-type=\"" + binders[j] + "\"></td>";
				}
			}
			htmlstr += "</tr>";

			// add it to the table
			inpoint.append(htmlstr);
		}
	}
}

function DePopulateShoppingList(jsonobj, location) {
 // find the table that has the location to add the data to as its data-bind property
	var top = $("table[data-bind='" + location + "']");
		// iterate through the items and look for the property value for each column
	Items = jsonobj;
	for (num in Items) {
		var obj = Items[num];
		$("tr[data-id='" + obj.ID + "']").each(function() {
			//console.log(obj);
			var current = parseInt($(this).attr('data-quant'));
			var torem = parseInt(obj.Amount);
			var n  = current - torem;
			if (n <= 0) {
				$(this).remove();
			} else {
				$(this).attr('data-quant',n);
				$(this).children().children('span[data-link="Quantity"]').text(n);
			}
		});
	}
}

function AddManageButtons(location) {
	var rows = $("table[data-bind='" + location + "'] tbody tr");
	rows.each(function () {
		var htmlstr = "";
		htmlstr = '<button class="btn btn-primary btn-xs manage">Edit</button>';
		$(this).children('#controls').append(htmlstr);
	});
	$('button.manage').each(function () {
		var id = $(this).parent().attr('data-id');
		//console.log(code);
		$(this).click({ id: id }, ManageThisRecipe)
	});
}

function AddDeleteButtons(location, type) {
	var rows = $("table[data-bind='" + location + "'] tbody tr");
	rows.each(function () {
		var htmlstr = "";
		htmlstr = '<button class="btn btn-danger btn-xs delete">Delete</button>';
		$(this).children('#controls').append(htmlstr);
	});
	$('button.delete').each(function () {
		var id = $(this).parent().attr('data-id');
		//console.log(code);
		if (type == 0) {
			$(this).click({ id: id }, DeleteThisIngredient);
		}
		if (type == 1) {
			$(this).click({ id: id }, DeleteThisIngredientMap);
		}
		if (type == 2) {
			$(this).click({ id: id }, DeleteThisRecipe);
		}
	});
}

function ManageThisRecipe(event) {
	var id = event.data.id;
	//alert(id);
	window.location.href = "/recipes/manage/" + id;
}

function DeleteThisRecipe(event) {
	$.getJSON("/recipes/delete/" + event.data.id).done(function (json){
		alert("deleted");
		window.location.reload();
	}).fail(function (jqxhr, textStatus, error){
		alert(error);
	});
}

function DeleteThisIngredient(event) {
	$.getJSON("/ingredients/delete/" + event.data.id).done(function (json){
		alert("deleted");
		window.location.reload();
	}).fail(function (jqxhr, textStatus, error){
		alert(error);
	});
}

function DeleteThisIngredientMap(event) {
	var recipe = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
	$.getJSON("/recipes/ingredients/delete/" + event.data.id).done(function (json){
		alert("deleted");
		window.location.href = "/recipes/manage/" + recipe;
	}).fail(function (jqxhr, textStatus, error){
		alert(error);
	});
	//alert(id);
}

function PopulateIngredients(event) {
	var id = event.data.id;
	var button = $("button.recipe[data-id='" + id + "']");
	if (button.hasClass("btn-success")) {
		//turn it off
		//console.log("Removing recipe: " + id);
		button.removeClass("btn-success");
		$.getJSON("/lists/adding/" + id).done(function (json) {
			DePopulateShoppingList(json, "ingredients");
		}).fail(function (jqxhr, textStatus, error) {
			var error = textStatus + ": " + error;
			alert(error);
		});
	}
	else {
		//console.log("Adding recipe: " + id);
		$("button.recipe[data-id='" + id + "']").addClass("btn-success");
		$.getJSON("/lists/adding/" + id).done(function (json) {
			PopulateShoppingList(json, "ingredients");
		}).fail(function (jqxhr, textStatus, error) {
			var error = textStatus + ": " + error;
			alert(error);
		});
	}
}
