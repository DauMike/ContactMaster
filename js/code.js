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
			//Num Column
			var cellNum = document.createElement('td');
			cellNum.textContent = i+1;
			row.appendChild(cellNum);
			//First Name Column
            var cellFirst = document.createElement('td');
            cellFirst.textContent = contactFirstName[i];
            row.appendChild(cellFirst);
			//Last Name Column
			var cellLast = document.createElement('td');
            cellLast.textContent = contactLastName[i];
            row.appendChild(cellLast);
			//Email Column
			var cellEmail = document.createElement('td');
            cellEmail.textContent = contactEmail[i];
            row.appendChild(cellEmail);
			//Phone Number Column
			var cellPhone = document.createElement('td');
            cellPhone.textContent = contactPhone[i];
            row.appendChild(cellPhone);
			//Actions Column
			var cellActions = document.createElement('td');
			//Edit Button
			var btnEdit = document.createElement('button');
			btnEdit.className = "buttonEdit";
			btnEdit.innerHTML = '<a href="#editContact" class="buttonEdit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>';
			//Delete Button
			var btnDelete = document.createElement('button');
			btnDelete.className = "buttonDelete";
			btnDelete.innerHTML = '<a href="#deleteContact" class="buttonDelete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE92E;</i></a>';
			//Append Buttons to td
			cellActions.appendChild(btnEdit);
			cellActions.appendChild(btnDelete);
            row.appendChild(cellActions);
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

function deleteContact() {
	let phn = document.getElementById("phoneText").value;

	document.getElementById("contactDeleteResult").innerHTML = "";

	let tmp = {phone:phn,userid:userId};
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

				if(resultDelete == null)
				{
					document.getElementById("contactDeleteResult").innerHTML = "Contact Does Not Exist";
					return;
				}
				else
				{
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
//Used to format phone numbers. 
function phone_formatting(ele,restore) {
	var new_number,
		selection_start = ele.selectionStart,
		selection_end = ele.selectionEnd,
		number = ele.value.replace(/\D/g,'');
	
	// automatically add dashes
	if (number.length > 2) {
	  // matches: 123 || 123-4 || 123-45
	  new_number = number.substring(0,3) + '-';
	  if (number.length === 4 || number.length === 5) {
		// matches: 123-4 || 123-45
		new_number += number.substr(3);
	  }
	  else if (number.length > 5) {
		// matches: 123-456 || 123-456-7 || 123-456-789
		new_number += number.substring(3,6) + '-';
	  }
	  if (number.length > 6) {
		// matches: 123-456-7 || 123-456-789 || 123-456-7890
		new_number += number.substring(6);
	  }
	}
	else {
	  new_number = number;
	}
	
	// if value is heigher than 12, last number is dropped
	// if inserting a number before the last character, numbers
	// are shifted right, only 12 characters will show
	ele.value =  (new_number.length > 12) ? new_number.substring(0,12) : new_number;
	
	// restore cursor selection,
	// prevent it from going to the end
	// UNLESS
	// cursor was at the end AND a dash was added
	document.getElementById('msg').innerHTML='<p>Selection is: ' + selection_end + ' and length is: ' + new_number.length + '</p>';
	
	if (new_number.slice(-1) === '-' && restore === false
		&& (new_number.length === 8 && selection_end === 7)
			|| (new_number.length === 4 && selection_end === 3)) {
		selection_start = new_number.length;
		selection_end = new_number.length;
	}
	else if (restore === 'revert') {
	  selection_start--;
	  selection_end--;
	}
	ele.setSelectionRange(selection_start, selection_end);
  
  }
	
  function phone_number_check(field,e) {
	var key_code = e.keyCode,
		key_string = String.fromCharCode(key_code),
		press_delete = false,
		dash_key = 189,
		delete_key = [8,46],
		direction_key = [33,34,35,36,37,38,39,40],
		selection_end = field.selectionEnd;
	
	// delete key was pressed
	if (delete_key.indexOf(key_code) > -1) {
	  press_delete = true;
	}
	
	// only force formatting is a number or delete key was pressed
	if (key_string.match(/^\d+$/) || press_delete) {
	  phone_formatting(field,press_delete);
	}
	// do nothing for direction keys, keep their default actions
	else if(direction_key.indexOf(key_code) > -1) {
	  // do nothing
	}
	else if(dash_key === key_code) {
	  if (selection_end === field.value.length) {
		field.value = field.value.slice(0,-1)
	  }
	  else {
		field.value = field.value.substring(0,(selection_end - 1)) + field.value.substr(selection_end)
		field.selectionEnd = selection_end - 1;
	  }
	}
	// all other non numerical key presses, remove their value
	else {
	  e.preventDefault();
  //    field.value = field.value.replace(/[^0-9\-]/g,'')
	  phone_formatting(field,'revert');
	}
  
  }
  
  document.getElementById('phoneText').onkeyup = function(e) {
	phone_number_check(this,e);
  }