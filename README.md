# node-unique-file-name
Creates unique file names

# Features

* Output filenames will be unique.
* Ensure that filenames contain no special characters, and may be used un-escaped as shell command arguments.
* Organize files by date and time.


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
* `h` - Hour [0-23]
* `m` - Minute [0-59]
* `s` - Second [0-59]. Use `%.3s` to include fractional component.
* `T` - Full JSON date ('1961-04-12T13:07:00.000Z')

## Examples

### %Y%M%D/%16b%.i%8.e

### Camera_%10T/%h%m%0.4s.png

## Slugification



# Options

Object or string. If string, will resolve to `{ format: string }`

* `dir` - Base directory for output ( default: `CWD` )
* `format` - 
* `touch` - Function used to create empty placeholder file, or `false` to not create them. `function ( filename, cb )` Defaults to `touch` or `touchSync`. 
* `exists` - function used to check if file already exists, or `false` not to check. `function ( filename, cb )`. ( defaults: `fs.exists` or `fs.existsSync` )