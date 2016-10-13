#!/usr/bin/env node

require('./lib/tip');
import config from './lib/config';
import Htmlonline from './lib/htmlonline';

new Htmlonline(config)