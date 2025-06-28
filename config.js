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
    BACKGROUND_MUSIC_HAPPY: "background-music",
    BACKGROUND_MUSIC_UPSET: "background-music-upset",
    BACKGROUND_MUSIC_DEATH: "background-music-death",
    CHOICE_SOUND: "choice-sound",
    CHOICE_HOVER: "choice-hover",
    AIRPLANE_DING: "airplane-ding",
    DUCK_RESPONSE: "duck-response-sound",
    TIMER_TICK: "timer-tick",
    RAGE_INCREASE: "rage-increase",
    DEATH_SOUND: "death-sound",
    LANDING_SOUND: "landing-sound",
  },

  // Music rage thresholds
  MUSIC_THRESHOLDS: {
    HAPPY: { min: 0, max: 4 },
    UPSET: { min: 5, max: 9 },
    DEATH: { min: 10, max: 12 },
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

  // Get appropriate background music based on rage level
  getMusicTrackForRage: (rageLevel) => {
    if (rageLevel >= CONFIG.MUSIC_THRESHOLDS.DEATH.min) {
      return CONFIG.AUDIO.BACKGROUND_MUSIC_DEATH;
    } else if (rageLevel >= CONFIG.MUSIC_THRESHOLDS.UPSET.min) {
      return CONFIG.AUDIO.BACKGROUND_MUSIC_UPSET;
    } else {
      return CONFIG.AUDIO.BACKGROUND_MUSIC_HAPPY;
    }
  },

  // Switch background music based on rage level
  switchBackgroundMusic: (rageLevel, currentTrack = null) => {
    const newTrack = UTILS.getMusicTrackForRage(rageLevel);

    // Don't switch if already playing the correct track
    if (currentTrack === newTrack) return newTrack;

    // Stop all music tracks
    const allTracks = [
      CONFIG.AUDIO.BACKGROUND_MUSIC_HAPPY,
      CONFIG.AUDIO.BACKGROUND_MUSIC_UPSET,
      CONFIG.AUDIO.BACKGROUND_MUSIC_DEATH,
    ];

    allTracks.forEach((trackId) => {
      const audio = document.getElementById(trackId);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Start the new track
    const newAudio = document.getElementById(newTrack);
    if (newAudio) {
      newAudio.volume = CONFIG.MUSIC_VOLUME;
      newAudio.play().catch((e) => console.log("Music switch failed:", e));
    }

    return newTrack;
  },
};
