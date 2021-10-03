console.log(options);

function onFormSubmit(e) {
	e.preventDefault();

	var form = document.forms.login;
	data = { username: form.username.value, password: form.password.value, clientid: options.client_id };

	fetch("/login", {
		method: 'POST',
		mode: 'same-origin', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
		  'Content-Type': 'application/json'
		  // 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *client
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	  }).then(ressponse => window.location.href = '/');
}