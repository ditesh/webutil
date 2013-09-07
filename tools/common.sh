# webutil 1.0.1
#
# Copyright (c) 2012-2013 Ditesh Shashikant Gathani
# 
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
# 
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
#

# Necessary global variables
TMPDIR="/tmp/webutil"

function converted {

    if [ "$1" = "jpg" ]; then

        if [ -f "$TMPDIR/jpg-to-png-files" ]; then

            RETVAL=`wc -l "$TMPDIR/jpg-to-png-files" | awk '{print $1}'`
            echo $RETVAL

        else echo "0"
        fi

    elif [ "$1" = "png" ]; then

        if [ -f "$TMPDIR/png-to-jpg-files" ]; then

            RETVAL=`wc -l "$TMPDIR/png-to-jpg-files" | awk '{print $1}'`
            echo $RETVAL

        else echo "0"
        fi

    elif [ "$1" = "gif" ]; then

        if [ -f "$TMPDIR/gif-to-png-files" ]; then

            RETVAL=`wc -l "$TMPDIR/gif-to-png-files" | awk '{print $1}'`
            echo $RETVAL

        else echo "0"
        fi

    else
        echo "0"
    fi

}

function size {

    if [ -f "$1" ]; then
        echo $(ls -l "$1" | awk '{print $5}');
    else
        echo "0"
    fi
}

function download {

    cd "$TMPDIR/$1/pre-processed"
    cat "$TMPDIR/${1}-files" | xargs -I % curl --compressed -s -A "$USERAGENT" -O %
    cp $TMPDIR/$1/pre-processed/* $TMPDIR/$1/pre-processed-gzip
    gzip -f $TMPDIR/$1/pre-processed-gzip/*

}

function post_processing {

    cp $TMPDIR/$1/post-processed/* $TMPDIR/$1/post-processed-gzip
    gzip -f $TMPDIR/$1/post-processed-gzip/*

    OLDIFS=$IFS
    IFS=$'\n'
    for i in `ls "$TMPDIR/$1/post-processed"`; do

        if [ -f "$TMPDIR/$1/pre-processed/$i" ]; then
            
            PRESIZE=$(size "$TMPDIR/$1/pre-processed/$i");
            POSTSIZE=$(size "$TMPDIR/$1/post-processed/$i");

            if [ $PRESIZE -gt $POSTSIZE ]; then
                echo "$1/pre-processed/$i ($PRESIZE) > $1/post-processed/$i ($POSTSIZE)" >> $TMPDIR/modified-files
            fi
        else

            # Hack for png/gif conversion

            PRESIZE=$(size "$TMPDIR/$1/pre-processed/${i%????}");
            POSTSIZE=$(size "$TMPDIR/$1/post-processed/$i");

            echo "$1/pre-processed/${i%????} ($PRESIZE) > $1/post-processed/${i} ($POSTSIZE)" >> $TMPDIR/modified-files

        fi

    done

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


