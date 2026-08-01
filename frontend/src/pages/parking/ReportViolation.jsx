import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Upload, Send } from 'lucide-react';
import { violations as initialViolations } from '@/data/mockData';
import { toast } from 'sonner';

const ReportViolation = () => {
  const [violationList, setViolationList] = useState(initialViolations);
  const [form, setForm] = useState({ slotId: '', vehicleNumber: '', remarks: '' });
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newViolation = {
      id: 'vl' + Date.now(),
      slotId: form.slotId,
      vehicleNumber: form.vehicleNumber,
      reportedBy: 'Vijay Patel',
      remarks: form.remarks,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : null,
      timestamp: new Date().toISOString(),
      fine: null,
      status: 'reported'
    };
    setViolationList((prev) => [newViolation, ...prev]);
    setForm({ slotId: '', vehicleNumber: '', remarks: '' });
    setImageFile(null);
    toast.success('Violation reported successfully');
  };

  const statusColors = {
    reported: 'destructive',
    reviewed: 'secondary',
    fined: 'default'
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Report Violations</h2>
          <p className="text-muted-foreground">Report and track parking violations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-primary" />
                New Violation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="slotId" className="text-xs">Slot ID</Label>
                  <Input id="slotId" placeholder="e.g., A-05" value={form.slotId} onChange={(e) => setForm({ ...form, slotId: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="vehicleNumber" className="text-xs">Vehicle Number</Label>
                  <Input id="vehicleNumber" placeholder="e.g., KA-01-AB-1234" value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="remarks" className="text-xs">Remarks</Label>
                  <Textarea id="remarks" placeholder="Describe the violation" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} required rows={3} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Evidence Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                    <input type="file" accept="image/*" className="hidden" id="imageUpload" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    <label htmlFor="imageUpload" className="text-sm text-primary cursor-pointer hover:underline">
                      {imageFile ? imageFile.name : 'Click to upload'}
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full transition-smooth">
                  <Send size={16} className="mr-2" /> Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Violation List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Violation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {violationList.map((v) =>
                  <div key={v.id} className="bg-muted rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">Slot {v.slotId} — {v.vehicleNumber}</p>
                          <p className="text-sm text-muted-foreground mt-1">{v.remarks}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Reported by {v.reportedBy} • {new Date(v.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={statusColors[v.status]}>{v.status}</Badge>
                          {v.fine && <p className="text-sm font-bold text-destructive mt-1">₹{v.fine}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>);

};

export default ReportViolation;