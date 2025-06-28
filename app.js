// Main game application
const Game = {
  // Game state
  state: {
    currentRound: 0,
    rageLevel: 0,
    maxRageReached: 0,
    timer: CONFIG.CHOICE_TIMER,
    showDuckResponse: false,
    lastResponse: "",
    gameHistory: [],
    timerInterval: null,
    currentMusicTrack: null,
  },

  // Initialize the game
  init: async () => {
    console.log("Initializing Red Eye Duck game...");

    // Load game data
    const dataLoaded = await loadGameData();
    if (!dataLoaded) {
      console.warn("Using fallback game data");
    }

    // Initialize start screen
    StartScreen.init();
  },

  // Start a new game
  startGame: () => {
    Game.resetGame();
    Game.state.currentRound = 0;
    Game.state.rageLevel = 0;
    Game.state.maxRageReached = 0;
    Game.state.timer = CONFIG.CHOICE_TIMER;
    Game.state.showDuckResponse = false;
    Game.state.gameHistory = [];
    Game.state.currentMusicTrack = UTILS.switchBackgroundMusic(0);

    Game.renderGameScreen();
    Game.startTimer();
  },

  // Reset game state
  resetGame: () => {
    if (Game.state.timerInterval) {
      clearInterval(Game.state.timerInterval);
      Game.state.timerInterval = null;
    }

    Game.state = {
      currentRound: 0,
      rageLevel: 0,
      maxRageReached: 0,
      timer: CONFIG.CHOICE_TIMER,
      showDuckResponse: false,
      lastResponse: "",
      gameHistory: [],
      timerInterval: null,
      currentMusicTrack: null,
    };
  },

  // Render the main game screen
  renderGameScreen: () => {
    const currentQuestion = getCurrentQuestion(Game.state.currentRound);
    if (!currentQuestion) {
      console.error("No question data for round:", Game.state.currentRound);
      return;
    }

    const container = document.getElementById("game-container");
    container.innerHTML = `
            <div class="flight-ui">
                <div class="status-bar">
                    <span>${MESSAGES.UI.FLIGHT_NUMBER} | ${
      MESSAGES.UI.ROUND_LABEL
    } ${Game.state.currentRound + 1}/${CONFIG.TOTAL_ROUNDS}</span>
                    <span class="timer ${
                      Game.state.timer <= 3 ? "warning" : ""
                    }">${MESSAGES.UI.TIMER_LABEL} ${Game.state.timer}s</span>
                </div>
                
                <div class="duck-section">
                    <img src="${UTILS.getDuckImagePath(Game.state.rageLevel)}" 
                         alt="Duck" 
                         class="duck-image" 
                         id="duck-image" />
                </div>

                <div class="dialogue-section" id="dialogue-section">
                    ${Game.renderDialogue(currentQuestion)}
                </div>
            </div>
        `;

    Game.attachGameEventListeners();
  },

  // Render dialogue content
  renderDialogue: (question) => {
    if (Game.state.showDuckResponse) {
      return `
                <div class="duck-response">
                    <strong>${MESSAGES.UI.DUCK_LABEL}</strong> "${Game.state.lastResponse}"
                </div>
            `;
    } else {
      return `
                <div class="duck-dialogue">
                    <strong>${MESSAGES.UI.DUCK_LABEL}</strong> "${
        question.duck
      }"
                </div>
                <div class="choices">
                    ${question.choices
                      .map(
                        (choice, index) => `
                        <button class="choice-button ${
                          index === 3 ? "silent-choice" : ""
                        }" 
                                data-choice="${index}">
                            ${choice.text}
                        </button>
                    `
                      )
                      .join("")}
                </div>
            `;
    }
  },

  // Attach event listeners for game screen
  attachGameEventListeners: () => {
    const choiceButtons = document.querySelectorAll(".choice-button");
    choiceButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const choiceIndex = parseInt(e.target.dataset.choice);
        Game.handleChoice(choiceIndex);
      });

      // Add hover sound effect
      button.addEventListener("mouseenter", () => {
        UTILS.playAudio(CONFIG.AUDIO.CHOICE_HOVER, 0.4);
      });
    });
  },

  // Handle player choice
  handleChoice: (choiceIndex) => {
    if (Game.state.showDuckResponse) return;

    Game.stopTimer();

    const currentQuestion = getCurrentQuestion(Game.state.currentRound);
    const selectedChoice = currentQuestion.choices[choiceIndex];

    // Play choice sound
    UTILS.playAudio(CONFIG.AUDIO.CHOICE_SOUND);

    // Calculate new rage
    const newRage = UTILS.clampRage(Game.state.rageLevel + selectedChoice.rage);
    const newMaxRage = Math.max(Game.state.maxRageReached, newRage);

    // Update state
    Game.state.rageLevel = newRage;
    Game.state.maxRageReached = newMaxRage;
    Game.state.lastResponse = selectedChoice.response;
    Game.state.showDuckResponse = true;

    // Switch background music based on new rage level
    Game.state.currentMusicTrack = UTILS.switchBackgroundMusic(
      newRage,
      Game.state.currentMusicTrack
    );

    // Add to history
    const historyEntry = {
      round: Game.state.currentRound + 1,
      duckSaid: currentQuestion.duck,
      playerChoice: selectedChoice.text,
      duckResponse: selectedChoice.response,
      rageChange: selectedChoice.rage,
      newRage: newRage,
    };
    Game.state.gameHistory.push(historyEntry);

    // Play rage sound if increased
    if (selectedChoice.rage > 0) {
      UTILS.playAudio(CONFIG.AUDIO.RAGE_INCREASE);
    }

    // Play duck response sound
    UTILS.playAudio(CONFIG.AUDIO.DUCK_RESPONSE);

    // Update duck image immediately
    const duckImage = document.getElementById("duck-image");
    if (duckImage) {
      duckImage.src = UTILS.getDuckImagePath(newRage);
    }

    // Re-render dialogue section
    const dialogueSection = document.getElementById("dialogue-section");
    if (dialogueSection) {
      dialogueSection.innerHTML = Game.renderDialogue(currentQuestion);
    }

    // Check for immediate death (rage 12)
    if (newRage >= CONFIG.DEATH_RAGE) {
      setTimeout(() => {
        if (typeof EndingScreen !== "undefined" && EndingScreen.init) {
          EndingScreen.init(Game.state);
        } else {
          console.error("EndingScreen not available");
        }
      }, CONFIG.RESPONSE_DISPLAY_TIME);
      return;
    }

    // Continue to next round or end game
    setTimeout(() => {
      if (Game.state.currentRound + 1 >= CONFIG.TOTAL_ROUNDS) {
        if (typeof EndingScreen !== "undefined" && EndingScreen.init) {
          EndingScreen.init(Game.state);
        } else {
          console.error("EndingScreen not available");
        }
      } else {
        Game.state.currentRound++;
        Game.state.timer = CONFIG.CHOICE_TIMER;
        Game.state.showDuckResponse = false;
        Game.renderGameScreen();
        Game.startTimer();
      }
    }, CONFIG.RESPONSE_DISPLAY_TIME);
  },

  // Start the choice timer
  startTimer: () => {
    Game.state.timerInterval = setInterval(() => {
      Game.state.timer--;

      // Update timer display
      const timerElement = document.querySelector(".timer");
      if (timerElement) {
        timerElement.textContent = `${MESSAGES.UI.TIMER_LABEL} ${Game.state.timer}s`;
        if (Game.state.timer <= 3) {
          timerElement.classList.add("warning");
          UTILS.playAudio(CONFIG.AUDIO.TIMER_TICK, 0.3);
        }
      }

      // Auto-select silent option when timer reaches 0
      if (Game.state.timer <= 0) {
        Game.handleChoice(3); // Silent option is always index 3
      }
    }, 1000);
  },

  // Stop the timer
  stopTimer: () => {
    if (Game.state.timerInterval) {
      clearInterval(Game.state.timerInterval);
      Game.state.timerInterval = null;
    }
  },
};

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  Game.init();
});

// Handle page visibility changes to pause/resume music
document.addEventListener("visibilitychange", () => {
  const allMusicTracks = [
    CONFIG.AUDIO.BACKGROUND_MUSIC_HAPPY,
    CONFIG.AUDIO.BACKGROUND_MUSIC_UPSET,
    CONFIG.AUDIO.BACKGROUND_MUSIC_DEATH,
  ];

  if (document.hidden) {
    // Pause all music tracks
    allMusicTracks.forEach((trackId) => {
      const audio = document.getElementById(trackId);
      if (audio && !audio.paused) {
        audio.pause();
      }
    });
  } else {
    // Resume the current track
    if (Game.state && Game.state.currentMusicTrack) {
      const currentAudio = document.getElementById(
        Game.state.currentMusicTrack
      );
      if (currentAudio) {
        currentAudio
          .play()
          .catch((e) => console.log("Music resume failed:", e));
      }
    }
  }
});
