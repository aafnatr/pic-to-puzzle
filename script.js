document.addEventListener('DOMContentLoaded', () => {
    const uploader = document.getElementById('image-uploader');
    const puzzleContainer = document.getElementById('puzzle-container');
    const piecesContainer = document.getElementById('pieces-container');
    const winMessage = document.getElementById('win-message');

    const PUZZLE_SIZE = 3; // We are making a 3x3 puzzle
    let draggedPiece = null;
    let originalPieces = [];

    // Create the placeholder slots in the puzzle container
    for (let i = 0; i < PUZZLE_SIZE * PUZZLE_SIZE; i++) {
        const placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        placeholder.dataset.index = i;
        puzzleContainer.appendChild(placeholder);

        // Add drop event listeners
        placeholder.addEventListener('dragover', (e) => e.preventDefault());
        placeholder.addEventListener('drop', onDrop);
    }

    uploader.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            createPuzzle(imageUrl);
        };
        reader.readAsDataURL(file);
    });

    function createPuzzle(imageUrl) {
        piecesContainer.innerHTML = '';
        winMessage.classList.add('hidden');
        originalPieces = [];

        // Create puzzle pieces from the image
        for (let i = 0; i < PUZZLE_SIZE * PUZZLE_SIZE; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.draggable = true;
            piece.style.backgroundImage = `url(${imageUrl})`;
            
            const col = i % PUZZLE_SIZE;
            const row = Math.floor(i / PUZZLE_SIZE);
            
            // Set the background position to show the correct part of the image
            piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
            
            // Store the correct index on the piece
            piece.dataset.correctIndex = i;
            
            originalPieces.push(piece);
        }

        // Shuffle and display the pieces
        shuffle(originalPieces).forEach(piece => {
            piecesContainer.appendChild(piece);
            piece.addEventListener('dragstart', onDragStart);
        });
    }

    function onDragStart(event) {
        draggedPiece = event.target;
    }

    function onDrop(event) {
        event.preventDefault();
        const dropZone = event.target;

        // If the drop zone is a placeholder and doesn't already have a piece
        if (dropZone.classList.contains('placeholder') && !dropZone.hasChildNodes()) {
            dropZone.appendChild(draggedPiece);
            checkWin();
        }
    }

    function checkWin() {
        const placeholders = puzzleContainer.querySelectorAll('.placeholder');
        let allCorrect = true;

        placeholders.forEach((placeholder, index) => {
            const piece = placeholder.firstChild;
            if (!piece || parseInt(piece.dataset.correctIndex) !== index) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            winMessage.classList.remove('hidden');
        }
    }

    // Function to shuffle an array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }
});
