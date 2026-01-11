const catStack = document.getElementById('cat-stack');
const summary = document.getElementById('summary');
const likedCatsDiv = document.getElementById('liked-cats');
const likedCount = document.getElementById('liked-count');
const restartBtn = document.getElementById('restart-btn');

let cats = [];
let likedCats = [];

// Fetch cats from Cataas
async function fetchCats(count = 10) {
    cats = [];
    for (let i = 0; i < count; i++) {
        const response = await fetch('https://cataas.com/cat?json=true');
        const data = await response.json();
        cats.push(`https://cataas.com${data.url}`);
    }
}

// Pre-create all cat cards
function showCats() {
    catStack.innerHTML = '';
    cats.forEach((catUrl, index) => {
        const card = document.createElement('div');
        card.classList.add('cat-card');
        card.style.zIndex = cats.length - index; // top card has highest z-index
        card.innerHTML = `<img src="${catUrl}" alt="Cat">`;
        addSwipeListeners(card, catUrl);
        catStack.appendChild(card);
    });
}

// Add swipe functionality to a card
function addSwipeListeners(card, catUrl) {
    let startX = 0;
    let currentX = 0;

    card.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });

    card.addEventListener('touchmove', e => {
        currentX = e.touches[0].clientX - startX;
        card.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.1}deg)`;
    });

    card.addEventListener('touchend', () => {
        if (currentX > 100) {
            swipe(catUrl, 'right', card);
        } else if (currentX < -100) {
            swipe(catUrl, 'left', card);
        } else {
            card.style.transform = 'translateX(0px) rotate(0deg)';
        }
    });

    // Optional: click to like
    card.addEventListener('click', () => {
        swipe(catUrl, 'right', card);
    });
}

// Handle swipe
function swipe(catUrl, direction, card) {
    if (direction === 'right') likedCats.push(catUrl);

    card.style.transition = 'all 0.5s ease';
    card.style.transform = `translateX(${direction === 'right' ? 1000 : -1000}px) rotate(${direction === 'right' ? 45 : -45}deg)`;
    card.style.opacity = '0';

    setTimeout(() => {
        card.remove(); // Remove the swiped card from DOM

        // Check if any cards left
        if (catStack.childElementCount === 0) {
            showSummary();
        }
    }, 500);
}

// Show summary
function showSummary() {
    catStack.style.display = 'none';
    summary.classList.remove('hidden');
    likedCount.textContent = likedCats.length;
    likedCatsDiv.innerHTML = '';
    likedCats.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        likedCatsDiv.appendChild(img);
    });
}

// Restart the game
restartBtn.addEventListener('click', async () => {
    likedCats = [];
    summary.classList.add('hidden');
    catStack.style.display = 'block';
    await init();
});

// Initialize the app
async function init() {
    await fetchCats();
    showCats();
}

init();

