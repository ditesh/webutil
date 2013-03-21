
# Necessary global variables
TMPDIR="/tmp/webutil"

function size {
    echo $(ls -l $1| awk '{print $5}');
}

function download {

    wget -q --user-agent="$USERAGENT" -P "$TMPDIR/$1/pre-processed" --input-file="$TMPDIR/${1}-files"
    cp $TMPDIR/$1/pre-processed/* $TMPDIR/$1/pre-processed-gzip
    gzip -f $TMPDIR/$1/pre-processed-gzip/*

}

function post_processing {

    cp $TMPDIR/$1/post-processed/* $TMPDIR/$1/post-processed-gzip
    gzip -f $TMPDIR/$1/post-processed-gzip/*

    for i in `ls $TMPDIR/$1/post-processed`; do

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


