const majorArcana = [
  ["the-fool", "The Fool", "0", "RWS_Tarot_00_Fool.jpg", "A beginning with open hands"],
  ["the-magician", "The Magician", "I", "RWS_Tarot_01_Magician.jpg", "Love made intentional"],
  ["the-high-priestess", "The High Priestess", "II", "RWS_Tarot_02_High_Priestess.jpg", "The quiet truth beneath words"],
  ["the-empress", "The Empress", "III", "RWS_Tarot_03_Empress.jpg", "Devotion that becomes a home"],
  ["the-emperor", "The Emperor", "IV", "RWS_Tarot_04_Emperor.jpg", "Care with structure and steadiness"],
  ["the-hierophant", "The Hierophant", "V", "RWS_Tarot_05_Hierophant.jpg", "A promise with roots"],
  ["the-lovers", "The Lovers", "VI", "RWS_Tarot_06_Lovers.jpg", "A choice made again and again"],
  ["the-chariot", "The Chariot", "VII", "RWS_Tarot_07_Chariot.jpg", "Moving forward together"],
  ["strength", "Strength", "VIII", "RWS_Tarot_08_Strength.jpg", "Softness that is powerful"],
  ["the-hermit", "The Hermit", "IX", "RWS_Tarot_09_Hermit.jpg", "Space that protects the flame"],
  ["wheel-of-fortune", "Wheel of Fortune", "X", "RWS_Tarot_10_Wheel_of_Fortune.jpg", "The turning point"],
  ["justice", "Justice", "XI", "RWS_Tarot_11_Justice.jpg", "Clear love, fair love"],
  ["the-hanged-man", "The Hanged Man", "XII", "RWS_Tarot_12_Hanged_Man.jpg", "A pause that changes everything"],
  ["death", "Death", "XIII", "RWS_Tarot_13_Death.jpg", "The old fear releases its grip"],
  ["temperance", "Temperance", "XIV", "RWS_Tarot_14_Temperance.jpg", "Two hearts finding rhythm"],
  ["the-devil", "The Devil", "XV", "RWS_Tarot_15_Devil.jpg", "Desire asking for honesty"],
  ["the-tower", "The Tower", "XVI", "RWS_Tarot_16_Tower.jpg", "Truth clearing the air"],
  ["the-star", "The Star", "XVII", "RWS_Tarot_17_Star.jpg", "Hope that feels clean and real"],
  ["the-moon", "The Moon", "XVIII", "RWS_Tarot_18_Moon.jpg", "Mystery, intuition, hidden feeling"],
  ["the-sun", "The Sun", "XIX", "RWS_Tarot_19_Sun.jpg", "Joy without armor"],
  ["judgement", "Judgement", "XX", "RWS_Tarot_20_Judgement.jpg", "A call to love more awake"],
  ["the-world", "The World", "XXI", "RWS_Tarot_21_World.jpg", "Wholeness, arrival, celebration"],
];

const majorMeanings = {
  "the-fool":
    "Love asks for brave softness. The Fool says that the sweetest parts of your bond grow when neither of you needs the whole map before taking the next step. Trust the small leap: the text sent first, the apology offered warmly, the plan made because joy deserves a place on the calendar.",
  "the-magician":
    "The Magician says love becomes extraordinary when intention meets action. Say the beautiful thing out loud. Make the plan. Turn affection into gestures she can feel, not just feelings you keep private.",
  "the-high-priestess":
    "The High Priestess points to the private language between two people. There is a truth beneath the obvious conversation. Listen for tone, timing, and silence; intimacy grows when intuition is treated as evidence worth honoring.",
  "the-empress":
    "The Empress is tenderness made practical. She points to love that is fed by attention, beauty, touch, good food, rest, and words that make the nervous system unclench. Protect the romantic garden you are growing together.",
  "the-emperor":
    "The Emperor brings steadiness. Romance becomes safer when it has structure: consistency, reliability, and care that shows up even when the day is not easy. This is love as protection, not control.",
  "the-hierophant":
    "The Hierophant asks what kind of promise your love wants to become. Shared rituals, values, and private traditions matter now. Build something that feels sacred because you both keep returning to it.",
  "the-lovers":
    "The Lovers is not only chemistry; it is alignment. It says the relationship becomes more powerful when desire and honesty sit at the same table. Choose each other with clear eyes, specific words, and a willing heart.",
  "the-chariot":
    "The Chariot says the relationship has momentum when both people face the same direction. Let tenderness have ambition. Decide what you are moving toward together, then protect the pace from distraction.",
  strength:
    "Strength is affection without force. The card says the soft approach is the powerful one: patience, warmth, humor, and a hand held at the right moment. Love does not need to win; it needs to understand.",
  "the-hermit":
    "The Hermit honors the space that keeps love honest. A little quiet can make the heart clearer. Step back from noise, then return with words that are calmer, truer, and more worthy of her trust.",
  "wheel-of-fortune":
    "Wheel of Fortune marks a turn in the story. Something between you is changing shape. Meet the change with curiosity instead of fear, because luck often enters through a door that first looks unfamiliar.",
  justice:
    "Justice asks for clean truth. Love deepens when both people feel heard, respected, and fairly met. Say what matters without punishment, and let accountability become a form of care.",
  "the-hanged-man":
    "The Hanged Man says pause before reacting. A new perspective can save a tender moment from becoming a hard one. Surrender the need to be immediately right and look for the meaning underneath.",
  death:
    "Death is the deep exhale after something false has ended. In love, it rarely means loss; it means the relationship is ready to outgrow an old defense, old silence, or old habit. Something more intimate can arrive now.",
  temperance:
    "Temperance is the art of blending two inner worlds. It asks for pacing, repair, and emotional balance. The most romantic thing may be the gentle way you help each other return to center.",
  "the-devil":
    "The Devil brings desire into the light. Attraction is powerful, but it wants honesty and freedom. Notice where fear, jealousy, habit, or longing tries to become a chain, then choose tenderness over possession.",
  "the-tower":
    "The Tower clears what was unstable. If something honest needs to be said, say it with care. The point is not drama; the point is a love strong enough to survive the truth.",
  "the-star":
    "The Star is the feeling of being safe enough to dream again. It brings healing, sweetness, and future-facing faith. Small promises kept can make love feel luminous.",
  "the-moon":
    "The Moon asks you to be gentle with what is not yet fully spoken. Do not punish the fog. Walk slowly, ask better questions, and pair intuition with reassurance rather than assumption.",
  "the-sun":
    "The Sun is open-hearted joy. It says love wants play, warmth, and simple delight. Let her feel chosen in daylight, not only in deep conversations or serious moments.",
  judgement:
    "Judgement is a wake-up call from the heart. Something wants to be named, forgiven, revived, or elevated. Answer with maturity and make the next version of love more conscious than the last.",
  "the-world":
    "The World is completion without an ending. It celebrates the beauty of arriving somewhere together. Honor what you have built, then let that wholeness become the ground for the next chapter.",
};

