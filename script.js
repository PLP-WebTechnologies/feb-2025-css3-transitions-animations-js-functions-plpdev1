/**
 * Theme Switcher and Animation Control
 * This script handles theme switching, animations, and localStorage for user preferences
 */

// Utility functions for localStorage
const storageManager = {
    /**
     * Save data to localStorage
     * @param {string} key - Storage key name
     * @param {any} value - Value to store
     */
    saveData: function(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    /**
     * Retrieve data from localStorage
     * @param {string} key - Storage key name
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} - Retrieved value or default
     */
    getData: function(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            if (value === null) {
                return defaultValue;
            }
            return JSON.parse(value);
        } catch (error) {
            console.error('Error getting data from localStorage:', error);
            return defaultValue;
        }
    }
};

// Animation controller
const animationController = {
    element: null,
    currentAnimation: null,
    
    /**
     * Initialize the animation controller
     * @param {HTMLElement} element - Element to animate
     */
    init: function(element) {
        this.element = element;
    },
    
    /**
     * Start an animation on the element
     * @param {string} type - Animation type (rotate, bounce, pulse)
     * @param {string} speed - Animation speed (slow, medium, fast)
     */
    startAnimation: function(type, speed) {
        // Remove any existing animations
        this.stopAnimation();
        
        // Add new animation classes
        this.element.classList.add(`${type}-animation`);
        this.element.classList.add(speed);
        
        this.currentAnimation = {
            type: type,
            speed: speed
        };
    },
    
    /**
     * Stop the current animation
     */
    stopAnimation: function() {
        if (!this.element) return;
        
        // Remove all animation classes
        this.element.classList.remove('rotate-animation', 'bounce-animation', 'pulse-animation');
        this.element.classList.remove('slow', 'medium', 'fast');
        this.currentAnimation = null;
    }
};

// Theme controller
const themeController = {
    isDarkTheme: false,
    
    /**
     * Initialize theme based on saved preference
     */
    init: function() {
        // Get saved theme or use system preference
        const savedTheme = storageManager.getData('theme', null);
        
        if (savedTheme !== null) {
            this.isDarkTheme = savedTheme === 'dark';
        } else {
            // Use system preference as fallback
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDarkTheme = prefersDark;
        }
        
        // Apply initial theme
        this.applyTheme();
    },
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme: function() {
        this.isDarkTheme = !this.isDarkTheme;
        this.applyTheme();
        
        // Save theme preference
        storageManager.saveData('theme', this.isDarkTheme ? 'dark' : 'light');
    },
    
    /**
     * Apply the current theme to the document
     */
    applyTheme: function() {
        if (this.isDarkTheme) {
            document.body.classList.add('dark-theme');
            document.getElementById('theme-toggle-btn').querySelector('.toggle-icon').textContent = '☀️';
        } else {
            document.body.classList.remove('dark-theme');
            document.getElementById('theme-toggle-btn').querySelector('.toggle-icon').textContent = '🌙';
        }
    }
};

// User preferences controller
const preferencesController = {
    /**
     * Save current preferences to localStorage
     */
    savePreferences: function() {
        const animationType = document.getElementById('animation-type').value;
        const animationSpeed = document.getElementById('animation-speed').value;
        
        const preferences = {
            animationType: animationType,
            animationSpeed: animationSpeed
        };
        
        const success = storageManager.saveData('preferences', preferences);
        
        if (success) {
            // Visual feedback on save
            const saveButton = document.getElementById('save-preferences');
            saveButton.textContent = 'Saved!';
            saveButton.classList.add('save-success');
            
            setTimeout(() => {
                saveButton.textContent = 'Save Preferences';
                saveButton.classList.remove('save-success');
            }, 1500);
        }
        
        // Apply the new preferences to current animation if it's active
        if (animationController.currentAnimation) {
            animationController.startAnimation(animationType, animationSpeed);
        }
    },
    
    /**
     * Load saved preferences from localStorage
     */
    loadPreferences: function() {
        const defaultPreferences = {
            animationType: 'bounce',
            animationSpeed: 'medium'
        };
        
        const preferences = storageManager.getData('preferences', defaultPreferences);
        
        // Set form values
        document.getElementById('animation-type').value = preferences.animationType;
        document.getElementById('animation-speed').value = preferences.animationSpeed;
        
        return preferences;
    }
};

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    themeController.init();
    
    // Initialize animation controller
    const animatedElement = document.querySelector('.animated-element');
    animationController.init(animatedElement);
    
    // Load saved preferences
    const preferences = preferencesController.loadPreferences();
    
    // Event listeners
    document.getElementById('theme-toggle-btn').addEventListener('click', function() {
        themeController.toggleTheme();
    });
    
    document.getElementById('start-animation').addEventListener('click', function() {
        const animationType = document.getElementById('animation-type').value;
        const animationSpeed = document.getElementById('animation-speed').value;
        
        animationController.startAnimation(animationType, animationSpeed);
    });
    
    document.getElementById('reset-animation').addEventListener('click', function() {
        animationController.stopAnimation();
    });
    
    document.getElementById('save-preferences').addEventListener('click', function() {
        preferencesController.savePreferences();
    });
});
