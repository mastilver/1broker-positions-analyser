#!/usr/bin/env node
'use strict';

const fs = require('fs');

const meow = require('meow');
const csvParser = require('csv-parse');
const moment = require('moment');

const cli = meow(`
	Usage
	  $ 1broker-positions-analyser <positions csv path>

	Options
	  --day    Display results day by day
	  --week   Display results week by week
	  --month  Display results month by month
	  --spread Spread earning and loses across the days a position is open

	Examples
	  $ 1broker-positions-analyser ~/Downloads/position_history_2017-01-01_2017-07-23.csv --month
	  2017-06: -0.2677
	  2017-07: -0.1143
`);

if (cli.flags.help) {
	cli.showHelp();
}

const getKey = getKeyGenerator(
	['day', 'week', 'month'].find(x => cli.flags[x]) || 'day'
);

const profitPerDay = {};

fs.createReadStream(cli.input[0])
.pipe(csvParser({
	columns: true
}))
.on('data', ({'Entry Date': startDate, 'Exit Date': endDate, 'Profit/Loss': profit}) => {
	endDate = new Date(endDate);
	endDate.setHours(24, 0, 0, 0);

	startDate = new Date(startDate);
	startDate.setHours(0, 0, 0, 0);

	if (cli.flags.spread) {
		const nbDays = ((endDate - startDate) / 1000 / 3600 / 24);

		profit /= nbDays;

		for (let i = 0; i < nbDays; i++) {
			addProfit(new Date(startDate.getTime() + (i * 24 * 3600 * 1000)), profit);
		}
	} else {
		addProfit(endDate, profit);
	}
})
.on('end', () => {
	const result = {};

	Object.keys(profitPerDay)
	.sort()
	.forEach(date => {
		const key = getKey(date);

		if (!(key in result)) {
			result[key] = 0;
		}

		result[key] += profitPerDay[date];
	});

	Object.keys(result)
	.sort()
	.forEach(date => {
		console.log(`${date}: ${result[date] < 0 ? '' : ' '}${result[date].toFixed(4)}`);
	});
});

function getKeyGenerator(type) {
	return ({
		day: d => moment(d).format('YYYY-MM-DD'),
		week: d => moment(d).format('YYYY-[W]WW'),
		month: d => moment(d).format('YYYY-MM')
	})[type];
}

function addProfit(date, profit) {
	const key = moment(date).format('YYYY-MM-DD');

	if (!(key in profitPerDay)) {
		profitPerDay[key] = 0;
	}

	profitPerDay[key] += parseFloat(profit, 10);
}
