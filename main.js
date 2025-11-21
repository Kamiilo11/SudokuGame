class SudokuGame {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.initialBoard = Array(9).fill().map(() => Array(9).fill(0));
        this.difficulty = 'easy';
        this.init();
    }

    init() {
        this.createBoard();
        this.setupEventListeners();
        this.generateNewGame();
    }

    createBoard() {
        const board = document.getElementById('sudoku-board');
        board.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('td');
                cell.className = 'cell';
                
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.row = i;
                input.dataset.col = j;
                
                input.addEventListener('input', (e) => this.handleInput(e));
                input.addEventListener('keydown', (e) => this.handleKeyDown(e));
                
                cell.appendChild(input);
                row.appendChild(cell);
            }
            board.appendChild(row);
        }
    }

    handleInput(event) {
        const input = event.target;
        let value = input.value;
        
        // Only allow numbers 1-9
        if (value && (!/^[1-9]$/.test(value))) {
            input.value = '';
            return;
        }

        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        
        // Remove all styling classes first
        input.classList.remove('user-input', 'error');
        
        if (value) {
            this.board[row][col] = parseInt(value);
            input.classList.add('user-input');
        } else {
            this.board[row][col] = 0;
        }
    }

    handleKeyDown(event) {
        // Allow navigation with arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            const currentInput = event.target;
            const row = parseInt(currentInput.dataset.row);
            const col = parseInt(currentInput.dataset.col);
            
            let nextRow = row;
            let nextCol = col;
            
            switch(event.key) {
                case 'ArrowUp': nextRow = row > 0 ? row - 1 : 8; break;
                case 'ArrowDown': nextRow = row < 8 ? row + 1 : 0; break;
                case 'ArrowLeft': nextCol = col > 0 ? col - 1 : 8; break;
                case 'ArrowRight': nextCol = col < 8 ? col + 1 : 0; break;
            }
            
            const nextInput = document.querySelector(`[data-row="${nextRow}"][data-col="${nextCol}"]`);
            if (nextInput) {
                nextInput.focus();
                event.preventDefault();
            }
        }
    }

    generateNewGame() {
        // Use a pre-defined valid Sudoku board for simplicity
        this.createValidSudoku();
        this.createPuzzle();
        this.displayBoard();
        document.getElementById('status').textContent = 'New game started!';
        document.getElementById('status').style.color = 'black';
    }

    createValidSudoku() {
        // Start with a valid solved Sudoku pattern
        const solvedPattern = [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9]
        ];

        // Randomize the board by swapping rows/columns and numbers
        this.solution = this.randomizeBoard(solvedPattern);
        this.board = this.solution.map(row => [...row]);
    }

    randomizeBoard(board) {
        // Create a copy of the board
        let newBoard = board.map(row => [...row]);
        
        // Swap some rows and columns to create variation
        for (let i = 0; i < 10; i++) {
            const block = Math.floor(Math.random() * 3) * 3;
            const row1 = block + Math.floor(Math.random() * 3);
            const row2 = block + Math.floor(Math.random() * 3);
            
            // Swap rows
            [newBoard[row1], newBoard[row2]] = [newBoard[row2], newBoard[row1]];
        }
        
        return newBoard;
    }

    createPuzzle() {
        // Copy the solution to initial board
        this.initialBoard = this.solution.map(row => [...row]);
        
        // Remove numbers based on difficulty
        let cellsToRemove;
        switch(this.difficulty) {
            case 'easy': cellsToRemove = 35; break;
            case 'medium': cellsToRemove = 45; break;
            case 'hard': cellsToRemove = 55; break;
            default: cellsToRemove = 35;
        }

        let removed = 0;
        const maxAttempts = 200;
        
        // Simple removal - don't check for uniqueness (for simplicity)
        while (removed < cellsToRemove && removed < maxAttempts) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            
            if (this.initialBoard[row][col] !== 0) {
                this.initialBoard[row][col] = 0;
                removed++;
            }
        }
        
        // Reset the current board to the puzzle
        this.board = this.initialBoard.map(row => [...row]);
    }

    displayBoard() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const input = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                const value = this.initialBoard[i][j];
                
                if (input) {
                    input.value = value !== 0 ? value : '';
                    
                    // Remove all classes first
                    input.classList.remove('fixed', 'user-input', 'error');
                    
                    if (value !== 0) {
                        input.classList.add('fixed');
                        input.disabled = true;
                    } else {
                        input.disabled = false;
                    }
                }
            }
        }
    }

    checkSolution() {
        let hasErrors = false;
        let isComplete = true;
        
        // Clear previous errors
        document.querySelectorAll('input[data-row]').forEach(input => {
            input.classList.remove('error');
        });
        
        // Check each cell
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const input = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                const currentValue = this.board[i][j];
                const correctValue = this.solution[i][j];
                
                // Check if cell is empty
                if (currentValue === 0) {
                    isComplete = false;
                }
                
                // Check if value is wrong (and not empty)
                if (currentValue !== 0 && currentValue !== correctValue) {
                    if (input) {
                        input.classList.add('error');
                    }
                    hasErrors = true;
                }
            }
        }
        
        const status = document.getElementById('status');
        if (hasErrors) {
            status.textContent = 'There are errors in your solution. Keep trying!';
            status.style.color = 'red';
        } else if (!isComplete) {
            status.textContent = 'So far so good! Keep going!';
            status.style.color = 'blue';
        } else {
            status.textContent = 'Congratulations! Puzzle solved correctly!';
            status.style.color = 'green';
        }
        
        return !hasErrors && isComplete;
    }

    solvePuzzle() {
        // Fill the board with the solution
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const input = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                if (input) {
                    this.board[i][j] = this.solution[i][j];
                    input.value = this.solution[i][j];
                    input.classList.remove('error', 'user-input');
                    input.classList.add('fixed');
                    input.disabled = true;
                }
            }
        }
        document.getElementById('status').textContent = 'Puzzle solved!';
        document.getElementById('status').style.color = 'blue';
    }

    setupEventListeners() {
        document.getElementById('new-game').addEventListener('click', () => {
            this.difficulty = document.getElementById('difficulty').value;
            this.generateNewGame();
        });
        
        document.getElementById('check-solution').addEventListener('click', () => {
            this.checkSolution();
        });
        
        document.getElementById('solve').addEventListener('click', () => {
            this.solvePuzzle();
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});