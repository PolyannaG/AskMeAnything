import csv
import string
import random
import bcrypt
import time
from datetime import datetime
from random_username.generate import generate_username
from Functions import passwordGenerator, emailGenerator, ReturnCorrectDate, MoreRecentDate, random_date, StrToDate
from random_timestamp import random_timestamp
from faker import Faker
fake = Faker()

#csv file headers
headerQuestions = ['id', 'title', 'text', 'date_created', 'popularity', 'userId']
headerAnswers = ['id', 'text', 'date_created', 'userId', 'questionId']
headerUsers = ['id', 'username', 'password', 'email', 'user_since']
headerKeywords = ['keyword']
headerQuestion_Keyword = ['keywordKeyword', 'questionId']

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

quest_Key_CSV = open('./Question_Keyword_Relationship.csv', 'w', encoding='UTF8', newline='')
writerQuest_Key =  csv.DictWriter(quest_Key_CSV, fieldnames=headerQuestion_Keyword)
writerQuest_Key.writeheader()

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

for i in range(1, 21):
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

#Questions - Answers
rowQuestion = {}
rowAnswers = {}
questions = []
answers = []
count = 1
for i in range(1, 301):
    rowQuestion['id']=i

    t = fake.sentence(40)
    title = t[:-1]+'?'
    rowQuestion['title'] = title

    txt = fake.paragraphs(random.randint(1,15))
    paragraph_str = ''
    for z in txt:
        paragraph_str = paragraph_str + z + ' '
    text = paragraph_str[:-1]
    rowQuestion['text'] = text

    if i % 5 == 0:
        UserId = 1
    else :
        UserId = random.randint(1,19)
    rowQuestion['userId']=UserId

    registered = dates_register[UserId]
    if i < 150 :
        question_date = ReturnCorrectDate(registered)
    else :
        #Recent dates for the statistics : CHANGE BEFORE PRESENTATION
        question_date_str = random_date("2021-06-10 00:00:00", "2021-07-20 00:00:00", random.random())
        question_date = StrToDate(question_date_str, '%Y-%m-%d %H:%M:%S')

    rowQuestion['date_created']=question_date

    number_answers = random.randint(0,10)
    rowQuestion['popularity']=number_answers

    for j in range(number_answers):
        rowAnswers['id']=count
        count = count + 1

        rowAnswers['questionId']=i

        txt = fake.paragraphs(random.randint(1,15))
        paragraph_str = ''
        for z in txt:
            paragraph_str = paragraph_str + z + ' '
        text = paragraph_str[:-1]
        rowAnswers['text'] = text

        if count % 15 == 0:
            userid = 1
        else :
            userid = random.randint(1,19)

        rowAnswers['userId']=userid
        Ans_registered = dates_register[userid]

        while True:
            if i < 150 :
                answer_date1 = ReturnCorrectDate(question_date)
            else :
                #Recent dates for the statistics : CHANGE BEFORE PRESENTATION
                answer_date1_str = random_date(question_date_str, "2021-07-30 00:00:00", random.random())
                answer_date1 = StrToDate(answer_date1_str, '%Y-%m-%d %H:%M:%S')
                #answer_date1 = random_timestamp( year=2021, month=5, day=random.randint( (recent_day)+1, 30 ) )
            answer_date2 = ReturnCorrectDate(Ans_registered)
            answer_date = MoreRecentDate(answer_date1, answer_date2)
            if answer_date != 0:
                break

        rowAnswers['date_created']=answer_date

        answers.append(rowAnswers)
        rowAnswers={}

    questions.append(rowQuestion)
    rowQuestion={}

writerQuestions.writerows(questions)
writerAnswers.writerows(answers)

#Keywords
row = {}
keywords = []
keywordList = ['health', 'sea', 'programming', 'bug', 'disease',
                'love', 'universe', 'movies', 'shows', 'pet',
                'dog', 'cat', 'philosophy', 'weather', 'netflix',
                'economy', 'Covid-19', 'sports', 'parenting', 'children',
                'work', 'DIY', 'food', 'school', 'university', 'education',
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
    already_keyword = []
    for j in range(num_keywords):
        key = random.choice(keywordList)
        while True :
            if key in already_keyword :
                key = random.choice(keywordList)
            else :
                break
        already_keyword.append(key)
        rowQK['keywordKeyword'] = key
        rowQK['questionId'] = i
        QuestionsKeywords.append(rowQK)
        rowQK={}

writerQuest_Key.writerows(QuestionsKeywords)

#close all csv files
questionsCSV.close()
answersCSV.close()
keywordsCSV.close()
usersCSV.close()
quest_Key_CSV.close()
passwordsCSV.close()