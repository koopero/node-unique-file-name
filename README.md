# node-unique-file-name
Creates unique file names

# Options

* `dir` - Base directory for output ( default: `CWD` )
* `format` - 
* `placeholder` - Whether to create an empty placeholder file ( default: `true` )

# Format

* `i` - integer counter, starting from 0. 
* `z` - hex counter
* `t` - base-36 counter
* `r` - Random string of characters [A-Za-z0-9]

* `B` - Basename of file
* `b` - Basename of file, slugified. 
* `F` - Basename of file
* `f` - Basename of file, slugified. 
* `E` - Extname of file, including '.'
* `e` - Extname of file, slugified. 
* `P` - Dirname of file.
* `p` - Dirname of file, slugified.

* `Y` - Year 
* `M` - Month [1-12]
* `D` - Day of month [1-31]
* `T` - Full JSON date ('1961-04-12T13:07:00.000Z') ( not trimmed )
