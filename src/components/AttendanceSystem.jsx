import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, XCircle, Coffee, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AttendanceSystem = () => {
  const { user, isAdmin } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [allUsersAttendance, setAllUsersAttendance] = useState([]);

  useEffect(() => {
    loadAttendanceData();
  }, [user]);

  const loadAttendanceData = () => {
    const today = new Date().toISOString().split('T')[0];
    const attendanceData = JSON.parse(localStorage.getItem('bolt_visa_attendance') || '[]');
    
    const todayRecord = attendanceData.find(
      record => record.userId === user?.id && record.date === today
    );
    setTodayAttendance(todayRecord);

    const userHistory = attendanceData.filter(record => record.userId === user?.id);
    setAttendanceHistory(userHistory.slice(-30));

    if (isAdmin) {
      setAllUsersAttendance(attendanceData.filter(record => record.date === today));
    }
  };

  const markAttendance = (status) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const time = now.toLocaleTimeString();
    
    const attendanceData = JSON.parse(localStorage.getItem('bolt_visa_attendance') || '[]');
    
    const existingIndex = attendanceData.findIndex(
      record => record.userId === user.id && record.date === today
    );

    const attendanceRecord = {
      id: existingIndex >= 0 ? attendanceData[existingIndex].id : Date.now().toString(),
      userId: user.id,
      userName: user.name,
      employeeId: user.employeeId,
      date: today,
      status,
      time,
      timestamp: now.toISOString()
    };

    if (existingIndex >= 0) {
      attendanceData[existingIndex] = attendanceRecord;
    } else {
      attendanceData.push(attendanceRecord);
    }

    localStorage.setItem('bolt_visa_attendance', JSON.stringify(attendanceData));
    
    const statusMessages = {
      present: 'Great! You\'re marked as present today.',
      absent: 'You\'ve been marked as absent.',
      leave: 'Your leave has been recorded.',
      half_leave: 'Half day leave has been marked.'
    };

    toast({
      title: "Attendance Marked!",
      description: statusMessages[status],
    });

    loadAttendanceData();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'absent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'leave': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'half_leave': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      case 'leave': return <Coffee className="h-4 w-4" />;
      case 'half_leave': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Calendar className="mr-2 h-6 w-6 text-purple-400" />
          Attendance System
        </h2>
      </motion.div>

      {!isAdmin && (
        <Card className="visa-card">
          <CardHeader>
            <CardTitle className="text-white">Today's Attendance</CardTitle>
            <CardDescription className="text-purple-300">
              Mark your attendance for {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayAttendance ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(todayAttendance.status)}>
                    {getStatusIcon(todayAttendance.status)}
                    <span className="ml-1 capitalize">{todayAttendance.status.replace('_', ' ')}</span>
                  </Badge>
                  <span className="text-purple-300">Marked at {todayAttendance.time}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAttendance(todayAttendance.status)}
                  className="border-purple-500/20 text-white hover:bg-purple-500/10"
                >
                  Update
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-purple-300">You haven't marked attendance today.</p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => markAttendance('present')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    onClick={() => markAttendance('absent')}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Absent
                  </Button>
                  <Button
                    onClick={() => markAttendance('leave')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Coffee className="h-4 w-4 mr-1" />
                    Leave
                  </Button>
                  <Button
                    onClick={() => markAttendance('half_leave')}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Half Leave
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <Card className="visa-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="mr-2 h-5 w-5 text-purple-400" />
              Today's Team Attendance
            </CardTitle>
            <CardDescription className="text-purple-300">
              Overview of all team members' attendance for {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allUsersAttendance.length > 0 ? (
                allUsersAttendance.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-purple-500/5 border border-purple-500/10"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {record.userName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{record.userName}</h3>
                        <p className="text-xs text-purple-400">{record.employeeId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1 capitalize">{record.status.replace('_', ' ')}</span>
                      </Badge>
                      <span className="text-purple-300 text-sm">{record.time}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-purple-400/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No attendance records</h3>
                  <p className="text-purple-300">No team members have marked attendance today.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!isAdmin && (
        <Card className="visa-card">
          <CardHeader>
            <CardTitle className="text-white">Attendance History</CardTitle>
            <CardDescription className="text-purple-300">
              Your attendance record for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceHistory.length > 0 ? (
                attendanceHistory.reverse().map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-purple-500/5 border border-purple-500/10"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span className="text-white">{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1 capitalize">{record.status.replace('_', ' ')}</span>
                      </Badge>
                      <span className="text-purple-300 text-sm">{record.time}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-purple-400/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No attendance history</h3>
                  <p className="text-purple-300">Start marking your attendance to see history here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceSystem;