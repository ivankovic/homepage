+++
date = 2015-03-06T22:55:30Z
title = "go-config - Go library for text file based configuration"
+++
Go-config - Go library for text file based configuration
========================================================

I just open-sourced a Go library for text file based configuration: [go-config](https://github.com/ivankovic/go-config).

Format
------

The format the library supports is a limited subset of the [.INI format](http://en.wikipedia.org/wiki/INI_file):

    key=value
    # Comment
    [section]
    key=value
    key=returned_value

It supports sections, key value pairs, `global` section and # line comments. It doesn't support any escaping, in-line comments or semicolon comments. Duplicate names are ok. The last value will be used.

The library is also read-only at the moment. In the future I might implement write support. 

Usage
-----

[It's really simple to use](https://github.com/ivankovic/go-config/blob/master/config/config_test.go#L8):

    import "github.com/ivankovic/go-config/config"
    
    ...

    x := config.Load("/path/to/config")
    v := x.Get("section", "key", "default_value")

Testing
-------

The library itself is well tested. But perhaps more importantly, any code *using* the library is easy to test. You can create fully in-memory fake configs just by doing:

    c := config.Config{
        sections: map[string]config.Section{
          "section_name":config.Section{
            values: map[string]string{
              "key": "value",
            }
          },
        },
    }

You can see a more [concrete example here](https://github.com/ivankovic/go-config/blob/master/config/config_test.go#L62)

