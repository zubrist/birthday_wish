// trigger to play music in the background with sweetalert
window.addEventListener('load', () => {
    // Multiple profile images support
    const profileImages = [
        'img/sushi.png',
        'img/IMG_20240629_074726_034.jpg',
        'img/Picsart_25-08-08_21-51-22-112.png',
        'img/Picsart_25-08-08_21-55-01-648.png',
        'img/Picsart_25-08-08_21-57-17-758.png',
        'img/Picsart_25-08-08_21-58-35-976.png',
        'img/Picsart_25-08-08_22-02-13-483.png'
    ];
    let currentProfileIndex = 0;
    const profileImgEl = document.getElementById('imagePath');

    function advanceProfile() {
        currentProfileIndex = (currentProfileIndex + 1) % profileImages.length;
        profileImgEl.src = profileImages[currentProfileIndex];
    }

    // Click + auto-cycle every 3 seconds
    if (profileImgEl) {
        profileImgEl.style.cursor = 'pointer';
        profileImgEl.title = 'Click to change photo';
        profileImgEl.addEventListener('click', advanceProfile);
        setInterval(advanceProfile, 3000); // auto change every 3s
    }

    Swal.fire({
        title: 'Do you want to play music in the background?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            document.querySelector('.song').play();
            animationTimeline();
        } else {
            animationTimeline();
        }
    });
});


// Simple confetti burst function
function confettiBurst(count = 80) {
  const colors = ['#ff3d7f', '#ffd300', '#5ae2ff', '#9d4edd', '#4ade80'];
  const container = document.body;
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    const size = Math.random() * 8 + 4;
    div.style.position = 'fixed';
    div.style.width = size + 'px';
    div.style.height = size * (Math.random() > 0.5 ? 1 : 0.4) + 'px';
    div.style.background = colors[Math.floor(Math.random() * colors.length)];
    div.style.top = '-10px';
    div.style.left = (Math.random() * 100) + 'vw';
    div.style.opacity = '0.9';
    div.style.transform = 'rotate(' + (Math.random()*360) + 'deg)';
    div.style.zIndex = 25;
    div.style.pointerEvents = 'none';
    container.appendChild(div);
    const fall = (100 + Math.random() * 20) + 'vh';
    const drift = (Math.random() * 40 - 20) + 'vw';
    const duration = 4 + Math.random() * 3;
    const delay = Math.random() * 0.3;
    gsap.to(div, { y: fall, x: drift, rotation: '+=180', duration, delay, ease: 'power2.out', onComplete: () => div.remove() });
  }
}

// Hearts spawning
function startHearts() {
  const heartsContainer = document.getElementById('hearts-container');
  if (!heartsContainer) return;
  const interval = setInterval(() => {
    if (!document.body.contains(heartsContainer)) { clearInterval(interval); return; }
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (6 + Math.random()*4) + 's';
    heart.style.filter = `hue-rotate(${Math.random()*360}deg)`;
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 10000);
  }, 600);
}

