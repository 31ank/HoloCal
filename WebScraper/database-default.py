import mysql.connector

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
def InsertEntry(name, date, time, streamTitle = "<i>Missing information</i>"):
    streamDate = date + " " + time + ":00"
    # Time format probably asian/tokyo?
    if(not(EntryExists(name, streamDate))):
        sql = "SELECT * FROM members WHERE first_name=%s"
        val = (name, )
        mycursor.execute(sql, val)
        result = mycursor.fetchall()
        sql = "INSERT INTO streams(member_id, stream_name, stream_date) VALUES(%s, %s, %s)"
        val = (result[0][0], streamTitle, streamDate)
        mycursor.execute(sql, val)
        db.commit()
        return True
    return False

# Test insert
# print(InsertEntry("Calliope", "2021-03-15", "14:55"))