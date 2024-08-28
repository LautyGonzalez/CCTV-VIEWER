const agregarCamaraBtn = document.getElementById('agregarCamara');
const modalAgregar = document.getElementById('hideModal');
const modalEditar = document.getElementById('CameraModalHide');
const btnAgregarCamara = document.getElementById('AddCameraButton');
const contenedor = document.querySelector(".viewer-grid");
const nombreCamaraInput = document.getElementById('Nombre-Camera');
const sourceCamaraInput = document.getElementById('Source-Camera');

agregarCamaraBtn.addEventListener('click', () => {
    modalAgregar.classList.toggle('modalShow');
});


function guardarCamarasEnLocalStorage(camaras) {
    localStorage.setItem('camaras', JSON.stringify(camaras));
}


function cargarCamarasDesdeLocalStorage() {
    const camaras = JSON.parse(localStorage.getItem('camaras')) || [];
    camaras.forEach(camara => crearCamara(camara.nombre, camara.src));
}


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


    cameraWrapper.addEventListener('click', () => {
        mostrarModalEdicion(cameraWrapper, cameraImg, cameraName);
    });
}


function mostrarModalEdicion(cameraWrapper, cameraImg, cameraName) {
    modalEditar.classList.add('modalShow');

    const modalCameraImg = document.getElementById("modalCameraLive");
    const modalCameraName = document.getElementById("modalCameraName");
    const modalCameraSource = document.getElementById("modalCameraSource");

    modalCameraImg.src = cameraImg.src;
    modalCameraName.value = cameraName.textContent;
    modalCameraSource.value = cameraImg.src;


    const saveChangesButton = document.getElementById("SaveChangesButton");
    saveChangesButton.onclick = () => {
        const nuevoNombre = modalCameraName.value;
        const nuevoSrc = modalCameraSource.value;

        cameraName.textContent = nuevoNombre;
        cameraImg.src = nuevoSrc;

        actualizarCamaraEnLocalStorage(cameraName.textContent, nuevoNombre, nuevoSrc);

        modalEditar.classList.remove('modalShow');
    };
}


function guardarCamaraEnLocalStorage(nombre, src) {
    const camaras = JSON.parse(localStorage.getItem('camaras')) || [];
    camaras.push({ nombre, src });
    guardarCamarasEnLocalStorage(camaras);
}


function actualizarCamaraEnLocalStorage(nombreOriginal, nombreNuevo, srcNuevo) {
    const camaras = JSON.parse(localStorage.getItem('camaras')) || [];
    const camarasActualizadas = camaras.map(camara =>
        camara.nombre === nombreOriginal ? { nombre: nombreNuevo, src: srcNuevo } : camara
    );
    guardarCamarasEnLocalStorage(camarasActualizadas);
}


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


const closeModalButton = document.getElementById('CloseModalButton');
closeModalButton.addEventListener('click', () => {
    modalEditar.classList.remove('modalShow');
});


window.onload = cargarCamarasDesdeLocalStorage;
