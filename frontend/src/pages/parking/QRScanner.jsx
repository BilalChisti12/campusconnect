import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { QrCode, LogIn, LogOut, Scan } from 'lucide-react';
import { toast } from 'sonner';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [parsedData, setParsedData] = useState(null);

  const simulateScan = () => {
    const mockQRData = JSON.stringify({
      studentId: '1',
      name: 'Rahul Kumar',
      rollNumber: 'CS2021001',
      vehicleNumber: 'KA-01-AB-1234',
      slotId: 'A-01'
    });
    setScanResult(mockQRData);
    try {
      setParsedData(JSON.parse(mockQRData));
    } catch {
      setParsedData(null);
    }
    toast.success('QR Code scanned successfully!');
  };

  const handleManualInput = () => {
    try {
      const data = JSON.parse(scanResult);
      setParsedData(data);
    } catch {
      toast.error('Invalid QR data format');
    }
  };

  const markEntry = () => {
    toast.success(`Parking entry recorded for ${parsedData?.name} at slot ${parsedData?.slotId}`);
  };

  const markExit = () => {
    toast.success(`Parking exit recorded for ${parsedData?.name} from slot ${parsedData?.slotId}`);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-foreground">QR Code Scanner</h2>
          <p className="text-muted-foreground">Scan student QR codes for parking entry/exit</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode size={20} className="text-primary" />
              Scan QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Simulated Scanner */}
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/50">
              <Scan size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm mb-4">Camera scanner simulation</p>
              <Button onClick={simulateScan} className="transition-smooth">
                <Scan size={18} className="mr-2" />
                Simulate QR Scan
              </Button>
            </div>

            {/* Manual Input */}
            <div className="space-y-2">
              <Label>Or paste QR data manually</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste QR code JSON data"
                  value={scanResult}
                  onChange={(e) => setScanResult(e.target.value)} />
                
                <Button variant="outline" onClick={handleManualInput} className="transition-smooth">
                  Parse
                </Button>
              </div>
            </div>

            {/* Parsed Result */}
            {parsedData &&
            <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{parsedData.name}</h3>
                  <Badge>Verified</Badge>
                </div>
                {[
              { label: 'Roll Number', value: parsedData.rollNumber },
              { label: 'Vehicle', value: parsedData.vehicleNumber },
              { label: 'Assigned Slot', value: parsedData.slotId }].
              map((item) =>
              <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground font-medium">{item.value}</span>
                  </div>
              )}
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1 transition-smooth" onClick={markEntry}>
                    <LogIn size={18} className="mr-2" /> Mark Entry
                  </Button>
                  <Button variant="outline" className="flex-1 transition-smooth" onClick={markExit}>
                    <LogOut size={18} className="mr-2" /> Mark Exit
                  </Button>
                </div>
              </div>
            }
          </CardContent>
        </Card>
      </div>
    </Layout>);

};

export default QRScanner;