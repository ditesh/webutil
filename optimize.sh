#!/bin/bash

command -v csstidy >/dev/null 2>&1 || { echo >&2 "I require csstidy but it's not installed.  Aborting."; }
command -v optipng >/dev/null 2>&1 || { echo >&2 "I require optipng but it's not installed.  Aborting."; }
command -v uglifyjs >/dev/null 2>&1 || { echo >&2 "I require uglifyjs but it's not installed.  Aborting."; }
command -v phantomjs >/dev/null 2>&1 || { echo >&2 "I require phantomjs but it's not installed.  Aborting."; }

JS=false
GIF=false
JPG=false
PNG=false
CSS=false
TMPDIR="/tmp/webutil"

rm -rf $TMPDIR
mkdir -p "$TMPDIR/png/pre"
mkdir -p "$TMPDIR/png/post"
mkdir -p "$TMPDIR/jpg/pre"
mkdir -p "$TMPDIR/jpg/post"
mkdir -p "$TMPDIR/gif/pre"
mkdir -p "$TMPDIR/gif/post"
mkdir -p "$TMPDIR/css/pre"
mkdir -p "$TMPDIR/css/post"
mkdir -p "$TMPDIR/js/pre"
mkdir -p "$TMPDIR/js/post"

echo "Web Optimization Tool 1.0 (c) 2013 Ditesh Gathani <ditesh@gathani.org>"
echo
echo -n "Running webutil ... "
OUTPUT=`phantomjs ./webutil.js -d -u -s $@`

if [ "$?" -ne "0" ] ; then
    echo "unable to connect";
    echo
    exit 1
fi

OLDIFS=$IFS
IFS=$'\n'
for i in $OUTPUT; do

    if $( echo $i | awk '{print $1}' | grep --quiet "png" ); then
        echo $i | awk '{print $3}' >> $TMPDIR/pngfiles.txt
    elif $( echo $i | awk '{print $1}' | grep --quiet "jpg\|jpeg" ); then
        echo $i | awk '{print $3}' >> $TMPDIR/jpgfiles.txt
    elif $( echo $i | awk '{print $1}' | grep --quiet "gif" ); then
        echo $i | awk '{print $3}' >> $TMPDIR/giffiles.txt
    elif $( echo $i | awk '{print $1}' | grep --quiet "css" ); then
        echo $i | awk '{print $3}' >> $TMPDIR/cssfiles.txt
    elif $( echo $i | awk '{print $1}' | grep --quiet "javascript" ); then
        echo $i | awk '{print $3}' >> $TMPDIR/jsfiles.txt
    fi

done

echo "done."

