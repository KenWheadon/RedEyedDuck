// Game configuration and constants
const CONFIG = {
  // Timer settings
  CHOICE_TIMER: 10,
  RESPONSE_DISPLAY_TIME: 2000,

  // Rage system
  MAX_RAGE: 12,
  MIN_RAGE: 0,
  DEATH_RAGE: 12,

  // Game progression
  TOTAL_ROUNDS: 20,

  // Audio settings
  MUSIC_VOLUME: 0.3,
  SFX_VOLUME: 0.7,

  // File paths
  IMAGES: {
    DUCK_PREFIX: "images/duck-rage-",
    DUCK_EXTENSION: ".png",
    BACKGROUND: "images/airplane-cabin.jpg",
  },

  AUDIO: {
    BACKGROUND_MUSIC: "background-music",
    CHOICE_SOUND: "choice-sound",
    DUCK_RESPONSE: "duck-response-sound",
    TIMER_TICK: "timer-tick",
    RAGE_INCREASE: "rage-increase",
    DEATH_SOUND: "death-sound",
    LANDING_SOUND: "landing-sound",
  },

  // Ending conditions
  ENDINGS: {
    SUPER_DEAD: "super-dead",
    HOW_UNLUCKY: "how-unlucky",
    RED_EYE_REDEMPTION: "red-eye-redemption",
    SUSPICIOUS_WIN: "suspicious-win",
    NEUTRAL: "neutral",
  },
};

// Utility functions
const UTILS = {
  // Get duck image path based on rage level
  getDuckImagePath: (rageLevel) => {
    const clampedRage = Math.max(0, Math.min(CONFIG.MAX_RAGE, rageLevel));
    return `${CONFIG.IMAGES.DUCK_PREFIX}${clampedRage}${CONFIG.IMAGES.DUCK_EXTENSION}`;
  },

  // Play audio with volume control
  playAudio: (audioId, volume = CONFIG.SFX_VOLUME) => {
    const audio = document.getElementById(audioId);
    if (audio) {
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch((e) => console.log("Audio play failed:", e));
    }
  },

  // Clamp rage between min and max
  clampRage: (rage) => {
    return Math.max(CONFIG.MIN_RAGE, Math.min(CONFIG.MAX_RAGE, rage));
  },

  // Get ending type based on final rage and max rage reached
  getEndingType: (finalRage, maxRageReached) => {
    if (finalRage >= CONFIG.DEATH_RAGE) return CONFIG.ENDINGS.SUPER_DEAD;
    if (finalRage >= 10) return CONFIG.ENDINGS.HOW_UNLUCKY;
    if (maxRageReached > 10 && finalRage < 10)
      return CONFIG.ENDINGS.RED_EYE_REDEMPTION;
    if (maxRageReached <= 1) return CONFIG.ENDINGS.SUSPICIOUS_WIN; // FIXED: never went above 1
    return CONFIG.ENDINGS.NEUTRAL;
  },
};
