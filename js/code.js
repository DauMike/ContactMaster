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

/*
function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	var list = document.createElement("ul");
	document.getElementById("contactsList").appendChild(list);

	if(srch === "")
	{
		document.getElementById("contactsList").replaceChildren(list);
		return;
	}
	
	let contactList = "";

	let tmp = {search:srch,userid:userId};
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

				if(jsonObject.id == "0")
				{
					document.getElementById("contactsList").replaceChildren(list);
					return;
				}
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += ",";
					}
				}

				//console.log(contactList);
				var listContact = contactList.split(',');
				console.log(listContact);
				document.getElementsByTagName("p")[0].innerHTML = contactList;
				for(let i of listContact)
				{
					let item = document.createElement("li");
					item.innerHTML = i;
					list.appendChild(item);
					let btnEdit = document.createElement('button');
					btnEdit.class = "btn";
					list.appendChild(btnEdit);
					let btnDel = document.createElement('button');
					btnDel.class = "btn";
					list.appendChild(btnDel);
				}
				document.getElementById("contactsList").replaceChildren(list);
				document.getElementById("contactsList").rep
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function loadAllContacts()
{
	let srch = "";
	document.getElementById("contactSearchResult").innerHTML = "";

	var list = document.createElement("ul");
	document.getElementById("contactsList").appendChild(list);

	let contactList = "";

	let tmp = {search:srch,userid:userId};
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
						contactList += ",";
					}
				}
				//console.log(contactList);
				var listContact = contactList.split(',');
				console.log(listContact);
				document.getElementsByTagName("p")[0].innerHTML = contactList;
				for(let i of listContact)
				{
					let item = document.createElement("li");
					item.innerHTML = i;
					list.appendChild(item);
					
				}
				document.getElementById("contactsList").replaceChildren(list);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}*/

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
/*
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
 }*/

 function notLoadAllContacts()
 {
	clearContactsTable();
	let srch = document.getElementById("searchText").value;

	if(srch === "")
	{
		clearContactsTable();
		return;
	}

	let tmp = {search:srch,userid:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

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
				if(jsonObject.id == "0")
				{
					clearContactsTable();
					return;
				}
				fillTable(jsonObject,true);
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){}
 }

 function loadContacts()
{
	clearContactsTable();
	let contactCount = 0;
	let contactFirstName = "";
	let contactLastName = "";
	let contactEmail = "";
	let contactPhone = "";
	let srch = document.getElementById("searchText").value;

	let tmp = {search:srch,userid:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

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

				fillTable(jsonObject,true);
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){}
}

function fillTable(jsonObject, isActionEnable)
{
	const table = document.getElementById('contactListTable');

	const contactCount = jsonObject.contactCount;
	const cId = jsonObject.cId;
	const contactFirstName = jsonObject.firstNames;
	const contactLastName = jsonObject.lastNames;
	const contactEmail = jsonObject.emails;
	const contactPhone = jsonObject.phoneNumbers;
	
	for(var i = 0; i < contactCount; i++){
		table.append(addRowToTable(cId[i], contactFirstName[i], contactLastName[i], contactPhone[i], contactEmail[i], isActionEnable));
	}
}

function addRowToTable(cId,firstName,lastName,phone,email,isActionEnable)
{
	const row = document.createElement('tr');
	const checkBoxField = document.createElement('td');
	const checkBox = document.createElement('input');
	const firstNameField = document.createElement('td');
	const lastNameField = document.createElement('td');
	const emailField = document.createElement('td');
	const phoneField = document.createElement('td');	
	const acitonsField = document.createElement('td');

	row.dataset.indexNumber = cId;
	firstNameField.innerHTML = firstName;
	lastNameField.innerHTML = lastName;
	phoneField.innerHTML = phone;
	emailField.innerHTML = email;
	
	//phoneField.setAttribute('hidden', 'true');
	//emailField.setAttribute('hidden', 'true');	

	checkBox.type = 'checkBox';	
	checkBox.id = 'checkbox1';	
	checkBox.checked = false;
	checkBox.setAttribute('onclick', 'onCheckBox(this);');	
	const checkBoxSpan = document.createElement('span');
	checkBoxSpan.class = "custom-checkbox";
	checkBoxSpan.append(checkBox);
	checkBoxField.append(checkBoxSpan);

	const aEditTag = document.createElement('a');
	aEditTag.id = "editContact" + cId;
	if(isActionEnable == true){
		aEditTag.setAttribute('onclick', 'onEditContact(this.id);');			
		aEditTag.innerHTML = '<a href="#editContact" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">edit</i></a>';//&#xE254;
	}
	else
		aEditTag.innerHTML = '<a class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">edit</i></a>';//&#xE254;

	const aDeleteTag = document.createElement('a');
	aDeleteTag.id = "deleteContact" + cId;
	aDeleteTag.setAttribute('onclick', 'onDeleteContact(this.id);');		
	aDeleteTag.innerHTML = '<a href="#deleteContact" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">delete</i></a>';//&#xE92E;

	acitonsField.append(aEditTag);
	acitonsField.append(aDeleteTag);

	row.append(checkBoxField);
	row.append(firstNameField);
	row.append(lastNameField);
	row.append(emailField);
	row.append(phoneField);
	row.append(acitonsField);

	return row;
}

