koa-message-parameter
=======

基于parameter和koa封装成的验证工具，可以自定义message

## Install

```bash
$ npm install koa-message-parameter --save
```

## Usage

```js
const Koa = require('koa');
const parameter = require('koa-message-parameter');

const app = new Koa();

parameter(app); // add verifyParams method, but don't add middleware to catch the error
// app.use(parameter(app)); // also add a middleware to catch the error.

app.use(async function (ctx) {
  ctx.verifyParams({
    name: {
      type: 'string',
      message: '请输入用户名！',
    },
    age: {
      type: 'int',
      min: [5, '年龄不得小于5岁！'],
    },
  });
});
```
## Translate

You can override the translate method of parameter to implement I18n, by passing a function like this :

```js
const Koa = require('koa');
const parameter = require('koa-message-parameter');

const app = new Koa();

parameter(app, function() {
  // Same example with node-parameter
  var args = Array.prototype.slice.call(arguments);
  // Assume there have I18n.t method for convert language.
  return I18n.t.apply(I18n, args);
});

app.use(async function (ctx) {
  ctx.verifyParams({
    name: 'string'
  });
});
```

### Rule

#### common rule

- `required` - if `required` is set to false, this property can be null or undefined. default to `true`.
- `type` - The type of property, every type has it's own rule for the validate.
- `convertType` - Make parameter convert the input param to the specific type, support `int`, `number`, `string` and `boolean`, also support a function to customize your own convert method.
- `default` - The default value of property, once the property is allowed non-required and missed, parameter will use this as the default value. __This may change the original input params__.
- `widelyUndefined` - override `options.widelyUndefined`
- `message` - Custom error tips when checking errors

__Note: you can combile require and type end with a notation `?` like: `int?` or `string?` to specific both type and non-required.__

#### int

If type is `int`, there has tow addition rules:

- `max` - The maximum of the value, `value` must <= `max`.
- `min` - The minimum of the value, `value` must >= `min`.

Default `convertType` is `int`.

__Note: default `convertType` will only work when `options.convert` set to true in parameter's constructor.__

#### integer

Alias to `int`.

#### number

If type is `number`, there has tow addition rules:

- `max` - The maximum of the value, `value` must <= `max`.
- `min` - The minimum of the value, `value` must >= `min`.

Default `convertType` is `number`.

#### date

The `date` type want to match `YYYY-MM-DD` type date string.

Default `convertType` is `string`.

#### dateTime

The `dateTime` type want to match `YYYY-MM-DD HH:mm:ss` type date string.

Default `convertType` is `string`.

#### datetime

Alias to `dateTime`.

#### id

The `id` type want to match `/^\d+$/` type date string.

Default `convertType` is `string`.

#### boolean

Match `boolean` type value.

Default `convertType` is `boolean`.

#### bool

Alias to `boolean`

#### string

If type is `string`, there has four addition rules:

- `allowEmpty`(alias to `empty`) - allow empty string, default to false. If `rule.required` set to false, `allowEmpty` will be set to `true` by default.
- `format` - A `RegExp` to check string's format.
- `max` - The maximum length of the string.
- `min` - The minimum length of the string.
- `trim` - Trim the string before check, default is `false`.

Default `convertType` is `string`.

#### email

The `email` type want to match [RFC 5322](http://tools.ietf.org/html/rfc5322#section-3.4) email address.

- `allowEmpty` - allow empty string, default is false.

Default `convertType` is `string`.

#### password

The `password` type want to match `/^$/` type string.

- `compare` - Compare field to check equal, default null, not check.
- `max` - The maximum length of the password.
- `min` - The minimum length of the password, default is 6.

Default `convertType` is `string`.

#### url

The `url` type want to match [web url](https://gist.github.com/dperini/729294).

Default `convertType` is `string`.

#### enum

If type is `enum`, it requires an addition rule:

- `values` - An array of data, `value` must be one on them. ___this rule is required.___

#### object

If type is `object`, there has one addition rule:

- `rule` - An object that validate the properties ot the object.

#### array

If type is `array`, there has four addition rule:

- `itemType` - The type of every item in this array.
- `rule` - An object that validate the items of the array. Only work with `itemType`.
- `max` - The maximun length of the array.
- `min` - The minimun lenght of the array.

#### abbr

- `'int'` => `{type: 'int', required: true}`
- `'int?'` => `{type: 'int', required: false }`
- `'integer'` => `{type: 'integer', required: true}`
- `'number'` => `{type: 'number', required: true}`
- `'date'` => `{type: 'date', required: true}`
- `'dateTime'` => `{type: 'dateTime', required: true}`
- `'id'` => `{type: 'id', required: true}`
- `'boolean'` => `{type: 'boolean', required: true}`
- `'bool'` => `{type: 'bool', required: true}`
- `'string'` => `{type: 'string', required: true, allowEmpty: false}`
- `'string?'` => `{type: 'string', required: false, allowEmpty: true}`
- `'email'` => `{type: 'email', required: true, allowEmpty: false, format: EMAIL_RE}`
- `'password'` => `{type: 'password', required: true, allowEmpty: false, format: PASSWORD_RE, min: 6}`
- `'object'` => `{type: 'object', required: true}`
- `'array'` => `{type: 'array', required: true}`
- `[1, 2]` => `{type: 'enum', values: [1, 2]}`
- `/\d+/` => `{type: 'string', required: true, allowEmpty: false, format: /\d+/}`

### much message
```

 {
   ... 
   min: [2, 'can't smaller then 2']
   ...
 }

=== equal to
 {
   ... 
   min:2,
   message: 'can't smaller then 2'
   ...
 }

(min,max,format,compare all available)
```
### `errors` examples

```js
{
  code: '100000',
  message: 'required'
}
```
