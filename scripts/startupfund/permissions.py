"""
StartupFund Custom Permissions
==============================
Role-based access control for API endpoints.
"""

from rest_framework import permissions


class IsInvestor(permissions.BasePermission):
    """
    Allow access only to authenticated investors.
    WHY: Ensures investor-only endpoints are protected.
    """
    
    message = 'Only investors can access this resource.'
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role == 'INVESTOR'
        )


class IsEntrepreneur(permissions.BasePermission):
    """
    Allow access only to authenticated entrepreneurs.
    WHY: Ensures entrepreneur-only endpoints are protected.
    """
    
    message = 'Only entrepreneurs can access this resource.'
    
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role == 'ENTREPRENEUR'
        )


class IsStartupOwner(permissions.BasePermission):
    """
    Allow access only to the startup's founder.
    WHY: Protects startup management from unauthorized access.
    """
    
    message = 'You must be the startup owner to perform this action.'
    
    def has_object_permission(self, request, view, obj):
        # Read permissions allowed for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for founder
        return obj.founder == request.user


class IsOfferOwnerOrStartupOwner(permissions.BasePermission):
    """
    Allow access to either the investor who made the offer
    or the startup founder receiving the offer.
    WHY: Both parties need access to manage the investment offer.
    """
    
    message = 'You must be the offer creator or startup owner.'
    
    def has_object_permission(self, request, view, obj):
        # Investor can view/withdraw their own offers
        if obj.investor == request.user:
            return True
        
        # Startup founder can view/respond to offers
        if obj.startup.founder == request.user:
            return True
        
        return False


class IsTeamMemberOfStartup(permissions.BasePermission):
    """
    Allow modification only by startup owner.
    WHY: Team management restricted to founders.
    """
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.startup.founder == request.user


class IsVerifiedInvestor(permissions.BasePermission):
    """
    Allow access only to verified and accredited investors.
    WHY: Regulatory compliance for investment transactions.
    """
    
    message = 'You must be a verified and accredited investor.'
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role != 'INVESTOR':
            return False
        if not hasattr(request.user, 'investor_profile'):
            return False
        return request.user.investor_profile.can_invest
