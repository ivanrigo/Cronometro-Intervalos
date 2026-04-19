// Variables globales
let workTime = 20;
let restTime = 10;
let totalRounds = 8;
let currentRound = 1;
let currentTime = 0;
let isWorkPhase = true;
let isRunning = false;
let timerInterval = null;
let isPaused = false;

// Elementos del DOM
const setupPanel = document.getElementById('setupPanel');
const timerPanel = document.getElementById('timerPanel');
const timerDisplay = document.getElementById('timerDisplay');
const phaseDisplay = document.getElementById('phaseDisplay');
const currentRoundDisplay = document.getElementById('currentRound');
const totalRoundsDisplay = document.getElementById('totalRounds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const workTimeInput = document.getElementById('workTime');
const restTimeInput = document.getElementById('restTime');
const roundsInput = document.getElementById('rounds');
const workTimeValue = document.getElementById('workTimeValue');
const restTimeValue = document.getElementById('restTimeValue');
const roundsValue = document.getElementById('roundsValue');

// Función para emitir sonido de alerta
function playAlertSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 880; // Frecuencia en Hz (nota A5)
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Función para emitir sonido de finalización
function playEndSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // Frecuencia en Hz (nota C5)
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}

// Función para formatear el tiempo (segundos a MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Función para actualizar el display del temporizador
function updateDisplay() {
    timerDisplay.textContent = formatTime(currentTime);
    
    if (isWorkPhase) {
        phaseDisplay.textContent = 'TRABAJO';
        phaseDisplay.className = 'phase-display work';
    } else {
        phaseDisplay.textContent = 'DESCANSO';
        phaseDisplay.className = 'phase-display rest';
    }
    
    currentRoundDisplay.textContent = currentRound;
    totalRoundsDisplay.textContent = totalRounds;
}

// Función para cambiar de fase
function switchPhase() {
    if (isWorkPhase) {
        // Cambiar a descanso
        isWorkPhase = false;
        currentTime = restTime;
        playAlertSound();
    } else {
        // Cambiar a trabajo y siguiente ronda
        isWorkPhase = true;
        currentRound++;
        
        if (currentRound > totalRounds) {
            // Fin del entrenamiento
            clearInterval(timerInterval);
            isRunning = false;
            playEndSound();
            alert('¡Entrenamiento completado! 🎉');
            resetTimer();
            return;
        }
        
        currentTime = workTime;
        playAlertSound();
    }
    
    updateDisplay();
}

// Función principal del temporizador
function tick() {
    if (currentTime > 0) {
        currentTime--;
        updateDisplay();
    } else {
        switchPhase();
    }
}

// Función para iniciar el temporizador
function startTimer() {
    workTime = parseInt(workTimeInput.value) || 20;
    restTime = parseInt(restTimeInput.value) || 10;
    totalRounds = parseInt(roundsInput.value) || 8;
    
    currentRound = 1;
    isWorkPhase = true;
    currentTime = workTime;
    isRunning = true;
    isPaused = false;
    
    setupPanel.style.display = 'none';
    timerPanel.style.display = 'block';
    
    updateDisplay();
    
    timerInterval = setInterval(tick, 1000);
}

// Función para pausar/reanudar el temporizador
function togglePause() {
    if (isPaused) {
        // Reanudar
        isPaused = false;
        pauseBtn.textContent = 'Pausar';
        pauseBtn.className = 'btn btn-warning';
        timerInterval = setInterval(tick, 1000);
    } else {
        // Pausar
        isPaused = true;
        pauseBtn.textContent = 'Reanudar';
        pauseBtn.className = 'btn btn-primary';
        clearInterval(timerInterval);
    }
}

// Función para reiniciar el temporizador
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    
    setupPanel.style.display = 'flex';
    timerPanel.style.display = 'none';
    
    pauseBtn.textContent = 'Pausar';
    pauseBtn.className = 'btn btn-warning';
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetTimer);

// Actualizar displays de valor al mover sliders
workTimeInput.addEventListener('input', () => {
    workTimeValue.textContent = workTimeInput.value;
});

restTimeInput.addEventListener('input', () => {
    restTimeValue.textContent = restTimeInput.value;
});

roundsInput.addEventListener('input', () => {
    roundsValue.textContent = roundsInput.value;
});
