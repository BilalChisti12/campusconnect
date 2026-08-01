import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { parkingSlots as initialSlots } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Car, MapPin, CheckCircle, XCircle } from 'lucide-react';

const ParkingDashboard = () => {
  const [slots] = useState(initialSlots);

  const total = slots.length;
  const occupied = slots.filter((s) => s.status === 'occupied').length;
  const available = slots.filter((s) => s.status === 'available').length;
  const reserved = slots.filter((s) => s.status === 'reserved').length;

  const statusColors = {
    available: 'bg-success/20 border-success text-success',
    occupied: 'bg-destructive/20 border-destructive text-destructive',
    reserved: 'bg-warning/20 border-warning text-warning'
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Parking Security Dashboard</h2>
          <p className="text-muted-foreground">Real-time parking slot overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Slots" value={total} icon={<MapPin size={24} />} />
          <StatsCard title="Occupied" value={occupied} icon={<XCircle size={24} />} variant="destructive" />
          <StatsCard title="Available" value={available} icon={<CheckCircle size={24} />} variant="success" />
          <StatsCard title="Reserved" value={reserved} icon={<Car size={24} />} variant="warning" />
        </div>

        {/* Slot Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Parking Slots Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {slots.map((slot, idx) =>
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-3 rounded-lg border-2 text-center ${statusColors[slot.status]}`}>
                
                  <p className="font-bold text-lg">{slot.slotNumber}</p>
                  <p className="text-xs mt-1">{slot.zone}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {slot.status}
                  </Badge>
                  {slot.assignedTo &&
                <p className="text-xs mt-1 truncate">{slot.assignedTo}</p>
                }
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>);

};

export default ParkingDashboard;