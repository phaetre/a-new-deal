import { Ticker } from './ticker.js';
var ticker = new Ticker({'main': 41.22}, 100, 60, 'main', window.innerWidth/2.01),
	mainDiv = document.createElement('div'),
	leftDiv = document.createElement('div'),
	rightDiv = document.createElement('div'),
	frames = 0,
	money = 150,
	m = document.createElement('p'),
	data = fetch('data.txt').then(i=>i.json()).then(q=>(q.forEach(i=>{let j = document.createElement('button'); j.title = i[1]; j.innerHTML = i[0]; rightDiv.appendChild(j)}), q));
leftDiv.classList.add('page');
rightDiv.classList.add('page');
//leftDiv.style.width = rightDiv.style.width = '45%';
m.innerHTML = '$'+money;
mainDiv.appendChild(leftDiv);
mainDiv.appendChild(rightDiv);
leftDiv.appendChild(ticker.canvas);
leftDiv.appendChild(m);
document.body.appendChild(mainDiv);
function tick(l) {
	let a = ticker.tick(frames);
	ticker.render(a);
	frames++;
	requestAnimationFrame(tick);
}
requestAnimationFrame(tick);