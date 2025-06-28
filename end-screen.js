// Ending screen component
const EndingScreen = {
  render: (gameState) => {
    const endingType = UTILS.getEndingType(
      gameState.rageLevel,
      gameState.maxRageReached
    );
    const ending = MESSAGES.ENDINGS[endingType];

    return `
            <div class="ending-screen">
                <div class="ending-content">
                    <h1 class="ending-title" style="color: ${ending.color}">
                        ${ending.title}
                    </h1>
                    <div class="duck-display final-duck">
                        <img src="${UTILS.getDuckImagePath(
                          gameState.rageLevel
                        )}" 
                             alt="Final Duck" 
                             class="duck-image final-duck-image" />
                    </div>
                    <p class="ending-message">${ending.message}</p>
                    <div class="final-stats">
                        <p>${MESSAGES.UI.FINAL_RAGE_LABEL} ${
      gameState.rageLevel
    }/${CONFIG.MAX_RAGE}</p>
                        <p>${MESSAGES.UI.MAX_RAGE_LABEL} ${
      gameState.maxRageReached
    }/${CONFIG.MAX_RAGE}</p>
                        <p>${MESSAGES.UI.ROUNDS_SURVIVED_LABEL} ${
      gameState.currentRound
    }/${CONFIG.TOTAL_ROUNDS}</p>
                    </div>
                    <button id="restart-button" class="restart-button">
                        ${MESSAGES.UI.RESTART_BUTTON}
                    </button>
                </div>
            </div>
        `;
  },

  attachEventListeners: () => {
    const restartButton = document.getElementById("restart-button");
    if (restartButton) {
      restartButton.addEventListener("click", () => {
        UTILS.playAudio(CONFIG.AUDIO.CHOICE_SOUND);
        Game.resetGame();
        StartScreen.init();
      });
    }
  },

  init: (gameState) => {
    const container = document.getElementById("game-container");
    container.innerHTML = EndingScreen.render(gameState);
    EndingScreen.attachEventListeners();

    // Play appropriate ending sound
    const endingType = UTILS.getEndingType(
      gameState.rageLevel,
      gameState.maxRageReached
    );
    if (endingType === CONFIG.ENDINGS.SUPER_DEAD) {
      UTILS.playAudio(CONFIG.AUDIO.DEATH_SOUND);
    } else {
      UTILS.playAudio(CONFIG.AUDIO.LANDING_SOUND);
    }
  },
};
