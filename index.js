/*!
 * koa-message-parameter - index.js
 * Copyright(c) 2020 Fairy <fang_xiao-7.13@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

const Parameter = require('./parameter');

module.exports = function (app = { context: {}}, translate) {
  let parameter;

  if (typeof translate === 'function') {
    parameter = new Parameter({
      translate
    })
  } else {
    parameter = new Parameter()
  }
  app.context.verifyParams = function(rules, params) {
    if (!rules) {
      return;
    }

    if (!params) {
      params = ['GET', 'HEAD'].includes(this.method.toUpperCase())
        ? this.request.query
        : this.request.body;

      // copy
      params = Object.assign({}, params, this.params);
    }
    const errors = parameter.validate(rules, params);
    if (!errors) {
      return;
    }
    this.throw(200, 'Validation Failed', {
      code: 'INVALID_PARAM',
      errors: errors[0],
    });
  };

  return async function verifyParam(ctx, next) {
    try {
      await next();
    } catch (err) {  
      if (err.code === 'INVALID_PARAM') {
        const errors = err.errors;
        ctx.status = 200;  
        ctx.body = {
          message: errors.message || 'Validation Failed',
          code: 100000,
        };
        return;
      }
      throw err;
    }
  };
};