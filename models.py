from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash


# Creates a class for models used in login manager
class User(db.Model, UserMixin):
    db.Model.metadata.reflect(db.engine)
    __table__ = db.Model.metadata.tables['Users']

    # Defines the Model
    def __init__(self, email, firstName, lastName, educationLevel, phoneNumber, dateOfBirth, password, role, takenCS, overallScore):
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
        self.overallScore = overallScore

    def get_id(self):
        return (self.userID)
