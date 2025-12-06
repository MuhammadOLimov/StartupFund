"""
StartupFund Serializers
=======================
DRF serializers with nested relationships for comprehensive API responses.
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from decimal import Decimal

from .models import (
    User, InvestorProfile, EntrepreneurProfile,
    Startup, TeamMember, StartupObligation,
    InvestmentOffer, PlatformTransaction
)


# =============================================================================
# USER & AUTHENTICATION SERIALIZERS
# =============================================================================

class InvestorProfileSerializer(serializers.ModelSerializer):
    """Serializer for investor profile details."""
    
    can_invest = serializers.ReadOnlyField()
    
    class Meta:
        model = InvestorProfile
        fields = [
            'id', 'bio', 'interests', 'investment_cap', 'portfolio_value',
            'accreditation_status', 'accreditation_verified_at',
            'total_investments', 'can_invest', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'accreditation_status', 'accreditation_verified_at',
            'total_investments', 'created_at', 'updated_at'
        ]


class EntrepreneurProfileSerializer(serializers.ModelSerializer):
    """Serializer for entrepreneur profile details."""
    
    class Meta:
        model = EntrepreneurProfile
        fields = [
            'id', 'bio', 'experience_years', 'linkedin_url', 'track_record',
            'startups_founded', 'total_funding_raised', 'created_at', 'updated_at'
        ]
        read_only_fields = ['startups_founded', 'total_funding_raised', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """
    Base user serializer with role-specific profile nesting.
    WHY: Single endpoint returns complete user context based on role.
    """
    
    investor_profile = InvestorProfileSerializer(read_only=True)
    entrepreneur_profile = EntrepreneurProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'role', 'phone_number', 'is_verified',
            'investor_profile', 'entrepreneur_profile',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['is_verified', 'created_at', 'updated_at']


class InvestorRegistrationSerializer(serializers.ModelSerializer):
    """
    Investor registration with automatic profile creation.
    WHY: Streamlined onboarding for accredited investor verification flow.
    """
    
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    # Profile fields
    investment_cap = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False, default=Decimal('0.00')
    )
    interests = serializers.ListField(
        child=serializers.CharField(), required=False, default=list
    )
    bio = serializers.CharField(required=False, allow_blank=True, default='')
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone_number',
            'investment_cap', 'interests', 'bio'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        return attrs
    
    @transaction.atomic
    def create(self, validated_data):
        # Extract profile data
        investment_cap = validated_data.pop('investment_cap', Decimal('0.00'))
        interests = validated_data.pop('interests', [])
        bio = validated_data.pop('bio', '')
        
        # Create user with investor role
        password = validated_data.pop('password')
        user = User.objects.create(
            **validated_data,
            role=User.Role.INVESTOR
        )
        user.set_password(password)
        user.save()
        
        # Create investor profile
        InvestorProfile.objects.create(
            user=user,
            investment_cap=investment_cap,
            interests=interests,
            bio=bio
        )
        
        return user


class EntrepreneurRegistrationSerializer(serializers.ModelSerializer):
    """
    Entrepreneur registration with automatic profile creation.
    WHY: Captures track record upfront for credibility assessment.
    """
    
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    # Profile fields
    experience_years = serializers.IntegerField(required=False, default=0)
    linkedin_url = serializers.URLField(required=False, allow_blank=True, default='')
    track_record = serializers.CharField(required=False, allow_blank=True, default='')
    bio = serializers.CharField(required=False, allow_blank=True, default='')
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone_number',
            'experience_years', 'linkedin_url', 'track_record', 'bio'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        return attrs
    
    @transaction.atomic
    def create(self, validated_data):
        # Extract profile data
        experience_years = validated_data.pop('experience_years', 0)
        linkedin_url = validated_data.pop('linkedin_url', '')
        track_record = validated_data.pop('track_record', '')
        bio = validated_data.pop('bio', '')
        
        # Create user with entrepreneur role
        password = validated_data.pop('password')
        user = User.objects.create(
            **validated_data,
            role=User.Role.ENTREPRENEUR
        )
        user.set_password(password)
        user.save()
        
        # Create entrepreneur profile
        EntrepreneurProfile.objects.create(
            user=user,
            experience_years=experience_years,
            linkedin_url=linkedin_url,
            track_record=track_record,
            bio=bio
        )
        
        return user


# =============================================================================
# STARTUP & TEAM SERIALIZERS
# =============================================================================

class TeamMemberSerializer(serializers.ModelSerializer):
    """
    Team member serializer for nested inclusion in Startup.
    WHY: Team dynamics visible in single API call for investor evaluation.
    """
    
    class Meta:
        model = TeamMember
        fields = [
            'id', 'name', 'role', 'bio', 'why_crucial', 'photo',
            'linkedin_url', 'email', 'equity_percentage', 'is_founder',
            'joined_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class StartupObligationSerializer(serializers.ModelSerializer):
    """
    Milestone/roadmap serializer for nested inclusion.
    WHY: Shows fund utilization plan for investor confidence.
    """
    
    class Meta:
        model = StartupObligation
        fields = [
            'id', 'title', 'description', 'deadline', 'budget_allocation',
            'status', 'completion_proof', 'completed_at',
            'funds_released', 'funds_released_at', 'order',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'funds_released', 'funds_released_at', 
            'completed_at', 'created_at', 'updated_at'
        ]


class StartupListSerializer(serializers.ModelSerializer):
    """
    Lightweight startup serializer for list views.
    WHY: Optimized for browse/filter performance in investor feed.
    """
    
    founder_name = serializers.CharField(source='founder.get_full_name', read_only=True)
    funding_progress = serializers.SerializerMethodField()
    team_size = serializers.SerializerMethodField()
    
    class Meta:
        model = Startup
        fields = [
            'id', 'title', 'slogan', 'industry_category', 'stage', 'status',
            'valuation', 'funding_goal', 'funding_raised', 'equity_offered',
            'min_ticket_size', 'logo', 'founder_name', 'funding_progress',
            'team_size', 'view_count', 'created_at'
        ]
    
    def get_funding_progress(self, obj) -> str:
        return f"{obj.calculate_funding_progress():.2f}%"
    
    def get_team_size(self, obj) -> int:
        return obj.team_members.count()


class StartupDetailSerializer(serializers.ModelSerializer):
    """
    Full startup serializer with nested team and milestones.
    WHY: Complete due diligence data in single API response for investor review.
    """
    
    founder = UserSerializer(read_only=True)
    team_members = TeamMemberSerializer(many=True, read_only=True)
    obligations = StartupObligationSerializer(many=True, read_only=True)
    funding_progress = serializers.SerializerMethodField()
    post_money_valuation = serializers.SerializerMethodField()
    remaining_funding = serializers.DecimalField(
        max_digits=15, decimal_places=2, read_only=True
    )
    is_fully_funded = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Startup
        fields = [
            'id', 'founder', 'title', 'slogan', 'description',
            # Market Data
            'industry_category', 'target_market_tam', 'target_market_sam', 'target_market_som',
            # Financials
            'valuation', 'funding_goal', 'funding_raised', 'equity_offered',
            'min_ticket_size', 'funding_progress', 'post_money_valuation',
            'remaining_funding', 'is_fully_funded',
            # Media
            'pitch_deck_file', 'demo_video_url', 'mvp_live_url', 'logo',
            # Status
            'status', 'stage', 'view_count', 'founded_date',
            # Nested
            'team_members', 'obligations',
            # Timestamps
            'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = [
            'founder', 'funding_raised', 'view_count',
            'created_at', 'updated_at', 'published_at'
        ]
    
    def get_funding_progress(self, obj) -> str:
        return f"{obj.calculate_funding_progress():.2f}%"
    
    def get_post_money_valuation(self, obj) -> Decimal:
        return obj.calculate_post_money_valuation()


class StartupCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Startup creation/update serializer for entrepreneur portal.
    WHY: Separate write serializer ensures proper validation without nested complexity.
    """
    
    class Meta:
        model = Startup
        fields = [
            'title', 'slogan', 'description',
            'industry_category', 'target_market_tam', 'target_market_sam', 'target_market_som',
            'valuation', 'funding_goal', 'equity_offered', 'min_ticket_size',
            'pitch_deck_file', 'demo_video_url', 'mvp_live_url', 'logo',
            'stage', 'founded_date'
        ]
    
    def validate_equity_offered(self, value):
        if value <= 0 or value > 100:
            raise serializers.ValidationError(
                'Equity offered must be between 0.01% and 100%.'
            )
        return value
    
    def validate_funding_goal(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                'Funding goal must be greater than zero.'
            )
        return value
    
    def validate(self, attrs):
        # Ensure TAM >= SAM >= SOM
        tam = attrs.get('target_market_tam', Decimal('0'))
        sam = attrs.get('target_market_sam', Decimal('0'))
        som = attrs.get('target_market_som', Decimal('0'))
        
        if sam > tam:
            raise serializers.ValidationError({
                'target_market_sam': 'SAM cannot exceed TAM.'
            })
        if som > sam:
            raise serializers.ValidationError({
                'target_market_som': 'SOM cannot exceed SAM.'
            })
        
        return attrs


