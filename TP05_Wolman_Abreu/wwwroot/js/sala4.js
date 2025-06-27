// Zonas y hechizos correctos
const zonas = [
    {id:'cueva', correcto:'reparo'},
    {id:'naufragio', correcto:'finite'},
    {id:'roca', correcto:'alohomora'},
    {id:'algas', correcto:'lumos'},
    {id:'puerta', correcto:'wingardium'}
];
let hechizosColocados = {};
let dragging = null;

// Drag & Drop
const hechizos = document.querySelectorAll('.hechizo');
hechizos.forEach(h => {
    h.addEventListener('dragstart', e => {
        dragging = h;
        h.classList.add('dragging');
    });
    h.addEventListener('dragend', e => {
        dragging = null;
        h.classList.remove('dragging');
    });
});

document.querySelectorAll('.zona').forEach(zona => {
    zona.addEventListener('dragover', e => {
        e.preventDefault();
        zona.style.background = 'rgba(0,0,0,0.4)';
    });
    zona.addEventListener('dragleave', e => {
        zona.style.background = '';
    });
    zona.addEventListener('drop', e => {
        e.preventDefault();
        zona.style.background = '';
        if (dragging) {
            zona.innerHTML = dragging.innerHTML;
            hechizosColocados[zona.id] = dragging.getAttribute('data-hechizo');
            validarHechizos();
        }
    });
});

function validarHechizos() {
    let correctos = 0;
    let totalColocados = 0;
    zonas.forEach(z => {
        const zonaElem = document.getElementById(z.id);
        if (hechizosColocados[z.id] === z.correcto) {
            zonaElem.classList.add('correcta');
            zonaElem.classList.remove('incorrecta');
            correctos++;
        } else if (hechizosColocados[z.id]) {
            zonaElem.classList.add('incorrecta');
            zonaElem.classList.remove('correcta');
            totalColocados++;
        } else {
            zonaElem.classList.remove('correcta','incorrecta');
        }
        if (hechizosColocados[z.id]) totalColocados++;
    });
    if (totalColocados === zonas.length) {
        if (correctos === zonas.length) {
            document.getElementById('feedback').innerHTML = '<b>¡Mapa completado! Ahora sigue la secuencia del duende acuático.</b>';
            setTimeout(iniciarSecuencia, 1200);
        } else {
            animacionError();
        }
    }
}

function animacionError() {
    document.getElementById('audio-error').play();
    document.getElementById('feedback').innerHTML = '<span style="color:red">¡Magia fallida! Reintenta.</span>';
    setTimeout(() => {
        document.getElementById('feedback').innerHTML = '';
        // Reset zonas
        zonas.forEach(z => {
            document.getElementById(z.id).innerHTML = z.id.charAt(0).toUpperCase()+z.id.slice(1);
            document.getElementById(z.id).classList.remove('correcta','incorrecta');
        });
        hechizosColocados = {};
    }, 1500);
}

// Secuencia del duende acuático
const secuenciaOpciones = ['lumos','reparo','finite','alohomora','wingardium'];
let secuencia = [];
let respuestaSecuencia = [];
function iniciarSecuencia() {
    document.getElementById('secuencia-container').style.display = '';
    secuencia = [];
    respuestaSecuencia = [];
    for(let i=0;i<3+Math.floor(Math.random()*2);i++){
        secuencia.push(secuenciaOpciones[Math.floor(Math.random()*secuenciaOpciones.length)]);
    }
    mostrarSecuencia();
    mostrarOpcionesSecuencia();
}
function mostrarSecuencia() {
    const cont = document.getElementById('secuencia-hechizos');
    cont.innerHTML = '';
    secuencia.forEach(h => {
        cont.innerHTML += `<img src="/images/hechizo_${h}.png" alt="?" />`;
    });
}
function mostrarOpcionesSecuencia() {
    const cont = document.getElementById('opciones-secuencia');
    cont.innerHTML = '';
    secuenciaOpciones.forEach(h => {
        const img = document.createElement('img');
        img.src = `/images/hechizo_${h}.png`;
        img.alt = h;
        img.onclick = () => seleccionarHechizoSecuencia(h, img);
        cont.appendChild(img);
    });
}
function seleccionarHechizoSecuencia(h, img) {
    if(respuestaSecuencia.length>=secuencia.length) return;
    respuestaSecuencia.push(h);
    img.classList.add('selected');
    if(respuestaSecuencia.length===secuencia.length){
        validarSecuencia();
    }
}
function validarSecuencia() {
    let ok = true;
    for(let i=0;i<secuencia.length;i++){
        if(secuencia[i]!==respuestaSecuencia[i]) ok=false;
    }
    if(ok){
        document.getElementById('audio-exito').play();
        document.getElementById('feedback-secuencia').innerHTML = '<b>¡Secuencia correcta! Has conseguido la poción de oxígeno y avanzás.</b>';
        setTimeout(()=>{ window.location.href = '/Home/Sala5'; }, 1800);
    }else{
        document.getElementById('audio-error').play();
        document.getElementById('feedback-secuencia').innerHTML = '<span style="color:red">¡Secuencia incorrecta! Intenta de nuevo.</span>';
        setTimeout(()=>{
            document.getElementById('feedback-secuencia').innerHTML = '';
            respuestaSecuencia = [];
            document.querySelectorAll('#opciones-secuencia img').forEach(img=>img.classList.remove('selected'));
        }, 1500);
    }
} 