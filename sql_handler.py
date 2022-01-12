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
