'use strict';

/**
 * Module dependencies.
 */

const bodyparser = require('koa-body');
const parameter = require('./index');
const Koa = require('koa');

const app = new Koa();

app.use(bodyparser());
app.use(parameter(app));

app.use(async function (ctx) {
  ctx.verifyParams({
    id: 'id',
    date: 'date'
  });
  ctx.body = 'passed';
});

app.listen(3000);