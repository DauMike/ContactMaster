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
				console.log( xhr.responseText );
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
		document.getElementById("userName").dataset.indexNumber = userId;
	}
}
/*
function loadContacts()
{
	clearContactsTable();
	let contactCount = 0;
	let contactFirstName = "";
	let contactLastName = "";
	let contactEmail = "";
	let contactPhone = "";

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

				// contactCount = jsonObject.contactCount;
				// contactFirstName = jsonObject.firstNames;
				// contactLastName = jsonObject.lastNames;
				// contactEmail = jsonObject.emails;
				// contactPhone = jsonObject.phoneNumbers;

				// const JSONArray = JSON.parse(xhr.responseText);

				// for (let i = 0; i < JSONArray.length; i++) {
				// 	addContactToTable(JSONArray[i]);
				// }

				fillTable(jsonObject,true);
				//display(contactCount, contactFirstName, contactLastName, contactEmail, contactPhone);

				alert(contactCount);
				alert(contactFirstName);
				alert(contactLastName);
				alert(contactEmail);
				alert(contactPhone);
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("loadingContactsResults").innerHTML = err.message;		
	}
}*/

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

function fillTable(jsonObject, isActionEnable)
{
	const table = document.getElementById('contactListTable');

	const contactCount = jsonObject.contactCount;
	const cId = jsonObject.cid;
	const contactFirstName = jsonObject.firstNames;
	const contactLastName = jsonObject.lastNames;
	const contactEmail = jsonObject.emails;
	const contactPhone = jsonObject.phoneNumbers;
	
	for(var i = 0; i < contactCount; i++){
		table.append(addRowToTable(cId[i], contactFirstName[i], contactLastName[i], contactPhone[i], contactEmail[i], isActionEnable));
	}
	//return table;
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

   let tmp = {/*userid:userId,*/ cid:cId, firstname:newFirstName, lastname:newLastName, email:newEmail, phone:phoneNumber}
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

function display(contactCount, contactFirstName, contactLastName, contactEmail, contactPhone) {
    // get handle on div
	var container = document.getElementById('contactListTable');
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
	var fieldName = document.createElement('th');
	fieldName.textContent = "Name"
	hrow.appendChild(fieldName);
	var fieldLast = document.createElement('th');
	fieldLast.textContent = "Last Name"
	hrow.appendChild(fieldLast);
	var fieldEmail = document.createElement('th');
	fieldEmail.textContent = "Email"
	hrow.appendChild(fieldEmail);
	var fieldPhone = document.createElement('th');
	fieldPhone.textContent = "Phone"
	hrow.appendChild(fieldPhone);
	thead.appendChild(hrow);
	tbody.appendChild(hrow);
    // loop array
    for (i = 0; i < contactCount; i++) {
        // create tr element
        var row = document.createElement('tr');
		// create td element
		var cellFirst = document.createElement('td');
		// set text
		cellFirst.textContent = contactFirstName[i];
		// append td to tr
		row.appendChild(cellFirst);
//			containerFirst.appendChild(cellFirst);
		var cellLast = document.createElement('td');
		// set text
		cellLast.textContent = contactLastName[i];
		// append td to tr
		row.appendChild(cellLast);
//			containerLast.appendChild(cellLast);
		var cellEmail = document.createElement('td');
		// set text
		cellEmail.textContent = contactEmail[i];
		// append td to tr
		row.appendChild(cellEmail);
//			containerEmail.appendChild(cellEmail);
		var cellPhone = document.createElement('td');
		// set text
		cellPhone.textContent = contactPhone[i];
		// append td to tr
		row.appendChild(cellPhone);
//			containerPhone.appendChild(cellPhone);
        //append tr to tbody
        tbody.appendChild(row);
//		container.appendChild(row);
    }
    // append tbody to table
	table.appendChild(tbody);
    // append table to container
    container.appendChild(table);
}
//display();

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

function clearAddForm() {
	document.getElementById('newContactFirstName').value = '';
	document.getElementById('newContactLastName').value = '';
	document.getElementById('newContactEmail').value = '';
	document.getElementById('newContactPhoneNumber').value = '';	
}

function addContact()
{
	let firstName = document.getElementById("newContactFirstName").value;
	let lastName = document.getElementById("newContactLastName").value;
	let email = document.getElementById("newContactEmail").value;
	let phoneNumber = document.getElementById("newContactPhoneNumber").value;

	if(firstName == "" || lastName == "" || email == "" || phoneNumber == "")
	{
		return;
	}

	phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');

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
				const cId = jsonObject.newId;
				//let resultAdd = jsonObject.match("create");
				if(cId < 0)//if(resultAdd == null)
				{					
					document.getElementById("newContactResult").innerHTML = "User already exists or adding failed.";					
					//return;
				}
				else
				{
					//clearAddForm();
					document.getElementById("newContactResult").innerHTML = "Contact Added";
					let newRow = addRowToTable(cId, firstName, lastName, phoneNumber, email, true);
					document.getElementById("contactListTable").append(newRow);

					//clearContactsTable();
					//loadContacts();
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

function searchContact()
{
   let searchFirstName = document.getElementById("searchFirstName").value;
   let searchLastName = document.getElementById("searchLastName").value;
   let searchEmail = document.getElementById("searchEmail").value;
   let searchPhone = document.getElementById("searchPhone").value;
   	
	//let contactList = "";
	if(searchFirstName == '' && searchLastName == '' && searchEmail == '' && searchPhone == ''){
		loadContacts();
		const addButton = document.getElementById("btnAddContact");
		addButton.setAttribute("href","#addContact");
		return;
	}
	let tmp = {firstName:searchFirstName,lastName:searchLastName,email:searchEmail,phoneNumber:searchPhone,userid:userId};
	let jsonPayload = JSON.stringify( tmp );

	const url = urlBase + '/Search.' + extension;
	
	const xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	//console.log(xhr);
	try
	{
		xhr.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200) 
			{
				//document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";

				clearContactsTable();
				let jsonObject = JSON.parse( xhr.responseText );
				fillTable(jsonObject, false);			
				
				const addButton = document.getElementById("btnAddContact");
				addButton.setAttribute("href","");
												
				// for( let i=0; i<jsonObject.results.length; i++ )
				// {
				// 	contactList += jsonObject.results[i];
				// 	if( i < jsonObject.results.length - 1 )
				// 	{
				// 		contactList += "<br />\r\n";
				// 	}
				// }
				
				//document.getElementsByTagName("p")[0].innerHTML = contactList;
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
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
					window.location.href = "index.html";//"register.html";
					document.getElementById("newUserResult").innerHTML = "User Created";
				}
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("newUserResult").innerHTML = err.message;
	}
}

/*function deleteContact() {
	// get phone number
	//let phn = document.getElementById("phoneText").value;

	document.getElementById("contactDeleteResult").innerHTML = "";

	//let tmp = {Phone:phn,UserID:userId};
	let tmp = {UserID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Delete.' + extension;

	// search by phone number

	// delete contact

}
*/

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

function wrapperFunction() {
	addUser();
	window.location.href = 'index.html';
 }

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

function clearPage()
{
	clearContactsTable();
}
