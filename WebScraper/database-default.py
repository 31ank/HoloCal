import mysql.connector
import pytz
import datetime
from stream import StreamEntry

db = mysql.connector.connect(
    host = "",
    user="",
    password = "",
    database = ""
)

mycursor = db.cursor()

# Check if entry already exists
def EntryExists(name, streamDate):
    sql = "SELECT * FROM streams JOIN members ON members.id = streams.member_id WHERE members.first_name=%s AND stream_date =%s;"
    val = (name, streamDate)
    mycursor.execute(sql, val)
    result = mycursor.fetchall()
    if(len(result) > 0):
        return True
    return False

# Insert new entry
def InsertEntry(streamEntry):
    # Time format asian/tokyo --> fix
    name = streamEntry.streamer
    # fix naming, add short version of name to db?
    date = ConvertTimezone(streamEntry.streamDate, "Asia/Tokyo", "Europe/London")
    if(name == "Ina"):
        name = "Ina'nis"
    if(name == "Calli"):
        name = "Calliope"
    if(not(EntryExists(name, date))):
        sql = "SELECT * FROM members WHERE first_name=%s"
        val = (name, )
        mycursor.execute(sql, val)
        result = mycursor.fetchall()
        # result[0][0] is streamer id
        val = [result[0][0], streamEntry.streamName, date]
        mycursor.execute("INSERT INTO streams (member_id, stream_name, stream_date) VALUES(%s, %s, %s)", val)
        db.commit()
        return True
    return False

def ConvertTimezone(date, fromZone, toZone):
    fromZone = pytz.timezone(fromZone)
    toZone = pytz.timezone(toZone)
    date = datetime.datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
    date = fromZone.localize(date)
    date = date.astimezone(toZone)
    date = date.strftime("%Y-%m-%d %H:%M:%S")

    return date

# Test insert
# print(InsertEntry("Calliope", "2021-03-15", "14:55"))