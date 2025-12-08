import { Link, useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { PremiumCard } from '@/components/PremiumCard';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useRFPs } from '@/hooks/useRFPs';
import type { RFP } from '@/lib/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: rfps = [], isLoading: loading, error } = useRFPs(); 

  console.log(rfps)

  const stats = {
    total: rfps.length,
    active: rfps.filter((r: RFP) => r.status === 'sent').length,
    draft: rfps.filter((r: RFP) => r.status === 'draft').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your requests for proposals
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" message="Loading RFPs..." />
          </div>
        ) : error ? (
          <PremiumCard className="text-center py-12">
            <p className="text-destructive mb-4">
              {error?.message || 'Failed to load RFPs. Please try again.'}
            </p>
            <Button onClick={()=> window.location.reload()} variant="outline">
              Try Again
            </Button>
          </PremiumCard>
        ) : rfps.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-8 w-8 text-muted-foreground" />}
            title="No RFPs yet"
            description="Create your first RFP to start receiving proposals from vendors."
            action={
              <Link to="/rfps/create">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Create your first RFP
                </Button>
              </Link>
            }
          />
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <StatCard
                icon={<FileText className="h-6 w-6 text-foreground" />}
                label="Total RFPs"
                value={stats.total}
              />
              <StatCard
                icon={<Clock className="h-6 w-6 text-foreground" />}
                label="Active"
                value={stats.active}
              />
              <StatCard
                icon={<CheckCircle className="h-6 w-6 text-foreground" />}
                label="Drafts"
                value={stats.draft}
              />
            </div>

            {/* RFP List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Recent RFPs</h2>
              <div className="grid gap-4">
                {rfps.map((rfp: RFP) => (
                  <PremiumCard
                    key={rfp._id}
                    hoverable
                    onClick={() => navigate(`/rfps/${rfp._id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{rfp.title}</h3>
                          <StatusBadge status={rfp.status} />
                        </div>
                        <p className="text-muted-foreground line-clamp-2 mb-3">
                          {rfp.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{rfp.items?.length || 0} items</span>
                          <span>•</span>
                          <span>
                            {rfp.vendorIds?.length || 0} vendors
                          </span>
                          {rfp.createdAt && (
                            <>
                              <span>•</span>
                              <span>
                                {new Date(rfp.createdAt).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </PremiumCard>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
