import unittest
import app
from sql_handler import sql_addLeaderboardEntry


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
        sql_addLeaderboardEntry(6, "Asteroids", 400, "2022-01-01")
