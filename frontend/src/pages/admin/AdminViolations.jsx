import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, DollarSign } from 'lucide-react';
import { violations as initialViolations } from '@/data/mockData';
import { toast } from 'sonner';

const AdminViolations = () => {
  const [violationList, setViolationList] = useState(initialViolations);
  const [fineAmounts, setFineAmounts] = useState({});

  const handleFine = (id) => {
    const amount = parseInt(fineAmounts[id] || '0');
    if (!amount) {
      toast.error('Please enter a fine amount');
      return;
    }
    setViolationList((prev) =>
    prev.map((v) => v.id === id ? { ...v, fine: amount, status: 'fined' } : v)
    );
    toast.success(`Fine of ₹${amount} assigned`);
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
          <h2 className="text-2xl font-bold text-foreground">Review Violations</h2>
          <p className="text-muted-foreground">Review reported violations and assign fines</p>
        </div>

        <div className="space-y-4">
          {violationList.map((v) =>
          <Card key={v.id}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-destructive" />
                      <span className="font-semibold text-foreground">Slot {v.slotId}</span>
                      <Badge variant={statusColors[v.status]}>{v.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{v.remarks}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Vehicle: {v.vehicleNumber}</span>
                      <span>By: {v.reportedBy}</span>
                      <span>{new Date(v.timestamp).toLocaleString()}</span>
                    </div>
                    {v.fine && <p className="text-sm font-bold text-destructive mt-1">Fine: ₹{v.fine}</p>}
                  </div>
                  {v.status === 'reported' &&
                <div className="flex items-center gap-2">
                      <Input
                    type="number"
                    placeholder="₹ Amount"
                    className="w-28"
                    value={fineAmounts[v.id] || ''}
                    onChange={(e) => setFineAmounts({ ...fineAmounts, [v.id]: e.target.value })} />
                  
                      <Button size="sm" className="transition-smooth" onClick={() => handleFine(v.id)}>
                        <DollarSign size={14} className="mr-1" /> Assign Fine
                      </Button>
                    </div>
                }
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>);

};

export default AdminViolations;