// Fireworks canvas
function createFireworks() {
  const canvas = document.getElementById('fireworks');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
  const particles = [];
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  function spawn(x, y) {
    const hue = Math.random() * 360;
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2) * (i/60);
      const speed = Math.random()*4 + 2;
      particles.push({
        x, y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: 0,
        maxLife: 60 + Math.random()*20,
        hue: hue + Math.random()*40 - 20
      });
    }
  }
  function update() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // gravity
      p.life++;
      if (p.life > p.maxLife) { particles.splice(idx,1); return; }
      const alpha = 1 - p.life / p.maxLife;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue},100%,60%,${alpha})`;
      ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(update);
  }
  update();
  // launch bursts periodically
  let launches = 0;
  const launchInterval = setInterval(() => {
    launches++;
    spawn(Math.random()*canvas.width, Math.random()*canvas.height*0.5 + canvas.height*0.1);
    if (launches > 25) clearInterval(launchInterval);
  }, 800);
}

// animation timeline
const animationTimeline = () => {
    // split chars that needs to be animated individually
    const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
    const hbd = document.getElementsByClassName("wish-hbd")[0];

    textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
        .split("")
        .join("</span><span>")}</span>`;

    hbd.innerHTML = `<span>${hbd.innerHTML
        .split("")
        .join("</span><span>")}</span>`;

    const ideaTextTrans = {
        opacity: 0,
        y: -20,
        rotationX: 5,
        skewX: "15deg"
    }

    const ideaTextTransLeave = {
        opacity: 0,
        y: 20,
        rotationY: 5,
        skewX: "-15deg"
    }

    // timeline
    const tl = new TimelineMax();

    tl.to('.container', 0.6, { visibility: 'visible' })
    .from('.one', 0.7, { opacity:0, y:10, onStart: () => confettiBurst(60) })
    .from('.two', 0.4, { opacity:0, y:10 })
    .to('.one',
        0.7,
        {
            opacity: 0,
            y: 10
        },
    "+=3.5")
    .to('.two',
        0.7,
        {
            opacity: 0,
            y: 10
        },
    "-=1")
    .from('.three', 0.7, { opacity: 0, y: 10 })
    .to('.three',
        0.7,
        {
            opacity: 0,
            y: 10
        },
    "+=3")
    .from('.four', 0.7, {
        scale: 0.2,
        opacity: 0,
    })
    .from('.fake-btn', 0.3, {
        scale: 0.2,
        opacity: 0,
    })
    .staggerTo(
        '.hbd-chatbox span',
        1.5, {
            visibility: "visible",
        },
        0.05
    )
    .to('.fake-btn', 0.1, {
        backgroundColor: "rgb(127, 206, 248)",
    },
    "+=4")
    .to(
        '.four',
        0.5, {
            scale: 0.2,
            opacity: 0,
            y: -150
        },
    "+=1")
    .from('.idea-1', 0.7, ideaTextTrans)
    .to('.idea-1', 0.7, ideaTextTransLeave, "+=2.5")
    .from('.idea-2', 0.7, ideaTextTrans)
    .to('.idea-2', 0.7, ideaTextTransLeave, "+=2.5")
    .from('.idea-3', 0.7, ideaTextTrans)
    .to('.idea-3 strong', 0.5, {
        scale: 1.2,
        x: 10,
        backgroundColor: "rgb(21, 161, 237)",
        color: "#fff",
    })
    .to('.idea-3', 0.7, ideaTextTransLeave, "+=2.5")
    .from('.idea-4', 0.7, ideaTextTrans)
    .to('.idea-4', 0.7, ideaTextTransLeave, "+=2.5")
    .from(
        '.idea-5',
        0.7, {
            rotationX: 15,
            rotationZ: -10,
            skewY: "-5deg",
            y: 50,
            z: 10,
            opacity: 0,
        },
        "+=1.5"
    )
    .to(
        '.idea-5 span',
        0.7, {
            rotation: 90,
            x: 8,
        },
        "+=1.4"
    )
    .to(
        '.idea-5',
        0.7, {
            scale: 0.2,
            opacity: 0,
        },
        "+=2"
    )
    .staggerFrom(
        '.idea-6 span',
        0.8, {
            scale: 3,
            opacity: 0,
            rotation: 15,
            ease: Expo.easeOut,
        },
        0.2
    )
    .staggerTo(
        '.idea-6 span',
        0.8, {
            scale: 3,
            opacity: 0,
            rotation: -15,
            ease: Expo.easeOut,
        },
        0.2,
        "+=1.5"
    )
    .staggerFromTo(
        '.baloons img',
        2.5, {
            opacity: 0.9,
            y: 1400,
        }, {
            opacity: 1,
            y: -1000,
        },
        0.2
    )
    .from(
        '.profile-picture',
        0.5, {
            scale: 3.5,
            opacity: 0,
            x: 25,
            y: -25,
            rotationZ: -45,
        },
        "-=2"
    )
    .from('.hat', 0.5, {
        x: -100,
        y: 350,
        rotation: -180,
        opacity: 0,
    })
    .staggerFrom(
        '.wish-hbd span',
        0.7, {
            opacity: 0,
            y: -50,
            // scale: 0.3,
            rotation: 150,
            skewX: "30deg",
            ease: Elastic.easeOut.config(1, 0.5),
        },
        0.1
    )
    .staggerFromTo(
        '.wish-hbd span',
        0.7,
        { scale: 1.4, rotationY: 150 },
        { scale: 1, rotationY: 0, color: '#ff69b4', ease: Expo.easeOut },
        0.1,
        'party'
    )
    .add(() => { startHearts(); }, 'party+=0.5')
    .from(
        '.wish h5',
        0.5, {
            opacity: 0,
            y: 10,
            skewX: "-15deg",
        },
        "party"
    )
    .staggerTo(
        '.eight svg',
        1.5,
        { visibility: 'visible', opacity:0, scale:80, repeat:3, repeatDelay:1.4 },
        0.3
    )
    .add(() => { confettiBurst(120); createFireworks(); }, '+=0.2')
    .to('.six', 0.5, {
        opacity: 0,
        y: 30,
        zIndex: "-1",
    })
    .staggerFrom('.nine p', 1, ideaTextTrans, 1.2)
    .to(
        '.last-smile',
        0.5, {
            rotation: 90,
        },
        "+=1"
    );

    // Restart Animation on click
    const replyBtn = document.getElementById('replay');
    replyBtn.addEventListener('click', () => {
        tl.restart();
        confettiBurst(60);
    });
}
