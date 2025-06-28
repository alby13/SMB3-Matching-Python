import pygame
import random
import os
import json
import base64
import time
from enum import Enum
from typing import List, Dict, Tuple, Optional, Callable

# Initialize pygame
pygame.init()
pygame.mixer.init()

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
CARD_WIDTH = 64
CARD_HEIGHT = 96
GRID_ROWS = 3
GRID_COLS = 6
GRID_PADDING = 32
FLIP_DURATION = 256  # ms
OUTCOME_SOUND_DELAY = 384  # ms
OUTCOME_FLIP_BACK_DELAY = 1280  # ms
END_REVEAL_MUSIC_DELAY = 256  # ms
END_REVEAL_MOVES_DELAY = 900  # ms
END_REVEAL_TIME_DELAY = 1800  # ms
END_REVEAL_BEST_DELAY = 2550  # ms
STORAGE_KEY = 'matching_a5b2de657a650b527eabf78d6f85bdaebc2635e1b2020a67bc614bf3b8362352'
PATTERN_INDEX_KEY = 'matching_a5b2de657a650b527eabf78d6f85bdaebc2635e1b2020a67bc614bf3b8362352_index'

# Paths
ASSETS_PATH = os.path.join(os.path.dirname(__file__), "assets")

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
BLUE = (63, 191, 255)  # #3FBFFF
DARK_BLUE = (56, 167, 222)  # #38A7DE

# Enums
class CardType(Enum):
    MUSHROOM = "mushroom"
    FLOWER = "flower"
    COINS10 = "coins10"
    COINS20 = "coins20"
    STAR = "star"
    ONEUP = "oneup"

class GameState(Enum):
    IN_PLAY = 0
    PATTERN_COMPLETED = 1
    ALL_PATTERNS_COMPLETED = 2

# Pattern definitions
def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

