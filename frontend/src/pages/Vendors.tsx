import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Users, Building, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { PremiumCard } from '@/components/PremiumCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { Vendor } from '@/lib/api';
import { mockApi } from '@/lib/mockData';
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface VendorFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
}

const initialFormData: VendorFormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
};

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<VendorFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [deleteVendor, setDeleteVendor] = useState<Vendor | null>(null);


  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await mockApi.vendors.getAll();
      setVendors(data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch vendors',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingVendor(null);
    setFormData(initialFormData);
    setFormOpen(true);
  };

  const openEditForm = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      company: vendor.company,
      phone: vendor.phone || '',
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.company) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);

      if (editingVendor) {
        await mockApi.vendors.update(editingVendor.id, formData);
        toast({
          title: 'Vendor Updated',
          description: 'Vendor information has been updated.',
        });
      } else {
        await mockApi.vendors.create(formData);
        toast({
          title: 'Vendor Added',
          description: 'New vendor has been added successfully.',
        });
      }

      setFormOpen(false);
      fetchVendors();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to save vendor',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteVendor) return;

    try {
      await mockApi.vendors.delete(deleteVendor.id);
      toast({
        title: 'Vendor Deleted',
        description: 'Vendor has been removed.',
      });
      setDeleteVendor(null);
      fetchVendors();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete vendor',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
            <p className="text-muted-foreground mt-1">
              Manage your vendor contacts
            </p>
          </div>
          <Button onClick={openAddForm} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Vendor
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" message="Loading vendors..." />
          </div>
        ) : vendors.length === 0 ? (
          <EmptyState
            icon={<Users className="h-8 w-8 text-muted-foreground" />}
            title="No vendors yet"
            description="Add vendors to send RFPs and receive proposals."
            action={
              <Button onClick={openAddForm} className="gap-2">
                <Plus className="h-5 w-5" />
                Add your first vendor
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <PremiumCard key={vendor.id} hoverable>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <Building className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditForm(vendor)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteVendor(vendor)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-1">{vendor.name}</h3>
                <p className="text-muted-foreground mb-4">{vendor.company}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{vendor.email}</span>
                  </div>
                  {vendor.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                </div>
              </PremiumCard>
            ))}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingVendor ? 'Edit Vendor' : 'Add Vendor'}
              </DialogTitle>
              <DialogDescription>
                {editingVendor
                  ? 'Update vendor information.'
                  : 'Add a new vendor to your list.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="Acme Corp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : editingVendor ? (
                    'Update Vendor'
                  ) : (
                    'Add Vendor'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteVendor} onOpenChange={() => setDeleteVendor(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deleteVendor?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
