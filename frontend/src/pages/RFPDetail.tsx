import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, Package, Users, BarChart3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Navbar } from '@/components/Navbar';
import { PremiumCard } from '@/components/PremiumCard';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { type RFP, type Vendor, type Proposal, rfpApi, vendorApi, proposalApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RFPDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rfp, setRfp] = useState<RFP | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);


  const fetchData = async () => {
    try {
      setLoading(true);
      const [rfpData, vendorsData, proposalsData] = await Promise.all([
        rfpApi.getById(id!),
        vendorApi.getAll(),
        proposalApi.getByRfpId(id!)
      ]);
      setRfp(rfpData || null);
      setVendors(vendorsData);
      setProposals(proposalsData);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load RFP details');


    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id])

  const handleVendorToggle = (vendorId: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSendRFP = async () => {
    if (selectedVendors.length === 0) {
      toast.error('Please select at least one vendor.');
      return;
    }

    try {
      setSending(true);
      await rfpApi.send(id!, selectedVendors);
      toast.success(`RFP sent to ${selectedVendors.length} vendor(s).`);
      setSelectedVendors([]);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to send RFP');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" message="Loading RFP details..." />
        </div>
      </div>
    );
  }

  if (!rfp) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <EmptyState
            icon={<Package className="h-8 w-8 text-muted-foreground" />}
            title="RFP not found"
            description="The requested RFP could not be found."
            action={
              <Button onClick={() => navigate('/')}>
                Back to Dashboard
              </Button>
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{rfp.title}</h1>
                <StatusBadge status={rfp.status} />
              </div>
              <p className="text-muted-foreground max-w-2xl">{rfp.description}</p>
            </div>
            {proposals.length > 0 && (
              <Link to={`/rfps/${id}/compare`}>
                <Button className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Compare Proposals ({proposals.length})
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requirements */}
            {rfp.requirements.items && rfp.requirements.items.length > 0 && (
              <PremiumCard>
                <h2 className="text-lg font-semibold mb-4">Requirements</h2>
                <div className="space-y-3">
                  {rfp.requirements.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                        <Package className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                            Qty: {item.quantity} {'units'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.specs}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </PremiumCard>
            )}

            {/* Terms & Conditions */}
            <PremiumCard>
              <h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {rfp.requirements.budget && (
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Budget
                    </p>
                    <p className="font-semibold">{rfp.requirements.budget}</p>
                  </div>
                )}
                {rfp.requirements.deliveryDays && (
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Delivery Terms
                    </p>
                    <p className="font-semibold">{rfp.requirements.deliveryDays}</p>
                  </div>
                )}
                {rfp.requirements.paymentTerms && (
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Payment Terms
                    </p>
                    <p className="font-semibold">{rfp.requirements.paymentTerms}</p>
                  </div>
                )}
                {rfp.requirements.warranty && (
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Warranty
                    </p>
                    <p className="font-semibold">{rfp.requirements.warranty}</p>
                  </div>
                )}
              </div>
            </PremiumCard>
          </div>

          {/* Sidebar - Vendor Selection */}
          <div className="space-y-6">
            <PremiumCard>
              <h2 className="text-lg font-semibold mb-4">Send to Vendors</h2>

              {vendors.length === 0 ? (
                <EmptyState
                  icon={<Users className="h-6 w-6 text-muted-foreground" />}
                  title="No vendors yet"
                  description="Add vendors to send this RFP."
                  action={
                    <Link to="/vendors">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Manage Vendors
                      </Button>
                    </Link>
                  }
                  className="py-8"
                />
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {vendors.map((vendor) => (
                      <label
                        key={vendor._id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={selectedVendors.includes(vendor._id)}
                          onCheckedChange={() => handleVendorToggle(vendor._id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{vendor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {vendor.company}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <Button
                    onClick={handleSendRFP}
                    disabled={selectedVendors.length === 0 || sending}
                    className="w-full gap-2"
                  >
                    {sending ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send to {selectedVendors.length} Vendor(s)
                      </>
                    )}
                  </Button>
                </>
              )}
            </PremiumCard>

            {/* Proposals Info */}
            <PremiumCard>
              <h2 className="text-lg font-semibold mb-2">Proposals</h2>
              <p className="text-3xl font-bold">{proposals.length}</p>
              <p className="text-sm text-muted-foreground">
                {proposals.length === 0
                  ? 'No proposals received yet'
                  : `${proposals.length} proposal(s) received`}
              </p>
            </PremiumCard>
          </div>
        </div>
      </main>
    </div>
  );
}
