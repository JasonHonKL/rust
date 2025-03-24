import unittest
from game_logic.three_player.player import Player

class TestPlayer(unittest.TestCase):
    def setUp(self):
        self.player = Player(name="Player1", initial_score=0)

    def test_initialization(self):
        self.assertEqual(self.player.name, "Player1")
        self.assertEqual(self.player.score, 0)

    def test_add_score(self):
        self.player.add_score(10)
        self.assertEqual(self.player.score, 10)

    def test_reset_score(self):
        self.player.add_score(10)
        self.player.reset_score()
        self.assertEqual(self.player.score, 0)

    def test_update_name(self):
        self.player.update_name("NewPlayer1")
        self.assertEqual(self.player.name, "NewPlayer1")

    def test_negative_score(self):
        self.player.add_score(-5)
        self.assertEqual(self.player.score, -5)

    def test_add_score_multiple_times(self):
        self.player.add_score(5)
        self.player.add_score(10)
        self.assertEqual(self.player.score, 15)

    def test_reset_score_multiple_times(self):
        self.player.add_score(20)
        self.player.reset_score()
        self.player.add_score(30)
        self.player.reset_score()
        self.assertEqual(self.player.score, 0)

    def test_update_name_multiple_times(self):
        self.player.update_name("PlayerA")
        self.player.update_name("PlayerB")
        self.assertEqual(self.player.name, "PlayerB")

if __name__ == "__main__":
    unittest.main()