const flash = require('./flash');

describe('req.session.flash', () => {

  let req, res, next, f;

  beforeEach(() => {
    req = {};
    res = {
      locals: {}
    };
    next = jest.fn();
    f = flash();
  });

  it('should skip over if no session is installed', () => {
    f(req, res, next);

    expect(next.mock.calls).toHaveLength(1);
  });

  it('should set the flash to an empty object if not already set', () => {
    req.session = {};
    f(req, res, next);

    expect(req.session).toHaveProperty('flash');
  });

  it('should up the count on flashed items on each request', () => {
    req.session = {
      flash: {
        myKey: {
          count: 0,
          data: 1
        },

        myOtherKey: {
          count: 0,
          data: 2
        }
      }
    };

    f(req, res, next);
    expect(req.session.flash.myKey.count).toBe(1);
    expect(req.session.flash.myOtherKey.count).toBe(1);
  });

  it('should remove items that have lived for one session', () => {
    req.session = {
      flash: {
        myKey: {
          count: 1,
          data: 1
        },

        myOtherKey: {
          count: 0,
          data: 2
        }
      }
    };

    f(req, res, next);
    expect(req.session.flash.myKey).toBeUndefined();
    expect(req.session.flash.myOtherKey.count).toBe(1);
  });

  it('should set the flashed variable for all views', () => {
    req.session = {
      flash: {
        myKey: {
          count: 0,
          data: 1
        },

        myOtherKey: {
          count: 0,
          data: 2
        }
      }
    };

    f(req, res, next);
    expect(res.locals.flash).toEqual({
      myKey: 1,
      myOtherKey: 2
    });
  });

  describe('flash()', () => {
    beforeEach(() => {
      req.session = {};
      req.session.flash = {};
    });

    it('should set the key/value pair provided to the session storage', () => {
      // Need to call the function to set the flash() message on the req object
      f(req, res, next);
      req.flash('key', 'my value');

      expect(req.session.flash.key).toEqual({
        count: 0,
        data: 'my value'
      });
    });

    it('should return the flashed value when only called with a key', () => {
      f(req, res, next);
      req.flash('key', 'my value');

      expect(req.flash('key')).toBe('my value')
    });

    it('should return null when the key isnt set on the flash', () => {
      f(req, res, next);

      expect(req.flash('key')).toBe(null);
    });
  });

  describe('flashed()', () => {
    beforeEach(() => {
      req.session = {};
      req.session.flash = {};
    });

    it('should return an object of all of the flashed session data', () => {
      f(req, res, next);
      req.flash('key', 1);
      req.flash('another', 2);

      expect(req.flashed()).toEqual({
        key: 1,
        another: 2
      });
    });

    it('should return an empty object when no data is in the flash', () => {
      f(req, res, next);

      expect(req.flashed()).toEqual({});
    });
  });
});