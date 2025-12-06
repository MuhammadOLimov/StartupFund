"""
StartupFund Settings Snippet
============================
Add these configurations to your Django settings.py

This is a configuration reference, not a complete settings file.
"""

# =============================================================================
# ADD TO INSTALLED_APPS
# =============================================================================

INSTALLED_APPS_ADDITIONS = [
    # Django REST Framework
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    
    # API Documentation
    'drf_spectacular',  # or 'drf_yasg'
    
    # Filtering
    'django_filters',
    
    # CORS (for frontend integration)
    'corsheaders',
    
    # Your app
    'startupfund',
]


# =============================================================================
# REST FRAMEWORK CONFIGURATION
# =============================================================================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    
    # Decimal handling for financial accuracy
    'COERCE_DECIMAL_TO_STRING': False,
}


# =============================================================================
# JWT CONFIGURATION
# =============================================================================

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': 'your-secret-key-here',  # Use env variable in production
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}


# =============================================================================
# CUSTOM USER MODEL
# =============================================================================

AUTH_USER_MODEL = 'startupfund.User'


# =============================================================================
# API DOCUMENTATION (drf-spectacular)
# =============================================================================

SPECTACULAR_SETTINGS = {
    'TITLE': 'StartupFund API',
    'DESCRIPTION': 'A comprehensive investment ecosystem platform API',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SCHEMA_PATH_PREFIX': '/api/v1/',
    
    # Security schemes
    'SECURITY': [{'Bearer': []}],
    'APPEND_COMPONENTS': {
        'securitySchemes': {
            'Bearer': {
                'type': 'http',
                'scheme': 'bearer',
                'bearerFormat': 'JWT',
            }
        }
    },
}


# =============================================================================
# DATABASE (PostgreSQL recommended)
# =============================================================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'startupfund_db',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
        'OPTIONS': {
            'options': '-c default_transaction_isolation=read\ committed'
        }
    }
}


# =============================================================================
# FILE UPLOADS
# =============================================================================

MEDIA_URL = '/media/'
MEDIA_ROOT = 'media/'

# Max upload size (10MB for pitch decks)
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024


# =============================================================================
# CORS CONFIGURATION (for frontend)
# =============================================================================

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
