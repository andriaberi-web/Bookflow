import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent  # backend/

# Runs only on this computer, never on the internet.
SECRET_KEY = "local-only"
DEBUG = True
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "converter",
]

MIDDLEWARE = [
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "bookflow.urls"
WSGI_APPLICATION = "bookflow.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

TIME_ZONE = "UTC"
USE_TZ = True

# Uploaded PDFs and converted EPUBs
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Largest PDF the converter accepts, in megabytes and in pages
MAX_PDF_SIZE_MB = int(os.getenv("MAX_PDF_SIZE_MB", "500"))
MAX_PDF_PAGES = int(os.getenv("MAX_PDF_PAGES", "5000"))

# A long book's text, as the editor saves it, is over Django's 2.5 MB default.
DATA_UPLOAD_MAX_MEMORY_SIZE = 200 * 1024 * 1024

# PDFs and images are opened in a process of their own (converter/isolated.py), which
# may take this much memory, in megabytes, and this many seconds.
CONVERTER_LIMITS = {
    "read":  {"memory_mb": 1536, "seconds": 300},   # reading a book
    "check": {"memory_mb": 512, "seconds": 30},     # counting an upload's pages
    "page":  {"memory_mb": 512, "seconds": 30},     # a page for the editor's preview
    "cover": {"memory_mb": 512, "seconds": 15},     # an uploaded cover image
}
# The largest page image the editor's preview gets, in pixels: 1600 wide for a usual page
MAX_PAGE_PIXELS = 8_000_000

# Read uploaded books in a background thread; tests turn this off to read right away.
CONVERTER_BACKGROUND = True

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "loggers": {
        "converter": {"handlers": ["console"], "level": "INFO"},
        "django.request": {"handlers": ["console"], "level": "ERROR", "propagate": False},
    },
}