echo -n "Checking for PNG files ... "
if [ -f "$TMPDIR/pngfiles.txt" ]; then

    echo "found"
    echo -n "Downloading PNG files ... "
    `wget -q -P "$TMPDIR/png/pre" --input-file="$TMPDIR/pngfiles.txt"`
    echo "done."

    echo -n "Optimizing PNG files ... "
    optipng -quiet -o 9 -dir "$TMPDIR/png/post" $TMPDIR/png/pre/*
    echo "done."

    PNG=true
    PNGPRE=`du -bh $TMPDIR/png/pre | awk '{ print $1 }' | cut -d'K' -f 1`
    PNGPOST=`du -bh $TMPDIR/png/post | awk '{ print $1 }' | cut -d'K' -f 1`
    PNGDIFF=`echo "$PNGPRE-$PNGPOST" | bc`
    PNGPER=`echo "scale=2;100*$PNGDIFF/$PNGPRE" | bc`

else
    echo "not found."
fi

echo -n "Checking for JPG files ... "

if [ -f "$TMPDIR/jpgfiles.txt" ]; then

    echo "found."
    echo -n "Downloading JPG files ... "
    `wget -q -P "$TMPDIR/jpg/pre" --input-file="$TMPDIR/jpgfiles.txt"`
    echo "done."

    echo -n "Optimizing JPG files ... "
    for i in `ls $TMPDIR/jpg/pre/* | xargs -n1 basename`; do `jpegtran -optimize -copy none "$TMPDIR/jpg/pre/$i" > "$TMPDIR/jpg/post/$i"`; done
    echo "done."

    JPG=true
    JPGPRE=`du -bh $TMPDIR/jpg/pre | awk '{ print $1 }' | cut -d'K' -f 1`
    JPGPOST=`du -bh $TMPDIR/jpg/post | awk '{ print $1 }' | cut -d'K' -f 1`
    JPGDIFF=`echo "$JPGPRE-$JPGPOST" | bc`
    JPGPER=`echo "scale=2;100*$JPGDIFF/$JPGPRE" | bc`

else
    echo "not found."
fi

echo -n "Checking for GIF files ... "
if [ -f "$TMPDIR/giffiles.txt" ]; then

    echo "found."
    echo -n "Downloading GIF files ... "
    `wget -q -P "$TMPDIR/gif/pre" --input-file="$TMPDIR/giffiles.txt"`
    echo "done."

    echo -n "Optimizing GIF files ... "
    for i in `ls $TMPDIR/gif/pre/* | xargs -n1 basename`; do

        FILENAME="${i%.*}"

        RETVAL=`optipng -o 9 -dir $TMPDIR/gif/post/ $TMPDIR/gif/pre/$i`

        if [[ "$?" -ne "0" || $(echo $RETVAL | grep "increase") ]]; then
            rm $TMPDIR/gif/post/$FILENAME.png
            cp $TMPDIR/gif/pre/$FILENAME.gif $TMPDIR/gif/post/$i
        fi

    done
    echo "done."

    GIF=true
    GIFPRE=`du -bh $TMPDIR/gif/pre | awk '{ print $1 }' | cut -d'K' -f 1`
    GIFPOST=`du -bh $TMPDIR/gif/post | awk '{ print $1 }' | cut -d'K' -f 1`
    GIFDIFF=`echo "$GIFPRE-$GIFPOST" | bc`
    GIFPER=`echo "scale=2;100*$GIFDIFF/$GIFPRE" | bc`

else
    echo "not found."
fi

echo -n "Checking for CSS files ... "
if [ -f "$TMPDIR/cssfiles.txt" ]; then

    echo "found."
    echo -n "Downloading CSS files ... "
    `wget -q -P "$TMPDIR/css/pre" --input-file="$TMPDIR/cssfiles.txt"`
    echo "done."

    echo -n "Optimizing CSS files ... "
    for i in `ls $TMPDIR/css/pre/* | xargs -n1 basename`; do `csstidy "$TMPDIR/css/pre/$i" --silent=true "$TMPDIR/css/post/$i"`; done
    echo "done."

    CSS=true
    CSSPRE=`du -bh $TMPDIR/css/pre | awk '{ print $1 }' | cut -d'K' -f 1`
    CSSPOST=`du -bh $TMPDIR/css/post | awk '{ print $1 }' | cut -d'K' -f 1`
    CSSDIFF=`echo "$CSSPRE-$CSSPOST" | bc`
    CSSPER=`echo "scale=2;100*$CSSDIFF/$CSSPRE" | bc`

else
    echo "not found."
fi

echo -n "Checking for JS files ... "
if [ -f "$TMPDIR/jsfiles.txt" ]; then

    echo "found."
    echo -n "Downloading JS files ... "
    `wget -q -P "$TMPDIR/js/pre" --input-file="$TMPDIR/jsfiles.txt"`
    echo "done."

    echo -n "Optimizing JS files ... "
    for i in `ls $TMPDIR/js/pre/* | xargs -n1 basename`; do `uglifyjs "$TMPDIR/js/pre/$i" -o "$TMPDIR/js/post/$i"`; done
    echo "done."

    JS=true
    JSPRE=`du -bh $TMPDIR/js/pre | awk '{ print $1 }' | cut -d'K' -f 1`
    JSPOST=`du -bh $TMPDIR/js/post | awk '{ print $1 }' | cut -d'K' -f 1`
    JSDIFF=`echo "$JSPRE-$JSPOST" | bc`
    JSPER=`echo "scale=2;100*$JSDIFF/$JSPRE" | bc`

else
    echo "not found."
fi

echo
echo "Results:"

if $GIF; then echo "GIF: ${GIFPRE}KB ${GIFPOST}KB ${GIFDIFF}KB ${GIFPER}%"; fi
if $JPG; then echo "JPG: ${JPGPRE}KB ${JPGPOST}KB ${JPGDIFF}KB ${JPGPER}%"; fi
if $PNG; then     echo "PNG: ${PNGPRE}KB ${PNGPOST}KB ${PNGDIFF}KB ${PNGPER}%"; fi
if $CSS; then echo "CSS: ${CSSPRE}KB ${CSSPOST}KB ${CSSDIFF}KB ${CSSPER}%"; fi
if $JS; then echo "JS: ${JSPRE}KB ${JSPOST}KB ${JSDIFF}KB ${JSPER}%"; fi

TOTALPRE=`echo "scale=2;${GIFPRE-0} + ${PNGPRE-0}+ ${JPGPRE-0} + ${CSSPRE-0} + ${JSPRE-0}" | bc`
TOTALPOST=`echo "scale=2;${GIFPOST-0} + ${PNGPOST-0} + ${JPGPOST-0} + ${CSSPOST-0} + ${JSPOST-0}" | bc`
TOTALDIFF=`echo "scale=2;${GIFDIFF-0} + ${PNGDIFF-0} + ${JPGDIFF-0} + ${CSSDIFF-0} + ${JSDIFF-0}" | bc`

# Division by 0 check
if [ "$TOTALPRE" != "0" ]; then
    TOTALPER=`echo "scale=2;100*$TOTALDIFF/$TOTALPRE" | bc`;
else
    TOTALPER="0"
fi
COST=`echo "scale=2; $TOTALDIFF * 1000000 * 0.19 / 1048576" | bc`

echo "Total: ${TOTALPRE}KB ${TOTALPOST}KB ${TOTALDIFF}KB ${TOTALPER}%"
echo "AWS bandwidth savings: USD$ ${COST} (1 million visits/month)"
echo
exit;
