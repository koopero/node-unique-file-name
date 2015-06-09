const 
  _     = require('lodash'),
  ass   = require('chai').assert

const defaultOptions = {
  iterations: 100,
  path: require('path'),
  fs:   require('fs-extra'),
}


module.exports = parseOptions

function parseOptions( opt, defaults ) {
  if ( 'string' == typeof opt ) {
    opt = {
      format: opt
    }
  }

  _.defaults( 
    opt, 
    {
      dir: process.cwd(),
    }, 
    defaults,
    defaultOptions
  );

  if ( opt.touch )
    ass.isFunction( opt.touch, 'opt.touch must be function or falsy' );

  if ( opt.exists )
    ass.isFunction( opt.exists, 'opt.exists must be function or falsy' );

  opt = _.clone(opt);

  return opt;
}
