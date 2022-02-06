const urlBase = 'http://contactdepot.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let contactCount = 0;
let contactFirstName = "";
let contactLastName = "";
let contactEmail = "";
let contactPhone = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "Username/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "home.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function loadContacts()
{
	contactCount = 0;
	contactFirstName = "";
	contactLastName = "";
	contactEmail = "";
	contactPhone = "";

	let tmp = {userid:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/LoadContacts.' + extension;

//	document.getElementById("contactCountResult").innerHTML = "";
	
	

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );	

				contactCount = jsonObject.contactCount;
				contactFirstName = jsonObject.firstNames;
				contactLastName = jsonObject.lastNames;
				contactEmail = jsonObject.emails;
				contactPhone = jsonObject.phoneNumbers;
//				fillTable();
/*
				alert(contactCount);
				alert(contactFirstName);
				alert(contactLastName);
				alert(contactEmail);
				alert(contactPhone);*/
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
//		document.getElementById("loadingContactsResults").innerHTML = err.message;
	}
}

function fillTable()
{
/*	alert(contactCount);
    alert(contactFirstName);
	alert(contactLastName);
	alert(contactEmail);
	alert(contactPhone);
	for(var i=0; i < contactCount; i++)
	{
		alert(contactFirstName[i]);
		alert(contactLastName[i]);
		alert(contactEmail[i]);
		alert(contactPhone[i]);
	}
	var table = document.createElement("table");
	for(var i=0; i < contactCount; i++)
	{
		var row = table.insertRow();
		var cell = row.insertCell();
		cell.appendChild(document.createTextNode(contactFirstName[i]));
	}
	for(var i=0; i < 2; i++)
	{
		document.write("<tr>");
		document.write("<td>" + contactFirstName[i] + "</td>");
		document.write("<td>" + contactLastName[i] + "</td>");
		document.write("<td>" + contactEmail[i] + "</td>");
		document.write("<td>" + contactPhone[i] + "</td>");
	}
	return table;*/
}

function display() {
    // get handle on div
    var container = document.getElementById('container');
    // create table element
    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    // loop array
	alert(contactCount);
    for (i = 0; i < contactCount; i++) {
        // get inner array
    //  var vals = orderArray[i];
        // create tr element
        var row = document.createElement('tr');
        // loop inner array
        // for (var b = 0; b < vals.length; b++) {
            // create td element
            var cell = document.createElement('td');
            // set text
            cell.textContent = contactFirstName[i];
            // append td to tr
            row.appendChild(cell);
			var cell = document.createElement('td');
            // set text
            cell.textContent = contactLastName[i];
            // append td to tr
            row.appendChild(cell);
			var cell = document.createElement('td');
            // set text
            cell.textContent = contactEmail[i];
            // append td to tr
            row.appendChild(cell);
			var cell = document.createElement('td');
            // set text
            cell.textContent = contactPhone[i];
            // append td to tr
            row.appendChild(cell);
        //append tr to tbody
        tbody.appendChild(row);
    }
    // append tbody to table
    table.appendChild(tbody);
    // append table to container
    container.appendChild(table);
}
display();

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
/*
function addContact()
{
	let newContact = document.getElementById("contactText").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {contact:newContact,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}
*/

function addContact()
{
	if(newContactFirstName == "" || newContactLastName == "" || newContactEmail == "" || newContactPhoneNumber == "")
	{
		return;
	}

	let firstName = document.getElementById("newContactFirstName").value;
	let lastName = document.getElementById("newContactLastName").value;
	let email = document.getElementById("newContactEmail").value;
	let phoneNumber = document.getElementById("newContactPhoneNumber").value;

	document.getElementById("newContactResult").innerHTML = "";

	let tmp = {userid:userId, firstname:firstName, lastname:lastName, email:email, phone:phoneNumber};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Add.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				let resultAdd = jsonObject.match("create");
			//	alert(jsonObject);

				if(resultAdd == null)
				{
					document.getElementById("newContactResult").innerHTML = "User Already Exist";
					return;
				}
				else
				{
					document.getElementById("newContactResult").innerHTML = "Contact Added";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("newContactResult").innerHTML = err.message;
	}
}


function addUser()
{
	let newFirstName = document.getElementById("firstname").value;
	let newLastName = document.getElementById("lastname").value;
	let newLogin = document.getElementById("login").value;
	let newPassword = document.getElementById("password").value;

	document.getElementById("newUserResult").innerHTML = "";

	let tmp = {firstname:newFirstName, lastname:newLastName, login:newLogin, password:newPassword};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if(userId < 1)
				{
					document.getElementById("newUserResult").innerHTML = "User Already Exist";
					return;
				}
				else
				{
					document.getElementById("newUserResult").innerHTML = "User Created";
				}
				window.location.href = "register.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("newUserResult").innerHTML = err.message;
	}
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Search.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}
/*
function deleteContact() {
	// get phone number
	let phn = document.getElementById("phoneText").value;

	document.getElementById("contactDeleteResult").innerHTML = "";

	let tmp = {Phone:phn,UserID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Delete.' + extension;

	// search by phone number

	// delete contact

}*/

function deleteContact() {
	let phn = document.getElementById("phoneText").value;

	document.getElementById("contactDeleteResult").innerHTML = "";

	let tmp = {phone:phn,userid:userId};
	//alert(phn);
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Delete.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				let resultDelete = jsonObject.match("delete");
				//alert(jsonObject);

				if(resultDelete == null)
				{
					//alert("No deletion happened");
					document.getElementById("contactDeleteResult").innerHTML = "Contact Does Not Exist";
					return;
				}
				else
				{
					//alert("Termination successful");
					document.getElementById("contactDeleteResult").innerHTML = "Deletion Successful";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}

function wrapperFunction() {
	addUser();
	window.location.href = 'index.html';
 }

 function editContact()
 {
	let newFirstName = document.getElementById("firstName").value;
	let newLastName = document.getElementById("lastName").value;
	let newEmail = document.getElementById("email").value;
	let phonenumber = document.getElementById("phoneNumber").value;

	document.getElementById("editResult").innerHTML = "";

	let tmp = {userid:userId, firstname:newFirstName, lastname:newLastName, email:newEmail, phone:phonenumber}
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Update.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				let resultEdit = jsonObject.match("update");
			//	alert(jsonObject);

				if(resultEdit === null)
				{
					document.getElementById("editResult").innerHTML = "Contact Does Not Exist";
					return;
				}
				else
				{
					document.getElementById("editResult").innerHTML = "Contact Update Successful";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
 }
