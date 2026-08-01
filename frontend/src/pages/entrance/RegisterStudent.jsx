import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { apiCall } from '@/lib/api';

const RegisterStudent = () => {
  const [form, setForm] = useState({
    name: '',
    rollNumber: '',
    vehicleNumber: '',
    email: '',
    password: '',
    vehicleType: 'two_wheeler'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await apiCall('/users', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email.toLowerCase().trim(),
          password: form.password,
          role: 'student',
          rollNumber: form.rollNumber.toUpperCase().trim(),
          vehicleNumber: form.vehicleNumber.toUpperCase().trim(),
          vehicleType: form.vehicleType
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Registration failed');
        return;
      }

      toast.success('Student registered successfully: ' + data.data.name);
      toast.info(`Temporary password: ${form.password}`, { duration: 10000 });

      setForm({
        name: '',
        rollNumber: '',
        vehicleNumber: '',
        email: '',
        password: '',
        vehicleType: 'two_wheeler'
      });
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Unable to submit registration request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Register New Student</h2>
          <p className="text-muted-foreground">Create a parking registration request</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus size={20} className="text-primary" />
              Student Registration Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
              { id: 'name', label: 'Full Name', placeholder: 'Enter student name', type: 'text' },
              { id: 'rollNumber', label: 'Roll Number', placeholder: 'e.g., CS2023001', type: 'text' },
              { id: 'vehicleNumber', label: 'Vehicle Number', placeholder: 'e.g., KA-01-AB-1234', type: 'text' },
              { id: 'email', label: 'Email', placeholder: 'student@campus.edu', type: 'email' }].
              map((field) =>
              <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.id]}
                  onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                  required />
                
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      minLength={6}
                      required />
                    
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}>
                      
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateTempPassword}
                    className="whitespace-nowrap">
                    
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Student will use this password to login. Please share it with them.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <select
                  id="vehicleType"
                  className="w-full rounded border border-input px-3 py-2 bg-background text-foreground"
                  value={form.vehicleType}
                  onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                  required>
                  
                  <option value="two_wheeler">Two Wheeler</option>
                  <option value="four_wheeler">Four Wheeler</option>
                </select>
              </div>
              <Button type="submit" className="w-full transition-smooth" disabled={loading}>
                <UserPlus size={18} className="mr-2" />
                {loading ? 'Submitting...' : 'Submit Registration Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>);

};

export default RegisterStudent;