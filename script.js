const catStack = document.getElementById("cat-stack");
const summary = document.getElementById("summary");
const likedCatsDiv = document.getElementById("liked-cats");
const likedCount = document.getElementById("liked-count");
const restartBtn = document.getElementById("restart-btn");

let cats = [];
let likedCats = [];

async function fetchCats(count = 10) {
    cats = [];
    for (let i = 0; i < count; i++) {
        cats.push(`https://cataas.com/cat?${Date.now() + i}`);
    }
}

function showCats() {
    catStack.innerHTML = "";

    cats.forEach((catUrl, index) => {
        const card = document.createElement("div");
        card.className = "cat-card";
        card.style.zIndex = cats.length - index;
        card.innerHTML = `<img src="${catUrl}" alt="Cat">`;

        addSwipe(card, catUrl);
        catStack.appendChild(card);
    });
}

function addSwipe(card, catUrl) {
    let startX = 0;
    let currentX = 0;
    let dragging = false;

    card.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
        dragging = true;
    });

    card.addEventListener("touchmove", e => {
        if (!dragging) return;
        currentX = e.touches[0].clientX - startX;
        card.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.1}deg)`;
    });

    card.addEventListener("touchend", () => {
        dragging = false;

        if (currentX > 120) {
            swipe(card, catUrl, "right");
        } else if (currentX < -120) {
            swipe(card, catUrl, "left");
        } else {
            card.style.transform = "translateX(0) rotate(0)";
        }

        currentX = 0;
    });
}

function swipe(card, catUrl, direction) {
    if (direction === "right") {
        likedCats.push(catUrl);
    }

    card.style.transition = "transform 0.4s ease, opacity 0.4s ease";
    card.style.transform =
        direction === "right"
            ? "translateX(1200px) rotate(45deg)"
            : "translateX(-1200px) rotate(-45deg)";
    card.style.opacity = "0";

    setTimeout(() => {
        card.remove();

        if (catStack.children.length === 0) {
            showSummary();
        }
    }, 400);
}

function showSummary() {
    catStack.style.display = "none";
    summary.classList.remove("hidden");

    likedCount.textContent = likedCats.length;
    likedCatsDiv.innerHTML = "";

    likedCats.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        likedCatsDiv.appendChild(img);
    });
}

restartBtn.addEventListener("click", async () => {
    likedCats = [];
    summary.classList.add("hidden");
    catStack.style.display = "block";
    await init();
});

async function init() {
    await fetchCats(10);
    showCats();
}

init();
