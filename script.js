const TOTAL_CATS = 12;
const container = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likeCountEl = document.getElementById("like-count");
const likedCatsEl = document.getElementById("liked-cats");

let likedCats = [];
let currentIndex = 0;

// Pre-generate cat image URLs
const cats = Array.from({ length: TOTAL_CATS }, (_, i) =>
  `https://cataas.com/cat?random=${i}`
);

// Create cards
cats.forEach((src, index) => {
  const card = document.createElement("div");
  card.className = "card";
  card.style.zIndex = TOTAL_CATS - index;

  const img = document.createElement("img");
  img.src = src;

  card.appendChild(img);
  container.appendChild(card);

  addSwipe(card, src);
});

function addSwipe(card, src) {
  let startX = 0;

  card.addEventListener("pointerdown", e => {
    startX = e.clientX;
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointerup", e => {
    const diff = e.clientX - startX;

    if (diff > 100) {
      like(card, src);
    } else if (diff < -100) {
      dislike(card);
    }
  });
}

function like(card, src) {
  card.classList.add("like");
  likedCats.push(src);
  nextCard();
}

function dislike(card) {
  card.classList.add("dislike");
  nextCard();
}

function nextCard() {
  currentIndex++;

  setTimeout(() => {
    container.removeChild(container.lastElementChild);

    if (currentIndex === TOTAL_CATS) {
      showSummary();
    }
  }, 400);
}

function showSummary() {
  container.classList.add("hidden");
  summary.classList.remove("hidden");
  likeCountEl.textContent = likedCats.length;

  likedCats.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    likedCatsEl.appendChild(img);
  });
}
