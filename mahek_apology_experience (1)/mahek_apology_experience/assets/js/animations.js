
// Simple floating hearts and delayed button reveal
function createHeart(){
  const el = document.createElement('div');
  el.className = 'heart';
  el.style.left = Math.random()*100 + 'vw';
  el.style.top = '-10px';
  el.style.fontSize = (18+Math.random()*28) + 'px';
  el.textContent = ['💖','💕','💘','💞'][Math.floor(Math.random()*4)];
  el.style.transition = 'transform 5s linear, top 5s linear, opacity 5s linear';
  document.body.appendChild(el);
  requestAnimationFrame(()=>{
    el.style.top = '110vh';
    el.style.transform = 'translateY(0) rotate('+ (Math.random()*360) +'deg)';
    el.style.opacity = 0;
  });
  setTimeout(()=>el.remove(),6000);
}
setInterval(createHeart,700);

document.addEventListener('DOMContentLoaded',()=>{
  // delayed reveal for elements with data-delay
  document.querySelectorAll('[data-delay]').forEach(el=>{
    const t = parseInt(el.getAttribute('data-delay'),10)||1000;
    el.style.display='none';
    setTimeout(()=>el.style.display='inline-block', t);
  });
  // small click ripple on buttons
  document.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', e=>{
      btn.animate([{transform:'scale(1)'},{transform:'scale(0.96)'},{transform:'scale(1)'}],{duration:220});
    });
  });
});

// simple confetti burst
function confettiBurst(){
  for(let i=0;i<40;i++){
    const c = document.createElement('div');
    c.className='confetti-paper';
    c.style.position='fixed';
    c.style.left = Math.random()*100+'vw';
    c.style.top = '-10px';
    c.style.width='8px';
    c.style.height='12px';
    c.style.background = ['#ff9ccf','#ffd9a6','#fff38a','#c6f7e2'][Math.floor(Math.random()*4)];
    c.style.transform='rotate('+Math.random()*360+'deg)';
    c.style.opacity='0.95';
    c.style.zIndex = 9999;
    c.style.transition='top 3s linear, transform 3s linear, opacity 3s linear';
    document.body.appendChild(c);
    requestAnimationFrame(()=>{
      c.style.top = (80+Math.random()*20)+'vh';
      c.style.transform = 'rotate('+ (Math.random()*720) +'deg)';
      c.style.opacity = 0;
    });
    setTimeout(()=>c.remove(),3200);
  }
}
