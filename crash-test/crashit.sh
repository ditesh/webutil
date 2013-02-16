#!/bin/bash

echo "Automated Crash Debugging Tool"
echo
echo "0. Removing /tmp/*.dmp*"
rm /tmp/*.dmp*

echo "1. Running phantomjs"
IFS=""
OUTPUT=`phantomjs crashit.js $@ 2>&1 | grep "PhantomJS has crashed"`

FILENAME=`ls /tmp/*.dmp`

if [ "$?" -eq "0" ]; then

    echo "2. Found and converting crash file $FILENAME"
    ./minidump_stackwalk $FILENAME . > "$FILENAME.log" 2> /dev/null


else echo "2. No crash"
fi

echo "3. All done"
echo
