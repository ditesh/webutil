#!/bin/bash

command -v csstidy >/dev/null 2>&1 || { echo >&2 "I require csstidy but it's not installed.  Aborting."; }
command -v optipng >/dev/null 2>&1 || { echo >&2 "I require optipng but it's not installed.  Aborting."; }
command -v uglifyjs >/dev/null 2>&1 || { echo >&2 "I require uglifyjs but it's not installed.  Aborting."; }
command -v phantomjs >/dev/null 2>&1 || { echo >&2 "I require phantomjs but it's not installed.  Aborting."; }

# Let's set up the support functions first
function download {
    wget -q --user-agent="$USERAGENT" -P "$TMPDIR/$1/pre-processed" --input-file="$TMPDIR/${1}files.txt"
    cp $TMPDIR/$1/pre-processed/* $TMPDIR/$1/pre-processed-gzip
    gzip $TMPDIR/$1/pre-processed-gzip/*
}

function post_processing {
    cp $TMPDIR/$1/post-processed/* $TMPDIR/$1/post-processed-gzip
    gzip $TMPDIR/$1/post-processed-gzip/*
}

function count {
    echo `ls "$TMPDIR/$1/pre-processed" | wc -l`
}

function presize {

    if [ $# -eq 2 ]; then PRE=`du -b "$TMPDIR/$1/pre-processed-gzip" | awk '{ print $1 }'`;
    else PRE=`du -b "$TMPDIR/$1/pre-processed" | awk '{ print $1 }'`;
    fi

    PRE=`echo $PRE/1024 | bc | sed -E 's/^(-?)\./\10./'`
    echo $PRE
}

function postsize {

    if [ $# -eq 2 ]; then POST=`du -b "$TMPDIR/$1/post-processed-gzip" | awk '{ print $1 }'`;
    else POST=`du -b "$TMPDIR/$1/post-processed" | awk '{ print $1 }'`
    fi

    POST=`echo $POST/1024 | bc | sed -E 's/^(-?)\./\10./'`
    echo $POST
}

JS=false
GIF=false
JPG=false
PNG=false
CSS=false
TMPDIR="/tmp/webutil"

# Set up folders
rm -rf $TMPDIR
types=( png jpeg gif css javascript )

for i in "${types[@]}"; do
    mkdir -p "$TMPDIR/$i/pre-processed" "$TMPDIR/$i/pre-processed-gzip" \
    "$TMPDIR/$i/post-processed" "$TMPDIR/$i/post-processed-gzip" 
done

echo "Web Optimization Tool 1.0.1 (c) 2013 Ditesh Gathani <ditesh@gathani.org>"
echo
echo -n "Running webutil ... "
OUTPUT=`phantomjs ./webutil.js -d -u -s $@`

if [ "$?" -ne "0" ] ; then
    echo "unable to connect";
    echo
    exit 1
fi

if $(echo $@ | grep -q "\-ua ipad"); then
    USERAGENT="Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10";
elif $(echo $@ | grep -q "\-ua iphone"); then
    USERAGENT="Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3";
elif $(echo $@ | grep -q "\-ua android"); then
    USERAGENT="Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";
elif $(echo $@ | grep -q "\-ua firefox"); then
    USERAGENT="Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:15.0) Gecko/20100101 Firefox/15.0.1"
elif $(echo $@ | grep -q "\-ua ie"); then
    USERAGENT="Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)";
else
    USERAGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17";
fi

OLDIFS=$IFS
IFS=$'\n'
for i in $OUTPUT; do

    for j in "${types[@]}"; do

        if $( echo $i | awk '{print $2}' | grep --quiet "$j" ); then
            echo $i | awk '{print $4}' >> "$TMPDIR/${j}files.txt"
        fi

    done
done

echo "done."

echo -n "Checking for PNG files ... "
if [ -f "$TMPDIR/pngfiles.txt" ]; then

    echo -n "found ... downloading ... "
    download png

    echo -n "optimizing ... "
    optipng -quiet -o 9 -dir $TMPDIR/png/post-processed $TMPDIR/png/pre-processed/*
    echo "done."

    post_processing png

    PNG=true
    PNGCOUNT=$(count png);
    PNGPRE=$(presize png);
    PNGPOST=$(postsize png);
    PNGDIFF=`echo "$PNGPRE-$PNGPOST" | bc | sed -E 's/^(-?)\./\10./'`
    PNGPER=`echo "scale=2;100*$PNGDIFF/$PNGPRE" | bc | sed -E 's/^(-?)\./\10./'`

    PNGPRE_COMPRESSED=$(presize png compressed)
    PNGPOST_COMPRESSED=$(postsize png compressed)
    PNGDIFF_COMPRESSED=`echo "$PNGPRE_COMPRESSED-$PNGPOST_COMPRESSED" | bc | sed -E 's/^(-?)\./\10./'`
    PNGPER_COMPRESSED=`echo "scale=2;100*$PNGDIFF_COMPRESSED/$PNGPRE_COMPRESSED" | bc | sed -E 's/^(-?)\./\10./'`

else echo "not found."
fi

echo -n "Checking for JPG files ... "
if [ -f "$TMPDIR/jpegfiles.txt" ]; then

    echo -n "found ... downloading ... "
    download jpeg

    echo -n "optimizing ... "
    for i in `ls $TMPDIR/jpeg/pre-processed/*`; do

        i=`echo $i | xargs -0 -n1 basename`
        jpegtran -optimize -copy none "$TMPDIR/jpeg/pre-processed/$i" > "$TMPDIR/jpeg/post-processed/$i";

    done
    echo "done."

    post_processing jpeg

    JPG=true
    JPGCOUNT=$(count jpeg);
    JPGPRE=$(presize jpeg);
    JPGPOST=$(postsize jpeg);
    JPGDIFF=`echo "$JPGPRE-$JPGPOST" | bc | sed -E 's/^(-?)\./\10./'`
    JPGPER=`echo "scale=2;100*$JPGDIFF/$JPGPRE" | bc | sed -E 's/^(-?)\./\10./'`

    JPGPRE_COMPRESSED=$(presize jpeg compressed);
    JPGPOST_COMPRESSED=$(postsize jpeg compressed);
    JPGDIFF_COMPRESSED=`echo "$JPGPRE_COMPRESSED-$JPGPOST_COMPRESSED" | bc | sed -E 's/^(-?)\./\10./'`
    JPGPER_COMPRESSED=`echo "scale=2;100*$JPGDIFF_COMPRESSED/$JPGPRE_COMPRESSED" | bc | sed -E 's/^(-?)\./\10./'`

else echo "not found."
fi

echo -n "Checking for GIF files ... "
if [ -f "$TMPDIR/giffiles.txt" ]; then

    echo -n "found ... downloading ... "
    download gif

    echo -n "optimizing ... "
    for i in `ls $TMPDIR/gif/pre-processed/*`; do

        i=`echo $i | xargs -0 -n1 basename`
        RETVAL=`optipng -o 9 -out "$TMPDIR/gif/post-processed/$i.png" "$TMPDIR/gif/pre-processed/$i"`

        if [[ "$?" -ne "0" || $(echo $RETVAL | grep "increase") ]]; then

            rm -f "$TMPDIR/gif/post-processed/$i.png"
            cp "$TMPDIR/gif/pre-processed/$i" "$TMPDIR/gif/post-processed/$i"

        fi

    done
    echo "done."

    post_processing gif

    GIF=true
    GIFCOUNT=$(count gif);
    GIFPRE=$(presize gif);
    GIFPOST=$(postsize gif);
    GIFDIFF=`echo "$GIFPRE-$GIFPOST" | bc | sed -E 's/^(-?)\./\10./'`
    GIFPER=`echo "scale=2;100*$GIFDIFF/$GIFPRE" | bc | sed -E 's/^(-?)\./\10./'`

    GIFPRE_COMPRESSED=$(presize gif compressed);
    GIFPOST_COMPRESSED=$(postsize gif compressed);
    GIFDIFF_COMPRESSED=`echo "$GIFPRE_COMPRESSED-$GIFPOST_COMPRESSED" | bc | sed -E 's/^(-?)\./\10./'`
    GIFPER_COMPRESSED=`echo "scale=2;100*$GIFDIFF_COMPRESSED/$GIFPRE_COMPRESSED" | bc | sed -E 's/^(-?)\./\10./'`

else echo "not found."
fi

echo -n "Checking for CSS files ... "
if [ -f "$TMPDIR/cssfiles.txt" ]; then

    echo -n "found ... downloading ... "
    download css

    echo -n "optimizing ... "
    for i in `ls $TMPDIR/css/pre-processed/*`; do

        i=`echo $i | xargs -0 -n1 basename`
        csstidy "$TMPDIR/css/pre-processed/$i" --silent=true "$TMPDIR/css/post-processed/$i"

    done
    echo "done."

    post_processing css

    CSS=true
    CSSCOUNT=$(count css);
    CSSPRE=$(presize css);
    CSSPOST=$(postsize css);
    CSSDIFF=`echo "$CSSPRE-$CSSPOST" | bc | sed -E 's/^(-?)\./\10./'`
    CSSPER=`echo "scale=2;100*$CSSDIFF/$CSSPRE" | bc | sed -E 's/^(-?)\./\10./'`

    CSSPRE_COMPRESSED=$(presize css compressed);
    CSSPOST_COMPRESSED=$(postsize css compressed);
    CSSDIFF_COMPRESSED=`echo "$CSSPRE_COMPRESSED-$CSSPOST_COMPRESSED" | bc | sed -E 's/^(-?)\./\10./'`
    CSSPER_COMPRESSED=`echo "scale=2;100*$CSSDIFF_COMPRESSED/$CSSPRE_COMPRESSED" | bc | sed -E 's/^(-?)\./\10./'`

else echo "not found."
fi

echo -n "Checking for JS files ... "
if [ -f "$TMPDIR/javascriptfiles.txt" ]; then

    echo -n "found ... downloading ... "
    download javascript

    echo -n "optimizing ..."
    for i in `ls $TMPDIR/javascript/pre-processed/*`; do

        i=`echo $i | xargs -0 -n1 basename`
        uglifyjs "$TMPDIR/javascript/pre-processed/$i" -o "$TMPDIR/javascript/post-processed/$i" -c 2> /dev/null

    done
    echo "done."

    post_processing javascript

    JS=true
    JSCOUNT=$(count javascript);
    JSPRE=$(presize javascript);
    JSPOST=$(postsize javascript);
    JSDIFF=`echo "$JSPRE-$JSPOST" | bc | sed -E 's/^(-?)\./\10./'`
    JSPER=`echo "scale=2;100*$JSDIFF/$JSPRE" | bc | sed -E 's/^(-?)\./\10./'`

    JSPRE_COMPRESSED=$(presize javascript compressed);
    JSPOST_COMPRESSED=$(postsize javascript compressed);
    JSDIFF_COMPRESSED=`echo "$JSPRE_COMPRESSED-$JSPOST_COMPRESSED" | bc | sed -E 's/^(-?)\./\10./'`
    JSPER_COMPRESSED=`echo "scale=2;100*$JSDIFF_COMPRESSED/$JSPRE_COMPRESSED" | bc | sed -E 's/^(-?)\./\10./'`

else echo "not found."
fi

echo
echo "[*] RESULTS (with no compression):"
echo

OUTPUT="RESOURCE COUNT AS-IS OPTIMIZED DIFF(KB) DIFF(%)\n"
OUTPUT=$OUTPUT"-------- ----- --------- ------- -------\n"
if $GIF; then OUTPUT=$OUTPUT"GIF ${GIFCOUNT} ${GIFPRE}KB ${GIFPOST}KB ${GIFDIFF}KB ${GIFPER}%\n"; fi
if $JPG; then OUTPUT=$OUTPUT"JPG ${JPGCOUNT} ${JPGPRE}KB ${JPGPOST}KB ${JPGDIFF}KB ${JPGPER}%\n"; fi
if $PNG; then OUTPUT=$OUTPUT"PNG ${PNGCOUNT} ${PNGPRE}KB ${PNGPOST}KB ${PNGDIFF}KB ${PNGPER}%\n"; fi
if $CSS; then OUTPUT=$OUTPUT"CSS ${CSSCOUNT} ${CSSPRE}KB ${CSSPOST}KB ${CSSDIFF}KB ${CSSPER}%\n"; fi
if $JS; then OUTPUT=$OUTPUT"JS ${JSCOUNT} ${JSPRE}KB ${JSPOST}KB ${JSDIFF}KB ${JSPER}%\n"; fi

TOTALCOUNT=`echo "${GIFCOUNT-0} + ${PNGCOUNT-0} + ${JPGCOUNT-0} + ${CSSCOUNT-0} + ${JSCOUNT-0}" | bc`
TOTALPRE=`echo "scale=2;${GIFPRE-0} + ${PNGPRE-0}+ ${JPGPRE-0} + ${CSSPRE-0} + ${JSPRE-0}" | bc | sed -E 's/^(-?)\./\10./'`
TOTALPOST=`echo "scale=2;${GIFPOST-0} + ${PNGPOST-0} + ${JPGPOST-0} + ${CSSPOST-0} + ${JSPOST-0}" | bc | sed -E 's/^(-?)\./\10./'`
TOTALDIFF=`echo "scale=2;${GIFDIFF-0} + ${PNGDIFF-0} + ${JPGDIFF-0} + ${CSSDIFF-0} + ${JSDIFF-0}" | bc | sed -E 's/^(-?)\./\10./'`

# Division by 0 check
if [ "$TOTALPRE" != "0" ]; then TOTALPER=`echo "scale=2;100*$TOTALDIFF/$TOTALPRE" | bc | sed -E 's/^(-?)\./\10./'`;
else TOTALPER="0"
fi

COST=`echo "scale=2; $TOTALDIFF * 1000000 * 0.19 / 1048576" | bc | sed -E 's/^(-?)\./\10./'`
OUTPUT=$OUTPUT"TOTAL ${TOTALCOUNT} ${TOTALPRE}KB ${TOTALPOST}KB ${TOTALDIFF}KB ${TOTALPER}%"

echo -e $OUTPUT | column -t
echo
echo "AWS bandwidth savings: USD$ ${COST} per million visits"

echo
echo "[*] RESULTS (with gzip compression)"
echo

OUTPUT="RESOURCE COUNT AS-IS OPTIMIZED DIFF(KB) DIFF(%)\n"
OUTPUT=$OUTPUT"-------- ----- ----- --------- ------- -------\n"
if $GIF; then OUTPUT=$OUTPUT"GIF ${GIFCOUNT} ${GIFPRE_COMPRESSED}KB ${GIFPOST_COMPRESSED}KB ${GIFDIFF_COMPRESSED}KB ${GIFPER_COMPRESSED}%\n"; fi
if $JPG; then OUTPUT=$OUTPUT"JPG ${JPGCOUNT} ${JPGPRE_COMPRESSED}KB ${JPGPOST_COMPRESSED}KB ${JPGDIFF_COMPRESSED}KB ${JPGPER_COMPRESSED}%\n"; fi
if $PNG; then OUTPUT=$OUTPUT"PNG ${PNGCOUNT} ${PNGPRE_COMPRESSED}KB ${PNGPOST_COMPRESSED}KB ${PNGDIFF_COMPRESSED}KB ${PNGPER_COMPRESSED}%\n"; fi
if $CSS; then OUTPUT=$OUTPUT"CSS ${CSSCOUNT} ${CSSPRE_COMPRESSED}KB ${CSSPOST_COMPRESSED}KB ${CSSDIFF_COMPRESSED}KB ${CSSPER_COMPRESSED}%\n"; fi
if $JS; then OUTPUT=$OUTPUT"JS ${JSCOUNT} ${JSPRE_COMPRESSED}KB ${JSPOST_COMPRESSED}KB ${JSDIFF_COMPRESSED}KB ${JSPER_COMPRESSED}%\n"; fi

TOTALPRE_COMPRESSED=`echo "scale=2;${GIFPRE_COMPRESSED-0} + ${PNGPRE_COMPRESSED-0}+ ${JPGPRE_COMPRESSED-0} + ${CSSPRE_COMPRESSED-0} + ${JSPRE_COMPRESSED-0}" | bc | sed -E 's/^(-?)\./\10./'`
TOTALPOST_COMPRESSED=`echo "scale=2;${GIFPOST_COMPRESSED-0} + ${PNGPOST_COMPRESSED-0} + ${JPGPOST_COMPRESSED-0} + ${CSSPOST_COMPRESSED-0} + ${JSPOST_COMPRESSED-0}" | bc | sed -E 's/^(-?)\./\10./'`
TOTALDIFF_COMPRESSED=`echo "scale=2;${GIFDIFF_COMPRESSED-0} + ${PNGDIFF_COMPRESSED-0} + ${JPGDIFF_COMPRESSED-0} + ${CSSDIFF_COMPRESSED-0} + ${JSDIFF_COMPRESSED-0}" | bc | sed -E 's/^(-?)\./\10./'`

# Division by 0 check
if [ "$TOTALPRE" != "0" ]; then
    TOTALPER_COMPRESSED=`echo "scale=2;100*$TOTALDIFF_COMPRESSED/$TOTALPRE_COMPRESSED" | bc | sed -E 's/^(-?)\./\10./'`;
else
    TOTALPER_COMPRESSED="0"
fi

COST_COMPRESSED=`echo "scale=2; $TOTALDIFF_COMPRESSED * 1000000 * 0.19 / 1048576" | bc | sed -E 's/^(-?)\./\10./'`
OUTPUT=$OUTPUT"TOTAL ${TOTALCOUNT} ${TOTALPRE_COMPRESSED}KB ${TOTALPOST_COMPRESSED}KB ${TOTALDIFF_COMPRESSED}KB ${TOTALPER_COMPRESSED}%"

echo -e $OUTPUT | column -t
echo
echo "AWS bandwidth savings: USD$ ${COST_COMPRESSED} per million visits"

OUTPUT=`echo $@ | grep cpa`

if [ $? -eq 0 ]; then

    OUTPUT=`phantomjs ./webutil.js -d -s -cpai $@`
    echo $OUTPUT

fi

echo $OUTPUT
echo
exit 0
