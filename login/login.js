//console.log(options);

function onFormSubmit(e) {
	e.preventDefault();

	var form = document.forms.login;
	data = { 'username': form.username.value, 'password': form.password.value, 'options': options };

	fetch("/login?response_type=login", {
		method: 'POST',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	}).then(res => {
		res.json().then(json => {
			console.log(json);
			window.location.href = `${options.redirect_uri}?code=${json.code}&state=${options.state}`;
		});
	});
}