const body=document.body;
const navbar=document.getElementById('navbar');
const menuToggle=document.getElementById('menuToggle');
const navMenu=document.getElementById('navMenu');
const themeToggle=document.getElementById('themeToggle');
const progress=document.getElementById('scrollProgress');
const toast=document.getElementById('toast');

/* Mobile Menu */
if(menuToggle&&navbar){
  menuToggle.addEventListener('click',()=>{
    const open=navbar.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded',String(open));
  });
}

document.querySelectorAll('.nav-link').forEach(link=>{
  link.addEventListener('click',()=>{
    if(navbar)navbar.classList.remove('menu-open');
    if(menuToggle)menuToggle.setAttribute('aria-expanded','false');
  });
});

/* Theme */
if(themeToggle){
  themeToggle.addEventListener('click',()=>{
    body.classList.toggle('light');
    localStorage.setItem('portfolio-theme',body.classList.contains('light')?'light':'dark');
  });
}

if(localStorage.getItem('portfolio-theme')==='light'){
  body.classList.add('light');
}

/* Scroll */
const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('.nav-link')];

function updateScroll(){
  const scrollTop=window.scrollY;
  const docHeight=document.documentElement.scrollHeight-window.innerHeight;

  if(progress){
    progress.style.width=`${docHeight>0?(scrollTop/docHeight)*100:0}%`;
  }

  let current='home';

  sections.forEach(section=>{
    if(scrollTop+180>=section.offsetTop)current=section.id;
  });

  navLinks.forEach(link=>{
    link.classList.toggle('active',link.getAttribute('href')===`#${current}`);
  });
}

window.addEventListener('scroll',updateScroll,{passive:true});
window.addEventListener('load',updateScroll);

/* Reveal Animation */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
},{threshold:0.12});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* Typing Effect */
const phrases=[
  'Aspiring Software Engineer',
  'AI & ML Enthusiast',
  'Data Science Learner',
  'Problem Solver'
];

const typingEl=document.getElementById('typingText');
let phraseIndex=0;
let charIndex=0;
let deleting=false;

function typeLoop(){
  if(!typingEl)return;

  const phrase=phrases[phraseIndex];

  typingEl.textContent=deleting
    ?phrase.slice(0,charIndex--)
    :phrase.slice(0,charIndex++);

  let delay=deleting?45:75;

  if(!deleting&&charIndex>phrase.length){
    deleting=true;
    delay=1200;
  }else if(deleting&&charIndex<0){
    deleting=false;
    phraseIndex=(phraseIndex+1)%phrases.length;
    charIndex=0;
    delay=400;
  }

  setTimeout(typeLoop,delay);
}

typeLoop();

/* Custom Cursor */
const hoverTargets=document.querySelectorAll('[data-hover]');
const cursorRing=document.getElementById('cursorRing');
const cursorDot=document.getElementById('cursorDot');

if(
  window.matchMedia('(pointer:fine)').matches&&
  cursorRing&&
  cursorDot
){
  window.addEventListener('mousemove',e=>{
    cursorDot.style.left=`${e.clientX}px`;
    cursorDot.style.top=`${e.clientY}px`;

    requestAnimationFrame(()=>{
      cursorRing.style.left=`${e.clientX}px`;
      cursorRing.style.top=`${e.clientY}px`;
    });
  });

  hoverTargets.forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      cursorRing.classList.add('hovered');
    });

    el.addEventListener('mouseleave',()=>{
      cursorRing.classList.remove('hovered');
    });
  });
}

/* Magnetic Buttons */
if(window.matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*0.16;
      const y=(e.clientY-r.top-r.height/2)*0.16;

      el.style.transform=`translate(${x}px,${y}px)`;
    });

    el.addEventListener('mouseleave',()=>{
      el.style.transform='';
    });
  });
}

/* Tilt Effect */
if(window.VanillaTilt){
  VanillaTilt.init(
    document.querySelectorAll('[data-tilt]'),
    {
      max:10,
      speed:500,
      glare:true,
      'max-glare':0.15
    }
  );
}

/* Toast */
function showToast(message){
  if(!toast)return;

  toast.textContent=message;
  toast.classList.add('show');

  clearTimeout(window.toastTimer);

  window.toastTimer=setTimeout(()=>{
    toast.classList.remove('show');
  },2500);
}

/* Certificate Buttons */
document.querySelectorAll('[data-toast]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    showToast(btn.dataset.toast);
  });
});

/* Contact Form */
const contactForm=document.getElementById('contactForm');

if(contactForm){
  contactForm.addEventListener('submit',e=>{
    e.preventDefault();

    const name=document.getElementById('name')?.value.trim()||'';
    const email=document.getElementById('email')?.value.trim()||'';
    const message=document.getElementById('message')?.value.trim()||'';

    const subject=encodeURIComponent(`Portfolio contact from ${name}`);
    const bodyText=encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href=
      `mailto:pramodthati03@gmail.com?subject=${subject}&body=${bodyText}`;

    showToast('Opening your email app...');
    contactForm.reset();
  });
}

/* Hero Dots */
const canvas=document.getElementById('dots');

if(canvas){
  const ctx=canvas.getContext('2d');
  let dots=[];
  let dpr=Math.min(window.devicePixelRatio||1,2);

  function resizeCanvas(){
    const rect=canvas.getBoundingClientRect();

    canvas.width=rect.width*dpr;
    canvas.height=rect.height*dpr;

    ctx.setTransform(dpr,0,0,dpr,0,0);

    const count=Math.max(
      35,
      Math.min(90,Math.floor((rect.width*rect.height)/12000))
    );

    dots=Array.from({length:count},()=>({
      x:Math.random()*rect.width,
      y:Math.random()*rect.height,
      vx:(Math.random()-0.5)*0.22,
      vy:(Math.random()-0.5)*0.22,
      r:Math.random()*1.7+0.5
    }));
  }

  function drawDots(){
    const w=canvas.clientWidth;
    const h=canvas.clientHeight;

    ctx.clearRect(0,0,w,h);

    for(const p of dots){
      p.x+=p.vx;
      p.y+=p.vy;

      if(p.x<0||p.x>w)p.vx*=-1;
      if(p.y<0||p.y>h)p.vy*=-1;

      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(105,225,255,.62)';
      ctx.fill();
    }

    for(let i=0;i<dots.length;i++){
      for(let j=i+1;j<dots.length;j++){
        const dx=dots[i].x-dots[j].x;
        const dy=dots[i].y-dots[j].y;
        const dist=Math.hypot(dx,dy);

        if(dist<120){
          ctx.beginPath();
          ctx.moveTo(dots[i].x,dots[i].y);
          ctx.lineTo(dots[j].x,dots[j].y);
          ctx.strokeStyle=
            `rgba(105,225,255,${(1-dist/120)*0.12})`;
          ctx.lineWidth=1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawDots);
  }

  window.addEventListener('resize',resizeCanvas);

  resizeCanvas();
  drawDots();
}