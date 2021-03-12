import mysql.connector
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
    if(name == "Ina"):
        name = "Ina'nis"
    if(name == "Calli"):
        name = "Calliope"
    if(not(EntryExists(name, streamEntry.streamDate))):
        sql = "SELECT * FROM members WHERE first_name=%s"
        val = (name, )
        mycursor.execute(sql, val)
        result = mycursor.fetchall()
        # result[0][0] is streamer id
        val = [result[0][0], streamEntry.streamName, streamEntry.streamDate]
        mycursor.execute("INSERT INTO streams (member_id, stream_name, stream_date) VALUES(%s, %s, %s)", val)
        db.commit()
        return True
    return False