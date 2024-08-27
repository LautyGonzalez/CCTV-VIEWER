// Obtener los elementos del DOM
const agregarCamaraBtn = document.getElementById('agregarCamara');
const modalAgregar = document.getElementById('hideModal');
const modalEditar = document.getElementById('CameraModalHide');
const btnAgregarCamara = document.getElementById('AddCameraButton');
const contenedor = document.querySelector(".viewer-grid");
const nombreCamaraInput = document.getElementById('Nombre-Camera');
const sourceCamaraInput = document.getElementById('Source-Camera');

// Función para mostrar/ocultar el modal de agregar cámara
agregarCamaraBtn.addEventListener('click', () => {
    modalAgregar.classList.toggle('modalShow');
});

// Función para guardar las cámaras en localStorage
function guardarCamarasEnLocalStorage(camaras) {
    localStorage.setItem('camaras', JSON.stringify(camaras));
}

// Función para cargar las cámaras desde localStorage
function cargarCamarasDesdeLocalStorage() {
    const camaras = JSON.parse(localStorage.getItem('camaras')) || [];
    camaras.forEach(camara => crearCamara(camara.nombre, camara.src));
}

// Función para crear una cámara
function crearCamara(nombre, src) {
    const cameraWrapper = document.createElement('div');
    cameraWrapper.className = 'CameraWrapper';

    const cameraView = document.createElement('div');
    cameraView.className = 'CameraView';

    const cameraImg = document.createElement('img');
    cameraImg.src = src;
    cameraImg.onerror = () => {
        cameraImg.src = './img/CCTV-ERROR.jpg';
        console.log(`La conexión con la cámara "${nombre}" se ha perdido.`);
    };

    cameraView.appendChild(cameraImg);

    const cameraName = document.createElement('div');
    cameraName.className = 'CameraName';
    cameraName.textContent = nombre;

    cameraWrapper.appendChild(cameraView);
    cameraWrapper.appendChild(cameraName);

    contenedor.appendChild(cameraWrapper);

    // Añadir evento de clic para editar la cámara
    cameraWrapper.addEventListener('click', () => {
        mostrarModalEdicion(cameraWrapper, cameraImg, cameraName);
    });
}

// Función para mostrar el modal de edición de cámara
function mostrarModalEdicion(cameraWrapper, cameraImg, cameraName) {
    modalEditar.classList.add('modalShow');

    const modalCameraImg = document.getElementById("modalCameraLive");
    const modalCameraName = document.getElementById("modalCameraName");
    const modalCameraSource = document.getElementById("modalCameraSource");

    // Establecer valores iniciales en el modal
    modalCameraImg.src = cameraImg.src;
    modalCameraName.value = cameraName.textContent;
    modalCameraSource.value = cameraImg.src;

    // Guardar cambios al hacer clic en el botón de guardar
    const saveChangesButton = document.getElementById("SaveChangesButton");
    saveChangesButton.onclick = () => {
        const nuevoNombre = modalCameraName.value;
        const nuevoSrc = modalCameraSource.value;

        cameraName.textContent = nuevoNombre;
        cameraImg.src = nuevoSrc;

        // Actualizar en localStorage
        actualizarCamaraEnLocalStorage(cameraName.textContent, nuevoNombre, nuevoSrc);

        modalEditar.classList.remove('modalShow');
    };
}

// Función para guardar una nueva cámara en localStorage
function guardarCamaraEnLocalStorage(nombre, src) {
    const camaras = JSON.parse(localStorage.getItem('camaras')) || [];
    camaras.push({ nombre, src });
    guardarCamarasEnLocalStorage(camaras);
}

// Función para actualizar una cámara en localStorage
function actualizarCamaraEnLocalStorage(nombreOriginal, nombreNuevo, srcNuevo) {
    const camaras = JSON.parse(localStorage.getItem('camaras')) || [];
    const camarasActualizadas = camaras.map(camara =>
        camara.nombre === nombreOriginal ? { nombre: nombreNuevo, src: srcNuevo } : camara
    );
    guardarCamarasEnLocalStorage(camarasActualizadas);
}

// Evento para agregar una nueva cámara
btnAgregarCamara.addEventListener('click', () => {
    const nombre = nombreCamaraInput.value;
    const src = sourceCamaraInput.value;

    if (nombre && src) {
        crearCamara(nombre, src);
        guardarCamaraEnLocalStorage(nombre, src);

        modalAgregar.classList.remove('modalShow');
        nombreCamaraInput.value = '';
        sourceCamaraInput.value = '';
    }
});

// Evento para cerrar el modal de edición
const closeModalButton = document.getElementById('CloseModalButton');
closeModalButton.addEventListener('click', () => {
    modalEditar.classList.remove('modalShow');
});

// Cargar cámaras al iniciar
window.onload = cargarCamarasDesdeLocalStorage;
