// Start screen component
const StartScreen = {
  render: () => {
    return `
            <div class="start-screen">
                <div class="start-content">
                    <h1 class="game-title">RED EYE DUCK</h1>
                    <div class="duck-display">
                        <img src="${UTILS.getDuckImagePath(
                          0
                        )}" alt="Duck" class="duck-image" />
                    </div>
                    <p class="game-description">
                        ${MESSAGES.UI.START_DESCRIPTION}
                    </p>
                    <button id="start-button" class="start-button">
                        ${MESSAGES.UI.START_BUTTON}
                    </button>
                </div>
            </div>
        `;
  },

  attachEventListeners: () => {
    const startButton = document.getElementById("start-button");
    if (startButton) {
      startButton.addEventListener("click", () => {
        UTILS.playAudio(CONFIG.AUDIO.CHOICE_SOUND);

        // Play airplane ding sound
        UTILS.playAudio(CONFIG.AUDIO.AIRPLANE_DING);

        Game.startGame();
      });
    }
  },

  init: () => {
    const container = document.getElementById("game-container");
    container.innerHTML = StartScreen.render();
    StartScreen.attachEventListeners();

    // Start happy background music
    UTILS.switchBackgroundMusic(0);
  },
};
