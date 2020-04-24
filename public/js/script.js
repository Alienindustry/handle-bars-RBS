//console.log('test');

const usernamefield = document.querySelector('#username');
const signUpSubmit = document. querySelector('#signUpSubmit')
const password - Document.querySelector("#signUpsubmit");

signUpSubmit.addEventListener('click', (e) =>{
   if(usernamefield.value) === ''){
       e.preventDefault();
       window.alert('Form Requires username');
   }
   if(password.value ! = confirmPassword.value)
       e.preventDefault
      window.alert('Form Requires username');

});