import os
import sys

# Add the project root to sys.path so we can import 'backend'
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.app.main import app
