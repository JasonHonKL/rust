import unittest
from game_logic.three_player.rules import ThreePlayerRules
from game_logic.three_player.player import ThreePlayer
from game_logic.three_player.utils.helpers import validate_move

class TestThreePlayerRules(unittest.TestCase):
    def setUp(self):
        self.player1 = ThreePlayer("Player1")
        self.player2 = ThreePlayer("Player2")
        self.player3 = ThreePlayer("Player3")
        self.rules = ThreePlayerRules()

    def test_initial_move_validity(self):
        # Test that the initial move is valid
        initial_move = {"player": self.player1, "move": "initial_move"}
        self.assertTrue(self.rules.is_valid_move(initial_move))

    def test_invalid_move(self):
        # Test that an invalid move is caught
        invalid_move = {"player": self.player1, "move": "invalid_move"}
        self.assertFalse(self.rules.is_valid_move(invalid_move))

    def test_move_validation_with_helper(self):
        # Test that the helper function validates moves correctly
        valid_move = {"player": self.player1, "move": "valid_move"}
        self.assertTrue(validate_move(valid_move))

    def test_win_condition(self):
        # Test that the win condition is correctly identified
        self.player1.score = 10
        self.player2.score = 5
        self.player3.score = 3
        self.assertEqual(self.rules.check_win_condition(), self.player1)

    def test_draw_condition(self):
        # Test that a draw condition is correctly identified
        self.player1.score = 5
        self.player2.score = 5
        self.player3.score = 5
        self.assertIsNone(self.rules.check_win_condition())

    def test_turn_order(self):
        # Test that the turn order is correctly enforced
        self.rules.set_turn_order([self.player1, self.player2, self.player3])
        self.assertEqual(self.rules.get_next_player(), self.player1)
        self.rules.next_turn()
        self.assertEqual(self.rules.get_next_player(), self.player2)
        self.rules.next_turn()
        self.assertEqual(self.rules.get_next_player(), self.player3)
        self.rules.next_turn()
        self.assertEqual(self.rules.get_next_player(), self.player1)

    def test_score_update(self):
        # Test that scores are updated correctly
        self.rules.update_score(self.player1, 5)
        self.assertEqual(self.player1.score, 5)
        self.rules.update_score(self.player2, 3)
        self.assertEqual(self.player2.score, 3)
        self.rules.update_score(self.player3, 2)
        self.assertEqual(self.player3.score, 2)

if __name__ == "__main__":
    unittest.main()