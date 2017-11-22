import csv
import math
year = 1974
congNum = 93
with open('2014.csv', 'r') as fin:
    reader = csv.reader(fin, delimiter='\t')
    with open('gapdata.csv', 'w') as fout:
        next(reader)
        writer = csv.writer(fout, delimiter=',')
        # writer.writerow(next(reader) + ['Year'])
        writer.writerow(['State','Gap'])
        curState = "Alabama"
        seatsR = 0
        seatsD = 0
        votesR = 0
        votesD = 0
        totalVotes = 0
        gap = 0
        for row in reader:
            rowSplit = row[0].split(',')
            print rowSplit
            if(rowSplit[0] != curState):
                totalSeats = seatsR + seatsD
                print totalSeats
                seatMargin = max(seatsR/(1.0*totalSeats),seatsD/(1.0*totalSeats))-.5
                voteMargin = max(votesR/(1.0*totalVotes),votesD/(1.0*totalVotes))-.5
                gap = seatMargin-2*voteMargin
                writer.writerow([curState,gap])
                print curState
                print gap
                curState = rowSplit[0]
                seatsR = 0
                seatsD = 0
                votesR = 0
                votesD = 0
                totalVotes = 0
            if(int(rowSplit[5])!=0 and int(rowSplit[6])!=0):
                if "R" in rowSplit[4]:
                    seatsR += 1
                else:
                    seatsD += 1
                votesD += int(rowSplit[5])
                votesR += int(rowSplit[6])
                total = int(rowSplit[5]) + int(rowSplit[6])# + int(rowSplit[7])
                totalVotes += total
            #writer.writerow([curState]+[gap])
            if(rowSplit[0] == "Wyoming"):
                curState = "Wyoming"
                totalSeats = int(rowSplit[5]) + int(rowSplit[6])
                seatMargin = .5
                voteMargin = max(int(rowSplit[5])/(1.0*totalVotes),int(rowSplit[6])/(1.0*totalVotes))-.5
                gap = seatMargin-2*voteMargin
                writer.writerow([curState,gap])