"""
StartupFund URL Configuration
=============================
Properly structured routes with dual interface namespace.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers as nested_routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from .views import (
    # Auth
    InvestorRegistrationView,
    EntrepreneurRegistrationView,
    UserProfileView,
    # Entrepreneur Portal
    EntrepreneurStartupViewSet,
    EntrepreneurTeamViewSet,
    EntrepreneurObligationViewSet,
    EntrepreneurOfferViewSet,
    EntrepreneurDashboardView,
    # Investor Portal
    InvestorStartupBrowseViewSet,
    InvestorOfferViewSet,
    InvestorDashboardView,
    # Admin
    PlatformStatsView
)


# =============================================================================
# AUTHENTICATION ROUTES
# =============================================================================

auth_urlpatterns = [
    # JWT Token endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Registration endpoints (separate for each role)
    path('register/investor/', InvestorRegistrationView.as_view(), name='register_investor'),
    path('register/entrepreneur/', EntrepreneurRegistrationView.as_view(), name='register_entrepreneur'),
    
    # Profile management
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]


# =============================================================================
# ENTREPRENEUR PORTAL ROUTES
# =============================================================================

# Main router for entrepreneur portal
portal_router = DefaultRouter()
portal_router.register(r'startups', EntrepreneurStartupViewSet, basename='portal-startup')
portal_router.register(r'offers', EntrepreneurOfferViewSet, basename='portal-offer')

# Nested routers for startup sub-resources
startup_router = nested_routers.NestedDefaultRouter(portal_router, r'startups', lookup='startup')
startup_router.register(r'team', EntrepreneurTeamViewSet, basename='startup-team')
startup_router.register(r'milestones', EntrepreneurObligationViewSet, basename='startup-milestone')

portal_urlpatterns = [
    path('', include(portal_router.urls)),
    path('', include(startup_router.urls)),
    path('dashboard/', EntrepreneurDashboardView.as_view(), name='portal_dashboard'),
]


# =============================================================================
# INVESTOR PORTAL ROUTES
# =============================================================================

invest_router = DefaultRouter()
invest_router.register(r'startups', InvestorStartupBrowseViewSet, basename='invest-startup')
invest_router.register(r'offers', InvestorOfferViewSet, basename='invest-offer')

invest_urlpatterns = [
    path('', include(invest_router.urls)),
    path('dashboard/', InvestorDashboardView.as_view(), name='invest_dashboard'),
]


# =============================================================================
# ADMIN ROUTES
# =============================================================================

admin_urlpatterns = [
    path('stats/', PlatformStatsView.as_view(), name='platform_stats'),
]


# =============================================================================
# MAIN URL CONFIGURATION
# =============================================================================

urlpatterns = [
    # Authentication namespace
    path('api/v1/auth/', include((auth_urlpatterns, 'auth'))),
    
    # Entrepreneur portal namespace
    path('api/v1/portal/', include((portal_urlpatterns, 'portal'))),
    
    # Investor portal namespace
    path('api/v1/invest/', include((invest_urlpatterns, 'invest'))),
    
    # Admin namespace
    path('api/v1/admin/', include((admin_urlpatterns, 'admin'))),
]


"""
API ENDPOINT SUMMARY
====================

Authentication:
    POST   /api/v1/auth/token/                          - Obtain JWT token
    POST   /api/v1/auth/token/refresh/                  - Refresh JWT token
    POST   /api/v1/auth/token/verify/                   - Verify JWT token
    POST   /api/v1/auth/register/investor/              - Register as investor
    POST   /api/v1/auth/register/entrepreneur/          - Register as entrepreneur
    GET    /api/v1/auth/profile/                        - Get user profile
    PUT    /api/v1/auth/profile/                        - Update user profile

Entrepreneur Portal:
    GET    /api/v1/portal/dashboard/                    - Entrepreneur dashboard
    GET    /api/v1/portal/startups/                     - List my startups
    POST   /api/v1/portal/startups/                     - Create startup
    GET    /api/v1/portal/startups/{id}/                - Startup detail
    PUT    /api/v1/portal/startups/{id}/                - Update startup
    DELETE /api/v1/portal/startups/{id}/                - Delete startup
    POST   /api/v1/portal/startups/{id}/submit_for_review/  - Submit for review
    POST   /api/v1/portal/startups/{id}/publish/        - Publish startup
    
    GET    /api/v1/portal/startups/{id}/team/           - List team members
    POST   /api/v1/portal/startups/{id}/team/           - Add team member
    PUT    /api/v1/portal/startups/{id}/team/{mid}/     - Update team member
    DELETE /api/v1/portal/startups/{id}/team/{mid}/     - Remove team member
    
    GET    /api/v1/portal/startups/{id}/milestones/     - List milestones
    POST   /api/v1/portal/startups/{id}/milestones/     - Add milestone
    PUT    /api/v1/portal/startups/{id}/milestones/{mid}/  - Update milestone
    POST   /api/v1/portal/startups/{id}/milestones/{mid}/mark_complete/  - Complete milestone
    
    GET    /api/v1/portal/offers/                       - List received offers
    GET    /api/v1/portal/offers/{id}/                  - Offer detail
    POST   /api/v1/portal/offers/{id}/respond/          - Accept/reject offer

Investor Portal:
    GET    /api/v1/invest/dashboard/                    - Investor dashboard
    GET    /api/v1/invest/startups/                     - Browse startups
    GET    /api/v1/invest/startups/{id}/                - Startup detail
    
    GET    /api/v1/invest/offers/                       - List my offers
    POST   /api/v1/invest/offers/                       - Create investment offer
    GET    /api/v1/invest/offers/{id}/                  - Offer detail
    POST   /api/v1/invest/offers/{id}/withdraw/         - Withdraw offer

Admin:
    GET    /api/v1/admin/stats/                         - Platform statistics
"""