# =============================================================================
# INVESTMENT SERIALIZERS
# =============================================================================

class InvestmentOfferCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating investment offers.
    WHY: Validates investment terms and ROI strategy completeness.
    """
    
    class Meta:
        model = InvestmentOffer
        fields = [
            'startup', 'amount', 'equity_requested', 'message',
            'roi_strategy', 'exit_strategy_description',
            'conversion_cap', 'conversion_discount',
            'revenue_share_percentage', 'revenue_share_cap',
            'expires_at'
        ]
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Investment amount must be positive.')
        return value
    
    def validate(self, attrs):
        startup = attrs.get('startup')
        amount = attrs.get('amount')
        investor = self.context['request'].user
        
        # Check startup is accepting investments
        if startup.status not in [Startup.Status.PUBLISHED]:
            raise serializers.ValidationError({
                'startup': 'This startup is not currently accepting investments.'
            })
        
        # Check minimum ticket size
        if amount < startup.min_ticket_size:
            raise serializers.ValidationError({
                'amount': f'Minimum investment is ${startup.min_ticket_size:,.2f}'
            })
        
        # Check investor has profile and can invest
        if not hasattr(investor, 'investor_profile'):
            raise serializers.ValidationError(
                'You must have an investor profile to make offers.'
            )
        
        # Validate ROI strategy specific fields
        roi_strategy = attrs.get('roi_strategy')
        if roi_strategy == InvestmentOffer.ROIStrategy.CONVERTIBLE_NOTE:
            if not attrs.get('conversion_cap'):
                raise serializers.ValidationError({
                    'conversion_cap': 'Required for convertible note investments.'
                })
        elif roi_strategy == InvestmentOffer.ROIStrategy.REVENUE_SHARE:
            if not attrs.get('revenue_share_percentage'):
                raise serializers.ValidationError({
                    'revenue_share_percentage': 'Required for revenue share investments.'
                })
        
        return attrs


class InvestmentOfferListSerializer(serializers.ModelSerializer):
    """
    Lightweight offer serializer for list views.
    """
    
    investor_name = serializers.CharField(source='investor.get_full_name', read_only=True)
    startup_title = serializers.CharField(source='startup.title', read_only=True)
    implied_valuation = serializers.SerializerMethodField()
    
    class Meta:
        model = InvestmentOffer
        fields = [
            'id', 'investor_name', 'startup_title', 'amount', 'equity_requested',
            'roi_strategy', 'status', 'implied_valuation', 'created_at', 'expires_at'
        ]
    
    def get_implied_valuation(self, obj) -> Decimal:
        return obj.calculate_implied_valuation()


class InvestmentOfferDetailSerializer(serializers.ModelSerializer):
    """
    Full investment offer details with investor info.
    WHY: Complete offer terms for entrepreneur evaluation.
    """
    
    investor = UserSerializer(read_only=True)
    startup = StartupListSerializer(read_only=True)
    implied_valuation = serializers.SerializerMethodField()
    
    class Meta:
        model = InvestmentOffer
        fields = [
            'id', 'investor', 'startup', 'amount', 'equity_requested', 'message',
            'roi_strategy', 'exit_strategy_description',
            'conversion_cap', 'conversion_discount',
            'revenue_share_percentage', 'revenue_share_cap',
            'status', 'responded_at', 'response_message',
            'implied_valuation', 'created_at', 'updated_at', 'expires_at'
        ]
    
    def get_implied_valuation(self, obj) -> Decimal:
        return obj.calculate_implied_valuation()


class InvestmentOfferResponseSerializer(serializers.Serializer):
    """
    Serializer for accepting/rejecting offers.
    WHY: Controlled state transitions with required messaging.
    """
    
    action = serializers.ChoiceField(choices=['accept', 'reject', 'negotiate'])
    response_message = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        if attrs['action'] == 'reject' and not attrs.get('response_message'):
            raise serializers.ValidationError({
                'response_message': 'Please provide a reason for rejection.'
            })
        return attrs


# =============================================================================
# TRANSACTION & DASHBOARD SERIALIZERS
# =============================================================================

class PlatformTransactionSerializer(serializers.ModelSerializer):
    """
    Transaction record serializer.
    WHY: Transparency in fee structure for regulatory compliance.
    """
    
    offer_details = InvestmentOfferListSerializer(source='investment_offer', read_only=True)
    
    class Meta:
        model = PlatformTransaction
        fields = [
            'id', 'offer_details', 'total_amount', 'platform_fee_percentage',
            'platform_revenue', 'net_startup_amount', 'transaction_type',
            'status', 'reference_id', 'created_at', 'processed_at', 'completed_at'
        ]


class EntrepreneurDashboardSerializer(serializers.Serializer):
    """
    Aggregated dashboard data for entrepreneurs.
    WHY: Single API call for complete founder overview.
    """
    
    total_startups = serializers.IntegerField()
    total_funding_raised = serializers.DecimalField(max_digits=15, decimal_places=2)
    pending_offers = serializers.IntegerField()
    total_investor_views = serializers.IntegerField()
    startups = StartupListSerializer(many=True)


class InvestorDashboardSerializer(serializers.Serializer):
    """
    Aggregated dashboard data for investors.
    WHY: Portfolio performance and ROI tracking in single call.
    """
    
    total_invested = serializers.DecimalField(max_digits=15, decimal_places=2)
    active_investments = serializers.IntegerField()
    pending_offers = serializers.IntegerField()
    portfolio_companies = serializers.IntegerField()
    offers = InvestmentOfferListSerializer(many=True)


class StartupSearchFilterSerializer(serializers.Serializer):
    """
    Search/filter parameters for startup browsing.
    WHY: Structured filtering for investor discovery.
    """
    
    industry = serializers.ChoiceField(choices=Startup.INDUSTRY_CHOICES, required=False)
    stage = serializers.ChoiceField(choices=Startup.Stage.choices, required=False)
    min_valuation = serializers.DecimalField(max_digits=15, decimal_places=2, required=False)
    max_valuation = serializers.DecimalField(max_digits=15, decimal_places=2, required=False)
    min_equity = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    max_equity = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    search = serializers.CharField(required=False)
    ordering = serializers.ChoiceField(
        choices=['created_at', '-created_at', 'valuation', '-valuation', 'funding_progress'],
        required=False,
        default='-created_at'
    )
