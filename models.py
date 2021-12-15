from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash
from flask_login import UserMixin
import base64
from cryptography.fernet import Fernet


def createAdmin():
    adminEmail = input("Please Enter the Admins Email Address: ")
    adminFirstName = input("Please Enter the Admins First Name: ")
    adminLastName = input("Please Enter the Admins Last Name: ")
    adminPassword = input("Please Enter the Admins Password")

    mycursor = db.cursor()
    mycursor.execute("INSERT INTO User (email, firstName, lastName, educationLevel, phoneNumber, dateOfBirth, "
                     "password, role, takenCS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", (adminEmail, adminFirstName,
                                                                                     adminLastName, "N/A", "N/A",
                                                                                     "N/A", adminPassword, "admin", 0))

    db.commit()

    print("Admin account created")