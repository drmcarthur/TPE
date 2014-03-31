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
            mu = []
            nu = []
            k = []
            alpha = []
            pr = []
            
            # Read in all the data from the table
            matName = fID.readline().rstrip('\n')
            tableName = fID.readline().rstrip('\n')
            tRange = fID.readline().rstrip('\n')
            tRange = tRange.split()
            tMin = tRange[0]
            tMax = tRange[1]
            for line in fID:
                line = line.split()
                T.append(line[0])
                rho.append(line[1])
                cp.append(line[2])
                mu.append(line[3])
                nu.append(line[4])
                k.append(line[5])
                alpha.append(line[6])
                pr.append(line[7])
        # Prepare for loop
        i = 0
        
        # Create strings so we can convert all properties in one loop instead of multiple loops
        tstring = ""
        rhostring = ""
        cpstring = ""
        mustring = ""
        nustring = ""
        kstring = ""
        alphastring = ""
        prstring = ""
        for temp in T:
            tstring += temp
            rhostring += rho[i]
            cpstring += cp[i]
            mustring += mu[i]
            nustring += nu[i]
            kstring += k[i]
            alphastring += alpha[i]
            prstring += pr[i]
            
            if(i < len(T) - 1):
                tstring += ","
                rhostring += ","
                cpstring += ","
                mustring += ","
                nustring += ","
                kstring += ","
                alphastring += ","
                prstring += ","
            i += 1
                
        # Create the JSON string
        json = ""
        json += '{\n\t"props":\n\t{\n\t\t"table":"' + tableName + '",\n\t\t"name":"' + matName +\
                '",\n\t\t"tMin":' + tMin + ',\n\t\t"tMax":' + tMax + ',\n\t\t' +\
                '"T":[' + tstring + '],\n\t\t' + '"rho":[' + rhostring + '],\n\t\t' +\
                '"cp":[' + cpstring + '],\n\t\t' + '"mu":[' + mustring + '],\n\t\t' +\
                '"nu":[' + nustring + '],\n\t\t' + '"k":[' + kstring + '],\n\t\t' +\
                '"alpha":[' + alphastring + '],\n\t\t' + '"pr":[' + prstring + ']\n\t}\n}'
        
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