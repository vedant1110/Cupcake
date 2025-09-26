// Upgraded interactions for games & rapid fire
const pages = Array.from(document.querySelectorAll('.card'));
function show(id){ pages.forEach(p=>p.classList.remove('show')); const el=document.getElementById(id); if(el) el.classList.add('show'); window.scrollTo(0,0); }

// Basic navigation
document.getElementById('startBtn').addEventListener('click', ()=> show('apology'));
document.getElementById('backToStart').addEventListener('click', ()=> show('startScreen'));
document.getElementById('decideBack')?.addEventListener('click', ()=> show('apology'));
document.getElementById('moreSurprises')?.addEventListener('click', ()=> show('surpriseQ'));

// Choices routing
document.querySelectorAll('.opt').forEach(b=> b.addEventListener('click', e=> handleChoice(e.currentTarget.dataset.choice)));

function handleChoice(choice){
  if(choice==='not') show('waitPage');
  else if(choice==='forgive'){ show('thankPage'); setTimeout(()=> document.getElementById('moreSurprises').disabled=false,5000); }
  else if(choice==='surprise_no'){ show('openSpecial'); setTimeout(()=> show('surpriseQ'),5000); }
  else if(choice==='surprise_yes'){ show('iloveyouPage'); }
  else if(choice==='love_yes'){ show('loveYes'); populateFinalGallery(); }
  else if(choice==='love_no'){ show('doYouLoveMe'); }
  else if(choice==='final_yes'){ show('finalYesPage'); }
  else if(choice==='date_yes'){ show('dateYesPage'); }
  else if(choice==='date_no'){ show('dateNoPage'); }
}

// Continue links
document.getElementById('whyLove')?.addEventListener('click', ()=> show('whyLovePage'));
document.getElementById('moreLove')?.addEventListener('click', ()=> show('moreLovePage'));
document.getElementById('continueToLoveQ')?.addEventListener('click', ()=> show('doYouLoveMe'));
document.getElementById('readLetter')?.addEventListener('click', ()=> show('letterPage'));
document.getElementById('whyIMiss')?.addEventListener('click', ()=> show('missPage'));
document.getElementById('nextSurprise')?.addEventListener('click', ()=> show('forgiveQ'));
document.getElementById('dateQBtn')?.addEventListener('click', ()=> show('dateQ'));
document.getElementById('rethinkDate')?.addEventListener('click', ()=> show('dateQ'));
document.getElementById('finalContinue')?.addEventListener('click', ()=> show('games'));

// Music play attempt
const bg = document.getElementById('bgMusic');
function tryPlay(){ bg.volume=0.18; bg.play().catch(()=>{}); }
document.addEventListener('click', tryPlay, {once:true});

// Populate gallery
function populateFinalGallery(){
  const container = document.getElementById('finalGallery');
  if(container.childElementCount>0) return;
  for(let i=1;i<=9;i++){
    const img = document.createElement('img');
    img.src = `assets/images/photo${i}.jpeg`;
    img.alt = `memory ${i}`;
    container.appendChild(img);
  }
}

// -- GAMES -- //
const gameArea = document.getElementById('gameArea');
const gameOutput = document.getElementById('gameOutput');
const games = {
  spin: { labels: ["Movie Night","Picnic","Cute Note","Surprise Gift","Date Night","Chocolates","Massage","Long Hug"], run: spinWheel },
  truth: { run: truthDare },
  find: { run: findHeartGame },
  dice: { run: loveDice },
  flirty: { run: flirtyChallenge },
  compliment: { run: complimentMe },
  wild: { run: wildDice },
  secret: { run: secretConfessions },
  compliment2: { run: complimentMe2 },
  describe: { run: describeMe }
};

document.querySelectorAll('.gameBtn').forEach(b=> b.addEventListener('click', ()=> {
  const g = b.dataset.game;
  const fn = games[g]?.run;
  if(fn) fn();
}));

// Helper: clear area
function clearGameArea(){ gameArea.innerHTML=''; gameOutput.innerHTML=''; }

