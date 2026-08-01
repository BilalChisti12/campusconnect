import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldCheck, ShieldX } from 'lucide-react';
import { students } from '@/data/mockData';
import { toast } from 'sonner';

const VerifyVehicle = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [found, setFound] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const student = students.find(
      (s) => s.vehicleNumber.toLowerCase() === searchQuery.toLowerCase() || s.rollNumber.toLowerCase() === searchQuery.toLowerCase()
    );
    setFound(student || null);
    setSearched(true);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Verify Vehicle</h2>
          <p className="text-muted-foreground">Search by vehicle number or roll number</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Lookup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="search">Vehicle Number / Roll Number</Label>
                <Input
                  id="search"
                  placeholder="e.g., KA-01-AB-1234 or CS2021001"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                
              </div>
              <Button className="self-end transition-smooth" onClick={handleSearch}>
                <Search size={18} className="mr-2" />
                Search
              </Button>
            </div>

            {searched &&
            <div className="mt-4">
                {found ?
              <div className="bg-muted rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{found.name}</h3>
                      <Badge variant="default">Registered</Badge>
                    </div>
                    {[
                { label: 'Roll Number', value: found.rollNumber },
                { label: 'Vehicle Number', value: found.vehicleNumber },
                { label: 'Vehicle Type', value: found.vehicleType },
                { label: 'Assigned Slot', value: found.slotId || 'Not Assigned' }].
                map((item) =>
                <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="text-foreground font-medium">{item.value}</span>
                      </div>
                )}
                    <div className="flex gap-3 pt-2">
                      <Button className="flex-1 transition-smooth" onClick={() => toast.success('Entry allowed for ' + found.name)}>
                        <ShieldCheck size={18} className="mr-2" /> Allow
                      </Button>
                      <Button variant="destructive" className="flex-1 transition-smooth" onClick={() => toast.error('Entry denied for ' + found.name)}>
                        <ShieldX size={18} className="mr-2" /> Deny
                      </Button>
                    </div>
                  </div> :

              <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-center">
                    <ShieldX size={32} className="mx-auto mb-2" />
                    <p className="font-medium">Vehicle not found in system</p>
                    <p className="text-sm mt-1">This vehicle is not registered. Deny entry or log as visitor.</p>
                  </div>
              }
              </div>
            }
          </CardContent>
        </Card>
      </div>
    </Layout>);

};

export default VerifyVehicle;