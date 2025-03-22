# game/entities/bullet.py

import pygame

class Bullet:
    def __init__(self, x, y, speed, direction, color=(255, 0, 0), radius=5):
        """
        Initialize a Bullet object.

        :param x: The initial x-coordinate of the bullet.
        :param y: The initial y-coordinate of the bullet.
        :param speed: The speed at which the bullet moves.
        :param direction: The direction vector of the bullet as a tuple (dx, dy).
        :param color: The color of the bullet (default is red).
        :param radius: The radius of the bullet (default is 5).
        """
        self.x = x
        self.y = y
        self.speed = speed
        self.direction = direction
        self.color = color
        self.radius = radius
        self.is_active = True

    def update(self):
        """
        Update the bullet's position based on its speed and direction.
        """
        if self.is_active:
            self.x += self.direction[0] * self.speed
            self.y += self.direction[1] * self.speed

    def render(self, screen):
        """
        Render the bullet on the screen.

        :param screen: The pygame Surface object representing the game screen.
        """
        if self.is_active:
            pygame.draw.circle(screen, self.color, (int(self.x), int(self.y)), self.radius)

    def deactivate(self):
        """
        Deactivate the bullet, marking it for removal.
        """
        self.is_active = False

    def is_off_screen(self, screen_width, screen_height):
        """
        Check if the bullet is off the screen.

        :param screen_width: The width of the screen.
        :param screen_height: The height of the screen.
        :return: True if the bullet is off the screen, False otherwise.
        """
        return (self.x < 0 or self.x > screen_width or
                self.y < 0 or self.y > screen_height)