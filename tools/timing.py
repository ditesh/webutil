import sys, json, math, pprint, subprocess

def avg(s):
    return sum(s) * 1.0 / len(s)

def stddev(s, mean):

    d1 = [x - mean for x in s]
    d2 = [x*x for x in d1]
    return str(round(math.sqrt(sum(d2)/len(s)), 2))

def main(argv):

    try:
        count = int(argv[0])
        url = argv[1]
    except:
        print "ERROR: invalid parameters"
        sys.exit()

    print "Executing " + str(count) + " runs on " + url
    print

    objs = []
    timings = {}
    timings["first-byte"] = []
    timings["on-dom-content-loaded"] = []
    timings["on-load"] = []
    timings["fully-loaded"] = []

    for i in range(0, count):

        proc = subprocess.Popen(["phantomjs", "webutil.js", "-json", url], stdout=subprocess.PIPE)
        output = proc.stdout.read()
        obj = json.loads(output)

        timings["first-byte"].append(obj["summary"]["timings"]["first-byte"])
        timings["on-dom-content-loaded"].append(obj["summary"]["timings"]["on-dom-content-loaded"])
        timings["on-load"].append(obj["summary"]["timings"]["on-load"])
        timings["fully-loaded"].append(obj["summary"]["timings"]["fully-loaded"])

    mean = avg(timings["first-byte"])
    print "First Byte:\t\tmean " + str(round(mean, 2)) + "ms, standard deviation: "  + stddev(timings["first-byte"], mean) + "ms"

    mean = avg(timings["on-dom-content-loaded"])
    print "DOMContentLoaded:\tmean " + str(round(mean, 2)) + "ms, standard deviation: "  + stddev(timings["on-dom-content-loaded"], mean) + "ms"

    mean = avg(timings["on-load"])
    print "On Load:\t\tmean " + str(round(mean, 2)) + "ms, standard deviation: "  + stddev(timings["on-load"], mean) + "ms"

    mean = avg(timings["fully-loaded"])
    print "Fully Loaded:\t\tmean " + str(round(mean, 2)) + "ms, standard deviation: "  + stddev(timings["fully-loaded"], mean) + "ms"

if __name__ == "__main__":

    print "webutil 1.0.1 (c) 2012-2013 Ditesh Gathani <ditesh@gathani.org>"

    if len(sys.argv) != 4:
        print "ERROR: invalid parameters"
        sys.exit()

    sys.argv.pop(0);
    sys.argv.pop(0);

    sys.exit(main(sys.argv))
