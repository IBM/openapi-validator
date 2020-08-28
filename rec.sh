echo This is a demo to show my extensions for custom queries in the openapi validator

echo in your config file you must add the following security_definitions
echo
echo
echo  'custom' :  -- Parent Object in the config
echo {
echo  'produces': { -- Path to the object that needs to be validated
echo    '_parent': [{ -- if the thing to be validated is an array or an object create a config like this
echo      'value': 'r', -- What value to look for
echo      'failIfFound': false, -- Do we fail if we find it or dont find it
echo      'casesensitive': true, -- is it case censitivie
echo      'level': 'error' -- failure level
echo    }]
echo  },
echo  'paths': {
echo    '_parent': [{
echo      'value': 'z',
echo      'failIfFound': false,
echo      'casesensitive': true,
echo      'level': 'error'
echo    }]
echo  },
echo  'info': {
echo    '_parent': [{
echo      'value': 'f',
echo      'failIfFound': true,
echo      'casesensitive': true,
echo      'level': 'error'
echo    }],
echo    '_child' : { -- If it is a value of on object
echo      'title' : [{
echo              'value': 'zz',
echo              'failIfFound': false,
echo              'casesensitive': true,
echo              'level': 'error'
echo            }]
echo    }
echo  }
echo }


echo
echo
echo Using the config above I run it on my sample and i get the following errors

read
node index.js  perftest_v5c.yaml
