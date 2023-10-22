const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const restart = document.querySelector('.restart');
const pontuacao = document.querySelector('.score');
const numPontuacao = document.querySelector('.score-number');

let pipePassed = false;
let score = 0;
let gameOver = false;
let loop;
let lastJumpTime = 0;
const jumpCooldown = 500;

const jump = () => {
    if(!gameOver){
        mario.classList.add('jump');
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
}

const blink = (classe) => {
    if(classe === restart){
        classe.classList.add('blink-restart');
        setTimeout(() => {
            classe.classList.remove('blink-restart');
        }, 1000000);
    }else{
        classe.classList.add('blink-score');
        setTimeout(() => {
            classe.classList.remove('blink-score');
        }, 501);
    }
}

const restartGame = () => {
    location.reload();
}

const endGame = () => {
    gameOver = true;
    if (window.innerWidth <= 768) { 
        restart.innerHTML = 'Clique para reiniciar'
    }
    restart.style.display = 'block'; 
    blink(restart)
    clouds.style.animationPlayState = 'paused';
    pipe.style.animationPlayState = 'paused';
    clearInterval(loop);
}

function startGameLoop() {
    
    if (!loop && !gameOver) {
        const windowWidth = window.innerWidth;
    
        // Calcule a duração com base na largura da janela (quanto menor, mais rápido)
        const minDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pipe-min-duration'));
        const maxDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pipe-max-duration'));
        const normalizedDuration = (windowWidth / 768) * (maxDuration - minDuration) + minDuration;
        
        // Defina a duração da animação do cano com base no cálculo
        document.documentElement.style.setProperty('--pipe-duration', normalizedDuration + 's');
        loop = setInterval(() => {
            const pipePosition = pipe.offsetLeft;
            const marioPosition = +window.getComputedStyle(mario).bottom.replace('px','');
            const cloudsPosition = clouds.offsetLeft;

            if(pipePosition <= 120 && marioPosition < 80 && pipePosition > 0){
                pipe.style.animationPlayState = 'paused';
                pipe.style.left = `${pipePosition}px`

                mario.classList.remove('.jump')
                mario.style.bottom = `${marioPosition}px`
                mario.src = './images/game-over.png'
                mario.style.width = '80px'
                mario.style.marginLeft = '50px'
                
                clouds.style.animationPlayState = 'paused';
                clouds.style.left = cloudsPosition+'px';
                clearInterval(loop);
                endGame();

            }else if (pipePosition <= -10 && !pipePassed) {
                score++; 
                blink(numPontuacao)
                pipePassed = true; 
                numPontuacao.innerHTML = score;

            } else if (pipePosition > 0) {
                pipePassed = false;
            }
        }, 10);
    }
}

startGameLoop();

document.addEventListener('keydown', (event) => {
    if ((event.key === 'R' || event.key === 'r') && gameOver) {
        restartGame();
    } else {
        const currentTime = new Date().getTime();
        if (currentTime - lastJumpTime >= jumpCooldown) {
            jump();
            lastJumpTime = currentTime;
        }
    }
});

document.addEventListener('touchstart', (event) => {
    if ((event) && gameOver) {
        restartGame();
    } else {
        const currentTime = new Date().getTime();
        if (currentTime - lastJumpTime >= jumpCooldown) {
            jump();
            lastJumpTime = currentTime;
        }
    }
});

