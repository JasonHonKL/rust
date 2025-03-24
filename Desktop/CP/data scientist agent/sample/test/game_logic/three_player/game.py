# game_logic/three_player/game.py

import random
from .player import Player
from .rules import Rules
from .utils.helpers import Helper

class ThreePlayerGame:
    """
    Main class to handle the core logic for a three-player game.
    """

    def __init__(self, player1_name, player2_name, player3_name):
        """
        Initialize the game with three players.

        :param player1_name: Name of the first player.
        :param player2_name: Name of the second player.
        :param player3_name: Name of the third player.
        """
        self.player1 = Player(player1_name)
        self.player2 = Player(player2_name)
        self.player3 = Player(player3_name)
        self.rules = Rules()
        self.helper = Helper()
        self.current_turn = 1
        self.game_over = False

    def start_game(self):
        """
        Start the game and handle the main game loop.
        """
        print("Starting the three-player game!")
        while not self.game_over:
            self.play_turn()

    def play_turn(self):
        """
        Handle the logic for a single turn in the game.
        """
        print(f"Turn {self.current_turn}")
        self._process_player_turn(self.player1)
        if self.game_over:
            return
        self._process_player_turn(self.player2)
        if self.game_over:
            return
        self._process_player_turn(self.player3)
        if self.game_over:
            return
        self.current_turn += 1

    def _process_player_turn(self, player):
        """
        Process a single player's turn.

        :param player: The player whose turn it is.
        """
        print(f"{player.name}'s turn:")
        action = self._get_player_action(player)
        self._execute_action(player, action)
        if self.rules.check_win_condition(player):
            print(f"{player.name} wins!")
            self.game_over = True

    def _get_player_action(self, player):
        """
        Get the action the player wants to take.

        :param player: The player whose action is being determined.
        :return: The action chosen by the player.
        """
        # For simplicity, we'll randomly choose an action.
        actions = ["attack", "defend", "special"]
        return random.choice(actions)

    def _execute_action(self, player, action):
        """
        Execute the chosen action for the player.

        :param player: The player performing the action.
        :param action: The action to be executed.
        """
        if action == "attack":
            target = self._choose_target(player)
            damage = self.helper.calculate_damage(player, target)
            target.take_damage(damage)
            print(f"{player.name} attacks {target.name} for {damage} damage!")
        elif action == "defend":
            player.defend()
            print(f"{player.name} defends!")
        elif action == "special":
            special_effect = self.helper.get_special_effect(player)
            print(f"{player.name} uses a special ability: {special_effect}!")
        else:
            print("Invalid action!")

    def _choose_target(self, player):
        """
        Choose a target for the player's action.

        :param player: The player choosing the target.
        :return: The chosen target player.
        """
        if player == self.player1:
            return random.choice([self.player2, self.player3])
        elif player == self.player2:
            return random.choice([self.player1, self.player3])
        else:
            return random.choice([self.player1, self.player2])

    def reset_game(self):
        """
        Reset the game to its initial state.
        """
        self.player1.reset()
        self.player2.reset()
        self.player3.reset()
        self.current_turn = 1
        self.game_over = False
        print("Game has been reset.")