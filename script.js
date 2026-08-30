/* ==========================================================================
   MIDNIGHT MEMORIES — BIRTHDAY SURPRISE SCRIPT (CINEMATIC EXPERIENCE)
   ========================================================================== */

/**
 * EASY CUSTOMIZATION CONFIGURATION
 * All personal details, messages, and audio paths are defined here.
 */
const CONFIG = {
    // Exact spelling for the birthday person
    friendName: "Nagii Bangaram",

    // Path to single photo (located in assets/images/friend.jpg)
    photo: "assets/images/friend.jpg",

    // Path to background audio (feel-good, warm, uplifting track)
    music: "assets/audio/birthday-song.mp3",

    // Step 7: Personal Birthday Message
    birthdayMessage: "Some people make ordinary moments feel special. Today is your day, so here's a little reminder of how incredibly special you are to me...",

    // Step 9: Final Birthday Message
    finalMessage: "Here's to another year of happiness, success, laughter and amazing memories. Happy Birthday ❤️"
};

/* ==========================================================================
   APPLICATION ENGINE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // State Variables
    let currentScreen = "screen-love-question";
    let noButtonClickCount = 0;
    let areCandlesBlown = false;
    let isTypewriterActive = false;

    const loveNoResponses = [
        "Are you sure? 👀",
        "Think again 😂",
        "No isn't an option! 😜",
        "Nice try, but you love me ❤️",
        "Just click YES already! 🥰",
        "You know you love me! ✨"
    ];

    // DOM Elements
    const elements = {
        particleCanvas: document.getElementById("particle-canvas"),
        confettiCanvas: document.getElementById("confetti-canvas"),
        bgAudio: document.getElementById("bg-music"),
        audioControl: document.getElementById("audio-control"),
        musicBtn: document.getElementById("music-toggle-btn"),
        iconPlay: document.querySelector(".icon-play"),
        iconPause: document.querySelector(".icon-pause"),

        // Screens
        screenLoveQuestion: document.getElementById("screen-love-question"),
        screenLoading: document.getElementById("screen-loading"),
        screenWelcome: document.getElementById("screen-welcome"),
        screenCountdown: document.getElementById("screen-countdown"),
        screenCake: document.getElementById("screen-cake"),
        screenPhotoReveal: document.getElementById("screen-photo-reveal"),
        screenWords: document.getElementById("screen-words"),
        screenGift: document.getElementById("screen-gift"),
        screenFinalReveal: document.getElementById("screen-final-reveal"),
        screenEnding: document.getElementById("screen-ending"),

        // Love Screen Elements
        loveQuestionText: document.getElementById("love-question-text"),
        loveSubText: document.getElementById("love-sub-text"),
        btnLoveYes: document.getElementById("btn-love-yes"),
        btnLoveNo: document.getElementById("btn-love-no"),
        loveButtonsZone: document.getElementById("love-buttons-zone"),

        // Loading Elements
        loadingText: document.getElementById("loading-text"),
        loadingProgress: document.getElementById("loading-progress"),

        // Welcome & Countdown Elements
        welcomeTitle: document.getElementById("welcome-title"),
        countdownNumber: document.getElementById("countdown-number"),
        countdownReveal: document.getElementById("countdown-reveal"),
        btnStart: document.getElementById("btn-start"),
        btnAfterCountdown: document.getElementById("btn-after-countdown"),

        // Cake Elements
        birthdayCake: document.getElementById("birthday-cake"),
        btnBlowCandles: document.getElementById("btn-blow-candles"),
        cakeWishStatus: document.getElementById("cake-wish-status"),
        btnAfterCake: document.getElementById("btn-after-cake"),

        // Photo Reveal Elements
        mainFriendPhoto: document.getElementById("main-friend-photo"),
        photoFrameWrapper: document.getElementById("photo-frame-wrapper"),
        fxZoom: document.getElementById("fx-zoom"),
        fxGlow: document.getElementById("fx-glow"),
        fxParticles: document.getElementById("fx-particles"),
        btnToWords: document.getElementById("btn-to-words"),

        // Words Elements
        wordsTextContainer: document.getElementById("words-text-container"),
        btnToGift: document.getElementById("btn-to-gift"),

        // Gift & Final Reveal Elements
        giftBox: document.getElementById("gift-box"),
        btnOpenGift: document.getElementById("btn-open-gift"),
        finalFriendPhoto: document.getElementById("final-friend-photo"),
        finalFriendName: document.getElementById("final-friend-name"),
        finalBdayMessage: document.getElementById("final-bday-message"),
        btnToEnding: document.getElementById("btn-to-ending"),
        btnReplay: document.getElementById("btn-replay")
    };

    /* ----------------------------------------------------------------------
       1. CINEMATIC AUDIO & SYNTHESIZER ENGINE
       ---------------------------------------------------------------------- */
    class AudioEngine {
        constructor(audioEl, controlEl, iconPlay, iconPause) {
            this.audioEl = audioEl;
            this.controlEl = controlEl;
            this.iconPlay = iconPlay;
            this.iconPause = iconPause;
            this.isPlaying = false;
            this.currentVolume = 0.25;
            this.fadeInterval = null;
            this.audioCtx = null;
            this.synthInterval = null;
            this.isUsingSynth = false;

            // Audio volumes tailored for each scene
            this.sceneVolumes = {
                'screen-loading': 0.22,
                'screen-welcome': 0.28,
                'screen-countdown': 0.35,
                'reveal': 0.48,
                'screen-cake': 0.40,
                'screen-photo-reveal': 0.30,
                'screen-words': 0.22,
                'screen-gift': 0.45,
                'screen-final-reveal': 0.40,
                'screen-ending': 0.30
            };
        }

        init() {
            this.audioEl.volume = this.currentVolume;
            this.audioEl.addEventListener('error', () => {
                console.log("Audio file placeholder detected. Activating built-in ambient melodic synth fallback.");
                this.isUsingSynth = true;
            });
        }

        play(initialVol = 0.25) {
            this.isPlaying = true;
            this.updateUI(true);
            this.currentVolume = 0;
            this.audioEl.volume = 0;

            const playPromise = this.audioEl.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.fadeTo(initialVol, 1500);
                }).catch(err => {
                    console.log("Audio playback standard fallback:", err);
                    this.startSynthMelody();
                });
            } else {
                this.startSynthMelody();
            }
        }

        pause() {
            this.isPlaying = false;
            this.updateUI(false);
            this.fadeTo(0, 400, () => {
                this.audioEl.pause();
                this.stopSynthMelody();
            });
        }

        toggle() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play(this.currentVolume || 0.3);
            }
        }

        fadeTo(targetVol, durationMs = 1000, onComplete = null) {
            if (this.fadeInterval) clearInterval(this.fadeInterval);
            const startVol = this.audioEl.volume;
            const diff = targetVol - startVol;
            const steps = 30;
            const stepTime = durationMs / steps;
            let currentStep = 0;

            this.fadeInterval = setInterval(() => {
                currentStep++;
                const newVol = Math.max(0, Math.min(1, startVol + (diff * (currentStep / steps))));
                this.audioEl.volume = newVol;
                this.currentVolume = newVol;

                if (currentStep >= steps) {
                    clearInterval(this.fadeInterval);
                    this.audioEl.volume = Math.max(0, Math.min(1, targetVol));
                    this.currentVolume = targetVol;
                    if (onComplete) onComplete();
                }
            }, stepTime);
        }

        setProgression(sceneKey) {
            if (!this.isPlaying) return;
            const targetVol = this.sceneVolumes[sceneKey] || 0.3;
            this.fadeTo(targetVol, 1200);
        }

        updateUI(playing) {
            if (playing) {
                this.iconPlay.classList.add("hidden");
                this.iconPause.classList.remove("hidden");
                this.controlEl.classList.remove("paused");
            } else {
                this.iconPlay.classList.remove("hidden");
                this.iconPause.classList.add("hidden");
                this.controlEl.classList.add("paused");
            }
        }

        /* Built-in Emotional Ambient Melodic Synthesizer Fallback */
        startSynthMelody() {
            try {
                if (!this.audioCtx) {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    this.audioCtx = new AudioContext();
                }
                if (this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume();
                }

                // Peaceful, feel-good pentatonic chords (C, G, Am, F)
                const chords = [
                    [261.63, 329.63, 392.00, 493.88], // Cmaj7
                    [220.00, 261.63, 329.63, 392.00], // Am7
                    [174.61, 220.00, 261.63, 329.63], // Fmaj7
                    [196.00, 246.94, 293.66, 392.00]  // G6
                ];
                let chordIdx = 0;
                let noteIdx = 0;

                this.stopSynthMelody();
                this.synthInterval = setInterval(() => {
                    if (!this.isPlaying) return;
                    const chord = chords[chordIdx];
                    const freq = chord[noteIdx % chord.length];
                    this.playSynthNote(freq);

                    noteIdx++;
                    if (noteIdx % 4 === 0) {
                        chordIdx = (chordIdx + 1) % chords.length;
                    }
                }, 600);
            } catch (e) {
                console.log("Web Audio synth not supported in this environment");
            }
        }

        playSynthNote(freq) {
            if (!this.audioCtx || this.audioCtx.state !== 'running') return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            // Soft envelope
            gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.04, this.audioCtx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.6);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 1.7);
        }

        stopSynthMelody() {
            if (this.synthInterval) {
                clearInterval(this.synthInterval);
                this.synthInterval = null;
            }
        }
    }

    const soundManager = new AudioEngine(elements.bgAudio, elements.audioControl, elements.iconPlay, elements.iconPause);
    soundManager.init();

    elements.musicBtn.addEventListener("click", () => soundManager.toggle());

    /* ----------------------------------------------------------------------
       2. INITIALIZATION (STRICTLY GENERIC TEXT BEFORE COUNTDOWN)
       ---------------------------------------------------------------------- */
    function initConfig() {
        if (CONFIG.photo) {
            elements.mainFriendPhoto.src = CONFIG.photo;
            elements.finalFriendPhoto.src = CONFIG.photo;
        }

        // Before countdown: NO friend name displayed anywhere
        document.title = "A Special Surprise ✨";
        elements.welcomeTitle.textContent = "Hey 👀";

        // Post-countdown components initialized
        elements.finalFriendName.textContent = `${CONFIG.friendName.toUpperCase()} ❤️`;
        elements.finalBdayMessage.textContent = CONFIG.finalMessage;

        // Reveal floating audio control
        elements.audioControl.classList.remove("hidden");
    }

    /* ----------------------------------------------------------------------
       3. CANVAS PARTICLES & CONFETTI ENGINE
       ---------------------------------------------------------------------- */
    let particleCtx, confettiCtx;
    let particles = [];
    let confettiList = [];

    function setupCanvases() {
        const resize = () => {
            elements.particleCanvas.width = window.innerWidth;
            elements.particleCanvas.height = window.innerHeight;
            elements.confettiCanvas.width = window.innerWidth;
            elements.confettiCanvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        particleCtx = elements.particleCanvas.getContext("2d");
        confettiCtx = elements.confettiCanvas.getContext("2d");

        createParticles();
        animateParticles();
        animateConfetti();
    }

    function createParticles() {
        particles = [];
        const count = Math.min(Math.floor(window.innerWidth / 15), 60);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: Math.random() * 2 + 1,
                color: ['rgba(157,78,221,', 'rgba(255,42,133,', 'rgba(0,242,254,'][Math.floor(Math.random() * 3)],
                alpha: Math.random() * 0.7 + 0.3,
                speedY: -(Math.random() * 0.4 + 0.1),
                speedX: (Math.random() - 0.5) * 0.3,
                pulse: Math.random() * 0.02
            });
        }
    }

    function animateParticles() {
        particleCtx.clearRect(0, 0, elements.particleCanvas.width, elements.particleCanvas.height);
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.alpha += Math.sin(Date.now() * p.pulse) * 0.01;

            if (p.y < 0) p.y = elements.particleCanvas.height;
            if (p.x < 0 || p.x > elements.particleCanvas.width) p.x = Math.random() * elements.particleCanvas.width;

            particleCtx.beginPath();
            particleCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            particleCtx.fillStyle = p.color + Math.max(0.1, Math.min(1, p.alpha)) + ')';
            particleCtx.shadowBlur = 10;
            particleCtx.shadowColor = '#9d4edd';
            particleCtx.fill();
        });
        requestAnimationFrame(animateParticles);
    }

    function triggerConfettiBurst() {
        const colors = ['#ff2a85', '#9d4edd', '#00f2fe', '#ffd700', '#ffffff'];
        for (let i = 0; i < 90; i++) {
            confettiList.push({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.7) * 16,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                life: 1
            });
        }
    }

    function animateConfetti() {
        confettiCtx.clearRect(0, 0, elements.confettiCanvas.width, elements.confettiCanvas.height);
        for (let i = confettiList.length - 1; i >= 0; i--) {
            const c = confettiList[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.25; // gravity
            c.rotation += c.rotSpeed;
            c.life -= 0.012;

            if (c.life <= 0) {
                confettiList.splice(i, 1);
                continue;
            }

            confettiCtx.save();
            confettiCtx.translate(c.x, c.y);
            confettiCtx.rotate((c.rotation * Math.PI) / 180);
            confettiCtx.fillStyle = c.color;
            confettiCtx.globalAlpha = c.life;
            confettiCtx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
            confettiCtx.restore();
        }
        requestAnimationFrame(animateConfetti);
    }

    /* ----------------------------------------------------------------------
       4. SCREEN TRANSITION CONTROLLER WITH MUSIC PROGRESSION
       ---------------------------------------------------------------------- */
    function switchScreen(targetId) {
        const currentEl = document.getElementById(currentScreen);
        const targetEl = document.getElementById(targetId);

        if (!targetEl) return;

        if (currentEl) {
            currentEl.classList.remove("active");
            setTimeout(() => {
                currentEl.classList.add("hidden");
                targetEl.classList.remove("hidden");
                setTimeout(() => {
                    targetEl.classList.add("active");
                    currentScreen = targetId;
                    soundManager.setProgression(targetId);
                }, 50);
            }, 400);
        } else {
            targetEl.classList.remove("hidden");
            targetEl.classList.add("active");
            currentScreen = targetId;
            soundManager.setProgression(targetId);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ----------------------------------------------------------------------
       5. STEP 1: "DO YOU LOVE ME?" INTERACTIVE NO/YES LOGIC
       ---------------------------------------------------------------------- */
    function moveNoButton() {
        noButtonClickCount++;

        // Update playful prompt text
        const responseIdx = (noButtonClickCount - 1) % loveNoResponses.length;
        elements.loveSubText.textContent = loveNoResponses[responseIdx];

        // Safe bounded displacement calculation
        const maxOffset = 90;
        const randomX = (Math.random() * maxOffset * 2 - maxOffset);
        const randomY = (Math.random() * 50 - 25);

        elements.btnLoveNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }

    elements.btnLoveNo.addEventListener("mouseenter", moveNoButton);
    elements.btnLoveNo.addEventListener("touchstart", (e) => {
        e.preventDefault();
        moveNoButton();
    });
    elements.btnLoveNo.addEventListener("click", (e) => {
        e.preventDefault();
        moveNoButton();
    });

    elements.btnLoveYes.addEventListener("click", () => {
        triggerConfettiBurst();
        elements.btnLoveYes.classList.add("active");

        // Start music gently upon initial user interaction
        soundManager.play(0.25);

        setTimeout(() => {
            switchScreen("screen-loading");
            startLoadingSequence();
        }, 500);
    });

    /* ----------------------------------------------------------------------
       6. STEP 2: UNLOCKING SURPRISE LOADING SEQUENCE
       ---------------------------------------------------------------------- */
    function startLoadingSequence() {
        const phrases = [
            "Preparing something special...",
            "Loading memories...",
            "Almost ready...",
            "Ready? ❤️"
        ];
        let step = 0;
        elements.loadingProgress.style.width = "10%";

        const interval = setInterval(() => {
            step++;
            if (step < phrases.length) {
                elements.loadingText.textContent = phrases[step];
                elements.loadingProgress.style.width = `${((step + 1) / phrases.length) * 100}%`;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    switchScreen("screen-welcome");
                }, 700);
            }
        }, 1100);
    }

    /* ----------------------------------------------------------------------
       7. STEP 4: COUNTDOWN SEQUENCE (NAME REVEALED HERE!)
       ---------------------------------------------------------------------- */
    function startCountdownSequence() {
        let count = 3;
        elements.countdownNumber.textContent = count;
        elements.countdownNumber.classList.remove("hidden");
        elements.countdownReveal.classList.add("hidden");
        elements.btnAfterCountdown.classList.add("hidden");

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                elements.countdownNumber.textContent = count;
            } else {
                clearInterval(interval);
                elements.countdownNumber.classList.add("hidden");
                
                // Set name reveal HTML with neon pink glow
                elements.countdownReveal.innerHTML = `🎉 HAPPY BIRTHDAY 🎉<br><span class="highlight-name" style="color: #ff69b4; text-shadow: 0 0 8px #ff69b4, 0 0 16px #ff1493, 0 0 28px #ff69b4;">❤️ ${CONFIG.friendName.toUpperCase()} ❤️</span>`;
                elements.countdownReveal.classList.remove("hidden");
                elements.btnAfterCountdown.classList.remove("hidden");
                
                // Update document title now that name is revealed
                document.title = `Happy Birthday ${CONFIG.friendName} ✨`;

                // Uplifting music swell at Happy Birthday moment
                soundManager.setProgression('reveal');
                triggerConfettiBurst();
            }
        }, 1000);
    }

    /* ----------------------------------------------------------------------
       8. STEP 5: BIRTHDAY CAKE & BLOW CANDLES
       ---------------------------------------------------------------------- */
    elements.btnBlowCandles.addEventListener("click", () => {
        if (areCandlesBlown) return;
        areCandlesBlown = true;
        
        elements.birthdayCake.classList.add("candles-blown");
        elements.btnBlowCandles.classList.add("hidden");
        elements.cakeWishStatus.classList.remove("hidden");
        elements.btnAfterCake.classList.remove("hidden");
        triggerConfettiBurst();
    });

    /* ----------------------------------------------------------------------
       9. STEP 6: INTERACTIVE PHOTO TRANSFORMATIONS
       ---------------------------------------------------------------------- */
    elements.fxZoom.addEventListener("click", () => {
        elements.photoFrameWrapper.classList.toggle("fx-zoom");
        elements.fxZoom.classList.toggle("active");
    });

    elements.fxGlow.addEventListener("click", () => {
        elements.photoFrameWrapper.classList.toggle("fx-glow");
        elements.fxGlow.classList.toggle("active");
    });

    elements.fxParticles.addEventListener("click", () => {
        elements.photoFrameWrapper.classList.toggle("fx-particles");
        elements.fxParticles.classList.toggle("active");
    });

    // 3D Parallax Tilt Effect on Photo Hover/Touch
    elements.photoFrameWrapper.addEventListener("mousemove", (e) => {
        const rect = elements.photoFrameWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        elements.photoFrameWrapper.style.transform = `perspective(600px) rotateY(${x / 15}deg) rotateX(${-y / 15}deg)`;
    });

    elements.photoFrameWrapper.addEventListener("mouseleave", () => {
        elements.photoFrameWrapper.style.transform = `perspective(600px) rotateY(0deg) rotateX(0deg)`;
    });

    /* ----------------------------------------------------------------------
       10. STEP 7: TYPEWRITER / ANIMATED MESSAGE REVEAL
       ---------------------------------------------------------------------- */
    function typeMessage(text) {
        elements.wordsTextContainer.textContent = "";
        let i = 0;
        isTypewriterActive = true;
        const speed = 28;

        function typeChar() {
            if (i < text.length) {
                elements.wordsTextContainer.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            } else {
                isTypewriterActive = false;
            }
        }
        typeChar();
    }

    /* ----------------------------------------------------------------------
       11. STEP 8: GIFT BOX & FINAL PHOTO REVEAL
       ---------------------------------------------------------------------- */
    elements.btnOpenGift.addEventListener("click", () => {
        elements.giftBox.classList.add("opened");
        triggerConfettiBurst();
        soundManager.setProgression('screen-gift');
        setTimeout(() => {
            triggerConfettiBurst();
            switchScreen("screen-final-reveal");
        }, 1200);
    });

    /* ----------------------------------------------------------------------
       12. NAVIGATION BUTTON BINDINGS
       ---------------------------------------------------------------------- */
    elements.btnStart.addEventListener("click", () => {
        switchScreen("screen-countdown");
        startCountdownSequence();
    });

    elements.btnAfterCountdown.addEventListener("click", () => switchScreen("screen-cake"));
    elements.btnAfterCake.addEventListener("click", () => switchScreen("screen-photo-reveal"));
    
    elements.btnToWords.addEventListener("click", () => {
        switchScreen("screen-words");
        setTimeout(() => {
            typeMessage(CONFIG.birthdayMessage);
        }, 500);
    });

    elements.btnToGift.addEventListener("click", () => switchScreen("screen-gift"));
    elements.btnToEnding.addEventListener("click", () => switchScreen("screen-ending"));

    elements.btnReplay.addEventListener("click", () => {
        // Reset states
        elements.giftBox.classList.remove("opened");
        elements.birthdayCake.classList.remove("candles-blown");
        elements.btnBlowCandles.classList.remove("hidden");
        elements.cakeWishStatus.classList.add("hidden");
        elements.btnAfterCake.classList.add("hidden");
        areCandlesBlown = false;
        elements.btnLoveNo.style.transform = "none";
        elements.loveSubText.textContent = "Choose wisely... 👀";
        noButtonClickCount = 0;

        switchScreen("screen-welcome");
    });

    /* ----------------------------------------------------------------------
       13. START APP
       ---------------------------------------------------------------------- */
    initConfig();
    setupCanvases();
});
