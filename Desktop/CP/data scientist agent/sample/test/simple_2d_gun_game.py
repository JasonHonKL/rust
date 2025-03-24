import pygame
import random

# Initialize Pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
GREEN = (0, 255, 0)

# Initialize screen
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Simple 2D Gun Game")

# Clock for controlling the frame rate
clock = pygame.time.Clock()

# Player class
class Player(pygame.sprite.Sprite):
    def __init__(self, color, x, y, left_key, right_key, shoot_key):
        super().__init__()
        self.image = pygame.Surface((50, 50))
        self.image.fill(color)
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.speed = 5
        self.left_key = left_key
        self.right_key = right_key
        self.shoot_key = shoot_key

    def update(self):
        keys = pygame.key.get_pressed()
        if keys[self.left_key] and self.rect.left > 0:
            self.rect.x -= self.speed
        if keys[self.right_key] and self.rect.right < SCREEN_WIDTH:
            self.rect.x += self.speed

    def shoot(self):
        bullet = Bullet(self.rect.centerx, self.rect.top)
        all_sprites.add(bullet)
        bullets.add(bullet)

# Bullet class
class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((5, 10))
        self.image.fill(WHITE)
        self.rect = self.image.get_rect()
        self.rect.centerx = x
        self.rect.bottom = y
        self.speed = -10  # Negative speed to move upwards

    def update(self):
        self.rect.y += self.speed
        if self.rect.bottom < 0:  # Check if the bullet is off-screen
            self.kill()

# Target class
class Target(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((30, 30))
        self.image.fill(BLACK)
        self.rect = self.image.get_rect()
        self.rect.x = random.randint(0, SCREEN_WIDTH - self.rect.width)
        self.rect.y = random.randint(-100, -40)
        self.speed = random.randint(1, 3)

    def update(self):
        self.rect.y += self.speed
        if self.rect.top > SCREEN_HEIGHT:
            self.rect.x = random.randint(0, SCREEN_WIDTH - self.rect.width)
            self.rect.y = random.randint(-100, -40)
            self.speed = random.randint(1, 3)

# ScoreBoard class
class ScoreBoard:
    def __init__(self):
        self.scores = [0, 0, 0]  # Scores for Player 1, Player 2, Player 3
        self.font = pygame.font.SysFont(None, 36)

    def increment_score(self, player_index):
        self.scores[player_index] += 1

    def draw(self, screen):
        for i, score in enumerate(self.scores):
            score_text = self.font.render(f"Player {i+1}: {score}", True, BLACK)
            screen.blit(score_text, (10, 10 + i * 30))

# ThreePlayerGame class
class ThreePlayerGame:
    def __init__(self):
        self.player1 = Player(
            RED,
            SCREEN_WIDTH // 4,
            SCREEN_HEIGHT - 50,
            pygame.K_a,
            pygame.K_d,
            pygame.K_w,
        )
        self.player2 = Player(
            BLUE,
            SCREEN_WIDTH // 2,
            SCREEN_HEIGHT - 50,
            pygame.K_LEFT,
            pygame.K_RIGHT,
            pygame.K_UP,
        )
        self.player3 = Player(
            GREEN,
            3 * SCREEN_WIDTH // 4,
            SCREEN_HEIGHT - 50,
            pygame.K_j,
            pygame.K_l,
            pygame.K_i,
        )
        all_sprites.add(self.player1)
        all_sprites.add(self.player2)
        all_sprites.add(self.player3)

# Sprite groups
all_sprites = pygame.sprite.Group()
bullets = pygame.sprite.Group()
targets = pygame.sprite.Group()

# Create game instance
game = ThreePlayerGame()

# Create targets
for _ in range(10):
    target = Target()
    all_sprites.add(target)
    targets.add(target)

# Game variables
score_board = ScoreBoard()
running = True
game_over = False
escaped_targets = 0
max_escaped_targets = 5  # Number of targets that can escape before game over

# Main game loop
while running:
    clock.tick(60)

    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == game.player1.shoot_key:
                game.player1.shoot()
            if event.key == game.player2.shoot_key:
                game.player2.shoot()
            if event.key == game.player3.shoot_key:
                game.player3.shoot()
            if game_over and event.key == pygame.K_r:  # Restart the game if 'R' is pressed
                game_over = False
                escaped_targets = 0
                score_board.scores = [0, 0, 0]
                all_sprites.empty()
                bullets.empty()
                targets.empty()
                game = ThreePlayerGame()
                for _ in range(10):
                    target = Target()
                    all_sprites.add(target)
                    targets.add(target)

    if not game_over:
        # Update
        all_sprites.update()

        # Check for collisions between bullets and targets
        hits = pygame.sprite.groupcollide(bullets, targets, True, True)
        for hit in hits:
            for bullet in hits[hit]:
                if bullet.rect.colliderect(game.player1.rect):
                    score_board.increment_score(0)
                elif bullet.rect.colliderect(game.player2.rect):
                    score_board.increment_score(1)
                elif bullet.rect.colliderect(game.player3.rect):
                    score_board.increment_score(2)
            target = Target()
            all_sprites.add(target)
            targets.add(target)

        # Check if targets reach the bottom
        for target in targets:
            if target.rect.bottom >= SCREEN_HEIGHT:
                escaped_targets += 1
                target.kill()
                if escaped_targets >= max_escaped_targets:
                    game_over = True

        # Draw everything
        screen.fill(WHITE)
        all_sprites.draw(screen)

        # Display score
        score_board.draw(screen)

        # Update the display
        pygame.display.flip()

    else:
        # Game over screen
        font = pygame.font.SysFont(None, 72)
        game_over_text = font.render("Game Over", True, BLACK)
        restart_text = font.render("Press R to Restart", True, BLACK)
        screen.blit(game_over_text, (SCREEN_WIDTH // 2 - 100, SCREEN_HEIGHT // 2 - 50))
        screen.blit(restart_text, (SCREEN_WIDTH // 2 - 150, SCREEN_HEIGHT // 2 + 50))
        pygame.display.flip()

# Quit Pygame
pygame.quit()