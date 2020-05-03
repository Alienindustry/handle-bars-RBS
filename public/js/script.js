//console.log('test');

const username = document.querySelector("#username");
const signUpSubmit = document.querySelector("#signUpSubmit");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");

if (typeof signUpSubmit != "underfined" && signUpSubmit != null) {
  signUpSubmit.addEventListener("click", (e) => {
    if (username.value === "") {
      e.preventDefault();
      window.alert("Form Requires username");
    }
    if (password.value != confirmPassword.value) {
      e.preventDefault();
      window.alert("Passwords do not match");
    }
  });
}

const messageContainer = document.querySelector(".messagecontainer");
const queryString = window.location.search;

if (queryString == "?incorrectlogin") {
  messageContainer.innerHTML = `<div class="card-panel red"> Incorrect  log in Details</div>`;
}

if (queryString == "?contactSaved") {
    messageContainer.innerHTML = `<div class="card-panel green"> Contact Saved</div>`;
  }
  
