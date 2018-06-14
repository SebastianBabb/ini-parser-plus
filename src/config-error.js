/**
 *  Config parser module
 *  @module  src/config-parser
 *
 */
class ConfigError extends Error {
    constructor(code = 0, ...params) {
        super(...params);

        this.code= code;
    }
}

ConfigError.INVALID_CONFIG_PATH = 1;
ConfigError.INVALID_CONFIG_FILE = 2;

module.exports = ConfigError;
