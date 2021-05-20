import { Ticker } from './ticker.js';
function button(innerHTML, title, onClick = () => {}, classes = []) {
	let j = document.createElement('button');
	j.title = title;
	j.innerHTML = innerHTML;
	j.addEventListener('click', onClick);
	for (let i of classes) {
		j.classList.add(i);
	}
	return j;
}
document.title = 'A New Deal';
function moneyFormat(money) {
	let r = money % 1;
	r || (r += '00');
	r * 10 % 1 || (r += '0');
	r = '.' + r;
	return (money | 0) + '.' + r.slice(-2);
}
function moneyUpdate() {
	m.innerHTML = 'Money: $' + moneyFormat(money);
}
function stockUpdate() {
	s.innerHTML = `Stocks: ${stock}`;
	t.innerHTML = `Price per Stock: $${moneyFormat(ticker.stocks.main)}`;
}
var datum = fetch('data2.txt').then(i=>i.json()),
	ticker = new Ticker({'main': 41.22}, 100, 60, 'main', window.innerWidth/2.01, datum),
	mainDiv = document.createElement('div'),
	leftDiv = document.createElement('div'),
	rightDiv = document.createElement('div'),
	frames = 0,
	money = 150,
	m = document.createElement('p'),
	s = document.createElement('p'),
	t = document.createElement('p'),
	c = document.createElement('div'),
	c2 = document.createElement('div'),
	c3 = document.createElement('div'),
	c4 = document.createElement('div'),
	c5 = document.createElement('div'),
	c6 = document.createElement('div'),
	data = fetch('data.txt').then(i=>i.json()).then(q=>(q.map(i=>{let j = button(i[0], i[1]); c4.appendChild(j); return j}))),
	num = 1,
	stock = 0,
	buy = button('BUY', 
				 'Buys the currently selected quantity of stock if you can afford it.', 
				 () => {let m = (ticker.stocks.main * 100 | 0) / 100, 
							n = money / m | 0; 
						if (num > n || num == 'max') {
							money -= m * n; 
							stock += n; 
							pressure -= n / 50
						} 
						else {
							money -= m * num; 
							stock += num; 
							pressure -= num / 40
						}
						moneyUpdate();
						stockUpdate()
					   }, 
				 ['centered']),
	sell = button('SELL', 
				  'Sells the currently selected quantity of stock.', 
				  () => {let m = (ticker.stocks.main * 100 | 0) / 100; 
						 if (stock < num || num == 'max') {
							 money += m * stock; 
							 pressure += stock / 50; 
							 stock -= stock
						 } 
						 else {
							 money += m * num; 
							 stock -= num; 
							 pressure += num / 46
						 }
						 moneyUpdate();
						 stockUpdate()
						}, 
				  ['centered']),
	nF = undefined,
	points = ([1, 5, 10, 100, 'max']).map(i=>button(
		i, 
		`Set buy/sell quantity to ${i}.`, 
		()=>{num = i; 
			 nF && (nF.style.background = ''); 
			 let g = points.map(i=>i.innerHTML), 
				 j = g.indexOf(i.toString()); 
			 nF = points[j]; 
			 nF.style.background = '#111'}, 
		['num'])),
	pressure = 0,
	cT = undefined,
	tab = 'Upgrades',
	tabs = (['Upgrades', 'Log', 'Key Concept']).map(i=>button(
		i, 
		`Set buy/sell quantity to ${i}.`, 
		()=>{tab = i; 
			 cT && (
				 (cT.style.background = ''), 
				 [...views[cT.innerHTML].children].forEach(q => q.hidden = true)
			 ); 
			 let g = tabs.map(i=>i.innerHTML), 
				 j = g.indexOf(i); 
			 cT = tabs[j]; 
			 cT.style.background = '#111'; 
			 [...views[i].children].forEach(q => q.hidden = false)})),
	views = {'Upgrades': c4, 'Log': c5, 'Key Concept': c6},
	log = document.createElement('textarea'),
	key = document.createElement('p');
key.innerHTML = 'This project relates entirely to Key Concept 7.1, section III, which states:<br>"During the 1930s, policymakers responded to the mass unemployment and social upheavals of the Great Depression by transforming the U.S. into a limited welfare state, redefining the goals and ideas of modern American liberalism."<br>'
points[0].style.background = '#111';
tabs[0].style.background = '#111';
nF = points[0];
cT = tabs[0];
leftDiv.classList.add('page');
rightDiv.classList.add('page');
c.classList.add('c');
c2.classList.add('c');
c3.classList.add('c');
//leftDiv.style.width = rightDiv.style.width = '45%';
//m.innerHTML = '$'+money;
moneyUpdate();
stockUpdate();
mainDiv.appendChild(leftDiv);
mainDiv.appendChild(rightDiv);
leftDiv.appendChild(ticker.canvas);
leftDiv.appendChild(m);
leftDiv.appendChild(s);
leftDiv.appendChild(t);
c.appendChild(buy);
c.appendChild(sell);
for (let i of points) {
	c2.appendChild(i);
}
for (let i of tabs) {
	c3.appendChild(i);
}
log.hidden = true;
key.hidden = 1;
key.classList.add('blah');
log.disabled = 'disabled';
c5.appendChild(log);
c6.appendChild(key);
leftDiv.appendChild(c);
leftDiv.appendChild(c2);
rightDiv.appendChild(c3);
rightDiv.appendChild(c4);
rightDiv.appendChild(c5);
rightDiv.appendChild(c6);
document.body.appendChild(mainDiv);
function tick(l) {
	let a = ticker.tick(frames, pressure);
	ticker.render(a);
	a && (stockUpdate(), (pressure *= 0.7));
	frames++;
	requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
