// Zonas y hechizos correctos
const zonas = [
    {id:'cueva', correcto:'lumos'},
    {id:'barco', correcto:'reparo'},
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
            const hechizo = dragging.getAttribute('data-hechizo').toLowerCase().replace(/\s+/g, '');
            zona.setAttribute('data-hechizo-colocado', hechizo);
            zona.querySelector('.hechizo-colocado')?.remove();
            const span = document.createElement('span');
            span.className = 'hechizo-colocado';
            span.innerText = dragging.innerText.trim();
            zona.appendChild(span);
            hechizosColocados[zona.id] = hechizo;
            validarHechizos();
        }
    });
});

function validarHechizos() {
    let correctos = 0;
    let totalColocados = 0;
    let errores = [];
    zonas.forEach(z => {
        const zonaElem = document.getElementById(z.id);
        const hechizoColocado = (zonaElem.getAttribute('data-hechizo-colocado') || '').toLowerCase().replace(/\s+/g, '');
        const correcto = (z.correcto || '').toLowerCase().replace(/\s+/g, '');
        if (hechizoColocado === correcto) {
            zonaElem.classList.add('correcta');
            zonaElem.classList.remove('incorrecta');
            correctos++;
        } else if (hechizoColocado) {
            zonaElem.classList.add('incorrecta');
            zonaElem.classList.remove('correcta');
            errores.push(hechizoColocado);
            totalColocados++;
        } else {
            zonaElem.classList.remove('correcta','incorrecta');
        }
        if (hechizoColocado) totalColocados++;
    });
    if (totalColocados === zonas.length) {
        if (correctos === zonas.length) {
            document.getElementById('feedback').innerHTML = '<b style="color:#FFD700;font-size:1.2rem;">¡Perfecto! Has completado el mapa correctamente.</b>';
            document.getElementById('audio-exito').play();
            document.getElementById('audio-victory').play();
            setTimeout(mostrarOverlayFelicidades, 1500);
        } else {
            document.getElementById('feedback').innerHTML = '<span style="color:red">¡Magia fallida! Revisa: <br>' + errores.join('<br>') + '</span>';
            setTimeout(animacionError, 1800);
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
            <h2 style='color:#FFD700;font-family:HarryP,serif;font-size:2.2rem;margin-bottom:18px;'>¡Has completado el mapa!</h2>
            <p style='color:#fff;font-size:1.2rem;margin-bottom:28px;'>¡Eres un verdadero mago de Hogwarts!<br>Haz clic en el botón para ver tu recompensa.</p>
            <a href="/Home/Ganaste" style='font-size:1.3rem;padding:16px 38px;border-radius:16px;background:#FFD700;color:#222;font-family:HarryP,serif;border:none;cursor:pointer;box-shadow:0 2px 12px #FFD70088;font-weight:bold;text-decoration:none;display:inline-block;transition:all 0.3s ease;'>¡Felicidades!</a>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Agregar efecto hover al botón
    const boton = overlay.querySelector('a');
    boton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.6)';
    });
    boton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 12px #FFD70088';
    });
}

// Al cargar, guarda el texto original de cada zona
window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.zona').forEach(zona => {
        zona.setAttribute('data-label-original', zona.innerHTML);
    });
}); 