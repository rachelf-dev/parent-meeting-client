export interface ParentMeetingDto1 {
    studentId: number;
    parentId: number;
    teacherId: number;
    teacherName: string;
    className: string;
    schoolId: number;
    meetingDate: string; // ב-JS תאריך מגיע לרוב כמחרוזת מה-JSON
    startTime: string;   // TimeSpan מגיע כמחרוזת (00:00:00)
    endTime: string;
    isPast: boolean;
}