/* DER KRIEGER — main.js v2.0 */

if(window.netlifyIdentity){window.netlifyIdentity.on('init',u=>{if(!u){window.netlifyIdentity.on('login',()=>{document.location.href='/admin/'})}})}

const navbar=document.getElementById('navbar'),toggle=document.getElementById('navToggle'),navMenu=document.getElementById('navLinks');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>40),{passive:true});
toggle.addEventListener('click',()=>{toggle.classList.toggle('open');navMenu.classList.toggle('open')});
navMenu.querySelectorAll('a').forEach(l=>l.addEventListener('click',()=>{toggle.classList.remove('open');navMenu.classList.remove('open')}));

const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

async function loadJSON(url){try{const r=await fetch(url+'?v='+Date.now());if(!r.ok)throw new Error(r.status);return await r.json()}catch(e){console.warn('Load error:',url,e);return null}}

function formatDate(iso){return new Date(iso+'T12:00:00').toLocaleDateString('de-AT',{day:'2-digit',month:'long',year:'numeric'})}
function formatDay(iso){const d=new Date(iso+'T12:00:00');return{day:d.toLocaleDateString('de-AT',{day:'2-digit'}),month:d.toLocaleDateString('de-AT',{month:'short'}).toUpperCase(),year:d.getFullYear()}}
const STATUS={available:'Verfügbar',limited:'Fast ausverkauft',sold_out:'Ausverkauft'};
function skel(h,n=1){return Array.from({length:n},()=>`<div class="skeleton skeleton-block" style="height:${h}px"></div>`).join('')}

async function loadSettings(){
  const d=await loadJSON('/content/settings.json');if(!d)return;
  const sub=document.getElementById('heroSubtitle'),claim=document.getElementById('heroClaim');
  if(sub)sub.textContent=d.hero_subtitle||sub.textContent;
  if(claim)claim.textContent=d.hero_claim||claim.textContent;
  if(d.stats){
    ['episodes','followers','years','impact'].forEach(k=>{
      const el=document.getElementById('stat'+k.charAt(0).toUpperCase()+k.slice(1));
      if(el)el.textContent=k==='years'?(d.stats[k]+'+'):d.stats[k];
    });
  }
  const cover=document.getElementById('podcastCover');if(cover&&d.podcast_cover)cover.src=d.podcast_cover;
  [['platformYT','youtube_url'],['platformSP','spotify_url'],['platformAP','apple_url']].forEach(([id,key])=>{
    const el=document.getElementById(id);if(el&&d[key])el.href=d[key];
  });
}

async function loadEpisodes(){
  const c=document.getElementById('episodeList');if(!c)return;
  c.innerHTML=skel(100,4);
  const d=await loadJSON('/content/episodes.json');
  if(!d||!d.episodes){c.innerHTML='<p style="color:var(--muted);padding:24px">Episoden konnten nicht geladen werden.</p>';return}
  const eps=d.episodes.filter(e=>e.visible!==false).sort((a,b)=>b.number-a.number);
  c.innerHTML=eps.map(ep=>`
    <div class="episode-item reveal">
      <div class="ep-number">${String(ep.number).padStart(2,'0')}</div>
      <div class="ep-body">
        ${ep.is_new?'<div class="ep-badges"><span class="badge-new">Neu</span></div>':''}
        <div class="ep-title">${ep.title}</div>
        <div class="ep-desc">${ep.description}</div>
        <div class="ep-links">
          ${ep.youtube_url?`<a href="${ep.youtube_url}" class="ep-link" target="_blank" rel="noopener">▶ YouTube</a>`:''}
          ${ep.spotify_url?`<a href="${ep.spotify_url}" class="ep-link" target="_blank" rel="noopener">⬤ Spotify</a>`:''}
        </div>
      </div>
      <div class="ep-duration">${ep.duration} Min.</div>
    </div>`).join('');
  c.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}

async function loadEvents(){
  const c=document.getElementById('eventList');if(!c)return;
  c.innerHTML=skel(88,3);
  const d=await loadJSON('/content/events.json');
  if(!d||!d.events){c.innerHTML='<p style="color:var(--muted);padding:24px">Events konnten nicht geladen werden.</p>';return}
  const today=new Date().toISOString().slice(0,10);
  const evs=d.events.filter(e=>e.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
  if(!evs.length){c.innerHTML='<div style="padding:48px 32px;text-align:center;color:var(--muted)"><p>Aktuell sind keine weiteren Events geplant.<br>Folge Martin auf Social Media für neue Termine.</p></div>';return}
  c.innerHTML=evs.map(ev=>{const dt=formatDay(ev.date);return`
    <div class="event-item reveal">
      <div class="event-date-block"><div class="event-day">${dt.day}</div><div class="event-month">${dt.month} ${dt.year}</div></div>
      <div><div class="event-title">${ev.title}</div><div class="event-location">${ev.location}</div></div>
      <div class="event-status-wrap">
        <span class="status-badge ${ev.status}">${STATUS[ev.status]||ev.status}</span>
        ${ev.ticket_url&&ev.status!=='sold_out'?`<a href="${ev.ticket_url}" class="ticket-btn" target="_blank" rel="noopener">Tickets</a>`:''}
      </div>
    </div>`}).join('');
  c.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}

async function loadBlog(){
  const c=document.getElementById('blogGrid');if(!c)return;
  c.innerHTML=skel(300,3);
  const d=await loadJSON('/content/blog.json');
  if(!d||!d.posts){c.innerHTML='<p style="color:var(--muted);padding:24px">Blog konnte nicht geladen werden.</p>';return}
  const posts=d.posts.filter(p=>p.visible!==false).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
  c.innerHTML=posts.map(p=>`
    <div class="blog-card reveal">
      <img src="${p.image}" alt="${p.title}" class="blog-card-img" loading="lazy">
      <div class="blog-card-body">
        <div class="blog-category">${p.category}</div>
        <div class="blog-card-title">${p.title}</div>
        <div class="blog-excerpt">${p.excerpt}</div>
        <div class="blog-meta">${formatDate(p.date)}</div>
      </div>
    </div>`).join('');
  c.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}

function initForm(){
  const form=document.getElementById('bookingForm');if(!form)return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const btn=form.querySelector('button[type="submit"]');
    btn.textContent='Wird gesendet…';btn.disabled=true;
    setTimeout(()=>{form.style.display='none';const s=document.getElementById('formSuccess');if(s)s.style.display='block'},800);
  });
}

document.addEventListener('DOMContentLoaded',()=>{loadSettings();loadEpisodes();loadEvents();loadBlog();initForm()});
