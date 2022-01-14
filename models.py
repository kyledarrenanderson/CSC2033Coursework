from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash


class User(db.Model):
    db.Model.metadata.reflect(db.engine)
    __table__ = db.Model.metadata.tables['User']


    def __init__(self, email, firstName, lastName, educationLevel, phoneNumber, dateOfBirth, password, role, takenCS):
        self.email = email
        self.firstName = firstName
        self.lastName = lastName
        self.educationLevel = educationLevel
        self.dateOfBirth = dateOfBirth
        self.password = generate_password_hash(password)
        self.overallScore = 0
        self.role = "User"
        self.takenCS = takenCS
        self.phoneNumber = phoneNumber

def createAdmin():
    adminEmail = input("Please Enter the Admins Email Address: ")
    adminFirstName = input("Please Enter the Admins First Name: ")
    adminLastName = input("Please Enter the Admins Last Name: ")
    adminPassword = input("Please Enter the Admins Password")

    mycursor = db.cursor()
    addAdmin = "INSERT INTO users (email, firstName, lastName, educationLevel, phoneNumber, dateOfBirth, password, role, takenCS) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    adminDetails = (adminEmail, adminFirstName, adminLastName, "N/A", "N/A", "N/A", adminPassword, "admin", 0)
    mycursor.execute(addAdmin, adminDetails)

    db.commit()

    print("Admin account created")