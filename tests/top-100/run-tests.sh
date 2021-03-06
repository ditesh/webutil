#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
cd ../../

echo "webutil.js automated tester 1.0 (c) 2013 Ditesh Gathani <ditesh@gathani.org>";
echo
echo "1. Removing output directory (/tmp/wutest)"
rm -rf /tmp/wutest/*
echo "2. Creating output directory (/tmp/wutest)"
mkdir -p /tmp/wutest

echo "3. Running tests on top 100 websites ..."

for i in `cat tests/test-sites`; do

    echo -n "   o http://$i "
    OUTPUT=`phantomjs webutil.js -ua chrome -s $i 2> /dev/null`

    if [ $? -ne 0 ]; then
        echo $OUTPUT > "/tmp/wutest/$i.log"
        echo "FAIL"
    else echo "OK"
    fi

done

COUNT=`ls /tmp/wutest | wc -l`

echo "4. Summary: $COUNT test(s) failed"
echo "5. All done, exiting"
echo
