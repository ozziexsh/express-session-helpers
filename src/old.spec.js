const oldMiddleware = require('./old');

describe('req.session.old', () => {

  let req, res, next, f;

  beforeEach(() => {
    req = {};
    res = {
      locals: {}
    };
    next = jest.fn();
    old = oldMiddleware();
  });

  it('should skip over if no session is installed', () => {
    old(req, res, next);

    expect(next.mock.calls).toHaveLength(1);
  });

  it('should set the old input to an empty object if not already set', () => {
    req.session = {};
    old(req, res, next);

    expect(req.session).toHaveProperty('old');
  });

  it('should preserve input for the inital request', () => {
    req.session = {
      old: {
        count: 0,
        data: {
          firstName: 'ozzie'
        }
      }
    };

    old(req, res, next);
    expect(req.session.old.count).toBe(1);
  });

  it('should remove the old input after the next request', () => {
    req.session = {
      old: {
        count: 1,
        data: {
          firstName: 'ozzie'
        }
      }
    };

    old(req, res, next);
    expect(req.session.old).toEqual({});
  });

  it('should make the old input available to all views', () => {
    req.session = {
      old: {
        count: 0,
        data: {
          firstName: 'ozzie'
        }
      }
    };

    old(req, res, next);
    expect(res.locals.old).toEqual({
      firstName: 'ozzie'
    });
  });

  describe('sendBackInput()', () => {
    it('should set the old input based on the request body', () => {
      req.body = {
        firstName: 'ozzie'
      };

      req.session = {};

      old(req, res, next);

      req.sendBackInput();

      expect(req.session.old).toEqual({
        count: 0,
        data: {
          firstName: 'ozzie'
        }
      });
    });
  });

});