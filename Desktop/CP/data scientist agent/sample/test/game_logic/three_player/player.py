# game_logic/three_player/player.py

class Player:
    """
    Represents a player in a three-player game.
    This class contains attributes and methods specific to three-player gameplay.
    """

    def __init__(self, name, position):
        """
        Initializes a new Player instance.

        :param name: The name of the player.
        :param position: The position of the player in the game (1, 2, or 3).
        """
        self.name = name
        self.position = position
        self.score = 0
        self.hand = []  # Represents the cards or items the player holds

    def add_to_hand(self, item):
        """
        Adds an item to the player's hand.

        :param item: The item to add to the hand.
        """
        self.hand.append(item)

    def remove_from_hand(self, item):
        """
        Removes an item from the player's hand.

        :param item: The item to remove from the hand.
        :return: The removed item, or None if the item was not found.
        """
        if item in self.hand:
            self.hand.remove(item)
            return item
        return None

    def update_score(self, points):
        """
        Updates the player's score by adding the specified points.

        :param points: The points to add to the player's score.
        """
        self.score += points

    def reset(self):
        """
        Resets the player's state for a new game.
        """
        self.score = 0
        self.hand = []

    def __str__(self):
        """
        Returns a string representation of the player.

        :return: A string describing the player.
        """
        return f"Player {self.position}: {self.name}, Score: {self.score}, Hand: {self.hand}"