function flash() {
  return function(req, res, next) {
    if (!req.session) {
      return next();
    }

    req.session.flash = req.session.flash || {};

    req.flash = function(key, data) {
      // Called with just key, return that piece of flashed data
      if (typeof data === 'undefined') {
        if (typeof req.session.flash[key] === "undefined") {
          return null;
        }
        return req.session.flash[key].data;
      }

      // otherwise called with data so set it
      req.session.flash[key] = {
        count: 0,
        data
      };
    };

    req.flashed = function() {
      let flash = {};
      Object.keys(req.session.flash).forEach(item => {
        flash[item] = req.session.flash[item].data;
      });

      return flash;
    };

    let sessionToSet = {};

    Object.keys(req.session.flash).forEach(item => {
      let flashItem = req.session.flash[item];

      flashItem.count += 1;

      if (flashItem.count <= 1) {
        sessionToSet[item] = flashItem;
      }
    });

    req.session.flash = sessionToSet;

    res.locals.flash = req.flashed();

    return next();
  };
}

module.exports = flash;
