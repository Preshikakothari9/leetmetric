document.addEventListener("DOMContentLoaded", function () {

const searchButton = document.getElementById("search-btn");
const usernameInput = document.getElementById("user-input");
const statsContainer = document.querySelector(".stats-container");

const easyProgressCircle = document.querySelector(".easy-progress");
const mediumProgressCircle = document.querySelector(".medium-progress");
const hardProgressCircle = document.querySelector(".hard-progress");

const easyLabel = document.getElementById("easy-label");
const mediumLabel = document.getElementById("medium-label");
const hardLabel = document.getElementById("hard-label");

const cardStatsContainer = document.querySelector(".stats-cards");


// ✅ Fetch User Data (UPDATED API)
async function fetchUserDetails(username) {
    try {
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;
        statsContainer.classList.add("hidden");

        const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
        const data = await response.json();

        console.log("API DATA:", data);

        // ✅ Handle invalid user or API issue
        if (!data || data.status === "error" || !data.totalSolved) {
            throw new Error("User not found or API issue");
        }

        displayUserData(data);
        statsContainer.classList.remove("hidden");

    } catch (error) {
        statsContainer.innerHTML = `<p>${error.message}</p>`;
        statsContainer.classList.remove("hidden");
    } finally {
        searchButton.textContent = "Search";
        searchButton.disabled = false;
    }
}


// ✅ Update Progress Circles
function updateProgress(solved, total, label, circle) {
    const percent = total === 0 ? 0 : (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${percent}%`);
    label.textContent = `${solved} / ${total}`;
}


// ✅ Display Data
function displayUserData(data) {

    const easySolved = data.easySolved || 0;
    const totalEasy = data.totalEasy || 0;

    const mediumSolved = data.mediumSolved || 0;
    const totalMedium = data.totalMedium || 0;

    const hardSolved = data.hardSolved || 0;
    const totalHard = data.totalHard || 0;

    updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
    updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
    updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);

    const cardData = [
        { label: "Total Solved", value: data.totalSolved || 0 },
        { label: "Ranking", value: data.ranking || "N/A" },
        { label: "Easy Solved", value: easySolved },
        { label: "Medium Solved", value: mediumSolved },
        { label: "Hard Solved", value: hardSolved }
    ];

    cardStatsContainer.innerHTML = cardData.map(item => `
        <div class="card">
            <h4>${item.label}</h4>
            <p>${item.value}</p>
        </div>
    `).join("");
}


// ✅ Button Click Event
searchButton.addEventListener("click", function () {
    const username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter username");
        return;
    }

    fetchUserDetails(username);
});

});