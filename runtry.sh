#!/bin/bash


for i in `cat tests/top-100/test-sites`; do

    while [ 1 ]; do

        phantomjs webutil.js -s $i
        echo
        echo -n "Running on $i, (c)ontinue or (r)epeat? "
        read var

        if [ "$var" != "r" ]; then break; fi

    done

    echo
done
