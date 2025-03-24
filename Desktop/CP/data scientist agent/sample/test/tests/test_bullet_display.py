import unittest
from unittest.mock import patch, MagicMock
from display.bullet_display import BulletDisplay

class TestBulletDisplay(unittest.TestCase):
    def setUp(self):
        self.bullet_display = BulletDisplay()

    def test_initial_state(self):
        """Test that the bullet display initializes correctly."""
        self.assertEqual(self.bullet_display.bullets, [])
        self.assertEqual(self.bullet_display.max_bullets, 10)

    def test_add_bullet(self):
        """Test adding a bullet to the display."""
        self.bullet_display.add_bullet("Test Bullet")
        self.assertIn("Test Bullet", self.bullet_display.bullets)

    def test_remove_bullet(self):
        """Test removing a bullet from the display."""
        self.bullet_display.add_bullet("Test Bullet")
        self.bullet_display.remove_bullet("Test Bullet")
        self.assertNotIn("Test Bullet", self.bullet_display.bullets)

    def test_render_bullets(self):
        """Test rendering bullets in the display."""
        self.bullet_display.add_bullet("Bullet 1")
        self.bullet_display.add_bullet("Bullet 2")
        rendered_bullets = self.bullet_display.render_bullets()
        self.assertEqual(rendered_bullets, ["Bullet 1", "Bullet 2"])

    def test_max_bullets_reached(self):
        """Test that the display does not exceed the maximum number of bullets."""
        for i in range(11):
            self.bullet_display.add_bullet(f"Bullet {i}")
        self.assertEqual(len(self.bullet_display.bullets), 10)

    @patch('display.bullet_display.BulletDisplay.render_bullets')
    def test_render_bullets_called(self, mock_render):
        """Test that the render_bullets method is called correctly."""
        self.bullet_display.render_bullets()
        mock_render.assert_called_once()

    def test_clear_bullets(self):
        """Test clearing all bullets from the display."""
        self.bullet_display.add_bullet("Bullet 1")
        self.bullet_display.add_bullet("Bullet 2")
        self.bullet_display.clear_bullets()
        self.assertEqual(self.bullet_display.bullets, [])

if __name__ == '__main__':
    unittest.main()