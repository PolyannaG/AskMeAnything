import csv
import string
import random
import bcrypt
from random_username.generate import generate_username
from Functions import passwordGenerator, emailGenerator, ReturnCorrectDate, MoreRecentDate
from random_timestamp import random_timestamp
from faker import Faker
fake = Faker()

#csv file headers
headerQuestions = ['id', 'title', 'text', 'date_created', 'num_answers', 'Userid']
headerAnswers = ['id', 'text', 'date_created', 'Userid', 'questionId']
headerUsers = ['id', 'username', 'password', 'email', 'user_since']
headerKeywords = ['keyword']
headerQuestion_Keyword = ['questionId', 'keywordKeyword']
headerStatistics = ['id', 'date_created', 'Userid']

#open-create all csv files and write the headers
questionsCSV = open('./questions.csv', 'w', encoding='UTF8', newline='')
writerQuestions = csv.DictWriter(questionsCSV, fieldnames = headerQuestions)
writerQuestions.writeheader()

answersCSV = open('./answers.csv', 'w', encoding='UTF8', newline='')
writerAnswers =  csv.DictWriter(answersCSV, fieldnames=headerAnswers)
writerAnswers.writeheader()

keywordsCSV = open('./keywords.csv', 'w', encoding='UTF8', newline='')
writerKeyword = csv.DictWriter(keywordsCSV, fieldnames=headerKeywords)
writerKeyword.writeheader()

usersCSV = open('./users.csv', 'w', encoding='UTF8', newline='')
writerUsers = csv.DictWriter(usersCSV, fieldnames=headerUsers)
writerUsers.writeheader()

quest_Key_CSV = open('./Question_Keyword.csv', 'w', encoding='UTF8', newline='')
writerQuest_Key =  csv.DictWriter(quest_Key_CSV, fieldnames=headerQuestion_Keyword)
writerQuest_Key.writeheader()

questionsStatsCSV = open('./questions_statistics.csv', 'w', encoding='UTF8', newline='')
writerQuestionsStats =  csv.DictWriter(questionsStatsCSV, fieldnames=headerStatistics)
writerQuestionsStats.writeheader()

answersStatsCSV = open('./answers_statistics.csv', 'w', encoding='UTF8', newline='')
writerAnswersStats =  csv.DictWriter(answersStatsCSV, fieldnames=headerStatistics)
writerAnswersStats.writeheader()

questionIdOnly = open('./questionIdOnly.csv', 'w', encoding='UTF8', newline='')
writerQid =  csv.DictWriter(questionIdOnly, fieldnames=['id'])
writerQid.writeheader()

passwordsCSV = open('./passwords.csv', 'w', encoding='UTF8', newline='')
writerPassw = csv.DictWriter(passwordsCSV, fieldnames=['username', 'password'])
writerPassw.writeheader()


dates_register = {}
#Users
row = {}
rowPass = {}
users = []
passw = []
usernames = generate_username(102)
password_length = [8,9,10,11,12,13,14,15]

for i in range(1, 101):
    row['id']=i
    row['username']=usernames[i]
    rowPass['username']=usernames[i]

    p = passwordGenerator(random.choice(password_length))
    rowPass['password']=p
    password = bytes(p, encoding='utf-8')
    const_hash = b'$2b$12$mzZXxm.lIzmqEMht8NVw1O'
    hash = bcrypt.hashpw(password, const_hash)
    hashed = hash.decode("utf-8")
    row['password']=hashed

    email = emailGenerator(usernames[i])
    row['email']=email

    if i%5 == 0:
        date = random_timestamp(year=2018)
    elif i%2 == 0:
        date = random_timestamp(year=2020)
    else:
        date = random_timestamp(year=2019)

    dates_register[i]=date
    row['user_since']=date

    users.append(row)
    passw.append(rowPass)
    row = {}
    rowPass = {}

writerUsers.writerows(users)
writerPassw.writerows(passw)

#Questions - Answers - their Statistics
rowQuestion = {}
rowAnswers = {}
rowStatsQ = {}
rowStatsA = {}
questions = []
answers = []
questionStats = []
answerStats = []
count = 1
for i in range(1, 301):
    rowQuestion['id']=i
    rowStatsQ['id']=i

    t = fake.sentence(40)
    title = t[:-1]+'?'
    rowQuestion['title'] = title

    txt = fake.paragraphs(random.randint(1,15))
    rowQuestion['text'] = txt

    UserId = random.randint(1,98)
    rowQuestion['Userid']=UserId
    rowStatsQ['Userid']=UserId

    registered = dates_register[UserId]
    question_date = ReturnCorrectDate(registered)
    rowQuestion['date_created']=question_date
    rowStatsQ['date_created']=question_date

    number_answers = random.randint(0,8)
    rowQuestion['num_answers']=number_answers

    for j in range(number_answers):
        rowAnswers['id']=count
        rowStatsA['id']=count
        count = count + 1

        rowAnswers['questionId']=i

        txt = fake.paragraphs(random.randint(1,15))
        rowAnswers['text'] = txt

        userid = random.randint(1,95)
        rowAnswers['Userid']=userid
        rowStatsA['Userid']=userid
        Ans_registered = dates_register[userid]

        while True:
            answer_date1 = ReturnCorrectDate(question_date)
            answer_date2 = ReturnCorrectDate(Ans_registered)
            answer_date = MoreRecentDate(answer_date1, answer_date2)
            if answer_date != 0:
                break

        rowAnswers['date_created']=answer_date
        rowStatsA['date_created']=answer_date

        answers.append(rowAnswers)
        answerStats.append(rowStatsA)
        rowAnswers={}
        rowStatsA={}

    questions.append(rowQuestion)
    questionStats.append(rowStatsQ)
    rowQuestion={}
    rowStatsQ={}

writerQuestions.writerows(questions)
writerAnswers.writerows(answers)
writerQuestionsStats.writerows(questionStats)
writerAnswersStats.writerows(answerStats)

#Question_ids for answer question
rowID = {}
questionIDs =[]
for i in range(1, 301):
    rowID['id']=i
    questionIDs.append(rowID)
    rowID={}

writerQid.writerows(questionIDs)

#Keywords
row = {}
keywords = []
keywordList = ['health', 'sea', 'programming', 'bug', 'disease',
                'love', 'universe', 'movies', 'shows', 'pet',
                'dog', 'cat', 'philosophy', 'weather', 'netflix',
                'economy', 'Covid-19', 'sports', 'parenting', 'children',
                'dog', 'cat', 'work', 'DIY', 'food',
                'recipe', 'restaurant', 'vacation', 'trip', 'abroad',
                'animal', 'wildlife', 'fire', 'transportation', 'instructions',
                'house', 'garden', 'flowers', 'decoration', 'sale', 'nature']

for i in keywordList:
    row['keyword']=i
    keywords.append(row)
    row = {}

writerKeyword.writerows(keywords)

#Question-Keyword Table
rowQK = {}
QuestionsKeywords = []
for i in range(1, 301):
    num_keywords = random.randint(0,6)
    for i in range(num_keywords):
        rowQK['questionId'] = i
        rowQK['keywordKeyword'] = random.choice(keywordList)
        QuestionsKeywords.append(rowQK)
        rowQK={}

writerQuest_Key.writerows(QuestionsKeywords)

#close all csv files
questionsCSV.close()
answersCSV.close()
keywordsCSV.close()
usersCSV.close()
quest_Key_CSV.close()
questionsStatsCSV.close()
answersStatsCSV.close()
questionIdOnly.close()
passwordsCSV.close()