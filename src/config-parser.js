/**
 *  Config parser module
 *  @file INI configuration file parser with .local file extension support.
 *  @module  src/config-parser
 *  @author Sebastian Babb
 *
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const readline = require("readline");
const ConfigError = require("./config-error");

module.exports = function(c_path) {
    // Local file extention.
    const LOCAL_EXT = ".local";

    // Characters that indicate a comment.
    const COMMENT_CHARS = [";","#"];

    // Holds the config file attributes.
    let config = {};

    // Holds public memebers.
    let module = {};

    /************************
     * Public
     ************************/

    /**
     * Sets the path to the configuration directory.
     * @param {string} c_path - The path to the config file.
     */
    module.setConfigPath = function(c_path) {
        if(!c_path) {
            throw new ConfigError(ConfigError.INVALID_CONFIG_PATH, "No config path set.");
        }

        // Set the config path.
        config.path = c_path;

        // Isolate and set the config filename directory.
        let config_tokens = config.path.split(path.sep);

        // Index of the filename.
        let last_token = config_tokens.length-1;

        // Set the config configuration directory and filename.
        config.dir = config_tokens.slice(0,last_token).join(path.sep);
        config.filename = config_tokens[last_token];

        // Load the config file into memory.
        loadConfigFile();
    }

    /**
     * Get the path to the configuration file.
     * @return {string} The path to the config file.
     */
    module.getConfigPath = function() {
        return config.path;
    }

    /**
     * Get the path to the configuration directory.
     * @return {string} The path to the directory containgin the config file.
     */
    module.getConfigDir = function() {
        return config.dir;
    }

    /**
     * Get the configuration filename.
     * @return {string} The name of the config file.
     */
    module.getConfigFile = function() {
        return config.filename;
    }

    /**
     * Get the sections defined in the config file.
     * @return {array} The section.
     */
    module.getSections = function() {
        return Object.keys(config.obj);
    }

    /**
     * Get the properties of a specific section.
     * @param {string} section - The name of the section.
     * @return {array} The names of the properties.
     */
    module.getSectionProperties = function(section) {
        return Object.keys(config.obj[section]);
    }

    /**
     * Get the contents of the config file.
     * @return {object} Objects where the keys are the sections that refernce section objects.
     */
    module.getConfig= function() {
        return config.obj;

    }

    /************************
     * Private
     ************************/

    /*
     * Load the config file into memory.
     * Read the files in the config directory and determine if there
     * is a .local file that will override some values in the base config.
     */
    loadConfigFile = function() {
        // Check config file(s) exists.
        config.base = fs.existsSync(config.path)
        config.local = fs.existsSync(config.path + LOCAL_EXT);

        // At least the base or .local config file must exist.
        if(!config.base && !config.local) {
            throw new ConfigError(ConfigError.INVALID_CONFIG_FILE, "No config file(s) found");
        }

        // Parse the config file and store it in the global config variable.  
        config["obj"] = parseConfig();
    }


    /*
     * Parses config file(s) and overrides/add values in/to the base config
     * if they have been (re)declared in the local config.
     */
    parseConfig = function() {
        let base_config = {};
        let local_config = {};

        // Parse base config.
        if(config.base) {
            base_config = readFileToObject(config.path);
        }

        // If a local config file is present, override base config values.
        if(config.local) {
            local_config = readFileToObject(config.path + LOCAL_EXT);

            // Resolve the config files.  This will override values in the base
            // config with those redeclared in the local config.  If no base config
            // was found, it will use the local config.
            resolveConfig(base_config, local_config);
        }

        return base_config;
    }

    /*
     * Overrides the properties in the base config with those re-declared or added in the
     * local config.  If no base config was found, the local will be used.
     */
    resolveConfig = function(base, local) {
        // Get local config sections and and override (or add to) base config.
        local_sections = Object.keys(local);

        // Override base section with values from local.
        local_sections.forEach(function(section) {
            // Get local section properties.
            let section_properties = Object.keys(local[section]);

            // Replace base config section.
            section_properties.forEach(function(property) {
                // Add section if it does not exist in the base config.
                if(base[section] == undefined) {
                    base[section] = {};
                }

                // Override base config properties.
                base[section][property] = local[section][property];
            });
        });
    }

    /*
     * Converts the content of an .ini file to an object.
     */
    readFileToObject = function(path) {
        // Holds the config sections 
        let c = {};

        // Holds the section currently being processed.
        let section_name = false;

        // Read the file to an array.
        file_content = fs.readFileSync(path, "utf8").split(os.EOL);

        // Process the file line by line.
        file_content.forEach((line) => {
            let first_char = line[0];
            // Ignore commented lines.
            if(COMMENT_CHARS.includes(first_char)) return;

            // Test for section header.
            if(first_char == "[") {  
                // Isolate section name - [ExampleSectionName]
                section_name = line.slice(1,line.indexOf("]"))
                // Store section as an object that will hold the properties and values.
                c[section_name] = {};
            }

            // Add properties to section.
            let property = line.split("=");
            // Build a regex from defined comments.
            const COMMENT_RE = new RegExp("["+COMMENT_CHARS.join("")+"]");

            // Add property to the section.
            if(section_name && 1 < property.length) {
                // Clean up property and value whitespace and remove any trailing comments.
                c[section_name][property[0].trim().replace(/["']/g,"")] = property[1].split(COMMENT_RE)[0].trim().replace(/["']/g,"");
            }
        }); 

        // Return the array of config section objects.
        return c;
    }

    /*
     * If the config file was set on construction, parse it.
     */
    if(c_path) {
        module.setConfigPath(c_path);
    }

    return module;
}
