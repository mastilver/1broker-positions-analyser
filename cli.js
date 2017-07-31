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

const result = {};

fs.createReadStream(cli.input[0])
.pipe(csvParser({
	columns: true
}))
.on('data', ({'Exit Date': date, 'Profit/Loss': profit}) => {
	date = new Date(date);
	const key = getKey(date);

	if (!(key in result)) {
		result[key] = 0;
	}

	result[key] += parseFloat(profit, 10);
})
.on('end', () => {
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
