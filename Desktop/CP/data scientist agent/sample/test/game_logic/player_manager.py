# game_logic/player_manager.py

class Player:
    def __init__(self, name):
        """
        Initialize a player with a name and a score of 0.
        
        :param name: The name of the player.
        """
        self.name = name
        self.score = 0

    def add_score(self, points):
        """
        Add points to the player's score.
        
        :param points: The points to add to the player's score.
        """
        self.score += points

    def reset_score(self):
        """
        Reset the player's score to 0.
        """
        self.score = 0

    def __str__(self):
        """
        Return a string representation of the player.
        
        :return: A string containing the player's name and score.
        """
        return f"{self.name}: {self.score} points"


class PlayerManager:
    def __init__(self):
        """
        Initialize the PlayerManager with three players and set the first player as the current player.
        """
        self.players = [Player("Player 1"), Player("Player 2"), Player("Player 3")]
        self.current_player_index = 0

    def get_current_player(self):
        """
        Get the current player whose turn it is.
        
        :return: The current Player object.
        """
        return self.players[self.current_player_index]

    def next_turn(self):
        """
        Move to the next player's turn.
        """
        self.current_player_index = (self.current_player_index + 1) % len(self.players)

    def reset_scores(self):
        """
        Reset the scores of all players to 0.
        """
        for player in self.players:
            player.reset_score()

    def get_scores(self):
        """
        Get the scores of all players.
        
        :return: A list of tuples containing each player's name and score.
        """
        return [(player.name, player.score) for player in self.players]

    def __str__(self):
        """
        Return a string representation of all players and their scores.
        
        :return: A string containing the names and scores of all players.
        """
        return "\n".join(str(player) for player in self.players)