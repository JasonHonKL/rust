import unittest
from game_logic.three_player.game import ThreePlayerGame
from game_logic.three_player.player import ThreePlayer
from game_logic.three_player.rules import ThreePlayerRules
from game_logic.three_player.utils.helpers import HelperFunctions

class TestThreePlayerGame(unittest.TestCase):
    def setUp(self):
        self.player1 = ThreePlayer("Player1")
        self.player2 = ThreePlayer("Player2")
        self.player3 = ThreePlayer("Player3")
        self.game = ThreePlayerGame([self.player1, self.player2, self.player3])
        self.rules = ThreePlayerRules()
        self.helpers = HelperFunctions()

    def test_initial_game_state(self):
        self.assertEqual(self.game.get_current_player(), self.player1)
        self.assertEqual(self.game.get_players(), [self.player1, self.player2, self.player3])
        self.assertEqual(self.game.get_scores(), {"Player1": 0, "Player2": 0, "Player3": 0})

    def test_player_turn_rotation(self):
        self.game.next_turn()
        self.assertEqual(self.game.get_current_player(), self.player2)
        self.game.next_turn()
        self.assertEqual(self.game.get_current_player(), self.player3)
        self.game.next_turn()
        self.assertEqual(self.game.get_current_player(), self.player1)

    def test_score_update(self):
        self.game.update_score(self.player1, 10)
        self.assertEqual(self.game.get_scores(), {"Player1": 10, "Player2": 0, "Player3": 0})
        self.game.update_score(self.player2, 5)
        self.assertEqual(self.game.get_scores(), {"Player1": 10, "Player2": 5, "Player3": 0})

    def test_game_end_condition(self):
        self.game.update_score(self.player1, 100)
        self.assertTrue(self.rules.check_win_condition(self.game.get_scores()))
        self.assertEqual(self.game.get_winner(), self.player1)

    def test_helper_functions(self):
        shuffled_players = self.helpers.shuffle_players([self.player1, self.player2, self.player3])
        self.assertEqual(len(shuffled_players), 3)
        self.assertIn(self.player1, shuffled_players)
        self.assertIn(self.player2, shuffled_players)
        self.assertIn(self.player3, shuffled_players)

if __name__ == "__main__":
    unittest.main()