// 1) Spin wheel
function spinWheel(){
  clearGameArea();
  const wheel = document.createElement('div'); wheel.className='wheel'; wheel.style.position='relative';
  const sliceCount = 8; const colors = ["#ff9ab2","#ffd6e0","#ffd9b3","#f3e8ff","#ffeef4","#fff0f0","#fff6e8","#fbeef7"];
  for(let i=0;i<sliceCount;i++){
    const s = document.createElement('div'); s.className='slice';
    s.style.transform = `rotate(${i*(360/sliceCount)}deg)`;
    s.style.background = colors[i%colors.length];
    s.style.clipPath = `polygon(50% 50%, 100% 0, 100% 100%)`;
    s.innerHTML = `<div style="transform:rotate(${360/sliceCount/2}deg);font-weight:700;color:#4b2c3a">${games.spin.labels[i]}</div>`;
    wheel.appendChild(s);
  }
  const pointer = document.createElement('div'); pointer.className='pointer';
  gameArea.appendChild(pointer); gameArea.appendChild(wheel);
  // animate rotation
  const extra = Math.floor(Math.random()*360)+720 + Math.floor(Math.random()*360);
  wheel.style.transition='transform 4s cubic-bezier(.17,.67,.83,.67)';
  wheel.style.transform = `rotate(${extra}deg)`;
  setTimeout(()=>{
    // determine result
    const deg = extra % 360;
    const idx = Math.floor(((360-deg)+ (360/sliceCount)/2) % 360 / (360/sliceCount));
    const res = games.spin.labels[idx];
    gameOutput.innerHTML = `<p>Wheel result: <strong>${res}</strong></p>`;
    floatEmojis(["🎈","💖","🌸"]);
  },4100);
}

// 2) Truth & Dare
function truthDare(){
  clearGameArea();
  const card = document.createElement('div'); card.className='flipCard';
  card.innerHTML = `<div class="flipCardInner"><div class="flipFront">Click to reveal</div><div class="flipBack"></div></div>`;
  gameArea.appendChild(card);
  const truths = ["What is one thing you hide?","What made you smile today?","Name one secret crush?"];
  const dares = ["Sing 10s of your favourite song","Send a silly selfie","Give a 20s hug to your pillow"];
  function reveal(){
    const isTruth = Math.random()>0.5;
    const txt = isTruth? `Truth: ${truths[Math.floor(Math.random()*truths.length)]}` : `Dare: ${dares[Math.floor(Math.random()*dares.length)]}`;
    card.querySelector('.flipBack').innerText = txt;
    card.classList.add('flipped');
    gameOutput.innerHTML = `<p>${txt}</p>`;
    floatEmojis(["💌","💫"]);
  }
  card.addEventListener('click', ()=> { card.classList.toggle('flipped'); if(card.classList.contains('flipped')) reveal(); else gameOutput.innerHTML=''; });
}

// 3) Find my heart
function findHeartGame(){
  clearGameArea();
  const grid = document.createElement('div'); grid.className='boxGrid';
  const indexes = Array.from({length:9},(_,i)=>i);
  const heartIndex = Math.floor(Math.random()*9);
  indexes.forEach(i=>{
    const box = document.createElement('div'); box.className='box'; box.innerHTML='<div>Open</div>';
    box.addEventListener('click', ()=>{
      if(box.classList.contains('revealed')) return;
      box.classList.add('revealed');
      if(i===heartIndex){
        box.innerHTML = `<div class="heart">❤</div><div>Found the heart!</div>`;
        gameOutput.innerHTML = `<p>You found my heart ❤️</p>`;
        floatEmojis(["❤","💖","🥰"]);
      } else {
        box.innerHTML = `<div style="font-size:20px">😢</div><div>Not here</div>`;
      }
    });
    grid.appendChild(box);
  });
  gameArea.appendChild(grid);
}

// 4) Love dice
function loveDice(){
  clearGameArea();
  const dice = document.createElement('div'); dice.className='dice'; dice.innerText='Roll';
  gameArea.appendChild(dice);
  const actions = ["Kiss on forehead","30s Hug","Good morning text","Cook for you","Massage"];
  dice.addEventListener('click', ()=>{
    dice.innerText='...';
    dice.style.transform='rotate(720deg)';
    setTimeout(()=>{
      const res = actions[Math.floor(Math.random()*actions.length)];
      dice.innerText='🎲';
      gameOutput.innerHTML = `<p>Love dice: <strong>${res}</strong></p>`;
      floatEmojis(["💋","🤗"]);
      dice.style.transform='none';
    },900);
  });
}

