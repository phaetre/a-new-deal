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
function moneyFormat(money) {
	let r = money % 1;
	r || (r += '00');
	r * 10 % 1 || (r += '0');
	r = '.' + r;
	return (money | 0) + '.' + r.slice(-2);
}
function moneyUpdate() {
	m.innerHTML = 'Money: $' + moneyFormat(money);
	localStorage.setItem('money', money);
}
function stockUpdate() {
	s.innerHTML = `Stocks owned: ${stock}`;
	t.innerHTML = `Price per Stock: $${moneyFormat(ticker.stocks.main)}`;
	d.innerHTML = `${date[1]}/${date[2]}/${date[0]}`;
	localStorage.setItem('stock', stock);
	localStorage.setItem('prices', ticker.focusStock);
	localStorage.setItem('day', day);
	localStorage.setItem('date', date);
}
function nextDay(date) {
	let m = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		d = [...date],
		ly = (d[0] % 4 ? 0 : (d[0] % 100 ? 1 : (d[0] % 400 ? 1 : 0)));
	d[2]++;
	if (d[2] > m[d[1] - 1] + (ly && d[1] == 2)) {
		d[1]++;
		d[2] = 1;
		if (d[1] > 12) {
			d[0]++;
			d[1] = 1;
		}
	}
	return d;
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
	d = document.createElement('p'),
	c = document.createElement('div'),
	c2 = document.createElement('div'),
	c3 = document.createElement('div'),
	c4 = document.createElement('div'),
	c5 = document.createElement('div'),
	c6 = document.createElement('div'),
	c7 = document.createElement('div'),
	data = fetch('data.txt').then(i=>i.json()).then(q=>(q.map(i=>{
		let j = button(i[0] + '\nCost (in-game): $' + i[7], i[1], () => {if (money > i[7]) {ticker.val *= (1 + q[2] / 100) || 1; ticker.add += q[3] || 0; j.classList.add('used'); log.innerHTML += `<br>${i[0]}:<br>${i[1]}`}}, ['locked']); 
		c4.appendChild(j); 
		return [j, [q[4], q[5], q[6]]]}))),
	num = 1,
	stock = 0,
	day = 0,
	date = [1932, 7, 8],
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
	tabs = (['Upgrades', 'Log', 'Key Concept', 'Help']).map(i=>button(
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
	views = {'Upgrades': c4, 'Log': c5, 'Key Concept': c6, 'Help': c7},
	log = document.createElement('textarea'),
	key = document.createElement('p'),
	help = document.createElement('p'),
	dividend = 0.3;
key.innerHTML = 'This project relates entirely to Key Concept 7.1, section III, which states:<br>"During the 1930s, policymakers responded to the mass unemployment and social upheavals of the Great Depression by transforming the U.S. into a limited welfare state, redefining the goals and ideas of modern American liberalism."<br>This project presents 9 different New Deal acts / programs, with brief descriptions of each of them. For more information about New Deal programs, go to <a href="https://livingnewdeal.org/">this site</a>, where most of this information was sourced from.<br><br>In terms of historical accuracy, the initial stock ticker data (when the game starts) is accurate (and sourced from <a href="https://www.macrotrends.net/2484/dow-jones-crash-1929-bear-market">here</a>), while all of the stock data after that is randomly generated, and an inaccurate simulator of actual stocks. The upgrades are actual historical policies that happened, and the dates are accurate, however unless it says a specific effect in the description for an upgrade, all of the effects are made up.';
help.innerHTML = 'Buy and sell stocks to make money, then use that to buy upgrades. You will also passively make money for every stock you have. Hover over each upgrade to learn more about that New Deal policy!';
log.innerHTML = 'When you purchase or unlock upgrades, their descriptions will be added here.';
points[0].style.background = '#111';
tabs[0].style.background = '#111';
nF = points[0];
cT = tabs[0];
leftDiv.classList.add('page');
rightDiv.classList.add('page');
c.classList.add('c');
c2.classList.add('c');
c3.classList.add('c');
document.title = 'A New Deal';
//leftDiv.style.width = rightDiv.style.width = '45%';
//m.innerHTML = '$'+money;
moneyUpdate();
stockUpdate();
mainDiv.appendChild(leftDiv);
mainDiv.appendChild(rightDiv);
leftDiv.appendChild(d);
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
help.hidden = 1;
key.classList.add('blah');
log.disabled = 'disabled';
c5.appendChild(log);
c6.appendChild(key);
c7.appendChild(help);
leftDiv.appendChild(c);
leftDiv.appendChild(c2);
rightDiv.appendChild(c3);
rightDiv.appendChild(c4);
rightDiv.appendChild(c5);
rightDiv.appendChild(c6);
rightDiv.appendChild(c7);
document.body.appendChild(mainDiv);
function tick(l) {
	let a = ticker.tick(frames, pressure, stock);
	ticker.render(a);
	a && ((money += Math.max(dividend * stock * ((ticker.focusStock[ticker.focusStock.length - 1] || 0) - (ticker.focusStock[ticker.focusStock.length - 2] || 0)), 0)), stockUpdate(), moneyUpdate(), (pressure *= 0.7), day++, (date = nextDay(date)), (()=>{for (let i in data){let j = i[1];if (j[0] == date[0] && j[1] == date[1] && j[2] == date[2]) {i[1].classList.remove('locked')}}})(), console.log(date));
	frames++;
	requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
