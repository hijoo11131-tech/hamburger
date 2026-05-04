const burgerImages = [
    'https://cdn.discordapp.com/attachments/1500557831705989209/1500558988477989016/IMG_0569.png?ex=69f8dff5&is=69f78e75&hm=d55aa3681e8ad4aada10541ad472e2e72db3e0632f89ef266a72c130174e7fb0&',
    'https://cdn.discordapp.com/attachments/1500557831705989209/1500684659573657661/IMG_0570.png?ex=69f95500&is=69f80380&hm=44753e7faf7ed48c7bb228742825f157fae68683835e6c0b948290f6d33a84d6&',
    'https://cdn.discordapp.com/attachments/1500557831705989209/1500559006735798493/IMG_0571.png?ex=69f8dffa&is=69f78e7a&hm=80698c57a662a7953df8f65425e66fec093522fa922851a5aab02aedd94c155d&',
    'https://cdn.discordapp.com/attachments/1500557831705989209/1500559014612959232/IMG_0572.png?ex=69f8dffc&is=69f78e7c&hm=8c291f0ffdf93ae203be244f48edd271cd198c9ee48af2ffa167bd63074c2cb0&',
    'https://cdn.discordapp.com/attachments/1500557831705989209/1500559989884977252/IMG_0573.png?ex=69f8e0e4&is=69f78f64&hm=6dd0797c57754e7d8ed7a8ee47ed0d4bbcc048630c8afe0f3525432ed53ed3fd&'
];

let currentStage = 0;
let resetCount = 0;
let totalCalories = 0;
let audioCtx = null;
let bonusCooldown = 0;
const audioBuffers = {};
let initPromise = null;

function initAudio() {
    if (initPromise) return initPromise;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    initPromise = Promise.all(
        ['eating', 'belching', 'farting'].map(name =>
            fetch(`sound/${name}.mp3`)
                .then(res => res.arrayBuffer())
                .then(buf => new Promise((resolve, reject) => {
                    try {
                        audioCtx.decodeAudioData(buf, decoded => {
                            audioBuffers[name] = decoded;
                            resolve();
                        }, reject);
                    } catch (e) {
                        reject(e);
                    }
                }))
        )
    );

    return initPromise;
}

function playBuffer(name, volume) {
    const buf = audioBuffers[name];
    if (!buf) return;
    const source = audioCtx.createBufferSource();
    const gain = audioCtx.createGain();
    source.buffer = buf;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(0);
}

function playBonusSound() {
    if (resetCount < 5) return;
    if (bonusCooldown > 0) {
        bonusCooldown--;
        return;
    }
    const rand = Math.random() * 100;
    if (rand < 1) {
        bonusCooldown = 5;
        playBuffer('farting', 1.0);
    } else if (rand < 3) {
        bonusCooldown = 5;
        playBuffer('belching', 1.0);
    }
}

function updateCalorieCounter() {
    document.getElementById('calorieValue').textContent = totalCalories.toLocaleString();
}

function eatBurger() {
    if (!audioCtx) {
        initAudio();
    } else {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        if (Object.keys(audioBuffers).length >= 3) {
            playBuffer('eating', 0.4);
            playBonusSound();
        }
    }

    currentStage = (currentStage + 1) % burgerImages.length;
    document.getElementById('burgerImage').src = burgerImages[currentStage];

    if (currentStage === 0) {
        resetCount++;
        totalCalories += 500;
        updateCalorieCounter();
    }
}

document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', (e) => e.preventDefault());
        .then(decoded => {
            const source = audioCtx.createBufferSource();
            const gain = audioCtx.createGain();
            source.buffer = decoded;
            gain.gain.value = volume;
            source.connect(gain);
            gain.connect(audioCtx.destination);
            source.start(0);
        });
}

function getSfxVolume(base) {
    return bgmPlaying ? 0.3 : base;
}

function playBonusSound() {
    const rand = Math.random() * 100;
    if (rand < 15) {
        playSound('sound/farting.mp3', getSfxVolume(1.0));
    } else if (rand < 35) {
        playSound('sound/belching.mp3', getSfxVolume(1.0));
    }
}

function updateCalorieCounter() {
    document.getElementById('calorieValue').textContent = totalCalories.toLocaleString();
}

function eatBurger() {
    ensureAudioCtx();

    currentStage = (currentStage + 1) % burgerImages.length;
    document.getElementById('burgerImage').src = burgerImages[currentStage];

    if (currentStage === 0) {
        totalCalories += 500;
        updateCalorieCounter();
    }

    if (totalCalories > 0 && totalCalories % 5000 === 0) {
        bgmPlaying = true;
        fetch('sound/hambgm.mp3')
            .then(res => res.arrayBuffer())
            .then(buf => decodeAudio(buf))
            .then(decoded => {
                const source = audioCtx.createBufferSource();
                const gain = audioCtx.createGain();
                source.buffer = decoded;
                gain.gain.value = 1.0;
                source.connect(gain);
                gain.connect(audioCtx.destination);
                source.start(0);
                source.onended = () => { bgmPlaying = false; };
            });
        return;
    }

    playSound('sound/eating.mp3', getSfxVolume(0.4));
    playBonusSound();
}

document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', (e) => e.preventDefault());