// 5) Flirty challenge
function flirtyChallenge(){
  clearGameArea();
  const btn = document.createElement('button'); btn.className='btn'; btn.innerText='Reveal flirty challenge';
  gameArea.appendChild(btn);
  btn.addEventListener('click', ()=>{
    const arr = ["Send a voice saying 'miss you'","Send a cute selfie","Whisper a memory"];
    const pick = arr[Math.floor(Math.random()*arr.length)];
    gameOutput.innerHTML = `<p>Flirty: ${pick}</p>`;
    floatEmojis(["😘","💫"]);
  });
}

// 6) Compliment me
function complimentMe(){
  clearGameArea();
  const arr = ["You are beautiful","Your laugh is magic","Your eyes are stars","You make me better"];
  const pick = arr[Math.floor(Math.random()*arr.length)];
  gameArea.innerHTML = `<div style="font-size:20px;padding:10px">${pick}</div>`;
  floatEmojis(["🌸","✨"]);
  gameOutput.innerHTML = `<p>${pick}</p>`;
}

// 7) Wild dice
function wildDice(){
  clearGameArea();
  const dice = document.createElement('div'); dice.className='dice'; dice.innerText='Roll Wild';
  gameArea.appendChild(dice);
  const actions = ["Dance for 15s","Tell a spicy secret","Send a playful emoji mix"];
  dice.addEventListener('click', ()=>{
    dice.innerText='...'; setTimeout(()=>{
      const pick = actions[Math.floor(Math.random()*actions.length)];
      gameOutput.innerHTML = `<p>Wild: ${pick}</p>`;
      floatEmojis(["🌶️","🔥"]);
      dice.innerText='🎲';
    },800);
  });
}

// 8) Secret confessions
function secretConfessions(){
  clearGameArea();
  const lock = document.createElement('div'); lock.className='flipCard'; lock.innerHTML = `<div class="flipCardInner"><div class="flipFront">Locked Note</div><div class="flipBack">I saved our first message ❤️</div></div>`;
  gameArea.appendChild(lock);
  lock.addEventListener('click', ()=> lock.classList.toggle('flipped'));
  gameOutput.innerHTML = `<p>Click the note to unlock a confession</p>`;
  floatEmojis(["🔐","💌"]);
}

// 9) Compliment me 2
function complimentMe2(){ complimentMe(); }

// 10) Describe me
function describeMe(){
  clearGameArea();
  const arr = ["Cute","Brave","Dreamy","Funny","Stubborn","Warm","Irresistible","Gentle"];
  gameArea.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:8px;max-width:420px;justify-content:center">${arr.map(a=>`<div class="box" style="padding:10px">${a}</div>`).join('')}</div>`;
  gameOutput.innerHTML = `<p>Which of these fits best? Click any to select.</p>`;
  document.querySelectorAll('.gameArea .box, .boxGrid .box').forEach(n=>{});
  // add click handlers
  Array.from(gameArea.querySelectorAll('.box')).forEach(b=> b.addEventListener('click', ()=> { gameOutput.innerHTML=`<p>You chose: <strong>${b.innerText}</strong></p>`; floatEmojis(["✨","💛"]); }));
}

// Emoji float / rain helper
function floatEmojis(list){
  const wrap = document.createElement('div'); wrap.className='emojiRain';
  document.body.appendChild(wrap);
  for(let i=0;i<10;i++){
    const span = document.createElement('div'); span.className='emoji'; span.innerText = list[Math.floor(Math.random()*list.length)];
    span.style.left = Math.random()*90 + '%'; span.style.top = '-10%'; span.style.fontSize = (14+Math.random()*24)+'px';
    span.style.animationDuration = (3+Math.random()*3)+'s'; span.style.animationDelay = (i*0.1)+'s';
    span.style.transition = 'transform 0.3s'; wrap.appendChild(span);
    // animate fall with simple CSS via JS
    setTimeout(()=> span.style.top = (60+Math.random()*40)+'vh', 50);
    setTimeout(()=> span.remove(), 4500);
  }
  setTimeout(()=> wrap.remove(), 5000);
}

