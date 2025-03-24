# game_logic/three_player/rules.py

class ThreePlayerRules:
    """
    Contains the rules and constraints specific to the three-player game.
    """

    def __init__(self):
        """
        Initialize the rules for the three-player game.
        """
        self.max_players = 3
        self.min_players = 3
        self.winning_score = 100
        self.max_turns = 10

    def validate_player_count(self, player_count):
        """
        Validate that the number of players is exactly three.

        :param player_count: The number of players in the game.
        :return: True if the player count is valid, False otherwise.
        """
        return player_count == self.max_players

    def check_winning_condition(self, scores):
        """
        Check if any player has met the winning condition.

        :param scores: A dictionary containing player IDs as keys and their scores as values.
        :return: The player ID of the winner if a winning condition is met, otherwise None.
        """
        for player_id, score in scores.items():
            if score >= self.winning_score:
                return player_id
        return None

    def is_game_over(self, turn_count, scores):
        """
        Determine if the game is over based on the number of turns or if a player has won.

        :param turn_count: The current turn count.
        :param scores: A dictionary containing player IDs as keys and their scores as values.
        :return: True if the game is over, False otherwise.
        """
        if turn_count >= self.max_turns:
            return True
        return self.check_winning_condition(scores) is not None

    def get_winner(self, scores):
        """
        Determine the winner of the game based on the scores.

        :param scores: A dictionary containing player IDs as keys and their scores as values.
        :return: The player ID of the winner, or None if there is no winner yet.
        """
        return self.check_winning_condition(scores)

    def apply_special_rules(self, player_id, scores):
        """
        Apply any special rules or constraints specific to the three-player game.

        :param player_id: The ID of the player to apply the rules to.
        :param scores: A dictionary containing player IDs as keys and their scores as values.
        :return: Updated scores after applying special rules.
        """
        # Example of a special rule: If a player reaches exactly 50 points, they gain an extra 10 points.
        if scores[player_id] == 50:
            scores[player_id] += 10
        return scores