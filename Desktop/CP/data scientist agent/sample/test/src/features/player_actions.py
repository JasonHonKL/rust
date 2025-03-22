# src/features/player_actions.py

class PlayerActions:
    def __init__(self):
        self.is_jumping = False
        self.is_shooting = False
        self.jump_cooldown = 1.0  # Cooldown time in seconds
        self.shoot_cooldown = 0.5  # Cooldown time in seconds
        self.last_jump_time = 0.0
        self.last_shoot_time = 0.0

    def handle_input(self, input_event):
        """
        Detects and processes player input for jumping and shooting actions.
        
        Args:
            input_event: The input event to be processed (e.g., key press, button click).
        """
        if input_event == "jump":
            self.jump()
        elif input_event == "shoot":
            self.shoot()
        else:
            print(f"Invalid input event: {input_event}")

    def jump(self):
        """
        Executes the jump action for the player.
        """
        current_time = self.get_current_time()
        if not self.is_jumping and (current_time - self.last_jump_time) >= self.jump_cooldown:
            self.is_jumping = True
            self.last_jump_time = current_time
            # Logic to make the player jump (e.g., apply upward force)
            print("Player is jumping!")
            # Simulate jump duration (e.g., 0.5 seconds)
            self.simulate_action_duration(0.5)
            self.is_jumping = False

    def shoot(self):
        """
        Executes the shoot action for the player.
        """
        current_time = self.get_current_time()
        if not self.is_shooting and (current_time - self.last_shoot_time) >= self.shoot_cooldown:
            self.is_shooting = True
            self.last_shoot_time = current_time
            # Logic to make the player shoot (e.g., spawn a projectile)
            print("Player is shooting!")
            # Simulate shoot duration (e.g., 0.2 seconds)
            self.simulate_action_duration(0.2)
            self.is_shooting = False

    def simulate_action_duration(self, duration):
        """
        Simulates the duration of an action (e.g., jump or shoot).
        
        Args:
            duration: The duration of the action in seconds.
        """
        # Simulate the action duration (e.g., using time.sleep or game loop logic)
        # For simplicity, we'll just print the duration here.
        print(f"Action duration: {duration} seconds")

    def get_current_time(self):
        """
        Returns the current time in seconds.
        
        Returns:
            float: The current time in seconds.
        """
        # This method should return the current time in seconds.
        # For simplicity, we'll use a placeholder here.
        import time
        return time.time()

    def update(self):
        """
        Updates the state of player actions. This method should be called in the game loop.
        """
        # Additional logic for managing ongoing actions (e.g., cooldowns, animations)
        pass

# Example usage:
# player_actions = PlayerActions()
# player_actions.handle_input("jump")
# player_actions.handle_input("shoot")