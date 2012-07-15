#!/bin/bash

TMPDIR="/tmp/webutil"

rm -rf $TMPDIR
mkdir -p "$TMPDIR/png/pre"
mkdir -p "$TMPDIR/png/post"

IFS=""
OUTPUT=`phantomjs webutil.js -ua chrome -u -s http://chrome.airasia.com`
PNGFILES=`echo $OUTPUT | grep "image/png" | awk '{ print $3 }'`
echo $PNGFILES > "$TMPDIR/files.txt"

`wget -q -P "$TMPDIR/png/pre" --input-file="$TMPDIR/files.txt"`
`optipng -quiet -o 9 -dir "$TMPDIR/png/post" $TMPDIR/png/pre/*`

exit;
