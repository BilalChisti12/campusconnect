import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldX, Users, CarFront, Clock } from 'lucide-react';
import { entryLogs, visitorLogs } from '@/data/mockData';
import { toast } from 'sonner';

const EntranceDashboard = () => {
  const [recentActions, setRecentActions] = useState([]);

  const handleVerify = (action) => {
    const newAction = {
      id: Date.now(),
      action,
      vehicle: 'KA-XX-XX-' + Math.floor(1000 + Math.random() * 9000),
      time: new Date().toLocaleTimeString()
    };
    setRecentActions((prev) => [newAction, ...prev.slice(0, 9)]);
    if (action === 'allow') {
      toast.success('Vehicle entry allowed');
    } else {
      toast.error('Vehicle entry denied');
    }
  };

  const activeVisitors = visitorLogs.filter((v) => v.status === 'inside').length;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Entrance Security Dashboard</h2>
          <p className="text-muted-foreground">Gate verification and visitor management</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Entries Today" value={entryLogs.filter((l) => l.type === 'entry').length} icon={<CarFront size={24} />} />
          <StatsCard title="Exits Today" value={entryLogs.filter((l) => l.type === 'exit').length} icon={<CarFront size={24} />} variant="warning" />
          <StatsCard title="Active Visitors" value={activeVisitors} icon={<Users size={24} />} variant="success" />
          <StatsCard title="Denied Today" value={recentActions.filter((a) => a.action === 'deny').length} icon={<ShieldX size={24} />} variant="destructive" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sticker Verification */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-primary" />
                  Vehicle Sticker Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Verify the vehicle sticker visually and mark the decision below.
                </p>
                <div className="flex gap-3">
                  <Button className="flex-1 transition-smooth" onClick={() => handleVerify('allow')}>
                    <ShieldCheck size={18} className="mr-2" />
                    Allow Entry
                  </Button>
                  <Button variant="destructive" className="flex-1 transition-smooth" onClick={() => handleVerify('deny')}>
                    <ShieldX size={18} className="mr-2" />
                    Deny Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  Recent Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActions.length === 0 ?
                <p className="text-sm text-muted-foreground text-center py-8">No actions yet today</p> :

                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {recentActions.map((action) =>
                  <div key={action.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted">
                        <div>
                          <span className="text-sm font-medium text-foreground">{action.vehicle}</span>
                          <span className="text-xs text-muted-foreground ml-2">{action.time}</span>
                        </div>
                        <Badge variant={action.action === 'allow' ? 'default' : 'destructive'}>
                          {action.action === 'allow' ? 'Allowed' : 'Denied'}
                        </Badge>
                      </div>
                  )}
                  </div>
                }
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Entry Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Entry Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Student</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Vehicle</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Method</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {entryLogs.map((log) =>
                  <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-smooth">
                      <td className="py-3 px-2 text-foreground">{log.studentName}</td>
                      <td className="py-3 px-2 text-foreground">{log.vehicleNumber}</td>
                      <td className="py-3 px-2">
                        <Badge variant={log.type === 'entry' ? 'default' : 'secondary'}>{log.type}</Badge>
                      </td>
                      <td className="py-3 px-2 text-foreground capitalize">{log.method}</td>
                      <td className="py-3 px-2 text-muted-foreground">{log.timestamp}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>);

};

export default EntranceDashboard;