// -- Rapid Fire Upgraded -- //
const rapidArea = document.getElementById('rapidArea');
const rapidQuestions = [
  {q:"Can I hold your hand?", opts:["Yes, always","Maybe later","No"]},
  {q:"Can I hug you?", opts:["Yes please","Only if you say sorry first","No"]},
  {q:"Can I kiss you?", opts:["Yes, sweetheart","Later","No"]},
  {q:"Can I give you a massage?", opts:["Yes","Maybe","No"]},
  {q:"Can I sing you a silly song?", opts:["Sing now","Later please","No"]},
  {q:"Can I make you breakfast?", opts:["Yes!","Maybe","No"]},
  {q:"Can I call you right now?", opts:["Call me","Later","Don't call"]},
  {q:"Can I surprise you tomorrow?", opts:["Yes, surprise me","I prefer not","Maybe"]},
  {q:"Can I learn your favourite thing?", opts:["Teach me","I'll try myself","No"]},
  {q:"Can I be better for you?", opts:["Yes, show me","Prove it","We'll see"]}
];
let rfIndex = 0;

function startRapid(){
  rfIndex = 0; rapidArea.innerHTML=''; showRapidQuestion();
}
function showRapidQuestion(){
  rapidArea.innerHTML='';
  if(rfIndex>=rapidQuestions.length){
    rapidArea.innerHTML = `<div style="text-align:center;font-size:18px">Rapid Fire Done! 🎉</div>`;
    confettiBurst();
    return;
  }
  const item = rapidQuestions[rfIndex];
  const qdiv = document.createElement('div'); qdiv.innerHTML = `<div style="font-weight:800;margin-bottom:10px">${item.q}</div>`;
  const optsDiv = document.createElement('div');
  item.opts.forEach((o,idx)=>{
    const btn = document.createElement('div'); btn.className='rapidOption'; btn.innerText = o;
    btn.addEventListener('click', ()=>{
      // mark selected (only one)
      Array.from(optsDiv.children).forEach(c=> c.classList.remove('selected'));
      btn.classList.add('selected');
      // auto next after 1s
      setTimeout(()=>{ rfIndex++; showRapidQuestion(); }, 1000);
    });
    optsDiv.appendChild(btn);
  });
  rapidArea.appendChild(qdiv); rapidArea.appendChild(optsDiv);
}

// Confetti
function confettiBurst(){
  const wrap = document.createElement('div'); wrap.className='confetti';
  document.body.appendChild(wrap);
  const colors = ['#ff6b9a','#ffd166','#9be7ff','#d8b4ff','#ffb6c1'];
  for(let i=0;i<60;i++){
    const p = document.createElement('div'); p.style.position='absolute'; p.style.left = Math.random()*100+'%'; p.style.top='-10%'; p.style.width='10px'; p.style.height='14px'; p.style.background = colors[Math.floor(Math.random()*colors.length)];
    p.style.opacity=0.9; p.style.transform = `rotate(${Math.random()*360}deg)`;
    wrap.appendChild(p);
    setTimeout(()=> p.style.top = (60+Math.random()*30)+'vh', 50);
    setTimeout(()=> p.remove(), 4500);
  }
  setTimeout(()=> wrap.remove(), 5000);
}

// Start rapid on clicking Continue from games
document.getElementById('toRapid')?.addEventListener('click', ()=> { show('rapid'); startRapid(); });

// Finish button
document.getElementById('finishBtn')?.addEventListener('click', ()=> show('thankFinal'));

// End celebration
document.getElementById('endBtn')?.addEventListener('click', ()=> { confettiBurst(); show('loveYes'); });

// Refresh & home
document.getElementById('refresh').addEventListener('click', ()=> location.reload());
document.getElementById('home').addEventListener('click', ()=> show('startScreen'));

// initial show
show('startScreen');
