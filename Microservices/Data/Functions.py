import string
import random
import bcrypt
import time
from datetime import datetime
from random_timestamp import random_timestamp


def passwordGenerator(length=8):
    LETTERS = string.ascii_letters
    NUMBERS = string.digits

    str = f'{LETTERS}{NUMBERS}'

    str = list(str)
    random.shuffle(str)
    random_password = random.choices(str, k=length)
    random_password = ''.join(random_password)
    return random_password


def emailGenerator(username):
    domains = [ "hotmail.com", "gmail.com", "mail.com", "yahoo.com"]
    d = random.choice(domains)
    email = username + '@' + d
    return email


def ReturnCorrectDate(initial_date):
    Month30 = [4, 6, 9, 11]
    Month31 = [1, 3, 5, 7, 8, 10, 12]

    x=random.randint(initial_date.month, 12)


    if x == initial_date.month :
        if initial_date.month == 2 :
            y=random.randint(1, 28)
        elif initial_date.month in Month30 :
            y=random.randint(initial_date.day, 30)
        elif initial_date.month in Month31 :
            y=random.randint(initial_date.day, 31)
        else :
            return random_timestamp(year=2030)
    else :
        y=random.randint(1, 27)

    return random_timestamp(year=initial_date.year, month=x, day=y)


def MoreRecentDate(date1, date2):
    if date1.year > date2.year :
        return date1
    elif date2.year > date1.year :
        return date2
    else :
        if date1.month > date2.month :
            return date1
        elif date2.month > date1.month :
            return date2
        else :
            if date1.day > date2.day :
                return date1
            elif date2.day > date1.day :
                return date2
    return 0


def str_time_prop(start, end, time_format, prop):

    stime = time.mktime(time.strptime(start, time_format))
    etime = time.mktime(time.strptime(end, time_format))

    ptime = stime + prop * (etime - stime)

    return time.strftime(time_format, time.localtime(ptime))


def random_date(start, end, prop):
    return str_time_prop(start, end, '%Y-%m-%d %H:%M:%S', prop)


def StrToDate(strDate, time_format):
    return datetime.strptime(strDate, time_format)