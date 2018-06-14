//var assert = require("assert");
var chai = require("chai");
var assert = chai.assert;

const config = require("../src/config-parser")();
const ConfigError = require("../src/config-error");

describe("These tests check the functionality of the public accessible functions of config-parser.js.", function() {
    describe("setConfigPath()", function() {
        it("Should set the config file path.", function() {
            var config_path = "foo/bar";

            // Catch the exception thrown by missing config file and check the path
            // was correctly set.
            try {
                config.setConfigPath(config_path);
            } catch(error) {
                assert.equal(config.getConfigPath(), config_path);
            }

        });
        it("Should throw an exeception if no config path is specified.", function() {

            try{
                config.setConfigPath();
            } catch(error) {
                assert.equal(error.code, ConfigError.INVALID_CONFIG_PATH);
            }
        });
        it("Should throw an exeception if no config file(s) are found.", function() {

            try{
                config.setConfigPath("fake-config/myApp.ini");
            } catch(error) {
                assert.equal(error.code, ConfigError.INVALID_CONFIG_FILE);
            }
        });
    });

    describe("getConfigPath()", function() {
        it("Should return the config file path.", function() {
            var config_path = "foo/bar";

            // Catch the exception thrown by missing config file and check the path
            // was correctly set.
            try {
                config.setConfigPath(config_path);
            } catch(error) {
                assert.equal(config.getConfigPath(), config_path);
            }

        });
    });

    describe("getConfigDir()", function() {
        it("Should return the directory containing the config file.", function() {
            var config_path = "config/foo/bar";

            // Catch the exception thrown by missing config file and check the path
            // was correctly set.
            try {
                config.setConfigPath(config_path);
            } catch(error) {
                assert.equal(config.getConfigDir(), "config/foo");
            }

        });
    });

    describe("getConfigFile()", function() {
        it("Should return the name of the config file.", function() {
            config_params = {
               directory: "config/foo/bar",
               file_name: "myApp.ini"
            };

            // Catch the exception thrown by missing config file and check the path
            // was correctly set.
            try {
                config.setConfigPath(Object.values(config_params).join("/"));
            } catch(error) {
                assert.equal(config.getConfigFile(), config_params.file_name);
            }

        });
    });

    describe("getConfig()", function() {
        it("Should load the config file into an object.", function() {
            config_params = {
               directory: "./test/config",
               file_name: "testConfig.ini"
            };

            config.setConfigPath(Object.values(config_params).join("/"));
            config_obj = config.getConfig();
            assert.equal(config_obj.webservice.server,"prod.backend.com");

        });

        it("Should make sections accessibles as object properties.", function() {
            config_params = {
               directory: "./test/config",
               file_name: "testConfig.ini"
            };

            config.setConfigPath(Object.values(config_params).join("/"));
            config_obj = config.getConfig();
            assert.property(config_obj, "webservice");

        });

        it("Should make section properties accessibles as properties of the section object.", function() {
            config_params = {
               directory: "./test/config",
               file_name: "testConfig.ini"
            };

            config.setConfigPath(Object.values(config_params).join("/"));
            config_obj = config.getConfig();
            assert.property(config_obj.webservice, "server");
        });

        it("Should replace base config values with those redeclared in the .local file..", function() {
            config_params = {
               directory: "./test/config",
               file_name: "testConfig.ini"
            };

            config.setConfigPath(Object.values(config_params).join("/"));
            config_obj = config.getConfig();
            assert.equal(config_obj.webservice["enable-tls"],"false");

        });

        it("Should add sections from the .local file that do not exist in the base config.", function() {
            config_params = {
               directory: "./test/config",
               file_name: "testConfig.ini"
            };

            config.setConfigPath(Object.values(config_params).join("/"));
            config_obj = config.getConfig();
            assert.property(config_obj, "general");

        });

        it("Should ignore lines that begin with comment characters.", function() {
            config_params = {
               directory: "./test/config",
               file_name: "testConfig.ini"
            };

            config.setConfigPath(Object.values(config_params).join("/"));
            config_obj = config.getConfig();
            assert.equal(config_obj.webservice.server, "prod.backend.com");

        });

        it("Should ignore trailing comments.", function() {
            config_params = {
               directory: "./test/config",
               file_name: "testConfig.ini"
            };

            config.setConfigPath(Object.values(config_params).join("/"));
            config_obj = config.getConfig();

            assert.equal(config_obj.general.hostname, "dev.my-dev-box.com");

        });
    });

    describe("getSections()", function() {
        it("Should return an array of the config file's sections.", function() {
            config_params = {
               directory: "./test/config",
               file_name: "testConfig.ini"
            };

            config.setConfigPath(Object.values(config_params).join("/"));
            sections = config.getSections();
            assert.typeOf(sections ,"array");

        });
    });

    describe("getSectionsProperties()", function() {
        it("Should return an array of the specified section's properties.", function() {
            config_params = {
               directory: "./test/config",
               file_name: "testConfig.ini"
            };

            config.setConfigPath(Object.values(config_params).join("/"));
            properties = config.getSectionProperties("webservice");
            assert.typeOf(properties, "array");

        });
    });
});

