#!/usr/bin/env node
'use strict';

const fs = require('fs');

const meow = require('meow');
const csvParser = require('csv-parse');

const cli = meow(`
	Usage
	  $ 1broker-positions-analyser <positions csv path>
`);

const result = {};

fs.createReadStream(cli.input[0])
.pipe(csvParser({
	columns: true
}))
.on('data', ({'Exit Date': date, 'Profit/Loss': profit}) => {
	date = new Date(date);
	const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

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