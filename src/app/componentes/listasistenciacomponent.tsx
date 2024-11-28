import React, { useState, useEffect } from 'react';

interface AttendanceListProps {
  subjectId: number;
}

interface AttendanceRecord {
  student_id: number;
  nombre: string;
  apellido: string;
  fecha: string;
  presente: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', { 
    day: '2-digit', 
    month: '2-digit', 
    year: '2-digit' 
  });
};

const AttendanceListComponent: React.FC<AttendanceListProps> = ({ subjectId }) => {
  const [subjectName, setSubjectName] = useState<string>('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchSubjectAndAttendance = async () => {
      try {
        // Fetch subject details
        const subjectResponse = await fetch(`https://regzusapi.onrender.com/subjects/${subjectId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
          },
        });
        const subjectData = await subjectResponse.json();
        setSubjectName(subjectData.nombre);

        // Fetch attendance records
        const attendanceResponse = await fetch(`https://regzusapi.onrender.com/subjects/${subjectId}/attendance/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
          },
        });
        const attendanceData: AttendanceRecord[] = await attendanceResponse.json();
        setAttendanceRecords(attendanceData);

        // Extract unique dates
        const uniqueDates = [...new Set(attendanceData.map((record) => record.fecha))];
        setDates(uniqueDates as string[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSubjectAndAttendance();
  }, [subjectId]);

  // Group students and their attendance
  const groupedStudents = attendanceRecords.reduce((acc, record) => {
    const studentKey = `${record.nombre} ${record.apellido}`;
    if (!acc[studentKey]) {
      acc[studentKey] = {};
    }
    acc[studentKey][record.fecha] = record.presente;
    return acc;
  }, {} as Record<string, Record<string, boolean>>);

  return (
    <div className="container-fluid">
      <h2 className="mb-4">{subjectName}</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Alumno</th>
              {dates.map(date => (
                <th key={date}>{formatDate(date)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedStudents).map(([studentName, attendance]) => (
              <tr key={studentName}>
                <td>{studentName}</td>
                {dates.map(date => (
                  <td 
                    key={date} 
                    className={
                      attendance[date] === true 
                        ? 'table-success text-center' 
                        : 'table-danger text-center'
                    }
                  >
                    {attendance[date] === true ? 'P' : 'A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceListComponent;