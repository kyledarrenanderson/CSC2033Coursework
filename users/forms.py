import re

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, DateField, SelectField, PasswordField
from wtforms.validators import data_required, Email, Length, EqualTo, ValidationError


# Ensures invalid characters are not present
def character_check(form, field):
    excluded_chars = "*?!'^+%&/()=}][{$#@<>"
    for char in field.data:
        if char in excluded_chars:
            raise ValidationError(f"Character {char} is not allowed.")


# REGISTRATION FORM
class RegisterForm(FlaskForm):
    firstName = StringField(validators=[data_required(), character_check])
    lastName = StringField(validators=[data_required(), character_check])
    email = StringField(validators=[data_required(), Email()])
    phone = StringField(validators=[data_required()])
    dob = DateField('DatePicker: ', validators=[data_required()])
    password = PasswordField(validators=[data_required(), Length(min=8, message='password must be 8 characters or more')])
    confirmPassword = PasswordField(validators=[data_required(), EqualTo('password', message='Passwords do not match')])
    educationLevel = SelectField(label='Education Level', choices=('None', 'GCSE', 'A Level', 'Bachelors', 'Masters'),
                                 validators=[data_required()])
    studiedCompSci = SelectField(label='Studied Computer Science', choices=('No', 'Yes'), validators=[data_required()])
    submit = SubmitField()

    # Ensures Password is secure
    def validate_password(self, password):
        p = re.compile(r'(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[@_!$%^&*()<>?/}{~:#])')
        if not p.match(self.password.data):
            raise ValidationError("Password must contain at least 1 digit, 1 uppercase letter,"
                                  " 1 lower case letter and a special character.")

    # Ensures phone number follows correct format
    def validate_phone(self, phone):
        n = re.compile(r'((\d){4}(-)(\d){3}(-)(\d){4})')
        if not n.match(self.phone.data):
            raise ValidationError("Phone numbers must be entered in the format XXXX-XXX-XXXX")


# LOGIN FORM
class LoginForm(FlaskForm):
    email = StringField(validators=[data_required(), Email()])
    password = PasswordField(validators=[data_required()])
    submit = SubmitField()


# UPDATE INFORMATION FORM
class UpdateInfoForm(FlaskForm):
    firstName = StringField(validators=[character_check])
    lastName = StringField(validators=[character_check])
    email = StringField(validators=[Email()])
    phone = StringField()
    password = PasswordField(validators=[Length(min=8, message='password must be 8 characters or more')])
    confirmPassword = PasswordField(validators=[EqualTo('password', message='Passwords do not match')])
    educationLevel = SelectField(label='Education Level', choices=('None', 'GCSE', 'A Level', 'Bachelors', 'Masters'),)
    studiedCompSci = SelectField(label='Studied Computer Science', choices=('No', 'Yes'), validators=[data_required()])
    currentPassword = PasswordField(validators=[data_required()])
    submit = SubmitField()

    def validate_password(self, password):

        p = re.compile(r'(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[@_!$%^&*()<>?/}{~:#])')
        if not p.match(self.password.data):
            raise ValidationError("Password must contain at least 1 digit, 1 uppercase letter,"
                                  " 1 lower case letter and a special character.")

    def validate_phone(self, phone):
        n = re.compile(r'((\d){4}(-)(\d){3}(-)(\d){4})')
        if not n.match(self.phone.data):
            raise ValidationError("Phone numbers must be entered in the format XXXX-XXX-XXXX")