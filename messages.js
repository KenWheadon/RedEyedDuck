// Game messages and dialogue system
const MESSAGES = {
  // Ending messages
  ENDINGS: {
    [CONFIG.ENDINGS.SUPER_DEAD]: {
      title: "SUPER DEAD",
      message:
        "The duck's eyes blaze red as its form shifts and warps. The last thing you see is its terrible smile as reality tears apart around you.",
      color: "#ff0000",
    },
    [CONFIG.ENDINGS.HOW_UNLUCKY]: {
      title: "HOW UNLUCKY",
      message:
        "You land safely, but the duck's parting glance promises this isn't over. Tomorrow's newspaper will have an interesting obituary.",
      color: "#ff6600",
    },
    [CONFIG.ENDINGS.RED_EYE_REDEMPTION]: {
      title: "RED-EYE REDEMPTION",
      message:
        "You walked the razor's edge and survived. The duck nods with something resembling respect as you depart. You'll sleep well tonight.",
      color: "#ffaa00",
    },
    [CONFIG.ENDINGS.SUSPICIOUS_WIN]: {
      title: "SUSPICIOUS WIN",
      message:
        "A perfectly polite conversation with a perfectly normal duck. Almost too normal. The duck seems... disappointed by your caution.",
      color: "#ffcc00",
    },
    [CONFIG.ENDINGS.NEUTRAL]: {
      title: "NEUTRAL LANDING",
      message:
        "The flight ends with mild tension in the air. The duck's knowing stare follows you off the plane, but nothing terrible happens. Tonight.",
      color: "#00ff00",
    },
  },

  // UI text
  UI: {
    FLIGHT_NUMBER: "Flight 666",
    TIMER_LABEL: "Time:",
    DUCK_LABEL: "Duck:",
    ROUND_LABEL: "Round",
    START_DESCRIPTION: `You're on a red-eye flight, and the duck in the seat next to you wants to chat.
Keep the conversation light. Keep the duck calm.
Survive all 20 exchanges without triggering something... unpleasant.`,
    START_BUTTON: "Board Flight",
    RESTART_BUTTON: "Take Another Flight",
    FINAL_RAGE_LABEL: "Final Rage Level:",
    MAX_RAGE_LABEL: "Max Rage Reached:",
    ROUNDS_SURVIVED_LABEL: "Rounds Survived:",
  },
};

// Game dialogue data - loaded from response-duck.json
let GAME_DATA = [];

// Load game dialogue from JSON file
const loadGameData = async () => {
  try {
    const response = await fetch("response-duck.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    GAME_DATA = await response.json();
    console.log("Game data loaded successfully");
    return true;
  } catch (error) {
    console.error("Failed to load game data:", error);
    // Fallback data in case JSON fails to load
    GAME_DATA = [
      {
        id: 1,
        duck: "Hello. I'm not used to flying economy.",
        choices: [
          {
            text: "Same. These seats are brutal.",
            response: "Ugh, I knew you'd get it.",
            rage: 0,
          },
          {
            text: "Then why are you here?",
            response: "Circumstances... changed.",
            rage: 1,
          },
          { text: "I like it. Feels democratic.", response: "Hmm.", rage: 2 },
          {
            text: "(Say nothing)",
            response: "Duck stares longer than necessary.",
            rage: 1,
          },
        ],
      },
    ];
    return false;
  }
};

// Get current question data
const getCurrentQuestion = (roundIndex) => {
  if (roundIndex >= 0 && roundIndex < GAME_DATA.length) {
    return GAME_DATA[roundIndex];
  }
  return null;
};
