"""
StartupFund Views
=================
ViewSets with role-based access control and business logic.
"""

from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Q
from django.utils import timezone
from decimal import Decimal
import uuid

from .models import (
    User, InvestorProfile, EntrepreneurProfile,
    Startup, TeamMember, StartupObligation,
    InvestmentOffer, PlatformTransaction
)
from .serializers import (
    UserSerializer, InvestorRegistrationSerializer, EntrepreneurRegistrationSerializer,
    InvestorProfileSerializer, EntrepreneurProfileSerializer,
    StartupListSerializer, StartupDetailSerializer, StartupCreateUpdateSerializer,
    TeamMemberSerializer, StartupObligationSerializer,
    InvestmentOfferCreateSerializer, InvestmentOfferListSerializer,
    InvestmentOfferDetailSerializer, InvestmentOfferResponseSerializer,
    PlatformTransactionSerializer,
    EntrepreneurDashboardSerializer, InvestorDashboardSerializer
)
from .permissions import (
    IsInvestor, IsEntrepreneur, IsStartupOwner,
    IsOfferOwnerOrStartupOwner, IsTeamMemberOfStartup, IsVerifiedInvestor
)


# =============================================================================
# AUTHENTICATION VIEWS
# =============================================================================

class InvestorRegistrationView(generics.CreateAPIView):
    """
    POST /api/v1/auth/register/investor/
    Register a new investor with profile.
    WHY: Separate endpoint captures investor-specific data and initiates
    accreditation verification flow.
    """
    
    permission_classes = [AllowAny]
    serializer_class = InvestorRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'Investor registration successful. Please verify your email and complete accreditation.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class EntrepreneurRegistrationView(generics.CreateAPIView):
    """
    POST /api/v1/auth/register/entrepreneur/
    Register a new entrepreneur with profile.
    WHY: Captures track record upfront for credibility scoring.
    """
    
    permission_classes = [AllowAny]
    serializer_class = EntrepreneurRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'Entrepreneur registration successful. Please verify your email.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    GET/PUT /api/v1/auth/profile/
    View and update current user profile.
    """
    
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


# =============================================================================
# ENTREPRENEUR PORTAL VIEWS
# =============================================================================

class EntrepreneurStartupViewSet(viewsets.ModelViewSet):
    """
    /api/v1/portal/startups/
    Full CRUD for entrepreneur's startups.
    WHY: Complete startup management in single viewset.
    """
    
    permission_classes = [IsAuthenticated, IsEntrepreneur]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'funding_raised', 'valuation']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return StartupListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return StartupCreateUpdateSerializer
        return StartupDetailSerializer
    
    def get_queryset(self):
        """Return only startups owned by the current entrepreneur."""
        return Startup.objects.filter(
            founder=self.request.user
        ).prefetch_related('team_members', 'obligations')
    
    def perform_create(self, serializer):
        """Automatically set founder to current user."""
        serializer.save(founder=self.request.user)
    
    @action(detail=True, methods=['post'])
    def submit_for_review(self, request, pk=None):
        """
        POST /api/v1/portal/startups/{id}/submit_for_review/
        Submit startup for platform review before publishing.
        """
        startup = self.get_object()
        
        if startup.status != Startup.Status.DRAFT:
            return Response(
                {'error': 'Only draft startups can be submitted for review.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validation checks
        errors = []
        if not startup.description:
            errors.append('Description is required.')
        if not startup.team_members.exists():
            errors.append('At least one team member is required.')
        if not startup.obligations.exists():
            errors.append('At least one milestone/obligation is required.')
        if startup.funding_goal <= 0:
            errors.append('Funding goal must be set.')
        
        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        
        startup.status = Startup.Status.UNDER_REVIEW
        startup.save()
        
        return Response({
            'message': 'Startup submitted for review.',
            'startup': StartupDetailSerializer(startup).data
        })
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """
        POST /api/v1/portal/startups/{id}/publish/
        Publish startup (admin action in production, simplified here).
        """
        startup = self.get_object()
        
        if startup.status not in [Startup.Status.UNDER_REVIEW, Startup.Status.DRAFT]:
            return Response(
                {'error': 'Startup cannot be published from current status.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        startup.status = Startup.Status.PUBLISHED
        startup.published_at = timezone.now()
        startup.save()
        
        return Response({
            'message': 'Startup published successfully.',
            'startup': StartupDetailSerializer(startup).data
        })


class EntrepreneurTeamViewSet(viewsets.ModelViewSet):
    """
    /api/v1/portal/startups/{startup_id}/team/
    Manage team members for a startup.
    WHY: Team dynamics are crucial for investor confidence.
    """
    
    permission_classes = [IsAuthenticated, IsEntrepreneur, IsTeamMemberOfStartup]
    serializer_class = TeamMemberSerializer
    
    def get_queryset(self):
        startup_id = self.kwargs.get('startup_pk')
        return TeamMember.objects.filter(
            startup_id=startup_id,
            startup__founder=self.request.user
        )
    
    def perform_create(self, serializer):
        startup_id = self.kwargs.get('startup_pk')
        startup = Startup.objects.get(
            id=startup_id,
            founder=self.request.user
        )
        serializer.save(startup=startup)


class EntrepreneurObligationViewSet(viewsets.ModelViewSet):
    """
    /api/v1/portal/startups/{startup_id}/milestones/
    Manage milestones/roadmap for a startup.
    WHY: Demonstrates financial discipline and enables tranche-based funding.
    """
    
    permission_classes = [IsAuthenticated, IsEntrepreneur]
    serializer_class = StartupObligationSerializer
    
    def get_queryset(self):
        startup_id = self.kwargs.get('startup_pk')
        return StartupObligation.objects.filter(
            startup_id=startup_id,
            startup__founder=self.request.user
        )
    
    def perform_create(self, serializer):
        startup_id = self.kwargs.get('startup_pk')
        startup = Startup.objects.get(
            id=startup_id,
            founder=self.request.user
        )
        serializer.save(startup=startup)
    
    @action(detail=True, methods=['post'])
    def mark_complete(self, request, startup_pk=None, pk=None):
        """
        POST /api/v1/portal/startups/{startup_id}/milestones/{id}/mark_complete/
        Mark a milestone as completed with proof.
        """
        obligation = self.get_object()
        completion_proof = request.data.get('completion_proof', '')
        
        if not completion_proof:
            return Response(
                {'error': 'Completion proof is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        obligation.status = StartupObligation.Status.COMPLETED
        obligation.completion_proof = completion_proof
        obligation.completed_at = timezone.now()
        obligation.save()
        
        return Response({
            'message': 'Milestone marked as complete.',
            'obligation': StartupObligationSerializer(obligation).data
        })


class EntrepreneurOfferViewSet(viewsets.ReadOnlyModelViewSet):
    """
    /api/v1/portal/offers/
    View and respond to investment offers.
    WHY: Central inbox for founder to manage investor interest.
    """
    
    permission_classes = [IsAuthenticated, IsEntrepreneur]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return InvestmentOfferListSerializer
        return InvestmentOfferDetailSerializer
    
    def get_queryset(self):
        """Return offers for all startups owned by the entrepreneur."""
        return InvestmentOffer.objects.filter(
            startup__founder=self.request.user
        ).select_related('investor', 'startup')
    
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        """
        POST /api/v1/portal/offers/{id}/respond/
        Accept, reject, or negotiate an offer.
        WHY: Controlled state machine for offer lifecycle.
        """
        offer = self.get_object()
        serializer = InvestmentOfferResponseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        action = serializer.validated_data['action']
        message = serializer.validated_data.get('response_message', '')
        
        if offer.status != InvestmentOffer.Status.PENDING:
            return Response(
                {'error': 'This offer has already been responded to.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        offer.response_message = message
        offer.responded_at = timezone.now()
        
        if action == 'accept':
            offer.status = InvestmentOffer.Status.ACCEPTED
            
            # Create platform transaction
            transaction = PlatformTransaction.objects.create(
                investment_offer=offer,
                total_amount=offer.amount,
                platform_fee_percentage=Decimal('5.00'),
                reference_id=f'TXN-{uuid.uuid4().hex[:12].upper()}'
            )
            
            # Update startup funding
            startup = offer.startup
            startup.funding_raised += offer.amount
            if startup.is_fully_funded:
                startup.status = Startup.Status.FUNDED
            startup.save()
            
            # Update investor stats
            investor_profile = offer.investor.investor_profile
            investor_profile.total_investments += 1
            investor_profile.save()
            
            return Response({
                'message': 'Offer accepted! Transaction created.',
                'offer': InvestmentOfferDetailSerializer(offer).data,
                'transaction': PlatformTransactionSerializer(transaction).data
            })
        
        elif action == 'reject':
            offer.status = InvestmentOffer.Status.REJECTED
        
        elif action == 'negotiate':
            offer.status = InvestmentOffer.Status.NEGOTIATING
        
        offer.save()
        
        return Response({
            'message': f'Offer {action}ed.',
            'offer': InvestmentOfferDetailSerializer(offer).data
        })


class EntrepreneurDashboardView(generics.GenericAPIView):
    """
    GET /api/v1/portal/dashboard/
    Aggregated dashboard for entrepreneurs.
    WHY: Single API call for complete founder overview.
    """
    
    permission_classes = [IsAuthenticated, IsEntrepreneur]
    serializer_class = EntrepreneurDashboardSerializer
    
    def get(self, request):
        startups = Startup.objects.filter(founder=request.user)
        
        data = {
            'total_startups': startups.count(),
            'total_funding_raised': startups.aggregate(
                total=Sum('funding_raised')
            )['total'] or Decimal('0.00'),
            'pending_offers': InvestmentOffer.objects.filter(
                startup__founder=request.user,
                status=InvestmentOffer.Status.PENDING
            ).count(),
            'total_investor_views': startups.aggregate(
                total=Sum('view_count')
            )['total'] or 0,
            'startups': startups
        }
        
        serializer = self.get_serializer(data)
        return Response(serializer.data)


# =============================================================================
# INVESTOR PORTAL VIEWS
# =============================================================================

class InvestorStartupBrowseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    /api/v1/invest/startups/
    Browse and filter published startups.
    WHY: Discovery engine for investor matching.
    """
    
    permission_classes = [IsAuthenticated, IsInvestor]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['title', 'description', 'slogan']
    filterset_fields = ['industry_category', 'stage']
    ordering_fields = ['created_at', 'valuation', 'funding_raised', 'view_count']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return StartupListSerializer
        return StartupDetailSerializer
    
    def get_queryset(self):
        """Return only published startups with filtering."""
        queryset = Startup.objects.filter(
            status=Startup.Status.PUBLISHED
        ).prefetch_related('team_members', 'obligations')
        
        # Custom filters
        min_val = self.request.query_params.get('min_valuation')
        max_val = self.request.query_params.get('max_valuation')
        min_equity = self.request.query_params.get('min_equity')
        max_equity = self.request.query_params.get('max_equity')
        
        if min_val:
            queryset = queryset.filter(valuation__gte=Decimal(min_val))
        if max_val:
            queryset = queryset.filter(valuation__lte=Decimal(max_val))
        if min_equity:
            queryset = queryset.filter(equity_offered__gte=Decimal(min_equity))
        if max_equity:
            queryset = queryset.filter(equity_offered__lte=Decimal(max_equity))
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """Increment view count on detail view."""
        instance = self.get_object()
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class InvestorOfferViewSet(viewsets.ModelViewSet):
    """
    /api/v1/invest/offers/
    Create and manage investment offers.
    WHY: Full offer lifecycle management for investors.
    """
    
    permission_classes = [IsAuthenticated, IsInvestor, IsOfferOwnerOrStartupOwner]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InvestmentOfferCreateSerializer
        if self.action == 'list':
            return InvestmentOfferListSerializer
        return InvestmentOfferDetailSerializer
    
    def get_queryset(self):
        """Return offers made by the current investor."""
        return InvestmentOffer.objects.filter(
            investor=self.request.user
        ).select_related('startup')
    
    def perform_create(self, serializer):
        """Set investor to current user on creation."""
        serializer.save(investor=self.request.user)
    
    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        """
        POST /api/v1/invest/offers/{id}/withdraw/
        Withdraw a pending offer.
        """
        offer = self.get_object()
        
        if offer.status not in [InvestmentOffer.Status.PENDING, InvestmentOffer.Status.NEGOTIATING]:
            return Response(
                {'error': 'Only pending or negotiating offers can be withdrawn.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        offer.status = InvestmentOffer.Status.WITHDRAWN
        offer.save()
        
        return Response({
            'message': 'Offer withdrawn.',
            'offer': InvestmentOfferDetailSerializer(offer).data
        })


class InvestorDashboardView(generics.GenericAPIView):
    """
    GET /api/v1/invest/dashboard/
    Aggregated dashboard for investors.
    WHY: Portfolio performance and ROI tracking.
    """
    
    permission_classes = [IsAuthenticated, IsInvestor]
    serializer_class = InvestorDashboardSerializer
    
    def get(self, request):
        offers = InvestmentOffer.objects.filter(investor=request.user)
        accepted_offers = offers.filter(status=InvestmentOffer.Status.ACCEPTED)
        
        data = {
            'total_invested': accepted_offers.aggregate(
                total=Sum('amount')
            )['total'] or Decimal('0.00'),
            'active_investments': accepted_offers.count(),
            'pending_offers': offers.filter(
                status=InvestmentOffer.Status.PENDING
            ).count(),
            'portfolio_companies': accepted_offers.values('startup').distinct().count(),
            'offers': offers.order_by('-created_at')[:10]
        }
        
        serializer = self.get_serializer(data)
        return Response(serializer.data)


# =============================================================================
# ADMIN / PLATFORM VIEWS
# =============================================================================

class PlatformStatsView(generics.GenericAPIView):
    """
    GET /api/v1/admin/stats/
    Platform-wide statistics for admin dashboard.
    WHY: Demonstrates platform's business model viability.
    """
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'ADMIN':
            return Response(
                {'error': 'Admin access required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        total_revenue = PlatformTransaction.calculate_total_platform_revenue()
        
        return Response({
            'total_users': User.objects.count(),
            'total_investors': User.objects.filter(role='INVESTOR').count(),
            'total_entrepreneurs': User.objects.filter(role='ENTREPRENEUR').count(),
            'total_startups': Startup.objects.count(),
            'published_startups': Startup.objects.filter(
                status=Startup.Status.PUBLISHED
            ).count(),
            'funded_startups': Startup.objects.filter(
                status=Startup.Status.FUNDED
            ).count(),
            'total_investments': InvestmentOffer.objects.filter(
                status=InvestmentOffer.Status.ACCEPTED
            ).count(),
            'total_transaction_volume': PlatformTransaction.objects.filter(
                status=PlatformTransaction.Status.COMPLETED
            ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0.00'),
            'total_platform_revenue': total_revenue,
            'platform_fee_percentage': Decimal('5.00')
        })
