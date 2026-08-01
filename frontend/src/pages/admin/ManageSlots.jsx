import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { apiCall } from '@/lib/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from
'@/components/ui/dialog';










const ZONES = [
'Zone A - Main Building',
'Zone B - Library',
'Zone C - Sports Complex',
'Zone D - Hostel Area'];


const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({ slotNumber: '', zone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/slots');
      const data = await response.json();
      if (data.success) {
        setSlots(data.data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!formData.slotNumber || !formData.zone) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiCall('/slots', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Slot added successfully');
        setIsAddDialogOpen(false);
        setFormData({ slotNumber: '', zone: '' });
        fetchSlots();
      } else {
        toast.error(data.message || 'Failed to add slot');
      }
    } catch (error) {
      toast.error('Failed to add slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSlot = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !formData.slotNumber || !formData.zone) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiCall(`/slots/${selectedSlot._id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Slot updated successfully');
        setIsEditDialogOpen(false);
        setSelectedSlot(null);
        setFormData({ slotNumber: '', zone: '' });
        fetchSlots();
      } else {
        toast.error(data.message || 'Failed to update slot');
      }
    } catch (error) {
      toast.error('Failed to update slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSlot = async () => {
    if (!selectedSlot) return;

    setIsSubmitting(true);
    try {
      const response = await apiCall(`/slots/${selectedSlot._id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Slot deleted successfully');
        setIsDeleteDialogOpen(false);
        setSelectedSlot(null);
        fetchSlots();
      } else {
        toast.error(data.message || 'Failed to delete slot');
      }
    } catch (error) {
      toast.error('Failed to delete slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (slot) => {
    setSelectedSlot(slot);
    setFormData({ slotNumber: slot.slotNumber, zone: slot.zone });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (slot) => {
    setSelectedSlot(slot);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (slot) => {
    if (slot.assignedTo) {
      return <Badge variant="destructive">Occupied</Badge>;
    }
    switch (slot.status) {
      case 'available':
        return <Badge variant="default">Available</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{slot.status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Manage Parking Slots</h2>
            <p className="text-muted-foreground">Add, edit, delete and manage parking slots across zones</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={16} className="mr-1" /> Add New Slot
          </Button>
        </div>

        {/* Slots Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Slots ({slots.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ?
            <div className="text-center py-8">
                <p className="text-muted-foreground">Loading slots...</p>
              </div> :

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Slot</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Zone</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Assigned To</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot) =>
                  <tr key={slot._id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-smooth">
                        <td className="py-3 px-2 font-medium text-foreground">{slot.slotNumber}</td>
                        <td className="py-3 px-2 text-foreground">{slot.zone}</td>
                        <td className="py-3 px-2">{getStatusBadge(slot)}</td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {slot.assignedTo ?
                      <div>
                              <div className="font-medium text-foreground">{slot.assignedTo}</div>
                              <div className="text-xs">{slot.vehicleNumber}</div>
                            </div> :

                      '—'
                      }
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(slot)}
                          disabled={!!slot.assignedTo}
                          title={slot.assignedTo ? 'Cannot edit occupied slot' : 'Edit slot'}>
                          
                              <Pencil size={16} />
                            </Button>
                            <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(slot)}
                          disabled={!!slot.assignedTo}
                          className="text-destructive hover:text-destructive"
                          title={slot.assignedTo ? 'Cannot delete occupied slot' : 'Delete slot'}>
                          
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            }
          </CardContent>
        </Card>

        {/* Add Slot Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus size={20} className="text-primary" />
                Add New Parking Slot
              </DialogTitle>
              <DialogDescription>
                Create a new parking slot in a zone
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slotNumber">Slot Number</Label>
                <Input
                  id="slotNumber"
                  placeholder="e.g., A-11"
                  value={formData.slotNumber}
                  onChange={(e) => setFormData({ ...formData, slotNumber: e.target.value })}
                  required />
                
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">Zone</Label>
                <Select
                  value={formData.zone}
                  onValueChange={(v) => setFormData({ ...formData, zone: v })}>
                  
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZONES.map((zone) =>
                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Slot'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Slot Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil size={20} className="text-primary" />
                Edit Parking Slot
              </DialogTitle>
              <DialogDescription>
                Update slot details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSlot} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editSlotNumber">Slot Number</Label>
                <Input
                  id="editSlotNumber"
                  placeholder="e.g., A-11"
                  value={formData.slotNumber}
                  onChange={(e) => setFormData({ ...formData, slotNumber: e.target.value })}
                  required />
                
              </div>
              <div className="space-y-2">
                <Label htmlFor="editZone">Zone</Label>
                <Select
                  value={formData.zone}
                  onValueChange={(v) => setFormData({ ...formData, zone: v })}>
                  
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZONES.map((zone) =>
                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Slot'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Slot Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Trash2 size={20} />
                Delete Parking Slot
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this slot? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedSlot &&
            <div className="bg-muted p-4 rounded-lg">
                <p><strong>Slot:</strong> {selectedSlot.slotNumber}</p>
                <p><strong>Zone:</strong> {selectedSlot.zone}</p>
              </div>
            }
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteSlot}
                disabled={isSubmitting}>
                
                {isSubmitting ? 'Deleting...' : 'Delete Slot'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>);

};

export default ManageSlots;