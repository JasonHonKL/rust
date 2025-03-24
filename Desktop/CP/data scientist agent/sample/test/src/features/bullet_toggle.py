# src/features/bullet_toggle.py

import keyboard
import logging
from typing import Callable

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class BulletToggle:
    def __init__(self, toggle_callback: Callable[[bool], None], shortcut: str = "ctrl+b"):
        """
        Initialize the BulletToggle feature.

        :param toggle_callback: A callback function that will be called when the bullet display is toggled.
                               The callback should accept a boolean parameter indicating the new state.
        :param shortcut: The keyboard shortcut to toggle the bullet display. Default is "ctrl+b".
        """
        self.toggle_callback = toggle_callback
        self.shortcut = shortcut
        self.is_bullet_displayed = True
        self._hotkey_id = None  # Store the hotkey ID for later cleanup
        self._setup_keyboard_listener()

    def _setup_keyboard_listener(self):
        """
        Set up the keyboard listener for the toggle shortcut.
        """
        self._hotkey_id = keyboard.add_hotkey(self.shortcut, self._toggle_bullet_display)
        logging.info(f"Keyboard listener set up with shortcut: {self.shortcut}")

    def _toggle_bullet_display(self):
        """
        Toggle the bullet display state and call the callback function.
        """
        self.is_bullet_displayed = not self.is_bullet_displayed
        logging.info(f"Bullet display toggled to {'on' if self.is_bullet_displayed else 'off'}")
        self.toggle_callback(self.is_bullet_displayed)

    def update_ui(self, is_bullet_displayed: bool):
        """
        Update the UI based on the bullet display state.

        :param is_bullet_displayed: The current state of the bullet display.
        """
        # Implement UI update logic here
        logging.info(f"UI updated: Bullet display is {'on' if is_bullet_displayed else 'off'}")

    def cleanup(self):
        """
        Clean up resources, such as removing the keyboard listener.
        """
        if self._hotkey_id:
            keyboard.remove_hotkey(self._hotkey_id)
            logging.info(f"Keyboard listener with shortcut {self.shortcut} removed")
        else:
            logging.warning("No hotkey ID found to remove")

# Example usage:
# def on_toggle(is_bullet_displayed: bool):
#     print(f"Bullet display is now {'on' if is_bullet_displayed else 'off'}")
# 
# bullet_toggle = BulletToggle(on_toggle)
# bullet_toggle.update_ui(True)