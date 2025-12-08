import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/Navbar';
import { PremiumCard } from '@/components/PremiumCard';
import { AIBadge } from '@/components/AIBadge';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { ComparisonResult } from '@/lib/api';
import { mockApi } from '@/lib/mockData';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function CompareProposals() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    const [comparison, setComparison] = useState<ComparisonResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedProposal, setExpandedProposal] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchComparison();
        }
    }, [id]);

    const fetchComparison = async () => {
        try {
            setLoading(true);
            const data = await mockApi.rfps.getComparison(id!);
            setComparison(data);
        } catch (err: any) {
            toast(
                err.message || 'Failed to load comparison',
            );
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner size="lg" message="🤖 AI Analyzing Proposals..." />
                </div>
            </div>
        );
    }

    if (!comparison || comparison.proposals.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="container py-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/rfps/${id}`)}
                        className="mb-4 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to RFP
                    </Button>
                    <EmptyState
                        icon={<Sparkles className="h-8 w-8 text-muted-foreground" />}
                        title="No proposals received yet"
                        description="Proposals from vendors will appear here once they respond to your RFP."
                        action={
                            <Button onClick={() => navigate(`/rfps/${id}`)}>
                                Back to RFP Details
                            </Button>
                        }
                    />
                </main>
            </div>
        );
    }

    const { rfp, proposals, aiRecommendation } = comparison;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/rfps/${id}`)}
                        className="mb-4 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to RFP
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Compare Proposals</h1>
                    <p className="text-muted-foreground mt-1">{rfp.title}</p>
                </div>

                {/* AI Recommendation Banner */}
                <PremiumCard className="mb-8 border-2 border-foreground/20">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-ai">
                            <Trophy className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <AIBadge label="AI Recommendation" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">
                                {aiRecommendation.recommendedVendorName}
                            </h2>
                            <p className="text-muted-foreground">{aiRecommendation.reasoning}</p>
                        </div>
                    </div>
                </PremiumCard>

                {/* Proposal Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {proposals.map((proposal) => {
                        const isRecommended = proposal.vendorId === aiRecommendation.recommendedVendorId;
                        const isExpanded = expandedProposal === proposal.id;

                        return (
                            <PremiumCard
                                key={proposal.id}
                                className={cn(
                                    isRecommended && 'border-2 border-foreground ring-2 ring-foreground/10'
                                )}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {isRecommended && (
                                                <span className="inline-flex items-center gap-1 rounded-full gradient-ai px-2 py-0.5 text-xs font-medium text-primary-foreground">
                                                    <Star className="h-3 w-3" />
                                                    Recommended
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-lg">
                                            {proposal.vendor?.name || 'Unknown Vendor'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {proposal.vendor?.company}
                                        </p>
                                    </div>
                                </div>

                                {/* AI Score */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">AI Score</span>
                                        <span className="text-lg font-bold">{proposal.aiScore}/100</span>
                                    </div>
                                    <Progress value={proposal.aiScore} className="h-2" />
                                </div>

                                {/* Total Cost */}
                                <div className="p-4 rounded-lg bg-muted/50 mb-4">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                        Total Cost
                                    </p>
                                    <p className="text-2xl font-bold">{formatCurrency(proposal.totalCost)}</p>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {proposal.deliveryTime && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Delivery</p>
                                            <p className="text-sm font-medium">{proposal.deliveryTime}</p>
                                        </div>
                                    )}
                                    {proposal.paymentTerms && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Payment</p>
                                            <p className="text-sm font-medium">{proposal.paymentTerms}</p>
                                        </div>
                                    )}
                                    {proposal.warranty && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-muted-foreground">Warranty</p>
                                            <p className="text-sm font-medium">{proposal.warranty}</p>
                                        </div>
                                    )}
                                </div>

                                {/* AI Summary */}
                                {proposal.aiSummary && (
                                    <div className="p-3 rounded-lg border border-border mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs font-medium text-muted-foreground">
                                                AI Summary
                                            </span>
                                        </div>
                                        <p className="text-sm">{proposal.aiSummary}</p>
                                    </div>
                                )}

                                {/* Expandable Items */}
                                {proposal.items && proposal.items.length > 0 && (
                                    <div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setExpandedProposal(isExpanded ? null : proposal.id)
                                            }
                                            className="w-full justify-between"
                                        >
                                            <span>Item Breakdown ({proposal.items.length})</span>
                                            {isExpanded ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </Button>

                                        {isExpanded && (
                                            <div className="mt-3 space-y-2">
                                                {proposal.items.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm"
                                                    >
                                                        <div>
                                                            <span className="font-medium">{item.name}</span>
                                                            <span className="text-muted-foreground ml-2">
                                                                x{item.quantity}
                                                            </span>
                                                        </div>
                                                        <span className="font-medium">
                                                            {formatCurrency(item.totalPrice)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </PremiumCard>
                        );
                    })}
                </div>

                {/* Comparison Table */}
                <PremiumCard>
                    <h2 className="text-lg font-semibold mb-4">Side-by-Side Comparison</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                                        Metric
                                    </th>
                                    {proposals.map((p) => (
                                        <th
                                            key={p.id}
                                            className={cn(
                                                'text-left py-3 px-4 font-medium',
                                                p.vendorId === aiRecommendation.recommendedVendorId &&
                                                'bg-muted/50'
                                            )}
                                        >
                                            {p.vendor?.name}
                                            {p.vendorId === aiRecommendation.recommendedVendorId && (
                                                <Star className="inline h-4 w-4 ml-1" />
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border">
                                    <td className="py-3 px-4 font-medium">AI Score</td>
                                    {proposals.map((p) => (
                                        <td
                                            key={p.id}
                                            className={cn(
                                                'py-3 px-4',
                                                p.vendorId === aiRecommendation.recommendedVendorId &&
                                                'bg-muted/50'
                                            )}
                                        >
                                            {p.aiScore}/100
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-3 px-4 font-medium">Total Cost</td>
                                    {proposals.map((p) => (
                                        <td
                                            key={p.id}
                                            className={cn(
                                                'py-3 px-4 font-semibold',
                                                p.vendorId === aiRecommendation.recommendedVendorId &&
                                                'bg-muted/50'
                                            )}
                                        >
                                            {formatCurrency(p.totalCost)}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-3 px-4 font-medium">Delivery</td>
                                    {proposals.map((p) => (
                                        <td
                                            key={p.id}
                                            className={cn(
                                                'py-3 px-4',
                                                p.vendorId === aiRecommendation.recommendedVendorId &&
                                                'bg-muted/50'
                                            )}
                                        >
                                            {p.deliveryTime || '-'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="py-3 px-4 font-medium">Payment</td>
                                    {proposals.map((p) => (
                                        <td
                                            key={p.id}
                                            className={cn(
                                                'py-3 px-4',
                                                p.vendorId === aiRecommendation.recommendedVendorId &&
                                                'bg-muted/50'
                                            )}
                                        >
                                            {p.paymentTerms || '-'}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Warranty</td>
                                    {proposals.map((p) => (
                                        <td
                                            key={p.id}
                                            className={cn(
                                                'py-3 px-4',
                                                p.vendorId === aiRecommendation.recommendedVendorId &&
                                                'bg-muted/50'
                                            )}
                                        >
                                            {p.warranty || '-'}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </PremiumCard>
            </main>
        </div>
    );
}
