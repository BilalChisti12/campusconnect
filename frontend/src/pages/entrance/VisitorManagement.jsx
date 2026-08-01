import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserPlus, LogOut } from 'lucide-react';
import { visitorLogs as initialVisitors } from '@/data/mockData';
import { toast } from 'sonner';

const VisitorManagement = () => {
  const [visitors, setVisitors] = useState(initialVisitors);
  const [form, setForm] = useState({ name: '', phone: '', vehicleNumber: '', purpose: '' });

  const handleAddVisitor = (e) => {
    e.preventDefault();
    const newVisitor = {
      id: 'v' + Date.now(),
      ...form,
      entryTime: new Date().toISOString(),
      exitTime: null,
      status: 'inside'
    };
    setVisitors((prev) => [newVisitor, ...prev]);
    setForm({ name: '', phone: '', vehicleNumber: '', purpose: '' });
    toast.success('Visitor logged: ' + form.name);
  };

  const handleExit = (id) => {
    setVisitors((prev) =>
    prev.map((v) => v.id === id ? { ...v, exitTime: new Date().toISOString(), status: 'exited' } : v)
    );
    toast.success('Visitor marked as exited');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Visitor Management</h2>
          <p className="text-muted-foreground">Log and manage campus visitors</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Visitor Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus size={20} className="text-primary" />
                Log New Visitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddVisitor} className="space-y-3">
                {[
                { id: 'name', label: 'Name', placeholder: 'Visitor name' },
                { id: 'phone', label: 'Phone', placeholder: 'Phone number' },
                { id: 'vehicleNumber', label: 'Vehicle', placeholder: 'Vehicle number' },
                { id: 'purpose', label: 'Purpose', placeholder: 'Purpose of visit' }].
                map((field) =>
                <div key={field.id} className="space-y-1">
                    <Label htmlFor={field.id} className="text-xs">{field.label}</Label>
                    <Input
                    id={field.id}
                    placeholder={field.placeholder}
                    value={form[field.id]}
                    onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                    required />
                  
                  </div>
                )}
                <Button type="submit" className="w-full transition-smooth">
                  <UserPlus size={16} className="mr-2" /> Log Entry
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Visitor List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 text-muted-foreground font-medium">Name</th>
                        <th className="text-left py-2 px-2 text-muted-foreground font-medium">Vehicle</th>
                        <th className="text-left py-2 px-2 text-muted-foreground font-medium">Purpose</th>
                        <th className="text-left py-2 px-2 text-muted-foreground font-medium">Status</th>
                        <th className="text-left py-2 px-2 text-muted-foreground font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((v) =>
                      <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-smooth">
                          <td className="py-3 px-2 text-foreground">{v.name}</td>
                          <td className="py-3 px-2 text-foreground">{v.vehicleNumber}</td>
                          <td className="py-3 px-2 text-foreground">{v.purpose}</td>
                          <td className="py-3 px-2">
                            <Badge variant={v.status === 'inside' ? 'default' : 'secondary'}>
                              {v.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            {v.status === 'inside' &&
                          <Button size="sm" variant="outline" className="transition-smooth" onClick={() => handleExit(v.id)}>
                                <LogOut size={14} className="mr-1" /> Exit
                              </Button>
                          }
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>);

};

export default VisitorManagement;