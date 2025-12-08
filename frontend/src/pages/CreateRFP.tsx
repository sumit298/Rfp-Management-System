import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, RotateCcw, Save, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Navbar } from '@/components/Navbar';
import { PremiumCard } from '@/components/PremiumCard';
import { AIBadge } from '@/components/AIBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { RFP } from '@/lib/api';
import toast from 'react-hot-toast';
import { useCreateRFP } from '@/hooks/useRFPs';


const PLACEHOLDER_TEXT = `Example: We need to procure 500 office chairs with ergonomic design, lumbar support, and adjustable height. Additionally, we require 200 standing desks with electric height adjustment. Budget is around $150,000. Delivery should be within 30 days. Payment terms: 50% upfront, 50% on delivery. 2-year warranty required.`;

export default function CreateRFP() {
  const [input, setInput] = useState('');
  const [generatedRFP, setGeneratedRFP] = useState<RFP | null>(null);
  const createRFP = useCreateRFP();
  const loading = createRFP.isPending;
  const navigate = useNavigate();


  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please describe your RFP requirements.');
      return;
    }

    createRFP.mutate(input, {
      onSuccess: (data) => {
        setGeneratedRFP(data);
        toast.success("Requirements are structured now")
      }
    })
  };

  const handleSave = () => {
    if (generatedRFP) {
      toast.success('Your RFP has been saved successfully.');
      navigate(`/rfps/${generatedRFP._id}`);
    }
  };

  const handleRegenerate = () => {
    setGeneratedRFP(null);
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create RFP</h1>
          <p className="text-muted-foreground mt-1">
            Describe your requirements in natural language and let AI structure them.
          </p>
        </div>

        {/* Input Section */}
        <PremiumCard className="mb-6">
          <label className="block text-sm font-medium mb-3">
            Describe your requirements
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PLACEHOLDER_TEXT}
            className="min-h-[200px] resize-none text-base"
            disabled={loading}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Be as detailed as possible for better results.
            </p>
            <Button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Structured RFP
                </>
              )}
            </Button>
          </div>
        </PremiumCard>

        {/* Loading State */}
        {loading && (
          <PremiumCard className="py-16">
            <LoadingSpinner
              size="lg"
              message="🤖 AI is analyzing your requirements..."
            />
          </PremiumCard>
        )}

        {/* Generated RFP Display */}
        {generatedRFP && !loading && (
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <AIBadge />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRegenerate} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Regenerate
                </Button>
                <Button size="sm" onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save & Continue
                </Button>
              </div>
            </div>

            {/* Title & Description */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{generatedRFP.title}</h2>
              <p className="text-muted-foreground">{generatedRFP.description}</p>
            </div>

            {/* Items */}
            {generatedRFP.requirements.items && generatedRFP.requirements.items.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Required Items
                </h3>
                <div className="space-y-3">
                  {generatedRFP.requirements.items.map((item, index) => (
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
              </div>
            )}

            {/* Terms Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {generatedRFP.requirements.budget && (
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Budget
                  </p>
                  <p className="font-semibold">{generatedRFP.requirements.budget}</p>
                </div>
              )}
              {generatedRFP.requirements.deliveryDays && (
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Delivery Terms
                  </p>
                  <p className="font-semibold">{generatedRFP.requirements.deliveryDays}</p>
                </div>
              )}
              {generatedRFP.requirements.paymentTerms && (
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Payment Terms
                  </p>
                  <p className="font-semibold">{generatedRFP.requirements.paymentTerms}</p>
                </div>
              )}
              {generatedRFP.requirements.warranty && (
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Warranty
                  </p>
                  <p className="font-semibold">{generatedRFP.requirements.warranty}</p>
                </div>
              )}
            </div>
          </PremiumCard>
        )}
      </main>
    </div>
  );
}
