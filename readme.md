# express-session-helpers

[![Travis](https://img.shields.io/travis/nehero/express-session-helpers.svg)](https://travis-ci.org/nehero/express-session-helpers) [![Coverage Status](https://coveralls.io/repos/nehero/express-session-helpers/badge.svg?branch=master)](https://coveralls.io/r/nehero/express-session-helpers?branch=master)

A set of utilities to help out with express sessions.

# Installation

`yarn add express express-session express-session-helpers`

# Reference

## Session Flashing

Flash a key / value pair to the session that only lives for the next request.

Usage:

```javascript
const express = require('express');
const app = express();
const session = require('express-session');
const { flash } = require('express-sesssion-helpers');

app.use(session({
  secret: 'lol'
}));

// This needs to be AFTER app.use(session())
app.use(flash());

app.post('/login', function(req, res, next) {
  // Let's say you're logging in a user and you did validation 
  // on their credentials. They didn't input their email / password
  // ...
  req.flash('errors', [
      'Email is required',
      'Password is required',
  ]);

  res.redirect('/login');
});

// app.get('/login') etc...
```

Then magically in your view, you have access to a `flash` variable.

```html
<!-- template engine is nunjucks -->
{% if flash.errors %}
  {% for error in flash.errors %}
    <li>{{ error }}</li>
  {% endfor %}
{% endif %}
```

## Sending back old input

Send back the users input to be used in the form for the next request only

Usage:

```javascript
const express = require('express');
const session = require('express-session');
const { old } = require('express-sesssion-helpers');
const bodyParser = require('body-parser');

const app = express();

// To accept form data
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(session({
  secret: 'lol'
}));

// This needs to be AFTER app.use(session())
app.use(old());

app.post('/login', function(req, res, next) {
  // do your validation
  // if it fails e.g. because the user didnt fill out their name
  // send back any validation errors using something like flash()
  // and send back their old input to prefill the fields
  req.sendBackInput();

  res.redirect('/login');
});

// app.get('/login') etc...
```

Then magically in your view, you have access to am `old` variable.

```html
<!-- template engine is nunjucks -->
<input type="email" name="email" value="{{ old.email if old.email else '' }}"
```