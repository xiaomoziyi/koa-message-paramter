/*!
 * koa-message-parameter - index.js
 * Copyright(c) 2020 Fairy <fang_xiao-7.13@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

 /**
 * 自定义Api异常
 */
class ApiError extends Error{
    
  //构造方法
  constructor(body = {
    code: -1,
    message: '未知错误',
    name: 'UNKNOW_ERROR'
  }){
      super();
      this.name = body.name;
      this.code = body.code;
      this.message = body.message;
  }
}

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
    if(typeof errors === 'object') {   
      throw new ApiError({
        code: 100000,
        name: 'INVALID_PARAM',
        message:  errors instanceof Array ? errors[0].message : errors.message || '未知错误',
      });
    }
    this.throw(500);
  };

  return async function verifyParam(ctx, next) {
    try {
      await next();
    } catch (err) {   
      if (err instanceof ApiError) {
        ctx.status = 200;  
        ctx.body = {
          code: err.code,
          message: err.message,
        };
        return;
      }
      throw err;
    }
  };
};