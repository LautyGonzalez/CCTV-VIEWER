var Formulario = document.getElementById("formLog");

Formulario.addEventListener("submit", function(event){
    event.preventDefault();

    var FormUsuario = document.getElementById("loginUser").value;
    var FormPasswd = document.getElementById("loginPwd").value;

    console.log(FormPasswd)
    console.log(FormUsuario)
    if(FormUsuario == "admin" && FormPasswd == "123456"){ //Completamente inseguro, es solo para la prueba y la entrega del tp
        window.location.href = './home.html'; 
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});