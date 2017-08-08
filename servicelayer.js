'use strict';
module.exports = (dir) => {
    const config = require(dir + '/configService')();
    const logger = require(dir + '/logService')(config);
    const cache = require(dir + '/cacheService')(logger, config);
    const data = require(dir + '/dataService')(cache, logger, config);
    return {
        config,
        logger,
        cache,
        data
    };
}