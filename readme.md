# ini-parser-plus

A simple INI configuration file parser with support for .local files.

## Installation

Using npm:
```shell
$ npm i --save ini-parser-plus
```

## Usage

In myConfig.ini:
```ini
; general settings
[general]
force-ssl-port=443
timezone="US/Pacific"
country-timezones="US"
lang="en"

; settings for ajax/javascript
[ajax]
server-timeout=25000 
upload-timeout=2700000
ajax-refresh=5000
ajax-refresh-on-request-status=1000
log=no
autocomplete-search-delay=2000
```

In myConfig.ini.local:<br />
_Any new sections will be added to the config object and any redeclared section properties will override those set in myConfig.ini._
```ini
; general settings
[general]
timezone="US/Mountain"  ; Overrides existing timezone property.
locale="eu_US"			; Adds locale property.

; Adds an entirely new section.
[debug]
level=0 
```

In Node.js:
```js
// Load the parser.
var config_parser = require('ini-parser-plus')();

// Set the config path.
config_parser.setPath('./myConfig.ini');

// Get all sections.
var sections = config_parser.getSection();

// Get all properties for a specific section.
var properties = config_parser.getSectionProperties('webservice');

console.log(properties);

[ 'general', 'ajax', 'debug' ]

// Get a specific section's properties.
var properties = config_parser.getSectionProperties("general");                                                                                                                                                                                                             

console.log(properties);

[ 'force-ssl-port',
  'timezone',
  'country-timezones',
  'lang',
  'locale' ]

// Load the config file into an object.
var config = config_parser.getConfig();

console.log(config);

{ general: 
   { 'force-ssl-port': '443',
     timezone: 'US/Mountain',
     'country-timezones': 'US',
     lang: 'en',
     locale: 'en_US' },
  ajax: 
   { 'server-timeout': '25000',
     'upload-timeout': '2700000',
     'ajax-refresh': '5000',
     'ajax-refresh-on-request-status': '1000',
     log: 'no',
     'autocomplete-search-delay': '2000' },
  debug: { 
  	level: '0' 
    }
}

// Access the sections and their properties using Dot notation.
console.log(config.general.timezone);
US/Mountain

// Access the sections and their properties using Bracket notation.
console.log(config.ajax['server-timeout']);
25000

```

Exception Handling:
```exc
let config_parser = require('config-parser')();                                                                                                                                                                                                                             

try {                                                                                                                                                                                                                                                                           
    config_parser.setConfigPath('./no/such/path/myConfig.ini');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
} catch(e) {
	console.log(e.code +"::"+ e.message); 
}

2::No config file(s) found

```	