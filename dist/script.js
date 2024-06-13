
const debugEl = document.getElementById('debug'),

iconMap = ["banana", "siete", "bar", "purpura", "barbar", "cereza", "plum", "naranja", "campana", "barbarbar", "limon", "melon"],

icon_width = 79,

icon_height = 79,

num_icons = 12,

time_per_icon = 100,

indexes = [0, 0, 0, 0];



const roll = (reel, offset = 0) => {
  
  const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);

  
  return new Promise((resolve, reject) => {

    const style = getComputedStyle(reel),
    
    backgroundPositionY = parseFloat(style["background-position-y"]),
    
    targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
    
    normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height);

    
    setTimeout(() => {
      
      reel.style.transition = `background-position-y ${(8 + 1 * delta) * time_per_icon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
      
      reel.style.backgroundPositionY = `${backgroundPositionY + delta * icon_height}px`;
    }, offset * 150);

   
    setTimeout(() => {
      // Reiniciar las posiciones
      reel.style.transition = `none`;
      reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
      // El resolve se usa para resolver la promesa
      resolve(delta % num_icons);
    }, (8 + 1 * delta) * time_per_icon + offset * 150);

  });
};



function rollAll() {

  debugEl.textContent = 'girando';

  const reelsList = document.querySelectorAll('.slots > .reel');

  Promise

  
  .all([...reelsList].map((reel, i) => roll(reel, i)))

  
  .then(deltas => {
    
    deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta) % num_icons);
    debugEl.textContent = indexes.map(i => iconMap[i]).join(' - ');

    
    if (indexes[0] == indexes[1] || indexes[1] == indexes[2]) {
      const winCls = indexes[0] == indexes[2] ? "win2" : "win1";
      document.querySelector(".slots").classList.add(winCls);
      setTimeout(() => document.querySelector(".slots").classList.remove(winCls), 2000);
    }

    
    setTimeout(rollAll, 3000);
  });
};


setTimeout(rollAll, 1000);