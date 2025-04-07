function createCard(nombre, titre, rank, description, img) {
	const cardElement = document.createElement("div");
	const cardPrependElement = document.createElement("div");
	const cardAppendElement = document.createElement("div");
	const cardBoxElement = document.createElement("div");
	const spanNumberElement = document.createElement("span");
	const spanTitreElement = document.createElement("span");
	const spanRankElement = document.createElement("span");
	const imageElement = document.createElement("img");
	const pElement = document.createElement("p");

	cardElement.classList.add("card");
	cardPrependElement.classList.add("card-prepend");
	cardBoxElement.classList.add("card-box");
	cardAppendElement.classList.add("card-append");

	spanNumberElement.classList.add("card-box", "bold");
	spanTitreElement.classList.add("card-box", "bold");
	spanRankElement.classList.add("card-box", "bold");

	pElement.classList.add("card-box", "card-description");

	imageElement.setAttribute("src", img);
	imageElement.setAttribute("alt", nombre);

	spanTitreElement.textContent = titre;
	spanRankElement.textContent = rank;
	spanNumberElement.textContent = nombre;
	pElement.textContent = description;

	cardElement.appendChild(cardPrependElement);
	cardElement.appendChild(cardBoxElement);
	cardElement.appendChild(cardAppendElement);

	cardPrependElement.appendChild(spanNumberElement);
	cardPrependElement.appendChild(spanTitreElement);
	cardPrependElement.appendChild(spanRankElement);

	cardBoxElement.appendChild(imageElement);

	cardAppendElement.appendChild(pElement);

	return cardElement;
}

function resetSectionGallery() {
	galleryElement.remove();

	galleryElement = document.createElement("section");
	galleryElement.classList.add("gallery");

	mainElement.appendChild(galleryElement);

	// const newGalleryElement = document.createElement("section");

	// newGalleryElement.classList.add("gallery");

	// galleryElement.replaceWith(newGalleryElement);

	// galleryElement = newGalleryElement;
}

function displayAllCards(cards) {
	for (let i = 0; i < cards.length; i++) {
		const card = cards[i];

		const cardElement = createCard(
			card.number,
			card.name,
			card.rank,
			card.description,
			card.image
		);

		galleryElement.appendChild(cardElement);
	}
}

const mainElement = document.querySelector(".app");
const buttonAll = document.querySelector("#filter-all");
const buttonSS = document.querySelector("#filter-ss");
const buttonSMore = document.querySelector("#filter-s-more");
const inputSearch = document.querySelector("#filter-search");

let galleryElement = document.querySelector(".gallery");
let isFilterAll = true;
let isFilterSS = false;
let isFilterSOrMore = false;

buttonAll.addEventListener("click", () => {
	buttonAll.classList.add("active");
	buttonSS.classList.remove("active");
	buttonSMore.classList.remove("active");

	isFilterAll = true;
	isFilterSS = false;
	isFilterSOrMore = false;

	search();
	resetSectionGallery();
	displayAllCards(CARDS);
});

buttonSMore.addEventListener("click", () => {
	buttonAll.classList.remove("active");
	buttonSS.classList.remove("active");
	buttonSMore.classList.add("active");

	isFilterAll = false;
	isFilterSS = false;
	isFilterSOrMore = true;

	const filteredCards = CARDS.filter((card) => card.rank.charAt(0) === "S");

	resetSectionGallery();
	displayAllCards(filteredCards);
});

buttonSS.addEventListener("click", () => {
	buttonAll.classList.remove("active");
	buttonSS.classList.add("active");
	buttonSMore.classList.remove("active");

	isFilterAll = false;
	isFilterSS = true;
	isFilterSOrMore = false;

	let filteredCards = [];

	for (let i = 0; i < CARDS.length; i++) {
		const card = CARDS[i];

		if (card.rank.startsWith("SS")) {
			filteredCards.push(card);
		}
	}

	resetSectionGallery();
	displayAllCards(filteredCards);
});

inputSearch.addEventListener("input", (e) => {
	const value = e.target.value.toLowerCase();
	search(value);
});

async function search(value) {
	if (!value) {
		if (isFilterAll) {
			GetCards();
		} else if (isFilterSOrMore) {
			GetCards("rank=S");
		} else if (isFilterSS) {
			GetCards("rank=SS");
		}
	} else {
		GetCards(`name=${value}`);
	}
}

GetCards();

async function GetCards(q) {
	fetch(`http://192.168.1.97:3000/v1/cards?${q}`, { method: "GET" })
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			resetSectionGallery();
			displayAllCards(data);
		})
		.catch((error) => {
			console.log(error);
		});
}
