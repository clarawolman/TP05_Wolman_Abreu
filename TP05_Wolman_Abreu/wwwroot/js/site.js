// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

// Timer del juego
let gameTimer = null;
let isTimerPaused = false;
const TIMER_KEY = 'escapeRoomTimeLeft';
const TIMER_STARTED_KEY = 'escapeRoomTimerStarted';
const INITIAL_TIME = 20 * 60; // 20 minutos en segundos

function getTimeLeft() {
    let stored = sessionStorage.getItem(TIMER_KEY);
    return stored !== null ? parseInt(stored) : INITIAL_TIME;
}

function setTimeLeft(val) {
    sessionStorage.setItem(TIMER_KEY, val);
}

function startTimer() {
    if (gameTimer) return; // Ya está corriendo
    gameTimer = setInterval(() => {
        if (!isTimerPaused) {
            let timeLeft = getTimeLeft();
            timeLeft--;
            setTimeLeft(timeLeft);
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(gameTimer);
                gameTimer = null;
                sessionStorage.removeItem(TIMER_KEY);
                sessionStorage.removeItem(TIMER_STARTED_KEY);
                window.location.href = '/Home/tiempoTerminado';
            }
        }
    }, 1000);
}

function pauseTimer() {
    isTimerPaused = true;
}

function resumeTimer() {
    isTimerPaused = false;
}

function updateTimerDisplay() {
    let timeLeft = getTimeLeft();
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function updateSalaCounter(salaActual) {
    const counterElement = document.getElementById('sala-counter');
    if (counterElement) {
        if (window.location.pathname.includes('Ganaste')) {
            counterElement.textContent = 'Juego terminado!';
        } else {
            counterElement.textContent = `Sala ${salaActual}/4`;
        }
    }
}

// Iniciar timer cuando se carga la página (si no está en páginas que lo ocultan)
document.addEventListener('DOMContentLoaded', function() {
    const hideHeader = document.querySelector('.hide-game-header');
    const path = window.location.pathname;
    let salaActual = 1;
    if (path.includes('Sala1')) salaActual = 1;
    else if (path.includes('Sala2')) salaActual = 2;
    else if (path.includes('Sala3')) salaActual = 3;
    else if (path.includes('Sala4')) salaActual = 4;
    else if (path.includes('SalaMemotest')) salaActual = 2;
    updateSalaCounter(salaActual);

    // Solo inicializar timer si no está en páginas ocultas
    if (!hideHeader) {
        // Si es la sala 1 y el timer no está iniciado, inicializarlo
        if (salaActual === 1 && !sessionStorage.getItem(TIMER_STARTED_KEY)) {
            setTimeLeft(INITIAL_TIME);
            sessionStorage.setItem(TIMER_STARTED_KEY, '1');
        }
        updateTimerDisplay();
        startTimer();
    }
    // Pausar timer en la página de ganaste
    if (window.location.pathname.includes('Ganaste')) {
        pauseTimer();
    }
    // Si estamos en una página oculta o en el inicio, limpiar timer
    if (hideHeader && !window.location.pathname.includes('Ganaste')) {
        sessionStorage.removeItem(TIMER_KEY);
        sessionStorage.removeItem(TIMER_STARTED_KEY);
    }
});
