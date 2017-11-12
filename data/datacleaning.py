import csv
year = 1974
congNum = 93
with open('allCongressDataPublish.csv', 'r') as fin:
    reader = csv.reader(fin, delimiter='\t')
    with open('new_allCongressDataPublish.csv', 'w') as fout:
        writer = csv.writer(fout, delimiter='\t')
        writer.writerow(next(reader) + ['Year'])

        for row in reader:
            rowSplit = row[0].split(',')
            curCongNum = rowSplit[65]
            # if(curCongNum == "NA"):
            #     print rowSplit
            if(curCongNum == "NA"):
                curCongNum = 0
            curCongNum = int(curCongNum)
            if((curCongNum != congNum) and (curCongNum > 90)):
                print year
                year = year + 2
                congNum = curCongNum
            row[0] = row[0] + "," + str(year)
            # print row
            writer.writerow(row)