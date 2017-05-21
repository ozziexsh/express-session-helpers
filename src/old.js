function old() {
  return function(req, res, next) {
    if (!req.session) {
      return next();
    }

    req.session.old = req.session.old || {};

    req.sendBackInput = function() {
      req.session.old = {
        count: 0,
        data: req.body
      };
    };

    req.session.old.count += 1;

    req.session.old = req.session.old.count <= 1
      ? req.session.old
      : {};

    res.locals.old = req.session.old.data || {};

    return next();
  };
}

module.exports = old;
