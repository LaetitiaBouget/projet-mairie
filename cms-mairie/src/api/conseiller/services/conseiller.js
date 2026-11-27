'use strict';

/**
 * conseiller service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::conseiller.conseiller');
