import argparse

def execute():
    parser = argparse.ArgumentParser(prog='Table Converter',\
            description='A script that converts tab-delimited table files into JSON', add_help=True)
    parser.add_argument('-t', '--tableName', action='store', required=True, help='filename of table to convert')
    args = parser.parse_args()
    
    # Store the filename
    table = args.tableName
    openFile = "../tables/txt/" + table + ".txt"
    #splitName = table.split(".")[0]
    #splitName = splitName.split(".")[0]
    #outName = "../js/" + splitName + ".json"
    outName = "../tables/json/" + table + ".json";
    print outName
    try:
        with open(openFile,'r') as fID:
            # Set up variables to store table data
            T = []
            rho = []
            cp = []
            nu = []
            k = []
            alpha = []
            pr = []
            
            # Read in all the data from the table
            matName = fID.readline().rstrip('\n')
            tableName = fID.readline().rstrip('\n')
            meltPt = fID.readline().rstrip('\n')
            tRange = fID.readline().rstrip('\n')
            tRange = tRange.split()


            tMin = tRange[0]
            tMax = tRange[1]

            for line in fID:
                line = line.split()
                T.append(line[0])
                rho.append(line[1])
                cp.append(line[2])
                nu.append(line[3])
                k.append(line[4])
                alpha.append(line[5])
                pr.append(line[6])
        # Prepare for loop
        i = 0

        # Create strings so we can convert all properties in one loop instead of multiple loops
        tstring = ""
        meltptstring = "" + meltPt
        rhostring = ""
        cpstring = ""
        nustring = ""
        kstring = ""
        alphastring = ""
        prstring = ""
        for temp in T:
            tstring += temp
            rhostring += rho[i]
            cpstring += cp[i]
            nustring += nu[i]
            kstring += k[i]
            alphastring += alpha[i]
            prstring += pr[i]
            
            if(i < len(T) - 1):
                tstring += ","
                rhostring += ","
                cpstring += ","
                nustring += ","
                kstring += ","
                alphastring += ","
                prstring += ","
            i += 1
                
        # Create the JSON string
        json = ""
        json += '{\n\t"table":"' + tableName + '",\n\t"name":"' + matName +\
                '",\n\t"meltpt":' + meltptstring +\
                '",\n\t"tMin":' + tMin + ',\n\t"tMax":' + tMax + ',\n\t' +\
                '"T":[' + tstring + '],\n\t' + '"rho":[' + rhostring + '],\n\t' +\
                '"cp":[' + cpstring + '],\n\t' +\
                '"nu":[' + nustring + '],\n\t' + '"k":[' + kstring + '],\n\t' +\
                '"alpha":[' + alphastring + '],\n\t' + '"pr":[' + prstring + ']\n}'
        
        # Write the JSON string to a file
        with open(outName,'w') as fOut:
            fOut.write(json)
        
        print "JSON file created: '" + outName + "'"
        
    except Exception, e:
        print "Error encountered... aborting..."
        print e.message
        
# Make this program execute
if __name__ == '__main__':
    execute()