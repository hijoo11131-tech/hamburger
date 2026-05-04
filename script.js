const burgerImages = [
    'https://cdn.discordapp.com/attachments/1500557831705989209/1500558988477989016/IMG_0569.png?ex=69f8dff5&is=69f78e75&hm=d55aa3681e8ad4aada10541ad472e2e72db3e0632f89ef266a72c130174e7fb0&',
    'https://cdn.discordapp.com/attachments/1500557831705989209/1500684659573657661/IMG_0570.png?ex=69f95500&is=69f80380&hm=44753e7faf7ed48c7bb228742825f157fae68683835e6c0b948290f6d33a84d6&',
    'https://cdn.discordapp.com/attachments/1500557831705989209/1500559006735798493/IMG_0571.png?ex=69f8dffa&is=69f78e7a&hm=80698c57a662a7953df8f65425e66fec093522fa922851a5aab02aedd94c155d&',
    'https://cdn.discordapp.com/attachments/1500557831705989209/1500559014612959232/IMG_0572.png?ex=69f8dffc&is=69f78e7c&hm=8c291f0ffdf93ae203be244f48edd271cd198c9ee48af2ffa167bd63074c2cb0&',
    'https://cdn.discordapp.com/attachments/1500557831705989209/1500559989884977252/IMG_0573.png?ex=69f8e0e4&is=69f78f64&hm=6dd0797c57754e7d8ed7a8ee47ed0d4bbcc048630c8afe0f3525432ed53ed3fd&'
];

let currentStage = 0;
let resetCount = 0;
let bgmPlaying = false;
let totalCalories = 0;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(src, volume) {
    fetch(src)
        .then(res => res.arrayBuffer())
        .then(buf => audioCtx.decodeAudioData(buf))
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
    if (rand < 5) {
        playSound('sound/farting.mp3', getSfxVolume(1.0));
    } else if (rand < 12) {
        playSound('sound/belching.mp3', getSfxVolume(1.0));
    }
}

function updateCalorieCounter() {
    document.getElementById('calorieValue').textContent = totalCalories.toLocaleString();
}

function eatBurger() {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    totalCalories += 500;
    updateCalorieCounter();

    currentStage = (currentStage + 1) % burgerImages.length;

    if (currentStage === 0) {
        resetCount++;

        if (resetCount % 6 === 0) {
            bgmPlaying = true;
            fetch('sound/hambgm.mp3')
                .then(res => res.arrayBuffer())
                .then(buf => audioCtx.decodeAudioData(buf))
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
            document.getElementById('burgerImage').src = burgerImages[currentStage];
            return;
        }
    }

    playSound('sound/eating.mp3', getSfxVolume(0.4));
    playBonusSound();
    document.getElementById('burgerImage').src = burgerImages[currentStage];
}

document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', (e) => e.preventDefault());
