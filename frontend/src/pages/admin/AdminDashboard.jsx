import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Users, ClipboardList, Car } from 'lucide-react';
import { apiCall } from '@/lib/api';


















const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingRequests: 0,
    twoWheelers: 0,
    fourWheelers: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch stats
        const statsResponse = await apiCall('/students/stats');
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        // Fetch recent students
        const studentsResponse = await apiCall('/students');
        const studentsData = await studentsResponse.json();
        if (studentsData.success) {
          setRecentStudents(studentsData.data.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground">System overview and management</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Students" value={loading ? '...' : stats.totalStudents} icon={<Users size={24} />} />
          <StatsCard title="Two Wheelers" value={loading ? '...' : stats.twoWheelers} icon={<Car size={24} />} />
          <StatsCard title="Four Wheelers" value={loading ? '...' : stats.fourWheelers} icon={<Car size={24} />} variant="default" />
          <StatsCard title="Pending Requests" value={loading ? '...' : stats.pendingRequests} icon={<ClipboardList size={24} />} variant="warning" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Students */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  Recent Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ?
                <div className="text-center py-4">
                    <p className="text-muted-foreground">Loading...</p>
                  </div> :
                recentStudents.length === 0 ?
                <div className="text-center py-4">
                    <p className="text-muted-foreground">No students found</p>
                  </div> :

                <div className="space-y-3">
                    {recentStudents.map((student) =>
                  <div key={student._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                        </div>
                        <Badge variant={student.status === 'approved' ? 'default' : 'secondary'}>
                          {student.status}
                        </Badge>
                      </div>
                  )}
                  </div>
                }
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car size={20} className="text-primary" />
                  System Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                { label: 'Registered Students', value: stats.totalStudents, icon: <Users size={16} /> },
                { label: 'Two Wheeler Vehicles', value: stats.twoWheelers, icon: <Car size={16} /> },
                { label: 'Four Wheeler Vehicles', value: stats.fourWheelers, icon: <Car size={16} /> },
                { label: 'Pending Approvals', value: stats.pendingRequests, icon: <ClipboardList size={16} /> }].
                map((item) =>
                <div key={item.label} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-foreground">
                      <span className="text-primary">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="font-bold text-foreground">{loading ? '...' : item.value}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>);

};

export default AdminDashboard;