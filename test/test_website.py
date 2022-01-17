import unittest
import app
from sql_handler import *


class TestUserRegistration(unittest.TestCase):
    def test_01(self):
        assert False


class TestUserLogin(unittest.TestCase):
    def test_01(self):
        assert False


class TestUserLogout(unittest.TestCase):
    def test_01(self):
        assert False


class TestAdminTasks(unittest.TestCase):
    def test_01(self):
        assert False


class TestLeaderboard(unittest.TestCase):
    def test_01(self):
        sql_addLeaderboardEntry(5, "Asteroids", 400, "2022-01-01")
        sql_addLeaderboardEntry(5, "ChoosePath", 400, "2022-01-01")
        sql_addLeaderboardEntry(5, "HangMan", 400, "2022-01-01")
        sql_addLeaderboardEntry(5, "Quiz", 1400, "2022-01-01")
        sql_calculateOverallScore(5)