patterns = [
    {
        "name": "1",
        "cardBackgroundColor": hex_to_rgb("#ffcec6"),
        "cards": [
            CardType.MUSHROOM, CardType.FLOWER, CardType.COINS20, CardType.MUSHROOM, CardType.COINS10, CardType.STAR,
            CardType.FLOWER, CardType.ONEUP, CardType.MUSHROOM, CardType.COINS10, CardType.ONEUP, CardType.COINS20,
            CardType.STAR, CardType.FLOWER, CardType.STAR, CardType.MUSHROOM, CardType.FLOWER, CardType.STAR
        ]
    },
    {
        "name": "2",
        "cardBackgroundColor": hex_to_rgb("#c4e6f6"),
        "cards": [
            CardType.MUSHROOM, CardType.FLOWER, CardType.COINS20, CardType.FLOWER, CardType.COINS10, CardType.STAR,
            CardType.COINS20, CardType.ONEUP, CardType.MUSHROOM, CardType.COINS10, CardType.ONEUP, CardType.FLOWER,
            CardType.STAR, CardType.MUSHROOM, CardType.STAR, CardType.MUSHROOM, CardType.FLOWER, CardType.STAR
        ]
    },
    {
        "name": "3",
        "cardBackgroundColor": hex_to_rgb("#7966d8"),
        "cards": [
            CardType.MUSHROOM, CardType.FLOWER, CardType.ONEUP, CardType.FLOWER, CardType.STAR, CardType.STAR,
            CardType.COINS20, CardType.STAR, CardType.MUSHROOM, CardType.COINS10, CardType.ONEUP, CardType.FLOWER,
            CardType.COINS20, CardType.MUSHROOM, CardType.COINS10, CardType.MUSHROOM, CardType.FLOWER, CardType.STAR
        ]
    },
    {
        "name": "4",
        "cardBackgroundColor": hex_to_rgb("#117733"),
        "cards": [
            CardType.FLOWER, CardType.COINS10, CardType.ONEUP, CardType.FLOWER, CardType.ONEUP, CardType.MUSHROOM,
            CardType.STAR, CardType.MUSHROOM, CardType.COINS20, CardType.STAR, CardType.MUSHROOM, CardType.COINS10,
            CardType.STAR, CardType.FLOWER, CardType.COINS20, CardType.MUSHROOM, CardType.FLOWER, CardType.STAR
        ]
    },
    {
        "name": "5",
        "cardBackgroundColor": hex_to_rgb("#44aa99"),
        "cards": [
            CardType.FLOWER, CardType.COINS20, CardType.MUSHROOM, CardType.STAR, CardType.ONEUP, CardType.FLOWER,
            CardType.ONEUP, CardType.FLOWER, CardType.COINS10, CardType.MUSHROOM, CardType.COINS20, CardType.STAR,
            CardType.MUSHROOM, CardType.COINS10, CardType.STAR, CardType.MUSHROOM, CardType.FLOWER, CardType.STAR
        ]
    },
    {
        "name": "6",
        "cardBackgroundColor": hex_to_rgb("#ffc8f6"),
        "cards": [
            CardType.FLOWER, CardType.STAR, CardType.ONEUP, CardType.FLOWER, CardType.COINS20, CardType.MUSHROOM,
            CardType.COINS10, CardType.MUSHROOM, CardType.COINS20, CardType.ONEUP, CardType.MUSHROOM, CardType.COINS10,
            CardType.STAR, CardType.FLOWER, CardType.STAR, CardType.MUSHROOM, CardType.FLOWER, CardType.STAR
        ]
    },
    {
        "name": "7",
        "cardBackgroundColor": hex_to_rgb("#ddcc77"),
        "cards": [
            CardType.FLOWER, CardType.STAR, CardType.ONEUP, CardType.FLOWER, CardType.ONEUP, CardType.MUSHROOM,
            CardType.COINS10, CardType.MUSHROOM, CardType.FLOWER, CardType.STAR, CardType.MUSHROOM, CardType.COINS10,
            CardType.STAR, CardType.COINS20, CardType.COINS20, CardType.MUSHROOM, CardType.FLOWER, CardType.STAR
        ]
    },
    {
        "name": "8",
        "cardBackgroundColor": hex_to_rgb("#d8669f"),
        "cards": [
            CardType.ONEUP, CardType.MUSHROOM, CardType.COINS10, CardType.MUSHROOM, CardType.FLOWER, CardType.STAR,
            CardType.MUSHROOM, CardType.COINS10, CardType.STAR, CardType.COINS20, CardType.COINS20, CardType.FLOWER,
            CardType.STAR, CardType.ONEUP, CardType.FLOWER, CardType.MUSHROOM, CardType.FLOWER, CardType.STAR
        ]
    }
]

# Card class
class Card:
    def __init__(self, key: int, card_type: CardType, background_color: Tuple[int, int, int], game):
        self.key = key
        self.card_type = card_type
        self.visible = False
        self.matched = False
        self.flipping_back = False
        self.background_color = background_color
        self.flip_start_time = 0
        self.flip_direction = None  # None, 'forward', 'backward'
        self.rect = pygame.Rect(0, 0, CARD_WIDTH, CARD_HEIGHT)
        self.game = game
        
    def is_flipping(self):
        return self.flip_direction is not None
        
    def start_flip(self, direction: str):
        self.flip_direction = direction
        self.flip_start_time = pygame.time.get_ticks()
        
    def update(self, current_time: int):
        if self.flip_direction:
            elapsed = current_time - self.flip_start_time
            if elapsed >= FLIP_DURATION:
                if self.flip_direction == 'forward':
                    self.visible = True
                elif self.flip_direction == 'backward':
                    self.visible = False
                self.flip_direction = None
                    
    def draw(self, surface, sprites, selector_img):
        if not self.visible and not self.flip_direction:
            frame = sprites["hidden"]
        elif self.visible and not self.flip_direction:
            frame = sprites[self.card_type.value]
        else:
            elapsed = pygame.time.get_ticks() - self.flip_start_time
            progress = min(elapsed / FLIP_DURATION, 1.0)
            
            if self.flip_direction == 'forward':
                if progress < 0.33:
                    frame = sprites["flip1"]
                elif progress < 0.66:
                    frame = sprites["flip2"]
                else:
                    frame = sprites["flip3"]
            else:  # backward
                if progress < 0.33:
                    frame = sprites["flip3"]
                elif progress < 0.66:
                    frame = sprites["flip2"]
                else:
                    frame = sprites["flip1"]
        
        # Create card surface with scaled dimensions
        card_width = int(CARD_WIDTH * self.game.scale_factor)
        card_height = int(CARD_HEIGHT * self.game.scale_factor)
        card_surface = pygame.Surface((card_width, card_height), pygame.SRCALPHA)
        
        # Fill with background color (make sure it's visible)
        card_surface.fill(self.background_color)
        
        # Blit the frame onto the card surface
        card_surface.blit(frame, (0, 0))
        
        # Update rect size to match scaled dimensions
        self.rect.width = card_width
        self.rect.height = card_height
        
        # Draw to main surface
        surface.blit(card_surface, self.rect)

