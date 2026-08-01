import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { visitorLogs } from '@/data/mockData';

const AdminVisitors = () =>
<Layout>
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Visitor Logs</h2>
        <p className="text-muted-foreground">View all campus visitor records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} className="text-primary" />
            All Visitors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Name</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Phone</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Vehicle</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Purpose</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Entry</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Exit</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {visitorLogs.map((v) =>
              <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-smooth">
                    <td className="py-3 px-2 text-foreground">{v.name}</td>
                    <td className="py-3 px-2 text-foreground">{v.phone}</td>
                    <td className="py-3 px-2 text-foreground">{v.vehicleNumber}</td>
                    <td className="py-3 px-2 text-foreground">{v.purpose}</td>
                    <td className="py-3 px-2 text-muted-foreground">{v.entryTime}</td>
                    <td className="py-3 px-2 text-muted-foreground">{v.exitTime || '—'}</td>
                    <td className="py-3 px-2">
                      <Badge variant={v.status === 'inside' ? 'default' : 'secondary'}>{v.status}</Badge>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </Layout>;


export default AdminVisitors;