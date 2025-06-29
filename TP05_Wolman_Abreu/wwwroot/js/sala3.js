// Buscaminas de Pociones - Sala 3
class BuscaminasPociones {
    constructor() {
        // Solo nivel medio: 6x6 con 8 minas
        this.config = { rows: 6, cols: 6, mines: 8 };
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.safeCount = 0;
        
        this.init();
    }

    init() {
        this.createBoard();
        this.setupEventListeners();
        this.updateDisplay();
    }

    createBoard() {
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.safeCount = 0;

        // Crear tablero vacío
        for (let i = 0; i < this.config.rows; i++) {
            this.board[i] = [];
            this.revealed[i] = [];
            this.flagged[i] = [];
            for (let j = 0; j < this.config.cols; j++) {
                this.board[i][j] = 0;
                this.revealed[i][j] = false;
                this.flagged[i][j] = false;
            }
        }

        // Colocar minas aleatoriamente
        let minesPlaced = 0;
        while (minesPlaced < this.config.mines) {
            const row = Math.floor(Math.random() * this.config.rows);
            const col = Math.floor(Math.random() * this.config.cols);
            if (this.board[row][col] !== -1) {
                this.board[row][col] = -1; // -1 representa una mina
                minesPlaced++;
            }
        }

        // Calcular números para celdas seguras
        for (let i = 0; i < this.config.rows; i++) {
            for (let j = 0; j < this.config.cols; j++) {
                if (this.board[i][j] !== -1) {
                    this.board[i][j] = this.countAdjacentMines(i, j);
                }
            }
        }

        this.renderBoard();
    }

    countAdjacentMines(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < this.board.length && 
                    newCol >= 0 && newCol < this.board[0].length) {
                    if (this.board[newRow][newCol] === -1) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        
        gameBoard.innerHTML = '';
        
        const board = document.createElement('div');
        board.className = 'board';
        board.style.gridTemplateColumns = `repeat(${this.config.cols}, 1fr)`;
        
        for (let i = 0; i < this.config.rows; i++) {
            for (let j = 0; j < this.config.cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (this.revealed[i][j]) {
                    cell.classList.add('revealed');
                    if (this.board[i][j] === -1) {
                        cell.classList.add('mine');
                        cell.innerHTML = '💀';
                    } else if (this.board[i][j] > 0) {
                        cell.classList.add(`number-${this.board[i][j]}`);
                        cell.textContent = this.board[i][j];
                    } else {
                        cell.innerHTML = '✅';
                    }
                } else if (this.flagged[i][j]) {
                    cell.classList.add('flagged');
                    cell.innerHTML = '🚩';
                }
                
                board.appendChild(cell);
            }
        }
        
        gameBoard.appendChild(board);
    }

    setupEventListeners() {
        // Event listener para clicks en celdas
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell') && !this.gameOver && !this.gameWon) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.revealCell(row, col);
            }
        });

        // Event listener para banderas (click derecho)
        document.addEventListener('contextmenu', (e) => {
            if (e.target.classList.contains('cell') && !this.gameOver && !this.gameWon) {
                e.preventDefault();
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.toggleFlag(row, col);
            }
        });

        // Botón nueva partida
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.resetGame();
        });
    }

    revealCell(row, col) {
        if (this.revealed[row][col] || this.flagged[row][col]) {
            return;
        }

        this.revealed[row][col] = true;

        if (this.board[row][col] === -1) {
            // ¡Mina encontrada!
            this.gameOver = true;
            this.revealAllMines();
            this.showMessage('¡La poción explota! 💥 Has activado un ingrediente maldito.', 'error');
            this.playSound('explosion');
            setTimeout(() => {
                if (confirm('¿Querés intentar de nuevo?')) {
                    this.resetGame();
                }
            }, 2000);
        } else {
            // Celda segura
            this.safeCount++;
            this.revealAdjacentCells(row, col);
            this.checkWin();
        }

        this.renderBoard();
        this.updateDisplay();
    }

    revealAdjacentCells(row, col) {
        if (this.board[row][col] === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < this.board.length && 
                        newCol >= 0 && newCol < this.board[0].length &&
                        !this.revealed[newRow][newCol] && !this.flagged[newRow][newCol]) {
                        this.revealCell(newRow, newCol);
                    }
                }
            }
        }
    }

    toggleFlag(row, col) {
        if (!this.revealed[row][col]) {
            this.flagged[row][col] = !this.flagged[row][col];
            this.renderBoard();
        }
    }

    revealAllMines() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j] === -1) {
                    this.revealed[i][j] = true;
                }
            }
        }
    }

    checkWin() {
        const totalSafeCells = this.config.rows * this.config.cols - this.config.mines;
        
        if (this.safeCount === totalSafeCells) {
            this.gameWon = true;
            this.showMessage('¡Poción completada! 🧪 Has encontrado todos los ingredientes seguros.', 'success');
            this.showTransitionButton();
        }
    }

    showTransitionButton() {
        const transitionDiv = document.createElement('div');
        transitionDiv.className = 'transicion-container';
        transitionDiv.style.position = 'fixed';
        transitionDiv.style.top = '50%';
        transitionDiv.style.left = '50%';
        transitionDiv.style.transform = 'translate(-50%, -50%)';
        transitionDiv.style.zIndex = '1000';
        transitionDiv.innerHTML = `
            <h2>🎉 ¡Poción Completada! 🎉</h2>
            <p>Has demostrado tu habilidad para distinguir ingredientes seguros de los malditos. Tu destreza en la preparación de pociones te ha llevado al siguiente nivel.</p>
            <p>El próximo desafío te espera en las profundidades del lago de Hogwarts...</p>
            <button class="btn-transicion" onclick="this.submitForm()">
                🌊 Continuar al Desafío del Lago
            </button>
        `;
        
        document.body.appendChild(transitionDiv);
        
        // Agregar método al botón
        transitionDiv.querySelector('.btn-transicion').submitForm = () => {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/Home/CompletarBuscaminas';
            document.body.appendChild(form);
            form.submit();
        };
    }

    resetGame() {
        this.createBoard();
        this.showMessage('', '');
    }

    updateDisplay() {
        // Ya no necesitamos actualizar display ya que eliminamos los contadores
    }

    showMessage(text, type) {
        const messageEl = document.getElementById('game-message');
        messageEl.textContent = text;
        messageEl.className = `game-message ${type}`;
    }

    playSound(type) {
        const audio = document.getElementById(`audio-${type}`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio no pudo reproducirse:', e));
        }
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new BuscaminasPociones();
}); 