const suitProfiles = {
  Wands: {
    file: "Wands",
    element: "Fire",
    phrase: "chemistry, courage, desire, and the spark that keeps love alive",
  },
  Cups: {
    file: "Cups",
    element: "Water",
    phrase: "emotion, romance, tenderness, and the honest language of the heart",
  },
  Swords: {
    file: "Swords",
    element: "Air",
    phrase: "communication, clarity, nervous-system truth, and the words love needs",
  },
  Pentacles: {
    file: "Pents",
    element: "Earth",
    phrase: "devotion, daily care, safety, and the life you build around love",
  },
};

const ranks = [
  ["ace", "Ace", "a new seed"],
  ["two", "Two", "a choice between two hearts or paths"],
  ["three", "Three", "growth through trust and shared effort"],
  ["four", "Four", "stability, pause, and emotional architecture"],
  ["five", "Five", "friction that reveals what needs care"],
  ["six", "Six", "repair, sweetness, memory, and generosity"],
  ["seven", "Seven", "discernment, longing, and the courage to choose"],
  ["eight", "Eight", "movement, repetition, and the next honest step"],
  ["nine", "Nine", "private fulfillment and the inner weather of love"],
  ["ten", "Ten", "completion, overflow, and what love becomes in real life"],
  ["page", "Page", "a tender message, curiosity, and beginner's heart"],
  ["knight", "Knight", "pursuit, momentum, and the style of showing up"],
  ["queen", "Queen", "receptive power, emotional maturity, and devotion"],
  ["king", "King", "steady leadership, protection, and integrated love"],
];

function cardNumber(index) {
  return String(index + 1).padStart(2, "0");
}

function buildMinorMeaning(rank, suit, profile) {
  return `The ${rank} of ${suit} brings ${profile.phrase}. In this reading, it points to ${ranks.find((item) => item[1] === rank)?.[2]}. Let the card be practical: notice how love is asking to be felt today, then answer with one specific action, one honest sentence, or one warmer choice.`;
}

const minorArcana = Object.entries(suitProfiles).flatMap(([suit, profile]) =>
  ranks.map(([slug, rank, tone], index) => ({
    id: `${slug}-of-${suit.toLowerCase()}`,
    name: `${rank} of ${suit}`,
    arcana: `${profile.element} / Minor Arcana`,
    group: suit,
    image: `/cards/${profile.file}${cardNumber(index)}.jpg`,
    tone,
    meaning: buildMinorMeaning(rank, suit, profile),
  })),
);

export const tarotCards = [
  ...majorArcana.map(([id, name, numeral, file, tone]) => ({
    id,
    name,
    arcana: `Major Arcana ${numeral}`,
    group: "Major Arcana",
    image: `/cards/${file}`,
    tone,
    meaning: majorMeanings[id],
  })),
  ...minorArcana,
];

export const deckGroups = ["Major Arcana", "Wands", "Cups", "Swords", "Pentacles"];
