const body=document.body;
const navbar=document.getElementById('navbar');
const menuToggle=document.getElementById('menuToggle');
const themeToggle=document.getElementById('themeToggle');
const progress=document.getElementById('scrollProgress');
const toast=document.getElementById('toast');

/* Theme: light is the default; only an explicit saved dark choice enables dark mode. */
function setTheme(theme){
  const isDark=theme==='dark';
  body.classList.toggle('dark',isDark);
  body.classList.toggle('light',!isDark);
  themeToggle?.setAttribute('aria-label',isDark?'Switch to light theme':'Switch to dark theme');
  themeToggle?.setAttribute('aria-pressed',String(isDark));
}

setTheme(localStorage.getItem('portfolio-theme')==='dark'?'dark':'light');
themeToggle?.addEventListener('click',()=>{
  const theme=body.classList.contains('dark')?'light':'dark';
  setTheme(theme);
  localStorage.setItem('portfolio-theme',theme);
});

menuToggle?.addEventListener('click',()=>{
  const open=navbar?.classList.toggle('menu-open')??false;
  menuToggle.setAttribute('aria-expanded',String(open));
});

document.querySelectorAll('.nav-link').forEach(link=>link.addEventListener('click',()=>{
  navbar?.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded','false');
}));

const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('.nav-link')];
function updateScroll(){
  const top=window.scrollY;
  const height=document.documentElement.scrollHeight-window.innerHeight;
  if(progress)progress.style.width=`${height>0?top/height*100:0}%`;
  let current='home';
  sections.forEach(section=>{if(top+180>=section.offsetTop)current=section.id;});
  navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${current}`));
}
window.addEventListener('scroll',updateScroll,{passive:true});
window.addEventListener('load',updateScroll);

if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
}else document.querySelectorAll('.reveal').forEach(element=>element.classList.add('visible'));

const typingEl=document.getElementById('typingText');
const phrases=['Aspiring Software Engineer','AI & ML Enthusiast','Data Science Learner','Problem Solver'];
if(typingEl){
  let phraseIndex=0,charIndex=0,deleting=false;
  const typeLoop=()=>{
    const phrase=phrases[phraseIndex];
    typingEl.textContent=phrase.slice(0,charIndex);
    let delay=deleting?45:75;
    if(!deleting&&charIndex===phrase.length){deleting=true;delay=1200;}
    else if(deleting&&charIndex===0){deleting=false;phraseIndex=(phraseIndex+1)%phrases.length;delay=400;}
    else charIndex+=deleting?-1:1;
    window.setTimeout(typeLoop,delay);
  };
  typeLoop();
}

const showToast=message=>{
  if(!toast)return;
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer=window.setTimeout(()=>toast.classList.remove('show'),2500);
};
document.querySelectorAll('[data-toast]').forEach(button=>button.addEventListener('click',()=>showToast(button.dataset.toast||'')));

const contactForm=document.getElementById('contactForm');
contactForm?.addEventListener('submit',event=>{
  event.preventDefault();
  const name=document.getElementById('name')?.value.trim()||'';
  const email=document.getElementById('email')?.value.trim()||'';
  const message=document.getElementById('message')?.value.trim()||'';
  const subject=encodeURIComponent(`Portfolio contact from ${name}`);
  const content=encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href=`mailto:pramodthati03@gmail.com?subject=${subject}&body=${content}`;
  showToast('Opening your email app...');
  contactForm.reset();
});

if(window.matchMedia('(pointer:fine)').matches){
  const ring=document.getElementById('cursorRing');
  const dot=document.getElementById('cursorDot');
  if(ring&&dot){
    window.addEventListener('mousemove',event=>{
      dot.style.left=`${event.clientX}px`;dot.style.top=`${event.clientY}px`;
      requestAnimationFrame(()=>{ring.style.left=`${event.clientX}px`;ring.style.top=`${event.clientY}px`;});
    });
    document.querySelectorAll('[data-hover]').forEach(element=>{
      element.addEventListener('mouseenter',()=>ring.classList.add('hovered'));
      element.addEventListener('mouseleave',()=>ring.classList.remove('hovered'));
    });
  }
  document.querySelectorAll('.magnetic').forEach(element=>{
    element.addEventListener('mousemove',event=>{
      const box=element.getBoundingClientRect();
      element.style.transform=`translate(${(event.clientX-box.left-box.width/2)*.16}px,${(event.clientY-box.top-box.height/2)*.16}px)`;
    });
    element.addEventListener('mouseleave',()=>element.style.transform='');
  });
}

if(window.VanillaTilt)VanillaTilt.init(document.querySelectorAll('[data-tilt]'),{max:10,speed:500,glare:true,'max-glare':.15});
