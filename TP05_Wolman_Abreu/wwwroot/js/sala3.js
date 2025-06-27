// Coordenadas de la ruta correcta (alfombra)
const rutaCorrecta = [
    {x:0, y:3}, {x:1, y:3}, {x:2, y:3}, {x:3, y:3}, {x:4, y:3}, {x:4, y:2}, {x:4, y:1}, {x:4, y:0}
];
let progreso = 0;

function esBaldosaCorrecta(x, y) {
    return rutaCorrecta[progreso] && rutaCorrecta[progreso].x == x && rutaCorrecta[progreso].y == y;
}

document.querySelectorAll('.baldosa').forEach(baldosa => {
    baldosa.addEventListener('click', function() {
        const x = parseInt(this.getAttribute('data-x'));
        const y = parseInt(this.getAttribute('data-y'));
        if (this.id === 'huevo' && progreso === rutaCorrecta.length - 1) {
            // Llegó al huevo dorado
            window.location.href = '/Home/Sala4';
            return;
        }
        if (esBaldosaCorrecta(x, y)) {
            progreso++;
            document.getElementById('audio-paso').play();
            this.style.outline = '2px solid green';
        } else {
            document.getElementById('audio-dragon').play();
            setTimeout(() => { window.location.reload(); }, 1200);
        }
    });
}); 