const bootScreen = document.getElementById("boot-screen");
const gameScreen = document.getElementById("game-screen");
const terminal = document.getElementById("terminal-output");
const progressBar = document.getElementById("progress-bar");

const screenTitle = document.getElementById("screen-title");
const screenContent = document.getElementById("screen-content");

const hpBar = document.getElementById("hp-bar");
const xpBar = document.getElementById("xp-bar");

const inventoryBtn = document.getElementById("inventory-btn");
const questLogBtn = document.getElementById("quest-log-btn");
const inventoryPanel = document.getElementById("inventory-panel");
const questLogPanel = document.getElementById("quest-log-panel");
const inventoryList = document.getElementById("inventory-list");
const inventoryCount = document.getElementById("inventory-count");
const questLogList = document.getElementById("quest-log-list");

let inventory = [];
let questLog = [];
let xp = 0;
let hp = 70;

const bootMessages = [
  "Loading Adventure Log...",
  "Loading Inventory...",
  "Checking HP...",
  "Calibrating Sub-Bass...",
  "Searching for Active Player...",
  "PLAYER FOUND",
  "KamiSama",
  "LEVEL 33"
];

bootSequence();

function bootSequence() {
  let i = 0;

  const timer = setInterval(() => {
    if (i >= bootMessages.length) {
      clearInterval(timer);
      setTimeout(showGame, 900);
      return;
    }

    const line = document.createElement("div");
    line.className = "terminal-line";
    line.textContent = bootMessages[i];
    terminal.appendChild(line);

    progressBar.style.width = `${((i + 1) / bootMessages.length) * 100}%`;
    i++;
  }, 600);
}

function showGame() {
  bootScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  hpBar.style.width = `${hp}%`;
  xpBar.style.width = `${xp}%`;

  showQuestGiver();
  updateInventory();
  updateQuestLog();
}

function setScreen(title, content) {
  screenTitle.textContent = title;
  screenContent.innerHTML = content;
}

function showQuestGiver() {
  setScreen("SIDE QUEST ACCEPTED", `
    <p class="quest-text">Every great adventure begins with someone willing to believe in impossible things.</p>
    <p class="quest-text">Your Quest Giver is nearby.</p>
    <p class="quest-text">Find the one who always says...</p>
    <h2>"One more side quest."</h2>
    <button onclick="showLantern()">PRESS START</button>
  `);

  questLog = ["Side Quest Accepted"];
  updateQuestLog();
}

function showLantern() {
  setScreen("QUEST ITEM ACQUIRED", `
    <h2>Explorer's Lantern</h2>
    <p class="quest-text">The Quest Giver has entrusted you with your first artifact.</p>
    <div class="code-box">
      FIRST ACCESS CODE
      <span>CREATOR</span>
    </div>
    <button onclick="showPassword()">CONTINUE</button>
  `);
}

function showPassword() {
  setScreen("ACCESS TERMINAL", `
    <input id="password" autocomplete="off" spellcheck="false" placeholder="ENTER ACCESS CODE">
    <button onclick="verifyPassword()">VERIFY</button>
    <div id="error-message"></div>
  `);

  setTimeout(() => {
    const input = document.getElementById("password");
    input.focus();

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") verifyPassword();
    });
  }, 100);
}

function verifyPassword() {
  const input = document.getElementById("password");
  const error = document.getElementById("error-message");
  const code = input.value.trim().toUpperCase();

  if (code === "CREATOR") {
    setScreen("ACCESS VERIFIED", `
      <p class="quest-text">Decrypting Quest Data...</p>
      <div class="progress">
        <div style="width:100%;height:100%;background:linear-gradient(90deg,#9b5cff,#c487ff);"></div>
      </div>
    `);

    setTimeout(showCreatorQuest, 1000);
  } else {
    error.textContent = "ACCESS DENIED";
    input.value = "";
    input.focus();
  }
}

function showCreatorQuest() {
  setScreen("QUEST_01", `
    <h1>THE CREATOR</h1>
    <p class="quest-text">Before there was a Wolf God...</p>
    <p class="quest-text">there was an idea.</p>
    <p class="quest-text">Return to where KamiSama comes to life.</p>
    <button onclick="beginSearch()">BEGIN SEARCH</button>
  `);

  questLog = ["The Creator - Active"];
  updateQuestLog();
}

function beginSearch() {
  setScreen("MISSION ACTIVE", `
    <h2>THE CREATOR</h2>
    <p class="quest-text">Current Objective:</p>
    <p class="quest-text">Recover the artifact where KamiSama comes to life.</p>
    <button onclick="completeCreatorQuest()">ARTIFACT RECOVERED</button>
  `);
}

function completeCreatorQuest() {
  setScreen("SCANNING ARTIFACT", `
    <p class="quest-text">Verifying recovered item...</p>
    <div class="progress">
      <div style="width:100%;height:100%;background:linear-gradient(90deg,#9b5cff,#c487ff);"></div>
    </div>
  `);

  setTimeout(() => {
    addItem("KamiSama Patch");
    xp = 18;
    hp = 78;
    hpBar.style.width = `${hp}%`;
    xpBar.style.width = `${xp}%`;

    questLog = ["The Creator - Complete"];
    updateQuestLog();

    setScreen("ADVENTURE LOG UPDATED", `
      <h2>ITEM ACQUIRED</h2>
      <p class="quest-text">KamiSama Patch has been added to your inventory.</p>
      <p class="quest-text">To secure the next code, search beside the ghost who never leaves your side.</p>
    `);
  }, 1000);
}

function addItem(item) {
  if (!inventory.includes(item)) {
    inventory.push(item);
  }

  updateInventory();
}

function updateInventory() {
  inventoryCount.textContent = `${inventory.length} / 6 ITEMS`;

  inventoryList.innerHTML = "";

  if (inventory.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No items collected yet.";
    inventoryList.appendChild(empty);
    return;
  }

  inventory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    inventoryList.appendChild(li);
  });
}

function updateQuestLog() {
  questLogList.innerHTML = "";

  if (questLog.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No active quests.";
    questLogList.appendChild(empty);
    return;
  }

  questLog.forEach(q => {
    const li = document.createElement("li");
    li.textContent = q;
    questLogList.appendChild(li);
  });
}

inventoryBtn.addEventListener("click", () => {
  inventoryPanel.classList.toggle("hidden");
  questLogPanel.classList.add("hidden");
});

questLogBtn.addEventListener("click", () => {
  questLogPanel.classList.toggle("hidden");
  inventoryPanel.classList.add("hidden");
});