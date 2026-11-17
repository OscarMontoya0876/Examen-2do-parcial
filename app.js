// Registro e inicio de sesión sencillo (se guarda en el navegador)
var usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
var sesion = JSON.parse(localStorage.getItem('sesion') || 'null');
var modo = 'registro';

function guardar() {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  localStorage.setItem('sesion', JSON.stringify(sesion));
}

function pintar() {
  document.getElementById('usuario').textContent = sesion ? 'Hola, ' + sesion.nombre : 'Sin sesión iniciada';
  var zona = document.getElementById('zona');
  if (!zona) return;
  if (sesion) {
    zona.innerHTML = '<div class="bienvenida"><h3></h3><p></p><a class="btn" href="bebidas.html">Ver bebidas</a><button class="btn" id="salir">Cerrar sesión</button></div>';
    zona.querySelector('h3').textContent = '¡Bienvenido(a), ' + sesion.nombre + '!';
    zona.querySelector('p').textContent = 'Sesión iniciada con: ' + sesion.correo;
    document.getElementById('salir').onclick = function () { sesion = null; modo = 'ingreso'; guardar(); pintar(); };
    return;
  }
  var reg = modo === 'registro';
  zona.innerHTML = '<form id="f"><div class="tabs"><button type="button" id="tr" class="' + (reg ? 'on' : '') + '">Registro</button><button type="button" id="ti" class="' + (reg ? '' : 'on') + '">Iniciar sesión</button></div>' +
    (reg ? '<label>Nombre</label><input id="n">' : '') +
    '<label>Correo</label><input id="c" type="email"><label>Contraseña</label><input id="p" type="password">' +
    '<button class="btn" type="submit">' + (reg ? 'Crear cuenta' : 'Ingresar') + '</button><div id="msg"></div></form>';
  document.getElementById('tr').onclick = function () { modo = 'registro'; pintar(); };
  document.getElementById('ti').onclick = function () { modo = 'ingreso'; pintar(); };
  document.getElementById('f').onsubmit = enviar;
}

function enviar(e) {
  e.preventDefault();
  var msg = document.getElementById('msg');
  var c = document.getElementById('c').value.trim().toLowerCase();
  var p = document.getElementById('p').value;
  if (!c || p.length < 4) { msg.textContent = 'Escribe un correo y una contraseña de 4 o más caracteres.'; return; }
  if (modo === 'registro') {
    var n = document.getElementById('n').value.trim();
    if (!n) { msg.textContent = 'Escribe tu nombre.'; return; }
    if (usuarios.some(function (u) { return u.correo === c; })) { msg.textContent = 'Ese correo ya está registrado.'; return; }
    sesion = { nombre: n, correo: c, pass: p };
    usuarios.push(sesion);
  } else {
    sesion = usuarios.filter(function (u) { return u.correo === c && u.pass === p; })[0];
    if (!sesion) { msg.textContent = 'Correo o contraseña incorrectos.'; return; }
  }
  guardar();
  pintar();
}

pintar();
