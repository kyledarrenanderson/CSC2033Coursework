import pyodbc
import databaseinfo
import textwrap

# CREATE CONNECTION STRING
connection_string = textwrap.dedent('''
    Driver={driver};
    Server={server};
    Database={database};
    Uid={username};
    Pwd={password};
    Encrypt=yes;
    TrustServerCertificate=no;
    Connection Timeout = 30;
    '''.format(
    driver=databaseinfo.driver,
    server=databaseinfo.server,
    database=databaseinfo.database_name,
    username=databaseinfo.username,
    password=databaseinfo.password
))


def sql_update(statement, fields):
    db: pyodbc.Connection = pyodbc.connect(connection_string)
    cursor: pyodbc.Cursor = db.cursor()

    cursor.execute(statement, fields)
    db.commit()
    db.close()


def sql_get(statement, fields):
    db: pyodbc.Connection = pyodbc.connect(connection_string)
    cursor: pyodbc.Cursor = db.cursor()

    cursor.execute(statement, fields)
    data = cursor.fetchall()
    db.close()
    return data


def sql_addLeaderboardEntry(userID, game, hiScore, lastPlayed):
    existCheck = sql_get("SELECT * FROM " + game + " WHERE userID = " + str(userID),())
    if len(existCheck) == 0:
        try:
            sql_update("INSERT INTO " + game + " (userID, hiScore, lastPlayed)VALUES (?, ?, ?)",
                       (userID, hiScore, lastPlayed))
        except:
            print("USER ID DOES NOT EXIST!")
    else:
        currentHiScore = existCheck[0][1]
        if hiScore > currentHiScore:
            sql_update("UPDATE " + game + " SET hiScore = " + str(hiScore) + " WHERE userID = " + str(userID),())


def sql_calculateOverallScore(userID):
    gameList = ["Asteroids", "ChoosePath", "HangMan", "Quiz"]
    overallScore = 0
    for game in gameList:
        scoreToAdd = sql_get("SELECT * FROM " + game + " WHERE userID = " + str(userID), ())[0][1]
        if scoreToAdd is not None:
            overallScore += scoreToAdd

    sql_update("UPDATE Users SET overallScore = " + str(overallScore) + " WHERE userID = " + str(userID) +
               " AND (overallScore < " + str(overallScore) + " OR overallScore IS NULL)", ())