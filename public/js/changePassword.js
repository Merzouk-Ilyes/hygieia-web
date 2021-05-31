
const password = document.getElementById('apassword');
const btn = document.getElementById('btn');

const passwordnew1 = document.getElementById('npassword');

const passwordnew2 = document.getElementById('npassword2');

if (btn)
	btn.addEventListener('click', e => {

		e.preventDefault();
		checkInputs();
	});
function checkInputs() {
	// trim to remove the whitespaces
	const passwordValue = password.value.trim();
	const passwordn = passwordnew1.value.trim();
	const passwordn2 = passwordnew2.value.trim();
	if (passwordValue === '' || passwordValue.length < 8) {
		setErrorFor(password, 'Entrer votre correct mot de passe');
		return;
	} else {
		setSuccessFor(password);
	}
	if (passwordn.length < 8) {
		setErrorFor(passwordnew1, 'Vous devez remplir votre nouveau mot de passe');
		return; 

	} else {
		setSuccessFor(passwordnew1);
	}
	if (passwordn2 !== passwordn || passwordn2.length == 0) {
		setErrorFor(passwordnew2, 'Entrer le mème mot de passe');
	} else {
		setSuccessFor(passwordnew2);

		const loadingElement = document.querySelector('#loader');
		loadingElement.className = 'lds-facebook run';
		btn.className = "btn notshow";
		$.ajax({
			method: 'POST',
			url: '/users/changePassword',
			data: {
				"password": passwordValue,
				"password2": passwordn,
			},
			success: function (result) {
				setTimeout(() => {
					loadingElement.className = 'lds-facebook stop';
					btn.className = "btn show";
					if (result.message == "error") {
						if (result.error == "Account d'ont exists") {
							setErrorFor(passwordnew2, 'Compte inexistant');
						} else if (result.error ===
							"invalid old password") {
								setErrorFor(passwordnew2, 'Mot de passe incorrect,vous devez Réssayer');
						} 

					} else {
						$('.alert').addClass("show");
	$('.alert').removeClass("hide");
	$('.alert').addClass("showAlert");
	setTimeout(function(){
	  $('.alert').removeClass("show");
	  $('.alert').addClass("hide");
	},5000);
						passwordnew2.value = "";
						passwordnew1.value = "";
						password.value = "";

					}
				}, 5000);





			}
		})


	}

}
function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}
