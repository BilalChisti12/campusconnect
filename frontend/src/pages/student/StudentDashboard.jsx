import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Car, MapPin, QrCode, User, Loader2 } from 'lucide-react';
import { apiCall } from '@/lib/api';















const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall('/students/me');
        const data = await response.json();

        if (data.success) {
          setProfile(data.data);
        } else {
          setError(data.message || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Generate QR code data based on actual student data
  const qrData = profile ? JSON.stringify({
    studentId: profile.id,
    userId: user?.id,
    name: profile.name,
    rollNumber: profile.rollNumber,
    vehicleNumber: profile.vehicleNumber,
    slotId: profile.slotId || 'Not Assigned',
    timestamp: new Date().toISOString()
  }) : '';

  // Format vehicle type for display
  const formatVehicleType = (type) => {
    return type === 'two_wheeler' ? 'Two Wheeler' : 'Four Wheeler';
  };

  // Get parking status based on slot assignment
  const getParkingStatus = () => {
    if (!profile?.slotId) return 'No Slot Assigned';
    return profile.status === 'approved' ? 'Active' : 'Pending Approval';
  };

  // Get zone from slot ID (e.g., "A-01" -> "Zone A")
  const getZone = () => {
    if (!profile?.slotId) return 'Not Assigned';
    const zoneLetter = profile.slotId.charAt(0);
    return `Zone ${zoneLetter}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading your profile...</span>
          </div>
        </div>
      </Layout>);

  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-destructive mb-2">{error || 'Profile not found'}</p>
            <p className="text-sm text-muted-foreground">Please contact admin if this persists</p>
          </div>
        </div>
      </Layout>);

  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome, {profile.name}</h2>
          <p className="text-muted-foreground">Your parking dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Roll Number" value={profile.rollNumber} icon={<User size={24} />} />
          <StatsCard
            title="Slot Number"
            value={profile.slotId || 'Not Assigned'}
            icon={<MapPin size={24} />}
            variant={profile.slotId ? 'success' : 'warning'} />
          
          <StatsCard title="Vehicle" value={profile.vehicleNumber} icon={<Car size={24} />} />
          <StatsCard
            title="Parking Status"
            value={getParkingStatus()}
            icon={<QrCode size={24} />}
            variant={profile.status === 'approved' ? 'success' : 'warning'} />
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Details */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                { label: 'Full Name', value: profile.name },
                { label: 'Roll Number', value: profile.rollNumber },
                { label: 'Email', value: profile.email },
                { label: 'Phone', value: profile.phone || 'Not provided' },
                { label: 'Department', value: profile.department || 'Not provided' },
                { label: 'Vehicle Number', value: profile.vehicleNumber },
                { label: 'Vehicle Type', value: formatVehicleType(profile.vehicleType) },
                { label: 'Assigned Zone', value: getZone() },
                { label: 'Assigned Slot', value: profile.slotId || 'Not Assigned' }].
                map((item) =>
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-card-foreground">{item.value}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={profile.status === 'approved' ? 'default' : 'secondary'}>
                    {profile.status === 'approved' ? 'Approved' : 'Pending Approval'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* QR Code */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode size={20} className="text-primary" />
                  Your Parking QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {profile.status === 'approved' && profile.slotId ?
                <>
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                      <QRCodeSVG
                      value={qrData}
                      size={200}
                      bgColor="transparent"
                      fgColor="hsl(172, 100%, 22%)"
                      level="H" />
                    
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Show this QR code at the parking area for entry/exit
                    </p>
                    <div className="mt-3 bg-muted rounded-lg px-4 py-2 text-xs text-muted-foreground">
                      Contains: Student ID, Vehicle Number, Slot ID
                    </div>
                  </> :

                <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">
                      {profile.status === 'pending' ?
                    'Your registration is pending approval' :
                    'No parking slot assigned yet'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      QR code will be available once approved and assigned a slot
                    </p>
                  </div>
                }
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>);

};

export default StudentDashboard;