function onCheckBox(checkBoxObj){
	console.log(checkBoxObj);
	if(!checkBoxObj.checked){
		$("#selectAll").prop("checked", false);
	}
}

function onEditContact(id){
	//console.log(id);
	updateContactField(id);	
}

function updateContactField(id) {
	const row = document.getElementById(id).parentElement.parentElement;

	document.getElementById('firstName').dataset.id = id;
	document.getElementById('firstName').dataset.indexNumber = row.dataset.indexNumber;	
	document.getElementById('firstName').value = row.childNodes[1].innerHTML;
	document.getElementById('lastName').value = row.childNodes[2].innerHTML;
	document.getElementById('email').value = row.childNodes[3].innerHTML;
	document.getElementById('phoneNumber').value = row.childNodes[4].innerHTML;
	
	//document.getElementById('userName').innerHTML = row.childNodes[0].innerHTML + ' ' + row.childNodes[1].innerHTML;

	//deleteInfoFromEditFields();
}

function editContact()
{
   let newFirstName = document.getElementById("firstName").value;
   let newLastName = document.getElementById("lastName").value;
   let newEmail = document.getElementById("email").value;
   let phoneNumber = document.getElementById("phoneNumber").value;
   const cId = document.getElementById('firstName').dataset.indexNumber;
   const row = document.getElementById(document.getElementById('firstName').dataset.id).parentElement.parentElement;

   if(newFirstName == "" || newLastName == "" || newEmail == "" || phoneNumber == "" || row==null)
	{
		return;
	}

   document.getElementById("editResult").innerHTML = "";

   let tmp = {userid:userId/*, cid:cId*/, firstname:newFirstName, lastname:newLastName, email:newEmail, phone:phoneNumber}
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
				   //clearContactsTable();
				   row.childNodes[1].innerHTML = document.getElementById('firstName').value;
				   row.childNodes[2].innerHTML = document.getElementById('lastName').value;
				   row.childNodes[3].innerHTML = document.getElementById('email').value;
				   row.childNodes[4].innerHTML = document.getElementById('phoneNumber').value;

				   //loadContacts();
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
// clear up all the contacts from the table
function clearContactsTable() {
	const parent = document.getElementById('contactListTable');

	if(parent == null)
		return;
	while (parent.firstChild) {
		parent.firstChild.remove();
	}
}

function clearAddForm() {
	document.getElementById('newContactFirstName').value = '';
	document.getElementById('newContactLastName').value = '';
	document.getElementById('newContactEmail').value = '';
	document.getElementById('newContactPhoneNumber').value = '';	
}

function getSelRowIdsRemove(cId){
	const parent = document.getElementById('contactListTable');

	let row;
	let count = 0;
	let cIds = ",";
	row = parent.firstChild;
	while (row){		
		if(cId >0 && row.dataset.indexNumber == cId){
			row.remove();
			cIds += cId + ",";
			break;
		}			
		let temprow = row.nextSibling;
		if(row.firstChild.firstChild.firstChild.checked == true)
		{	
			cIds+= row.dataset.indexNumber + ",";
			row.remove();
		}
		row = temprow;
		//parent.firstChild.remove();
		
	}

	return cIds;	
}

function onDeleteContact(id){	
	const row = document.getElementById(id).parentElement.parentElement;

	document.getElementById('contactDeleteResult').dataset.indexNumber = row.dataset.indexNumber;	
}

function deleteContact() {
	document.getElementById("contactDeleteResult").innerHTML = "";

	
	const cId = document.getElementById('contactDeleteResult').dataset.indexNumber;
	console.log(cId);
	
	let cIds = "\'" + getSelRowIdsRemove(cId) + "\'";
	
	if(cIds.length <= 3)
		return;
	
	let tmp = {cIds:cIds, userid:userId};
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
				let resultDelete = jsonObject.match("deleted");
				console.log(resultDelete);
				//alert(jsonObject);

				if(resultDelete == null)
				{				
					document.getElementById("contactDeleteResult").innerHTML = "Deletion Failed";					
					loadContacts();
				}
				else
				{				
					document.getElementById("contactDeleteResult").innerHTML = "Deletion Successful";
					document.getElementById('contactDeleteResult').dataset.indexNumber = -1;
					$("#selectAll").prop("checked", false);
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