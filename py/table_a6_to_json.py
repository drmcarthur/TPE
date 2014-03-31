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
            vf = []
            vg = []
            hfg = []
            cpf = []
            cpg = []
            muf = []
            mug = []
            kf = []
            kg = []
            prf = []
            prg = []
            sigmaf = []
            betaf = []
            
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
                vf.append(line[1])
                vg.append(line[2])
                hfg.append(line[3])
                cpf.append(line[4])
                cpg.append(line[5])
                muf.append(line[6])
                mug.append(line[7])
                kf.append(line[8])
                kg.append(line[9])
                prf.append(line[10])
                prg.append(line[11])
                sigmaf.append(line[12])
                betaf.append(line[13])                                
                
        # Prepare for loop
        i = 0
        
        # Create strings so we can convert all properties in one loop instead of multiple loops
        tstring = ""
        vfstring = ""
        vgstring = ""
        hfgstring = ""
        cpfstring = ""
        cpgstring = ""
        mufstring = ""
        mugstring = ""
        kfstring = ""
        kgstring = ""
        prfstring = ""
        prgstring = ""
        sigmafstring = ""
        betafstring = ""
        for temp in T:
            tstring += temp
            vfstring += vf[i]
            vgstring += vg[i]
            hfgstring += hfg[i]
            cpfstring += cpf[i]
            cpgstring += cpg[i]
            mufstring += muf[i]
            mugstring += mug[i]
            kfstring += kf[i]
            kgstring += kg[i]
            prfstring += prf[i]
            prgstring += prg[i]
            sigmafstring += sigmaf[i]
            betafstring += betaf[i]
            if(i < len(T) - 1):
                tstring += ","
                vfstring += ","
                vgstring += ","
                hfgstring += ","
                cpfstring += ","
                cpgstring += ","
                mufstring += ","
                mugstring += ","
                kfstring += ","
                kgstring += ","
                prfstring += ","
                prgstring += ","
                sigmafstring += ","
                betafstring += ","
            i += 1
                
        # Create the JSON string
        json = ""
        json += '{\n\t"table":"' + tableName + '",\n\t"name":"' + matName +\
                '",\n\t"tMin":' + tMin + ',\n\t"tMax":' + tMax + ',\n\t' +\
                '"T":[' + tstring + '],\n\t' + '"vf":[' + vfstring + '],\n\t' +\
                '"vg":[' + vgstring + '],\n\t' + '"hfg":[' + hfgstring + '],\n\t' +\
                '"cpf":[' + cpfstring + '],\n\t' + '"cpg":[' + cpgstring + '],\n\t' +\
                '"muf":[' + mufstring + '],\n\t' + '"mug":[' + mugstring + '],\n\t' +\
                '"kf":[' + kfstring + '],\n\t' + '"kg":[' + kgstring + '],\n\t' +\
                '"prf":[' + prfstring + '],\n\t' + '"prg":[' + prgstring + '],\n\t' +\
                '"sigmaf":[' + sigmafstring + '],\n\t' + '"betaf":[' + betafstring + ']\n}'
        
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