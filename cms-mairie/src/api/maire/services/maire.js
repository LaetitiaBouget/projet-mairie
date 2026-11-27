'use strict';

/**
 * maire service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::maire.maire');
