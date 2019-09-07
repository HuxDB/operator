'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cote = require('cote');

var _cote2 = _interopRequireDefault(_cote);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _errors = require('@feathersjs/errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const debug = (0, _debug2.default)('feathers-distributed:service');

// This is the Feathers service abstraction for a cote requester on remote
class RemoteService {
  constructor(options) {
    // This flag indicates to the plugin this is a remote service
    this.remote = true;
  }

  setup(app, path) {
    // Create the request manager to remote ones for this service
    this.requester = new app.cote.Requester({
      name: path + ' requester',
      namespace: path,
      requests: ['find', 'get', 'create', 'update', 'patch', 'remove']
    }, Object.assign({ log: false }, app.coteOptions));
    this.path = path;
    debug('Requester created for remote service on path ' + this.path);
    // Create the subscriber to listen to events from other nodes
    this.serviceEventsSubscriber = new app.cote.Subscriber({
      name: path + ' events subscriber',
      namespace: path,
      subscribesTo: ['created', 'updated', 'patched', 'removed']
    }, { log: false });
    this.serviceEventsSubscriber.on('created', object => {
      this.emit('created', object);
    });
    this.serviceEventsSubscriber.on('updated', object => {
      this.emit('updated', object);
    });
    this.serviceEventsSubscriber.on('patched', object => {
      this.emit('patched', object);
    });
    this.serviceEventsSubscriber.on('removed', object => {
      this.emit('removed', object);
    });
    debug('Subscriber created for remote service events on path ' + this.path);
  }

  // Perform requests to other nodes
  find(params) {
    var _this = this;

    return _asyncToGenerator(function* () {
      debug('Requesting find() remote service on path ' + _this.path, params);
      try {
        const result = yield _this.requester.send({ type: 'find', params });
        debug('Successfully find() remote service on path ' + _this.path);
        return result;
      } catch (error) {
        throw (0, _errors.convert)(error);
      }
    })();
  }

  get(id, params) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      debug('Requesting get() remote service on path ' + _this2.path, id, params);
      try {
        const result = yield _this2.requester.send({ type: 'get', id, params });
        debug('Successfully get() remote service on path ' + _this2.path);
        return result;
      } catch (error) {
        throw (0, _errors.convert)(error);
      }
    })();
  }

  create(data, params) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      debug('Requesting create() remote service on path ' + _this3.path, data, params);
      try {
        const result = yield _this3.requester.send({ type: 'create', data, params });
        debug('Successfully create() remote service on path ' + _this3.path);
        return result;
      } catch (error) {
        throw (0, _errors.convert)(error);
      }
    })();
  }

  update(id, data, params) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      debug('Requesting update() remote service on path ' + _this4.path, id, data, params);
      try {
        const result = yield _this4.requester.send({ type: 'update', id, data, params });
        debug('Successfully update() remote service on path ' + _this4.path);
        return result;
      } catch (error) {
        throw (0, _errors.convert)(error);
      }
    })();
  }

  patch(id, data, params) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      debug('Requesting patch() remote service on path ' + _this5.path, id, data, params);
      try {
        const result = yield _this5.requester.send({ type: 'patch', id, data, params });
        debug('Successfully patch() remote service on path ' + _this5.path);
        return result;
      } catch (error) {
        throw (0, _errors.convert)(error);
      }
    })();
  }

  remove(id, params) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      debug('Requesting remove() remote service on path ' + _this6.path, id, params);
      try {
        const result = yield _this6.requester.send({ type: 'remove', id, params });
        debug('Successfully remove() remote service on path ' + _this6.path);
        return result;
      } catch (error) {
        throw (0, _errors.convert)(error);
      }
    })();
  }
}

// This is the cote responder abstraction for a local Feathers service
class LocalService extends _cote2.default.Responder {
  constructor(options) {
    const app = options.app;
    const path = options.path;
    super({ name: path + ' responder', namespace: path, respondsTo: ['find', 'get', 'create', 'update', 'patch', 'remove'] }, { log: false });
    debug('Responder created for local service on path ' + path);
    const service = app.service(path);

    // Answer requests from other nodes
    this.on('find', (() => {
      var _ref = _asyncToGenerator(function* (req) {
        debug('Responding find() local service on path ' + path);
        const result = yield service.find(req.params);
        debug('Successfully find() local service on path ' + path);
        return result;
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
    this.on('get', (() => {
      var _ref2 = _asyncToGenerator(function* (req) {
        debug('Responding get() local service on path ' + path);
        const result = yield service.get(req.id, req.params);
        debug('Successfully get() local service on path ' + path);
        return result;
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());
    this.on('create', (() => {
      var _ref3 = _asyncToGenerator(function* (req) {
        debug('Responding create() local service on path ' + path);
        const result = yield service.create(req.data, req.params);
        debug('Successfully create() local service on path ' + path);
        return result;
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })());
    this.on('update', (() => {
      var _ref4 = _asyncToGenerator(function* (req) {
        debug('Responding update() local service on path ' + path);
        const result = yield service.update(req.id, req.data, req.params);
        debug('Successfully update() local service on path ' + path);
        return result;
      });

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    })());
    this.on('patch', (() => {
      var _ref5 = _asyncToGenerator(function* (req) {
        debug('Responding patch() local service on path ' + path);
        const result = yield service.patch(req.id, req.data, req.params);
        debug('Successfully patch() local service on path ' + path);
        return result;
      });

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    })());
    this.on('remove', (() => {
      var _ref6 = _asyncToGenerator(function* (req) {
        debug('Responding remove() local service on path ' + path);
        const result = yield service.remove(req.id, req.params);
        debug('Successfully remove() local service on path ' + path);
        return result;
      });

      return function (_x6) {
        return _ref6.apply(this, arguments);
      };
    })());

    // Dispatch events to other nodes
    this.serviceEventsPublisher = new app.cote.Publisher({
      name: path + ' events publisher',
      namespace: path,
      broadcasts: ['created', 'updated', 'patched', 'removed']
    }, Object.assign({ log: false }, app.coteOptions));
    service.on('created', object => {
      this.serviceEventsPublisher.publish('created', object);
    });
    service.on('updated', object => {
      this.serviceEventsPublisher.publish('updated', object);
    });
    service.on('patched', object => {
      this.serviceEventsPublisher.publish('patched', object);
    });
    service.on('removed', object => {
      this.serviceEventsPublisher.publish('removed', object);
    });
    debug('Publisher created for local service events on path ' + path);
  }
}

exports.default = {
  RemoteService,
  LocalService
};
module.exports = exports['default'];