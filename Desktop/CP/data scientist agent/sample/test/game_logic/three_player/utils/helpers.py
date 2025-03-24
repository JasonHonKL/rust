# game_logic/three_player/utils/helpers.py

def validate_player_input(input_data):
    """
    Validates the input data provided by a player.

    Args:
        input_data (dict): The input data to validate.

    Returns:
        bool: True if the input is valid, False otherwise.
    """
    required_keys = ['action', 'target', 'value']
    if not all(key in input_data for key in required_keys):
        return False
    return True

def calculate_score(player_data):
    """
    Calculates the score for a player based on their game data.

    Args:
        player_data (dict): The player's game data.

    Returns:
        int: The calculated score.
    """
    score = player_data.get('points', 0)
    score += player_data.get('bonus', 0)
    return score

def determine_winner(players):
    """
    Determines the winner among the players based on their scores.

    Args:
        players (list): A list of player data dictionaries.

    Returns:
        dict: The player data of the winner.
    """
    if not players:
        return None
    return max(players, key=lambda x: x.get('score', 0))

def shuffle_cards(cards):
    """
    Shuffles a list of cards.

    Args:
        cards (list): The list of cards to shuffle.

    Returns:
        list: The shuffled list of cards.
    """
    import random
    random.shuffle(cards)
    return cards

def deal_cards(cards, num_players):
    """
    Deals cards to the players.

    Args:
        cards (list): The list of cards to deal.
        num_players (int): The number of players.

    Returns:
        list: A list of lists, where each sublist represents the cards of a player.
    """
    hands = [[] for _ in range(num_players)]
    for i, card in enumerate(cards):
        hands[i % num_players].append(card)
    return hands

def is_game_over(players):
    """
    Checks if the game is over based on the players' status.

    Args:
        players (list): A list of player data dictionaries.

    Returns:
        bool: True if the game is over, False otherwise.
    """
    return all(player.get('status') == 'finished' for player in players)

def reset_game_state(players):
    """
    Resets the game state for all players.

    Args:
        players (list): A list of player data dictionaries.

    Returns:
        list: The list of players with reset game state.
    """
    for player in players:
        player['points'] = 0
        player['bonus'] = 0
        player['status'] = 'active'
    return players