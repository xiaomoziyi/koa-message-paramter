/*!
 * koa-parameter - test/index.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

const util = require('util');
const koaBody = require('koa-body');
const request = require('supertest');
const parameter = require('../index');
const Koa = require('koa');

describe('koa-paramter', function () {
  it('should verify query ok', function (done) {
    const app = new Koa();
    app.use(koaBody());
    app.use(parameter(app));
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: {
          type: 'string',
          message: '请输入用户名'
        }
      });
      ctx.body = 'passed';
    });

    request(app.listen())
    .get('/?id=1&name=foo')
    .expect(200)
    .expect('passed', done);
  });

  it('should verify query error', function (done) {
    const app = new Koa();
    app.use(parameter(app));
    app.use(koaBody());
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: 'string'
      });
      ctx.body = 'passed';
    });

    request(app.listen())
    .get('/?id=x&name=foo')
    .expect(200)
    .expect({
      message: 'id should match /^\\d+$/',
      code: 100000,
    }, done);
  });

  it('should verify body ok', function (done) {
    const app = new Koa();
    app.use(koaBody());
    app.use(parameter(app));
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: 'string'
      });
      ctx.body = 'passed';
    });

    request(app.listen())
    .post('/?id=1&name=foo')
    .send({
      id: '1',
      name: 'foo'
    })
    .expect(200)
    .expect('passed', done);
  });

  it('should verify body error', function (done) {
    const app = new Koa();
    app.use(koaBody());
    app.use(parameter(app));
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: {
          type: 'string',
          min: 5,
          message: '用户名不得小于5位'
        }
      });
      ctx.body = 'passed';
    });

    request(app.listen())
    .post('/?id=1&name=ss')
    .send({
      id: '1',
      name: 'ss'
    })
    .expect(200)
    .expect({
      message: '用户名不得小于5位',
      code: 100000,
    }, done);
  });

  it('should ignore other error', function (done) {
    const app = new Koa();
    app.use(koaBody());
    app.use(parameter(app));
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: 'string'
      });
      ctx.body = 'passed';
      ctx.throw('throw error');
    });

    request(app.listen())
    .post('/?id=1&name=foo')
    .send({
      id: '1',
      name: 'foo'
    })
    .expect(500)
    .expect('Internal Server Error', done);
  });

  it('should ignore without rule', function (done) {
    const app = new Koa();
    app.use(koaBody());
    app.use(parameter(app));
    app.use(async function (ctx) {
      ctx.verifyParams();
      ctx.body = 'passed';
    });

    request(app.listen())
    .post('/?id=1&name=foo')
    .send({
      id: '1',
      name: 'foo'
    })
    .expect(200)
    .expect('passed', done);
  });

  it('should not add middleware', function (done) {
    const app = new Koa();
    parameter(app);
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: 'string'
      });
      ctx.body = 'passed';
    });

    request(app.listen())
    .get('/?id=x&name=foo')
    .expect(200)
    .expect('Validation Failed', done);
  });

  it('should verify input params', function (done) {
    const app = new Koa();
    parameter(app);
    app.use(async function (ctx) {
      const params = {
        id: 'x',
        name: 'foo'
      };
      const rule = {
        id: 'id',
        name: 'string'
      };

      ctx.verifyParams(rule, params);
      ctx.body = 'passed';
    });

    request(app.listen())
    .get('/')
    .expect(200)
    .expect('Validation Failed', done);
  });

  it('should translate error message', function (done) {
    const app = new Koa();
    app.use(parameter(app, function() {
      var args = Array.prototype.slice.call(arguments);
      args[0] = args[0].replace('should match %s', 'doit correspondre à %s');
      return util.format.apply(util, args);
    }));
    app.use(async function (ctx) {
      const params = {
        id: 'hi im not an id',
      };
      const rule = {
        id: 'id'
      };

      ctx.verifyParams(rule, params);
      ctx.body = 'passed';
    });

    request(app.listen())
    .get('/')
    .expect(200)
    .expect({
      message: 'id doit correspondre à /^\\d+$/',
      code: 100000,
    }, done);
  });

  it('should verify body error', function (done) {
    const app = new Koa();
    app.use(koaBody());
    app.use(parameter(app));
    app.use(async function (ctx) {
      ctx.verifyParams({
        id: 'id',
        name: 'string',
        age: {
          type: 'int',
          max: [20,'不得超过20岁']
        }
      });
      ctx.body = 'passed';
    });

    request(app.listen())
    .post('/?id=1&name=ss&age=25')
    .send({
      id: '1',
      name: 'ss',
      age: 25,
    })
    .expect(200)
    .expect({
      message: '不得超过20岁',
      code: 100000,
    }, done);
  });
});