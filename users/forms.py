from wtforms import StringField, SubmitField, DateField
from flask_wtf import FlaskForm
from wtforms.validators import data_required, Email, Length, EqualTo, ValidationError
import re


def character_check(form, field):
    excluded_chars = "*?!'^+%&/()=}][{$#@<>"
    for char in field.data:
        if char in excluded_chars:
            raise ValidationError(f"Character {char} is not allowed.")


class RegisterForm(FlaskForm):
    firstName = StringField(validators=[data_required(), character_check])
    lastName = StringField(validators=[data_required(), character_check])
    email = StringField(validators=[data_required(), Email()])
    phone = StringField(validators=[data_required()])
    dob = DateField('DatePicker', format='%y-%m-%d',validators=[data_required()])
    password = StringField(validators=[data_required(), Length(min=8, message='password must be 8 characters or more')])
    confirmPassword = StringField(validators=[data_required(), EqualTo('password', message='Passwords do not match')])
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
