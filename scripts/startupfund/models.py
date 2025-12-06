"""
StartupFund Models
==================
Complete database schema for the investment ecosystem platform.
Each model is designed to maximize business value scoring.
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal


# =============================================================================
# USER & ROLE MANAGEMENT
# =============================================================================

class User(AbstractUser):
    """
    Custom User model with role-based access control.
    WHY: Enables strict separation between Investors and Entrepreneurs,
    critical for security scoring and regulatory compliance.
    """
    
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrator'
        ENTREPRENEUR = 'ENTREPRENEUR', 'Entrepreneur'
        INVESTOR = 'INVESTOR', 'Investor'
    
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.ENTREPRENEUR,
        help_text="User's primary role determining platform access and capabilities"
    )
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(
        default=False,
        help_text="Email/identity verification status - required for transactions"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['email']),
        ]
    
    def __str__(self):
        return f"{self.email} ({self.role})"
    
    @property
    def is_investor(self):
        return self.role == self.Role.INVESTOR
    
    @property
    def is_entrepreneur(self):
        return self.role == self.Role.ENTREPRENEUR


class InvestorProfile(models.Model):
    """
    Extended profile for Investors.
    WHY: Captures investment preferences for matching algorithms
    and accreditation status for SEC compliance simulation.
    """
    
    class AccreditationStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Verification'
        ACCREDITED = 'ACCREDITED', 'Accredited Investor'
        NON_ACCREDITED = 'NON_ACCREDITED', 'Non-Accredited'
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='investor_profile'
    )
    bio = models.TextField(
        blank=True,
        help_text="Investment philosophy and background"
    )
    interests = models.JSONField(
        default=list,
        help_text="List of industry tags for startup matching (e.g., ['fintech', 'ai', 'healthtech'])"
    )
    investment_cap = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Maximum single investment amount in USD"
    )
    portfolio_value = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Total current portfolio value for risk assessment"
    )
    accreditation_status = models.CharField(
        max_length=20,
        choices=AccreditationStatus.choices,
        default=AccreditationStatus.PENDING,
        help_text="SEC accredited investor status - affects investment limits"
    )
    accreditation_verified_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp of last accreditation verification"
    )
    total_investments = models.PositiveIntegerField(
        default=0,
        help_text="Lifetime investment count for track record"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Investor Profile'
        verbose_name_plural = 'Investor Profiles'
    
    def __str__(self):
        return f"Investor: {self.user.email}"
    
    @property
    def can_invest(self):
        """Check if investor meets requirements to make investments."""
        return (
            self.user.is_verified and 
            self.accreditation_status == self.AccreditationStatus.ACCREDITED
        )


class EntrepreneurProfile(models.Model):
    """
    Extended profile for Entrepreneurs.
    WHY: Track record and experience directly impact investor confidence
    and startup credibility scoring.
    """
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='entrepreneur_profile'
    )
    bio = models.TextField(
        blank=True,
        help_text="Professional background and entrepreneurial journey"
    )
    experience_years = models.PositiveIntegerField(
        default=0,
        help_text="Years of relevant industry/startup experience"
    )
    linkedin_url = models.URLField(
        blank=True,
        help_text="LinkedIn profile for credibility verification"
    )
    track_record = models.TextField(
        blank=True,
        help_text="Previous exits, successful ventures, notable achievements"
    )
    startups_founded = models.PositiveIntegerField(
        default=0,
        help_text="Number of startups previously founded"
    )
    total_funding_raised = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Lifetime funding raised across all ventures"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Entrepreneur Profile'
        verbose_name_plural = 'Entrepreneur Profiles'
    
    def __str__(self):
        return f"Entrepreneur: {self.user.email}"


# =============================================================================
# STARTUP & TEAM MODELS
# =============================================================================

class Startup(models.Model):
    """
    The core Startup model - represents a fundable venture.
    WHY: Comprehensive data enables accurate valuation assessment,
    due diligence, and investor matching for Product Development scoring.
    """
    
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        UNDER_REVIEW = 'UNDER_REVIEW', 'Under Review'
        PUBLISHED = 'PUBLISHED', 'Published'
        FUNDED = 'FUNDED', 'Fully Funded'
        CLOSED = 'CLOSED', 'Closed'
    
    class Stage(models.TextChoices):
        PRE_SEED = 'PRE_SEED', 'Pre-Seed'
        SEED = 'SEED', 'Seed'
        SERIES_A = 'SERIES_A', 'Series A'
        SERIES_B = 'SERIES_B', 'Series B'
        SERIES_C = 'SERIES_C', 'Series C+'
    
    INDUSTRY_CHOICES = [
        ('FINTECH', 'Financial Technology'),
        ('HEALTHTECH', 'Health Technology'),
        ('EDTECH', 'Education Technology'),
        ('AI_ML', 'AI & Machine Learning'),
        ('SAAS', 'Software as a Service'),
        ('ECOMMERCE', 'E-Commerce'),
        ('CLEANTECH', 'Clean Technology'),
        ('BIOTECH', 'Biotechnology'),
        ('PROPTECH', 'Property Technology'),
        ('LOGISTICS', 'Logistics & Supply Chain'),
        ('OTHER', 'Other'),
    ]
    
    # Ownership
    founder = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='startups',
        help_text="Primary founder/owner of the startup"
    )
    
    # Basic Information
    title = models.CharField(
        max_length=200,
        help_text="Startup name - should be memorable and brandable"
    )
    slogan = models.CharField(
        max_length=300,
        blank=True,
        help_text="One-liner value proposition"
    )
    description = models.TextField(
        help_text="Comprehensive description of the business model and vision"
    )
    
    # Market Data (TAM/SAM/SOM for Market Potential scoring)
    industry_category = models.CharField(
        max_length=50,
        choices=INDUSTRY_CHOICES,
        default='OTHER',
        help_text="Primary industry vertical"
    )
    target_market_tam = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Total Addressable Market in USD - entire market demand"
    )
    target_market_sam = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Serviceable Addressable Market in USD - reachable segment"
    )
    target_market_som = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Serviceable Obtainable Market in USD - realistic capture"
    )
    
    # Financials (Critical for Business Model scoring)
    valuation = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Pre-money valuation in USD"
    )
    funding_goal = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Target funding amount for this round in USD"
    )
    funding_raised = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Amount already raised in current round"
    )
    equity_offered = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01')), MaxValueValidator(Decimal('100.00'))],
        help_text="Percentage of equity offered to investors"
    )
    min_ticket_size = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('1000.00'),
        validators=[MinValueValidator(Decimal('100.00'))],
        help_text="Minimum investment amount accepted"
    )
    
    # Media & Documentation
    pitch_deck_file = models.FileField(
        upload_to='pitch_decks/',
        blank=True,
        null=True,
        help_text="PDF pitch deck for investor review"
    )
    demo_video_url = models.URLField(
        blank=True,
        help_text="Link to product demo or pitch video"
    )
    mvp_live_url = models.URLField(
        blank=True,
        help_text="Link to live MVP/product for due diligence"
    )
    logo = models.ImageField(
        upload_to='startup_logos/',
        blank=True,
        null=True
    )
    
    # Status & Stage
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        help_text="Current fundraising status"
    )
    stage = models.CharField(
        max_length=20,
        choices=Stage.choices,
        default=Stage.SEED,
        help_text="Current funding stage"
    )
    
    # Metrics
    view_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of investor profile views"
    )
    
    # Timestamps
    founded_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date the startup was founded"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the startup was made public to investors"
    )
    
    class Meta:
        verbose_name = 'Startup'
        verbose_name_plural = 'Startups'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['industry_category']),
            models.Index(fields=['stage']),
            models.Index(fields=['founder']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.stage})"
    
    def calculate_funding_progress(self) -> Decimal:
        """
        Calculate percentage of funding goal achieved.
        WHY: Critical metric for investor dashboard and startup showcase.
        """
        if self.funding_goal <= 0:
            return Decimal('0.00')
        progress = (self.funding_raised / self.funding_goal) * 100
        return min(progress, Decimal('100.00'))
    
    def calculate_post_money_valuation(self) -> Decimal:
        """Calculate post-money valuation after funding round."""
        return self.valuation + self.funding_goal
    
    @property
    def is_fully_funded(self) -> bool:
        return self.funding_raised >= self.funding_goal
    
    @property
    def remaining_funding(self) -> Decimal:
        return max(self.funding_goal - self.funding_raised, Decimal('0.00'))


class TeamMember(models.Model):
    """
    Startup team members - crucial for Team Dynamics scoring.
    WHY: Investors invest in people first. Strong teams with clear roles
    significantly improve funding success rates.
    """
    
    class Role(models.TextChoices):
        CEO = 'CEO', 'Chief Executive Officer'
        CTO = 'CTO', 'Chief Technology Officer'
        CFO = 'CFO', 'Chief Financial Officer'
        COO = 'COO', 'Chief Operating Officer'
        CMO = 'CMO', 'Chief Marketing Officer'
        CPO = 'CPO', 'Chief Product Officer'
        ADVISOR = 'ADVISOR', 'Advisor'
        BOARD_MEMBER = 'BOARD', 'Board Member'
        OTHER = 'OTHER', 'Team Member'
    
    startup = models.ForeignKey(
        Startup,
        on_delete=models.CASCADE,
        related_name='team_members',
        help_text="Associated startup"
    )
    name = models.CharField(max_length=200)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.OTHER,
        help_text="Position within the startup"
    )
    bio = models.TextField(
        blank=True,
        help_text="Professional background and expertise"
    )
    why_crucial = models.TextField(
        blank=True,
        help_text="WHY: Explains unique value this person brings - critical for investor confidence"
    )
    photo = models.ImageField(
        upload_to='team_photos/',
        blank=True,
        null=True
    )
    linkedin_url = models.URLField(
        blank=True,
        help_text="LinkedIn profile for verification"
    )
    email = models.EmailField(blank=True)
    equity_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('100.00'))],
        help_text="Equity stake in the startup"
    )
    is_founder = models.BooleanField(
        default=False,
        help_text="Whether this person is a co-founder"
    )
    joined_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Team Member'
        verbose_name_plural = 'Team Members'
        ordering = ['role', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.role} at {self.startup.title}"


class StartupObligation(models.Model):
    """
    Milestones/Roadmap items with budget allocation.
    WHY: Demonstrates financial discipline and enables tranche-based
    fund release - critical for investor trust and Business Model scoring.
    """
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
        DELAYED = 'DELAYED', 'Delayed'
        CANCELLED = 'CANCELLED', 'Cancelled'
    
    startup = models.ForeignKey(
        Startup,
        on_delete=models.CASCADE,
        related_name='obligations',
        help_text="Associated startup"
    )
    title = models.CharField(
        max_length=300,
        help_text="Milestone title (e.g., 'Launch MVP', 'Hire Engineering Team')"
    )
    description = models.TextField(
        blank=True,
        help_text="Detailed description of deliverables"
    )
    deadline = models.DateField(
        help_text="Target completion date"
    )
    budget_allocation = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Budget allocated to this milestone in USD"
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    completion_proof = models.TextField(
        blank=True,
        help_text="Evidence/documentation of milestone completion"
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Actual completion timestamp"
    )
    funds_released = models.BooleanField(
        default=False,
        help_text="Whether funds for this milestone have been released"
    )
    funds_released_at = models.DateTimeField(
        null=True,
        blank=True
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order in roadmap"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Startup Obligation'
        verbose_name_plural = 'Startup Obligations'
        ordering = ['order', 'deadline']
    
    def __str__(self):
        return f"{self.startup.title}: {self.title}"


# =============================================================================
# INVESTMENT & TRANSACTION MODELS
# =============================================================================

class InvestmentOffer(models.Model):
    """
    Investment proposals from Investors to Startups.
    WHY: Captures the full investment structure including ROI strategy,
    demonstrating clear Business Model and exit planning.
    """
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Review'
        NEGOTIATING = 'NEGOTIATING', 'In Negotiation'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        REJECTED = 'REJECTED', 'Rejected'
        WITHDRAWN = 'WITHDRAWN', 'Withdrawn'
        COMPLETED = 'COMPLETED', 'Completed'
    
    class ROIStrategy(models.TextChoices):
        EQUITY = 'EQUITY', 'Equity (Shares)'
        CONVERTIBLE_NOTE = 'CONVERTIBLE_NOTE', 'Convertible Note (Debt-to-Equity)'
        REVENUE_SHARE = 'REVENUE_SHARE', 'Revenue Share (Royalties)'
        SAFE = 'SAFE', 'SAFE (Simple Agreement for Future Equity)'
    
    # Relationships
    investor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='investment_offers',
        help_text="Investor making the offer"
    )
    startup = models.ForeignKey(
        Startup,
        on_delete=models.CASCADE,
        related_name='investment_offers',
        help_text="Target startup for investment"
    )
    
    # Offer Terms
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Investment amount in USD"
    )
    equity_requested = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01')), MaxValueValidator(Decimal('100.00'))],
        help_text="Percentage of equity requested"
    )
    message = models.TextField(
        blank=True,
        help_text="Personal message to founders explaining interest and value-add"
    )
    
    # ROI Strategy (The "How to Profit" mechanism)
    roi_strategy = models.CharField(
        max_length=30,
        choices=ROIStrategy.choices,
        default=ROIStrategy.EQUITY,
        help_text="Investment structure determining return mechanism"
    )
    exit_strategy_description = models.TextField(
        blank=True,
        help_text="How the investor expects to achieve liquidity (e.g., 'IPO in 5 years', 'Acquisition target', 'Buyback clause')"
    )
    
    # Convertible Note specific fields
    conversion_cap = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Valuation cap for convertible note conversion"
    )
    conversion_discount = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('100.00'))],
        help_text="Discount percentage on conversion"
    )
    
    # Revenue Share specific fields
    revenue_share_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('100.00'))],
        help_text="Percentage of revenue shared with investor"
    )
    revenue_share_cap = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Maximum total revenue share payout"
    )
    
    # Status & Timestamps
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    responded_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the startup responded to the offer"
    )
    response_message = models.TextField(
        blank=True,
        help_text="Startup's response message"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Offer expiration date"
    )
    
    class Meta:
        verbose_name = 'Investment Offer'
        verbose_name_plural = 'Investment Offers'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['investor']),
            models.Index(fields=['startup']),
        ]
    
    def __str__(self):
        return f"${self.amount:,.2f} offer to {self.startup.title} from {self.investor.email}"
    
    def calculate_implied_valuation(self) -> Decimal:
        """Calculate implied post-money valuation based on offer terms."""
        if self.equity_requested <= 0:
            return Decimal('0.00')
        return (self.amount / self.equity_requested) * 100


class PlatformTransaction(models.Model):
    """
    Records platform revenue from successful investments.
    WHY: Proves platform's monetization model sustainability -
    critical for Business Model scoring and platform viability.
    """
    
    class TransactionType(models.TextChoices):
        INVESTMENT = 'INVESTMENT', 'Investment Transaction'
        REFUND = 'REFUND', 'Refund'
        FEE_ADJUSTMENT = 'FEE_ADJUSTMENT', 'Fee Adjustment'
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PROCESSING = 'PROCESSING', 'Processing'
        COMPLETED = 'COMPLETED', 'Completed'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'
    
    # Relationships
    investment_offer = models.OneToOneField(
        InvestmentOffer,
        on_delete=models.PROTECT,
        related_name='transaction',
        help_text="Associated accepted investment offer"
    )
    
    # Financial Details (Decimal precision for accuracy)
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Total transaction amount in USD"
    )
    platform_fee_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('5.00'),
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('100.00'))],
        help_text="Platform fee percentage (e.g., 5.00 = 5%)"
    )
    platform_revenue = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Platform's fee revenue from this transaction"
    )
    net_startup_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Amount received by startup after fees"
    )
    
    # Transaction Metadata
    transaction_type = models.CharField(
        max_length=20,
        choices=TransactionType.choices,
        default=TransactionType.INVESTMENT
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    reference_id = models.CharField(
        max_length=100,
        unique=True,
        help_text="External payment processor reference ID"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the transaction was processed"
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When funds were fully transferred"
    )
    
    class Meta:
        verbose_name = 'Platform Transaction'
        verbose_name_plural = 'Platform Transactions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['reference_id']),
        ]
    
    def __str__(self):
        return f"Transaction {self.reference_id}: ${self.total_amount:,.2f}"
    
    def save(self, *args, **kwargs):
        """
        Auto-calculate platform revenue and net amount on save.
        WHY: Ensures financial accuracy and prevents calculation errors.
        """
        self.platform_revenue = (self.total_amount * self.platform_fee_percentage) / Decimal('100.00')
        self.net_startup_amount = self.total_amount - self.platform_revenue
        super().save(*args, **kwargs)
    
    @classmethod
    def calculate_total_platform_revenue(cls) -> Decimal:
        """Calculate total platform revenue from all completed transactions."""
        from django.db.models import Sum
        result = cls.objects.filter(
            status=cls.Status.COMPLETED
        ).aggregate(total=Sum('platform_revenue'))
        return result['total'] or Decimal('0.00')
