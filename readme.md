# 1broker-positions-analyser [![Build Status](https://travis-ci.org/mastilver/1broker-positions-analyser.svg?branch=master)](https://travis-ci.org/mastilver/1broker-positions-analyser)

> 1broker positions analyser


## Install

```
$ npm install -g 1broker-positions-analyser
```

## Usage

```
$ 1broker-positions-analyser --help
Usage
  $ 1broker-positions-analyser <positions csv path>

Options
  --day    Display results day by day
  --week   Display results week by week
  --month  Display results month by month
  --year   Display results year by year
  --spread Spread earning and loses across the days a position is open

Examples
  $ 1broker-positions-analyser ~/Downloads/position_history_2017-01-01_2017-07-23.csv --month
  2017-06: -0.2677
  2017-07: -0.1143
```

## License

MIT © [Thomas Sileghem](http://mastilver.com)
