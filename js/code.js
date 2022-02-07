const urlBase = 'http://contactdepot.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


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
	let contactCount = 0;
	let contactFirstName = "";
	let contactLastName = "";
	let contactEmail = "";
	let contactPhone = "";

	let tmp = {userid:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/LoadContacts.' + extension;

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

				display(contactCount, contactFirstName, contactLastName, contactEmail, contactPhone);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
//		document.getElementById("loadingContactsResults").innerHTML = err.message;
	}
}

function display(contactCount, contactFirstName, contactLastName, contactEmail, contactPhone) {
    // get handle on div
	var container = document.getElementById('contactsTable');
 /*   var containerFirst = document.getElementById('contactListFirstName');
	  var containerLast = document.getElementById('contactListLastName');
	  var containerEmail = document.getElementById('contactListEmail');
	  var containerPhone = document.getElementById('contactListPhone');
//	var container = document.getElementsByClassName('container');*/
    // create table element
    var table = document.createElement('table');
	var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
	//create header
		var hrow = document.createElement('tr');
		var fieldNum = document.createElement('th');
		fieldNum.textContent = "#"
		hrow.appendChild(fieldNum);
		var fieldName = document.createElement('th');
		fieldName.textContent = "First Name"
		hrow.appendChild(fieldName);
		var fieldLast = document.createElement('th');
		fieldLast.textContent = "Last Name"
		hrow.appendChild(fieldLast);
		var fieldEmail = document.createElement('th');
		fieldEmail.textContent = "Email"
		hrow.appendChild(fieldEmail);
		var fieldPhone = document.createElement('th');
		fieldPhone.textContent = "Phone Number"
		hrow.appendChild(fieldPhone);
		thead.appendChild(hrow);
		tbody.appendChild(hrow);
		var fieldButtons = document.createElement('th');
		fieldButtons.textContent = "Actions"
		hrow.appendChild(fieldButtons);
    // loop array
    for (i = 0; i < contactCount; i++) {
        // create tr element
        var row = document.createElement('tr');
			var cellNum = document.createElement('td');
			cellNum.textContent = i+1;
			row.appendChild(cellNum);
            var cellFirst = document.createElement('td');
            cellFirst.textContent = contactFirstName[i];
            row.appendChild(cellFirst);
//			containerFirst.appendChild(cellFirst);
			var cellLast = document.createElement('td');
            cellLast.textContent = contactLastName[i];
            row.appendChild(cellLast);
//			containerLast.appendChild(cellLast);
			var cellEmail = document.createElement('td');
            cellEmail.textContent = contactEmail[i];
            row.appendChild(cellEmail);
//			containerEmail.appendChild(cellEmail);
			var cellPhone = document.createElement('td');
            cellPhone.textContent = contactPhone[i];
            row.appendChild(cellPhone);
			var cellActions = document.createElement('td');
			//Edit Button
			var btnEdit = document.createElement('input');
			btnEdit.type = "button";
			btnEdit.className = "buttonEdit";
			btnEdit.value = "Edit";
			btnEdit.onclick = "#editContact";
			//Delete Button
			var iconDelete = document.createElement('span');
			iconDelete.className = "fas fa-pen-square";
			var btnDelete = document.createElement('input');
			btnDelete.type = "button";
			btnDelete.className = "delete";
//			btnDelete.appendChild(iconDelete);
			iconDelete.appendChild(btnDelete);
			cellActions.appendChild(iconDelete);
			cellActions.appendChild(btnDelete);
            row.appendChild(cellActions);
        //append tr to tbody
        tbody.appendChild(row);
//		container.appendChild(row);
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
