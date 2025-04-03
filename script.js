const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");
const searchInput = document.getElementById("inp-word");

btn.addEventListener("click", async () => {
    let inpWord = searchInput.value.trim();
    if (!inpWord) {
        result.innerHTML = `<h3 class="error">Please enter a word</h3>`;
        return;
    }

    try {
        let wordResponse = await fetch(`${url}${inpWord}`);
        let wordData = await wordResponse.json();

        if (!wordData || wordData.title) {
            throw new Error("Word not found");
        }

        // Extract necessary data
        let partOfSpeech = wordData[0].meanings[0].partOfSpeech;
        let phonetic = wordData[0].phonetic || "";
        let definition = wordData[0].meanings[0].definitions[0].definition;
        let example = wordData[0].meanings[0].definitions[0].example || "No example available.";
        
        // Extract synonyms (if available)
        let synonyms = wordData[0].meanings[0].synonyms;
        let synonymsText = synonyms && synonyms.length > 0 
            ? synonyms.join(", ") 
            : "No synonyms available.";

        // Construct HTML output
        let wordDefinition = `
            <div class="word">
                <h3>${inpWord}</h3>
                <button onclick="playSound()">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="details">
                <p>${partOfSpeech}</p>
                <p>/${phonetic}/</p>
            </div>
            <p class="word-meaning">${definition}</p>
            <p class="word-example">${example}</p>
            <p class="word-synonyms"><strong>Synonyms:</strong> ${synonymsText}</p>`;

        result.innerHTML = wordDefinition;

        // Set pronunciation audio
        const audioSrc = wordData[0].phonetics.find(p => p.audio)?.audio;
        if (audioSrc) {
            sound.setAttribute("src", audioSrc);
        }

    } catch (error) {
        console.error("Error:", error);
        result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
    }
});

function playSound() {
    sound.play();
}

// Function to update IST Time using correct time zone conversion
function updateISTTime() {
    const istElement = document.getElementById("ist-time");
    if (!istElement) return;

    const now = new Date();
    const istTime = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }).format(now);

    istElement.textContent = istTime;
}

// Update IST time every second
setInterval(updateISTTime, 1000);
updateISTTime(); // Set initial time

// Clear result when input is empty
searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
        result.innerHTML = "";
    }
});

// Press "P" to play pronunciation
document.addEventListener("keypress", (event) => {
    if (event.key.toLowerCase() === "p") {
        playSound();
    }
});
