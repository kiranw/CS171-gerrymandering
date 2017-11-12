import csv
year = 2014
congNum = 93
with open('allCongressDataPublish.csv', 'r') as fin:
    reader = csv.reader(fin, delimiter='\t')
    with open('new_allCongressDataPublish.csv', 'w') as fout:
        writer = csv.writer(fout, delimiter='\t')
        # set headers here, grabbing headers from reader first
        writer.writerow(next(reader) + ['Year'])

        for row in reader:
            rowSplit = row[0].split(',')
            curCongNum = rowSplit[65] 
            # if(curCongNum == "NA"):
            #     print rowSplit
            if((curCongNum != "NA") and (curCongNum != congNum) and (curCongNum > 90)):
            	print year
                # print curCongNum
            	year = year - 2
            	congNum = curCongNum
            row.append(year)
            writer.writerow(row)