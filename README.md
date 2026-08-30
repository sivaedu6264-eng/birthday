# 🎂 Midnight Memories — Premium Cinematic Birthday Surprise Website

An interactive, cinematic birthday surprise website built exclusively for **Nagii Bangaram**.

---

## 🎵 Feel-Good Background Music Engine

The website features an adaptive background audio engine designed for emotional progression:

### 🎼 Emotional Volume Progression:
- **`YES ❤️`** ➔ Music gently starts with a soft fade-in (`vol ~0.25`).
- **Countdown** ➔ Music builds slightly (`vol ~0.35`).
- **🎉 HAPPY BIRTHDAY (Reveal)** ➔ Uplifting celebratory volume swell (`vol ~0.48`).
- **🍰 Cake & Candles** ➔ Warm, happy feel-good tone (`vol ~0.40`).
- **📸 Photo Reveal** ➔ Softer emotional atmosphere (`vol ~0.30`).
- **💌 Personal Letter** ➔ Calm, warm backdrop (`vol ~0.22` — never obscures text).
- **🎁 Final Gift Box** ➔ Builds excitement again (`vol ~0.45`).
- **❤️ Final Portrait & Outro** ➔ Beautiful emotional resolution (`vol ~0.30`).

### 🎵 Floating Music Widget:
- Tap the **🎵** button in the top-right corner anytime to **Play / Pause**.
- Animated equalizer waves reflect live playback state.
- Supports smooth fade-in and fade-out transitions.

### 📁 Music File Placement:
Place any royalty-free feel-good MP3 track at:
`assets/audio/birthday-song.mp3` *(or `assets/audio/birthday.mp3`)*

> **Built-in Fallback**: If no MP3 file is present, the website automatically activates a built-in melodic ambient harp/piano chord synthesizer using Web Audio API so it plays warm, peaceful music out of the box!

---

## 🔒 Strict Name Rule Implementation

- **BEFORE COUNTDOWN**: The name is **strictly hidden** across all loading, question, and welcome screens. Only generic text is shown (*"Hey 👀"*, *"I made something special for you..."*, *"Choose wisely... 👀"*, *"A Special Surprise ✨"*).
- **AFTER COUNTDOWN (Reveal)**: Immediately after `3 ➔ 2 ➔ 1`, the name is unveiled as **`❤️ NAGII BANGARAM ❤️`** in neon pink glow with confetti and star particles, and used consistently across all following sections (Cake, Photo Reveal, Personal Message, Final Gift, Final Photo Presentation, and Ending Outro).

---

## 🌟 The Complete Cinematic Flow

```text
💕 DO YOU LOVE ME? (Name hidden)
        ↓
YES ❤️ / NO 😏 (Runaway playful button ➔ YES starts gentle music)
        ↓
🔐 UNLOCKING SURPRISE (Name hidden: "Preparing..." ➔ "Loading memories..." ➔ "Ready? ❤️")
        ↓
👀 WELCOME SCREEN (Name hidden: "Hey 👀" ➔ "✨ START THE JOURNEY")
        ↓
🎬 COUNTDOWN (3... 2... 1...)
        ↓
🎉 HAPPY BIRTHDAY 🎉 ➔ ❤️ NAGII BANGARAM ❤️ (NAME REVEALED + MUSIC SWELL)
        ↓
🍰 BIRTHDAY CAKE ("Make a wish, Nagii Bangaram ✨" ➔ "✨ BLOW THE CANDLES" ➔ smoke & confetti ➔ "Wish made, Nagii Bangaram? ❤️")
        ↓
📸 CINEMATIC PHOTO REVEAL ("This is you, Nagii Bangaram ❤️" + 3D Parallax & FX chips)
        ↓
💌 PERSONAL BIRTHDAY MESSAGE ("I wanted to tell you something, Nagii Bangaram... 💌" + Typewriter letter reveal)
        ↓
🎁 FINAL SURPRISE GIFT (Closed gift box ➔ 🎁 OPEN YOUR GIFT ➔ starburst explosion)
        ↓
📸 FINAL PHOTO & BIRTHDAY WISH (Cinematic portrait card + "NAGII BANGARAM ❤️" + "Keep smiling. Keep being you. ✨" + final wish)
        ↓
🌌 CINEMATIC ENDING (Starry outro: "This little surprise was made just for you, Nagii Bangaram. ❤️" ➔ "HAPPY BIRTHDAY, NAGII BANGARAM 🎂")
```

---

## ⚙️ Easy Customization Guide

All personal text, names, messages, and assets are in the single `CONFIG` object at the top of [`script.js`](file:///d:/personal%20%20projects/birthday/birthday-website/script.js):

```javascript
const CONFIG = {
    friendName: "Nagii Bangaram",
    photo: "assets/images/friend.jpg",
    music: "assets/audio/birthday-song.mp3",
    birthdayMessage: "Some people make ordinary moments feel special. Today is your day, so here's a little reminder of how incredibly special you are to me...",
    finalMessage: "Here's to another year of happiness, success, laughter and amazing memories. Happy Birthday ❤️"
};
```

---

## 🚀 Live Localhost Server

Your local Node server is live and running at:
👉 **[http://localhost:5500/](http://localhost:5500/)**
