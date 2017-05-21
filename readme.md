# express-session-helpers

[![Travis](https://img.shields.io/travis/nehero/express-session-helpers.svg)](https://travis-ci.org/nehero/express-session-helpers) [![Coverage Status](https://coveralls.io/repos/nehero/express-session-helpers/badge.svg?branch=master)](https://coveralls.io/r/nehero/express-session-helpers?branch=master)

A set of utilities to help out with express sessions.

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
{% if flash.errors %}
  {% for error in flash %}
    <li>{{ error }}</li>
  {% endfor %}
{% endif %}
```