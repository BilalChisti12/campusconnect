import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MapPin } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'@/components/ui/select';



















const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/students/pending');
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const response = await apiCall('/slots/available');
      const data = await response.json();
      if (data.success) {
        setSlots(data.data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      // Fallback to mock data if API fails
      setSlots([
      { _id: 's2', slotNumber: 'A-02', zone: 'Zone A', status: 'available' },
      { _id: 's5', slotNumber: 'B-02', zone: 'Zone B', status: 'available' },
      { _id: 's6', slotNumber: 'C-01', zone: 'Zone C', status: 'available' },
      { _id: 's8', slotNumber: 'D-01', zone: 'Zone D', status: 'available' }]
      );
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchSlots();
  }, []);

  const openApproveDialog = (request) => {
    setSelectedRequest(request);
    setSelectedSlot('');
    setIsDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest || !selectedSlot) {
      toast.error('Please select a parking slot');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiCall(`/students/${selectedRequest._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'approved',
          slotId: selectedSlot
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Request approved with slot ${selectedSlot}`);
        setIsDialogOpen(false);
        fetchRequests();
        fetchSlots(); // Refresh slots after assignment
      } else {
        toast.error(data.message || 'Failed to approve');
      }
    } catch (error) {
      toast.error('Failed to approve request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await apiCall(`/students/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'rejected' })
      });
      const data = await response.json();
      if (data.success) {
        toast.error('Request rejected');
        fetchRequests();
      } else {
        toast.error(data.message || 'Failed to reject');
      }
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const statusColors = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive'
  };

  const formatVehicleType = (type) => {
    return type === 'two_wheeler' ? 'Two Wheeler' : 'Four Wheeler';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Manage Requests</h2>
          <p className="text-muted-foreground">Approve or reject student parking registration requests</p>
        </div>

        {loading ?
        <div className="text-center py-8">
            <p className="text-muted-foreground">Loading requests...</p>
          </div> :
        requests.length === 0 ?
        <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No pending requests</p>
            </CardContent>
          </Card> :

        <div className="space-y-4">
            {requests.map((req) =>
          <Card key={req._id}>
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{req.studentName}</h3>
                        <Badge variant={statusColors[req.status]}>{req.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Roll: {req.rollNumber}</span>
                        <span>Vehicle: {req.vehicleNumber}</span>
                        <span>Type: {formatVehicleType(req.vehicleType)}</span>
                        <span>Email: {req.email}</span>
                        <span>Applied: {new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {req.status === 'pending' &&
                <div className="flex items-center gap-2">
                        <Button
                    size="sm"
                    className="transition-smooth"
                    onClick={() => openApproveDialog(req)}>
                    
                          <CheckCircle size={16} className="mr-1" /> Approve
                        </Button>
                        <Button
                    size="sm"
                    variant="destructive"
                    className="transition-smooth"
                    onClick={() => handleReject(req._id)}>
                    
                          <XCircle size={16} className="mr-1" /> Reject
                        </Button>
                      </div>
                }
                  </div>
                </CardContent>
              </Card>
          )}
          </div>
        }

        {/* Approve Dialog with Slot Selection */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Assign Parking Slot
              </DialogTitle>
              <DialogDescription>
                Select an available parking slot for {selectedRequest?.studentName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Student Details</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest?.studentName}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest?.rollNumber}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest?.vehicleNumber} ({formatVehicleType(selectedRequest?.vehicleType || '')})</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Parking Slot</label>
                  <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an available slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {slots.length === 0 ?
                      <SelectItem value="" disabled>No available slots</SelectItem> :

                      slots.map((slot) =>
                      <SelectItem key={slot._id} value={slot.slotNumber}>
                            {slot.slotNumber} - {slot.zone}
                          </SelectItem>
                      )
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={!selectedSlot || isSubmitting}>
                
                {isSubmitting ? 'Approving...' : 'Approve & Assign Slot'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>);

};

export default ManageRequests;