# Game class
class CardMatchingGame:
    def __init__(self):
        self.base_width = WINDOW_WIDTH
        self.base_height = WINDOW_HEIGHT
        self.screen = pygame.display.set_mode((self.base_width, self.base_height))
        pygame.display.set_caption("Card Matching Game")

        # Scaling variables
        self.fullscreen_enabled = False
        self.scale_factor = 1.0
        self.current_width = self.base_width
        self.current_height = self.base_height

        # Initialize card_sprites here
        self.card_sprites = {}
        
        # Load assets
        self.load_assets()
        
        # Initialize game state
        self.current_pattern_index = self.retrieve_pattern_index()
        self.game_state = GameState.IN_PLAY
        self.puzzle = {
            "pattern": patterns[self.current_pattern_index],
            "moves": 0,
            "start_time": 0,
            "end_time": 0
        }

        # Menu state variables
        self.menu_active = False
        self.music_enabled = True
        self.fullscreen_enabled = False
        
        # Create cards
        self.cards = self.create_cards(self.puzzle["pattern"])

        # Update positions after assets are loaded
        self.update_card_positions()
        
        # Set up game state variables
        self.other_card_key = None
        self.pair_to_hide = (None, None)
        self.pending_actions = []
        self.selected_card = None
        
        # Calculate grid position
        grid_width = GRID_COLS * CARD_WIDTH + (GRID_COLS - 1) * GRID_PADDING
        grid_height = GRID_ROWS * CARD_HEIGHT + (GRID_ROWS - 1) * GRID_PADDING
        grid_x = (WINDOW_WIDTH - grid_width) // 2
        grid_y = (WINDOW_HEIGHT - grid_height) // 2
        
        # Position cards on grid
        for i, card in enumerate(self.cards):
            row = i // GRID_COLS
            col = i % GRID_COLS
            x = grid_x + col * (CARD_WIDTH + GRID_PADDING)
            y = grid_y + row * (CARD_HEIGHT + GRID_PADDING)
            card.rect = pygame.Rect(x, y, CARD_WIDTH, CARD_HEIGHT)
            
        # End screen state
        self.end_screen_visible = False
        self.end_screen_animation_start = 0
        self.moves_visible = False
        self.time_visible = False
        self.best_visible = False
        self.best_moves = "TBD"
        self.best_time = "TBD"
        
        # Credits screen state
        self.credits_screen_visible = False
        self.scores_were_reset = False
        
        # Game loop control
        self.running = True
        self.clock = pygame.time.Clock()

    def load_assets(self):
        # Load sounds
        self.sounds = {
            "select": pygame.mixer.Sound(os.path.join(ASSETS_PATH, "select.wav")),
            "match_correct": pygame.mixer.Sound(os.path.join(ASSETS_PATH, "match_correct.wav")),
            "match_incorrect": pygame.mixer.Sound(os.path.join(ASSETS_PATH, "match_incorrect.wav")),
            "coin": pygame.mixer.Sound(os.path.join(ASSETS_PATH, "coin.wav")),
            "oneup": pygame.mixer.Sound(os.path.join(ASSETS_PATH, "1up.wav")),
            "clear": pygame.mixer.Sound(os.path.join(ASSETS_PATH, "clear.wav")),
            "game_over": pygame.mixer.Sound(os.path.join(ASSETS_PATH, "game_over.wav")),
        }
        
        # Load font
        self.font = pygame.font.Font(os.path.join(ASSETS_PATH, "smb3_font.ttf"), 16)
        self.small_font = pygame.font.Font(os.path.join(ASSETS_PATH, "smb3_font.ttf"), 12)
        
        # Load sprites
        cards_sheet = pygame.image.load(os.path.join(ASSETS_PATH, "cards.png")).convert_alpha()
        self.base_card_sprites = {  # Store the base sprites here
            "hidden": self.get_sprite(cards_sheet, 0, 0),
            "flip1": self.get_sprite(cards_sheet, 1, 0),
            "flip2": self.get_sprite(cards_sheet, 2, 0),
            "flip3": self.get_sprite(cards_sheet, 3, 0),
            "oneup": self.get_sprite(cards_sheet, 4, 0),
            "coins10": self.get_sprite(cards_sheet, 0, 1),
            "coins20": self.get_sprite(cards_sheet, 1, 1),
            "mushroom": self.get_sprite(cards_sheet, 2, 1),
            "flower": self.get_sprite(cards_sheet, 3, 1),
            "star": self.get_sprite(cards_sheet, 4, 1),
        }
        self.card_sprites = {}
        for key, sprite in self.base_card_sprites.items():
            self.card_sprites[key] = sprite.copy()  # Initial copy at base resolution
        
        # Load selector
        self.selector_img_base = pygame.image.load(os.path.join(ASSETS_PATH, "selector.png")).convert_alpha()
        self.selector_img = self.selector_img_base.copy()
        
        # Load background
        self.background_base = pygame.image.load(os.path.join(ASSETS_PATH, "stripes.png")).convert()
        self.background = self.background_base.copy()

    def update_scaling(self):
        # Calculate scale factor based on current screen size
        if self.fullscreen_enabled:
            info = pygame.display.Info()
            self.current_width = info.current_w
            self.current_height = info.current_h
        else:
            self.current_width = self.base_width
            self.current_height = self.base_height
            
        self.scale_factor = min(self.current_width / self.base_width, 
                              self.current_height / self.base_height)
        
        # Scale sprites
        self.card_sprites = {}
        for key, sprite in self.base_card_sprites.items():
            new_width = int(CARD_WIDTH * self.scale_factor)
            new_height = int(CARD_HEIGHT * self.scale_factor)
            self.card_sprites[key] = pygame.transform.scale(sprite, (new_width, new_height))
        
        # Scale selector
        self.selector_img = pygame.transform.scale(
            self.selector_img_base,
            (int(CARD_WIDTH * self.scale_factor), int(CARD_HEIGHT * self.scale_factor))
        )
        
        # Scale background
        self.background = pygame.transform.scale(
            self.background_base,
            (int(self.base_width * self.scale_factor), int(self.base_height * self.scale_factor))
        )

        self.update_card_positions()

    def toggle_fullscreen(self):
        self.fullscreen_enabled = not self.fullscreen_enabled
        if self.fullscreen_enabled:
            self.screen = pygame.display.set_mode((0, 0), pygame.FULLSCREEN)
        else:
            self.screen = pygame.display.set_mode((self.base_width, self.base_height))
        self.update_scaling()
        self.update_card_positions()

    def update_card_positions(self):
        grid_width = GRID_COLS * CARD_WIDTH * self.scale_factor + (GRID_COLS - 1) * GRID_PADDING * self.scale_factor
        grid_height = GRID_ROWS * CARD_HEIGHT * self.scale_factor + (GRID_ROWS - 1) * GRID_PADDING * self.scale_factor
        grid_x = (self.current_width - grid_width) // 2
        grid_y = (self.current_height - grid_height) // 2
        
        for i, card in enumerate(self.cards):
            row = i // GRID_COLS
            col = i % GRID_COLS
            x = grid_x + col * (CARD_WIDTH + GRID_PADDING) * self.scale_factor
            y = grid_y + row * (CARD_HEIGHT + GRID_PADDING) * self.scale_factor
            card.rect = pygame.Rect(x, y, 
                                  int(CARD_WIDTH * self.scale_factor), 
                                  int(CARD_HEIGHT * self.scale_factor))

    def toggle_music(self):
        self.music_enabled = not self.music_enabled
        # Add actual music control here when you implement background music
        print(f"Music Enabled: {self.music_enabled}")

    def handle_menu_click(self, mouse_pos):
        music_button_rect = pygame.Rect(WINDOW_WIDTH//2 - 100, WINDOW_HEIGHT//2 - 30, 200, 40)
        fullscreen_button_rect = pygame.Rect(WINDOW_WIDTH//2 - 100, WINDOW_HEIGHT//2 + 30, 200, 40)

        if music_button_rect.collidepoint(mouse_pos):
            self.toggle_music()
        elif fullscreen_button_rect.collidepoint(mouse_pos):
            self.toggle_fullscreen()

    def draw_menu(self):
        overlay = pygame.Surface((self.current_width, self.current_height))
        overlay.set_alpha(180)
        overlay.fill((0, 0, 0))
        self.screen.blit(overlay, (0, 0))

        scaled_font = pygame.font.Font(os.path.join(ASSETS_PATH, "smb3_font.ttf"), 
                                     int(16 * self.scale_factor))
        
        title_surf = scaled_font.render("Game Menu", True, WHITE)
        self.screen.blit(title_surf, (self.current_width//2 - title_surf.get_width()//2, 
                                    self.current_height//2 - int(100 * self.scale_factor)))

        music_text = f"Music: {'ON' if self.music_enabled else 'OFF'}"
        music_surf = scaled_font.render(music_text, True, BLACK)
        music_button_rect = pygame.Rect(self.current_width//2 - int(100 * self.scale_factor), 
                                      self.current_height//2 - int(30 * self.scale_factor), 
                                      int(200 * self.scale_factor), 
                                      int(40 * self.scale_factor))
        pygame.draw.rect(self.screen, WHITE, music_button_rect)
        self.screen.blit(music_surf, (music_button_rect.centerx - music_surf.get_width()//2,
                                    music_button_rect.centery - music_surf.get_height()//2))

        fullscreen_text = f"Fullscreen: {'ON' if self.fullscreen_enabled else 'OFF'}"
        fullscreen_surf = scaled_font.render(fullscreen_text, True, BLACK)
        fullscreen_button_rect = pygame.Rect(self.current_width//2 - int(100 * self.scale_factor), 
                                          self.current_height//2 + int(30 * self.scale_factor), 
                                          int(200 * self.scale_factor), 
                                          int(40 * self.scale_factor))
        pygame.draw.rect(self.screen, WHITE, fullscreen_button_rect)
        self.screen.blit(fullscreen_surf, (fullscreen_button_rect.centerx - fullscreen_surf.get_width()//2,
                                        fullscreen_button_rect.centery - fullscreen_surf.get_height()//2))
        
    def get_sprite(self, sheet, col, row):
        # Assuming the cards sheet has 32x48 sprites
        rect = pygame.Rect(col * 32, row * 48, 32, 48)
        image = pygame.Surface(rect.size, pygame.SRCALPHA)
        image.blit(sheet, (0, 0), rect)
        return pygame.transform.scale(image, (CARD_WIDTH, CARD_HEIGHT))
        
    def create_cards(self, pattern):
        cards = []
        for i, card_type in enumerate(pattern["cards"]):
            cards.append(Card(i, card_type, pattern["cardBackgroundColor"], self))  # Pass 'self' (the game instance)
        return cards
        
    def persist_pattern_index(self, index):
        try:
            with open("save_game.json", "w") as f:
                json.dump({"index": index}, f)
        except Exception as e:
            print(f"Could not persist pattern index: {e}")
            
    def retrieve_pattern_index(self):
        try:
            if os.path.exists("save_game.json"):
                with open("save_game.json", "r") as f:
                    data = json.load(f)
                    return data.get("index", 0)
        except Exception as e:
            print(f"Could not retrieve pattern index: {e}")
        return 0
        
    def submit_score(self, pattern_name, current_moves, current_time):
        try:
            scores = self.read_high_scores()
            pattern_score = scores.get(pattern_name, {"moves": float('inf'), "time": float('inf')})
            
            if current_moves < pattern_score["moves"]:
                pattern_score["moves"] = current_moves
                
            if current_time < pattern_score["time"] and current_time > 0:
                pattern_score["time"] = current_time
                
            scores[pattern_name] = pattern_score
            self.write_high_scores(scores)
            
            self.best_moves = str(pattern_score["moves"])
            self.best_time = str(pattern_score["time"])
            
        except Exception as e:
            print(f"Could not submit score: {e}")
            self.best_moves = "TBD"
            self.best_time = "TBD"
            
    def read_high_scores(self):
        default_scores = {
            "1": {"moves": float('inf'), "time": float('inf')},
            "2": {"moves": float('inf'), "time": float('inf')},
            "3": {"moves": float('inf'), "time": float('inf')},
            "4": {"moves": float('inf'), "time": float('inf')},
            "5": {"moves": float('inf'), "time": float('inf')},
            "6": {"moves": float('inf'), "time": float('inf')},
            "7": {"moves": float('inf'), "time": float('inf')},
            "8": {"moves": float('inf'), "time": float('inf')}
        }
        
        try:
            if os.path.exists("high_scores.json"):
                with open("high_scores.json", "r") as f:
                    return json.load(f)
            else:
                self.write_high_scores(default_scores)
                return default_scores
        except Exception as e:
            print(f"Could not read high scores: {e}")
            return default_scores
            
    def write_high_scores(self, scores):
        try:
            with open("high_scores.json", "w") as f:
                json.dump(scores, f)
        except Exception as e:
            print(f"Could not write high scores: {e}")
            
    def reset_scores(self):
        try:
            if os.path.exists("high_scores.json"):
                os.remove("high_scores.json")
            self.scores_were_reset = True
        except Exception as e:
            print(f"Could not reset scores: {e}")
            
    def handle_pattern_completed(self):
        self.puzzle["end_time"] = time.time()
        self.game_state = GameState.PATTERN_COMPLETED
        self.end_screen_visible = True
        self.end_screen_animation_start = pygame.time.get_ticks()
        
        # Schedule reveal animations
        self.pending_actions.append({"time": pygame.time.get_ticks() + END_REVEAL_MUSIC_DELAY, "action": lambda: self.sounds["clear"].play()})
        self.pending_actions.append({"time": pygame.time.get_ticks() + END_REVEAL_MOVES_DELAY, "action": lambda: setattr(self, "moves_visible", True)})
        self.pending_actions.append({"time": pygame.time.get_ticks() + END_REVEAL_TIME_DELAY, "action": lambda: setattr(self, "time_visible", True)})
        self.pending_actions.append({"time": pygame.time.get_ticks() + END_REVEAL_BEST_DELAY, "action": lambda: setattr(self, "best_visible", True)})
        
        # Submit score
        seconds_elapsed = int(self.puzzle["end_time"] - self.puzzle["start_time"])
        self.submit_score(self.puzzle["pattern"]["name"], self.puzzle["moves"], seconds_elapsed)
        
    def handle_move(self):
        if self.puzzle["start_time"] == 0:
            self.puzzle["start_time"] = time.time()
        self.puzzle["moves"] += 1
        
    def handle_continue(self):
        self.current_pattern_index += 1
        if self.current_pattern_index >= len(patterns):
            self.game_state = GameState.ALL_PATTERNS_COMPLETED
            self.credits_screen_visible = True
            self.end_screen_visible = False
            self.sounds["game_over"].play()
        else:
            self.puzzle = {
                "pattern": patterns[self.current_pattern_index],
                "moves": 0,
                "start_time": 0,
                "end_time": 0
            }
            self.persist_pattern_index(self.current_pattern_index)
            self.game_state = GameState.IN_PLAY
            self.end_screen_visible = False
            self.moves_visible = False
            self.time_visible = False
            self.best_visible = False
            self.cards = self.create_cards(self.puzzle["pattern"])
            
            # Reposition cards
            grid_width = GRID_COLS * CARD_WIDTH + (GRID_COLS - 1) * GRID_PADDING
            grid_height = GRID_ROWS * CARD_HEIGHT + (GRID_ROWS - 1) * GRID_PADDING
            grid_x = (WINDOW_WIDTH - grid_width) // 2
            grid_y = (WINDOW_HEIGHT - grid_height) // 2
            
            for i, card in enumerate(self.cards):
                row = i // GRID_COLS
                col = i % GRID_COLS
                x = grid_x + col * (CARD_WIDTH + GRID_PADDING)
                y = grid_y + row * (CARD_HEIGHT + GRID_PADDING)
                card.rect = pygame.Rect(x, y, CARD_WIDTH, CARD_HEIGHT)
                
            self.other_card_key = None
            self.pair_to_hide = (None, None)
            
    def handle_play_again(self):
        self.current_pattern_index = -1
        self.handle_continue()
        self.credits_screen_visible = False
        
    def flip_card(self, key):
        if self.game_state != GameState.IN_PLAY:
            return
            
        card = self.cards[key]
        if card.visible or card.matched or card.flipping_back:
            return
            
        self.handle_move()
        self.sounds["select"].play()
        
        # Start flipping animation
        card.start_flip('forward')
        
        if self.other_card_key is None:
            self.other_card_key = key
        else:
            card_a = self.cards[self.other_card_key]
            card_b = self.cards[key]
            
            # Check if cards match
            if card_a.card_type == card_b.card_type:
                # Mark cards as matched
                card_a.matched = True
                card_b.matched = True
                
                # Play sound based on card type
                sound_delay = OUTCOME_SOUND_DELAY
                if card_a.card_type in [CardType.COINS10, CardType.COINS20]:
                    self.pending_actions.append({"time": pygame.time.get_ticks() + sound_delay, "action": lambda: self.sounds["coin"].play()})
                elif card_a.card_type == CardType.ONEUP:
                    self.pending_actions.append({"time": pygame.time.get_ticks() + sound_delay, "action": lambda: self.sounds["oneup"].play()})
                else:
                    self.pending_actions.append({"time": pygame.time.get_ticks() + sound_delay, "action": lambda: self.sounds["match_correct"].play()})
                
                # Check for win condition
                if all(card.matched for card in self.cards):
                    self.pending_actions.append({"time": pygame.time.get_ticks() + OUTCOME_SOUND_DELAY + 150, "action": self.handle_pattern_completed})
            else:
                # Mark cards for flipping back
                card_a.flipping_back = True
                card_b.flipping_back = True
                
                # Schedule incorrect sound
                sound_delay = OUTCOME_SOUND_DELAY
                self.pending_actions.append({"time": pygame.time.get_ticks() + sound_delay, "action": lambda: self.sounds["match_incorrect"].play()})
                
                # Schedule flipping back
                flip_delay = OUTCOME_FLIP_BACK_DELAY
                self.pending_actions.append({
                    "time": pygame.time.get_ticks() + flip_delay,
                    "action": lambda: self.flip_back_cards(card_a.key, card_b.key)
                })
                
            self.other_card_key = None
            
    def flip_back_cards(self, key1, key2):
        card1 = self.cards[key1]
        card2 = self.cards[key2]
        
        card1.start_flip('backward')
        card2.start_flip('backward')
        
        card1.flipping_back = False
        card2.flipping_back = False
            
    def check_win_condition(self):
        if all(card.matched for card in self.cards):
            self.handle_pattern_completed()
            
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False

            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.menu_active = not self.menu_active
                elif event.key == pygame.K_f:
                    self.toggle_fullscreen()

            elif event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:  # Left click
                    mouse_pos = pygame.mouse.get_pos()
                    
                    if self.menu_active:
                        self.handle_menu_click(mouse_pos)
                    elif self.game_state == GameState.IN_PLAY:
                        for card in self.cards:
                            if card.rect.collidepoint(mouse_pos):
                                self.flip_card(card.key)
                                break
                    elif self.end_screen_visible and self.best_visible:
                        button_rect = pygame.Rect(WINDOW_WIDTH//2 - 70, WINDOW_HEIGHT//2 + 80, 140, 40)
                        if button_rect.collidepoint(mouse_pos):
                            self.sounds["clear"].stop()
                            self.handle_continue()
                    elif self.credits_screen_visible:
                        play_again_rect = pygame.Rect(WINDOW_WIDTH//2 - 70, WINDOW_HEIGHT//2 - 20, 140, 40)
                        reset_scores_rect = pygame.Rect(WINDOW_WIDTH//2 - 70, WINDOW_HEIGHT//2 + 40, 140, 40)
                        if play_again_rect.collidepoint(mouse_pos):
                            self.sounds["game_over"].stop()
                            self.handle_play_again()
                        elif reset_scores_rect.collidepoint(mouse_pos) and not self.scores_were_reset:
                            self.reset_scores()

            elif event.type == pygame.MOUSEMOTION:
                if not self.menu_active and self.game_state == GameState.IN_PLAY:
                    mouse_pos = pygame.mouse.get_pos()
                    self.selected_card = None
                    for card in self.cards:
                        if card.rect.collidepoint(mouse_pos) and not card.visible and not card.matched:
                            self.selected_card = card
                            break
                            
    def update(self,):
        current_time = pygame.time.get_ticks()
        
        # Process pending actions
        remaining_actions = []
        for action in self.pending_actions:
            if current_time >= action["time"]:
                action["action"]()
            else:
                remaining_actions.append(action)
        self.pending_actions = remaining_actions
        
        # Update cards (animations etc.)
        for card in self.cards:
            card.update(current_time)
            
    def draw(self):
        # Fill with a visible color first to ensure we're drawing
        self.screen.fill((100, 100, 100))  # Gray background for debugging
        
        # Draw background - ensure it scales properly
        scaled_bg = pygame.transform.scale(
            self.background_base,
            (self.current_width, self.current_height)
        )
        self.screen.blit(scaled_bg, (0, 0))
        
        if not self.menu_active:
            if self.game_state != GameState.ALL_PATTERNS_COMPLETED:
                for card in self.cards:
                    card.draw(self.screen, self.card_sprites, self.selector_img)
                if self.selected_card:
                    scaled_selector = pygame.transform.scale(
                        self.selector_img_base,
                        (int(CARD_WIDTH * self.scale_factor), int(CARD_HEIGHT * self.scale_factor))
                    )
                    self.screen.blit(scaled_selector, self.selected_card.rect)
            
            if self.end_screen_visible:
                self.draw_end_screen()
            
            if self.credits_screen_visible:
                self.draw_credits_screen()

        if self.menu_active:
            self.draw_menu()

        pygame.display.flip()
        
    def draw_end_screen(self):
        pattern = self.puzzle["pattern"]
        
        # Calculate animation progress
        if self.end_screen_animation_start > 0:
            elapsed = pygame.time.get_ticks() - self.end_screen_animation_start
            progress = min(elapsed / 512, 1.0)  # 512ms animation
        else:
            progress = 1.0
            
        # End screen background
        screen_width = 320
        screen_height = 240
        screen_rect = pygame.Rect(
            WINDOW_WIDTH//2 - screen_width//2,
            WINDOW_HEIGHT//2 - screen_height//2 * progress,  # Sliding animation
            screen_width,
            screen_height * progress  # Growing animation
        )
        pygame.draw.rect(self.screen, BLUE, screen_rect)
        pygame.draw.rect(self.screen, BLACK, screen_rect, 5)
        
        if progress < 0.5:  # Don't draw content until animation is half done
            return
            
        # Header
        pattern_color = pattern["cardBackgroundColor"]
        header_text = f"pattern {pattern['name']} of 8"
        text_surf = self.font.render(header_text, True, WHITE)
        self.screen.blit(text_surf, (WINDOW_WIDTH//2 - text_surf.get_width()//2, screen_rect.top + 20))

if __name__ == "__main__":
    game = CardMatchingGame()
    Card.game = game  # Set the game reference for Card class
    
    while game.running:
        current_time = pygame.time.get_ticks()
        game.handle_events()
        game.update()
        game.draw()
        game.clock.tick(60)
        
    pygame.quit()
