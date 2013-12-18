# Chatty

Sexy syslogging for node.js

## Install

````js
npm install chatty
````

## Usage

#### Manual

```js
var chatty = require('chatty');

chatty.info('Hello');
````

#### Express

```js
var express = require('express');
var chatty = require('chatty');

app.use(express.logger({ stream: chatty.stream() }));

app.get('/', function (req, res) {
  res.send('Hello');
});

app.listen(3000);
````

## API

#### chatty.info(data)
Syslog with `LOG_INFO` priority

#### chatty.error(data)
Syslog with `LOG_ERR` priority

#### chatty.debug(data)
Syslog with `LOG_DEBUG` priority

#### chatty.stream(priority, options)
Return a syslog stream wrapper with specified priority.

`priority` can be either a syslog priority or any of the strings: `info`, `error` or `debug`. (`LOG_INFO` by default)

`options` is merged with the default and passed into the stream constructor

#### chatty.configure(options)

Configure chatty, availiable options are: `ident`, `option` and `facility` ([syslog man page](http://linux.die.net/man/3/syslog))
An extra option `console`, may be set to true to log messages with console.log rather than syslog (useful for development/debugging)

#### chatty.log(priority, data)

Direct wrapper of syslog (you probably DON'T want this).

`priority` must be a syslog.prority int

