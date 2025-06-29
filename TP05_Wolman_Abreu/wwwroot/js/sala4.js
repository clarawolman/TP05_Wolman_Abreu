// Zonas y hechizos correctos
const zonas = [
    {id:'cueva', correcto:'lumos'},
    {id:'barco', correcto:'naufragio'},
    {id:'roca', correcto:'revelio'},
    {id:'algas', correcto:'herbivicus'},
    {id:'puerta', correcto:'alohomora'}
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
            zona.setAttribute('data-hechizo-colocado', dragging.getAttribute('data-hechizo'));
            zona.querySelector('.hechizo-colocado')?.remove();
            const span = document.createElement('span');
            span.className = 'hechizo-colocado';
            span.innerText = dragging.innerText;
            zona.appendChild(span);
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
            const zonaElem = document.getElementById(z.id);
            zonaElem.innerHTML = zonaElem.getAttribute('data-label-original') || zonaElem.id.charAt(0).toUpperCase()+zonaElem.id.slice(1);
            zonaElem.classList.remove('correcta','incorrecta');
            zonaElem.removeAttribute('data-hechizo-colocado');
        });
        hechizosColocados = {};
    }, 1500);
}

// Secuencia del duende acuático
const secuenciaOpciones = ['lumos','naufragio','revelio','herbivicus','alohomora'];
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
        document.getElementById('audio-victory').play();
        mostrarOverlayFelicidades();
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

function mostrarOverlayFelicidades() {
    let overlay = document.createElement('div');
    overlay.id = 'felicidades-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(20,20,40,0.7)';
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = 9999;
    overlay.innerHTML = `
        <div style="background:rgba(255,255,255,0.12);backdrop-filter:blur(10px);border-radius:22px;padding:40px 60px;text-align:center;box-shadow:0 0 30px #000a;">
            <h2 style='color:#FFD700;font-family:HarryP,serif;font-size:2.2rem;margin-bottom:18px;'>¡Felicidades!</h2>
            <p style='color:#fff;font-size:1.2rem;margin-bottom:28px;'>Completaste la sala 4.<br>¿Listo para continuar?</p>
            <button id='btn-continuar-sala5' style='font-size:1.3rem;padding:16px 38px;border-radius:16px;background:#FFD700;color:#222;font-family:HarryP,serif;border:none;cursor:pointer;box-shadow:0 2px 12px #FFD70088;font-weight:bold;'>Continuar a la sala 5</button>
        </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('btn-continuar-sala5').onclick = function() {
        window.location.href = '/Home/Sala5';
    };
}

// Opcional: CSS para que el hechizo colocado se vea bien
// .hechizo-colocado { font-family: 'HarryP', serif; font-size: 1.1rem; color: #fff; text-shadow: 1px 1px 4px #000; } 

// Al cargar, guarda el texto original de cada zona
window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.zona').forEach(zona => {
        zona.setAttribute('data-label-original', zona.innerHTML);
    });
}); 