// Sample portal values copied from the reference AI Campus Assistant demo.
export type Tone = "demo" | "success" | "warning" | "danger" | "primary" | "muted";

export const student = {
  name: "Devagya Tripathi",
  initials: "DT",
  firstName: "Devagya",
  regNo: "RA2311003010421",
  email: "devagya.tripathi@srmist.edu.in",
  phone: "+91 98765 43210",
  campus: "SRM IST Delhi NCR Campus",
  program: "B.Tech Computer Science Engineering",
  year: "2nd Year",
  section: "CSE-B",
};

export type ClassStatus = "Completed" | "Current" | "Next" | "Upcoming";
export interface ClassItem {
  day: string;
  subject: string;
  faculty: string;
  room: string;
  time: string;
  status: ClassStatus;
}

export const timetable: ClassItem[] = [
  { day: "Monday", subject: "Advanced Programming", faculty: "Dr. Meera Sharma", room: "Lab C-302", time: "09:00 AM - 10:30 AM", status: "Completed" },
  { day: "Monday", subject: "Database Management Systems", faculty: "Prof. Rohan Kapoor", room: "A-204", time: "10:45 AM - 12:15 PM", status: "Current" },
  { day: "Monday", subject: "Operating Systems", faculty: "Dr. Nidhi Verma", room: "B-105", time: "01:30 PM - 03:00 PM", status: "Next" },
  { day: "Tuesday", subject: "Computer Networks", faculty: "Prof. Arjun Malik", room: "A-118", time: "09:30 AM - 11:00 AM", status: "Upcoming" },
  { day: "Tuesday", subject: "Data Structures", faculty: "Dr. Priya Nair", room: "Lab C-201", time: "11:15 AM - 12:45 PM", status: "Upcoming" },
  { day: "Wednesday", subject: "Database Management Systems", faculty: "Prof. Rohan Kapoor", room: "A-204", time: "10:00 AM - 11:30 AM", status: "Upcoming" },
  { day: "Wednesday", subject: "Advanced Programming Lab", faculty: "Dr. Meera Sharma", room: "Lab C-302", time: "02:00 PM - 04:00 PM", status: "Upcoming" },
  { day: "Thursday", subject: "Operating Systems", faculty: "Dr. Nidhi Verma", room: "B-105", time: "09:30 AM - 11:00 AM", status: "Upcoming" },
  { day: "Thursday", subject: "Computer Networks Lab", faculty: "Prof. Arjun Malik", room: "Lab B-210", time: "01:00 PM - 03:00 PM", status: "Upcoming" },
  { day: "Friday", subject: "Data Structures", faculty: "Dr. Priya Nair", room: "A-109", time: "09:00 AM - 10:30 AM", status: "Upcoming" },
  { day: "Friday", subject: "APP Project Review", faculty: "Dr. Meera Sharma", room: "Seminar Hall", time: "12:00 PM - 01:00 PM", status: "Upcoming" },
];
export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export type Priority = "High" | "Medium" | "Low";
export type AssignmentStatus = "Pending" | "Submitted" | "Overdue";
export interface Assignment {
  id: string;
  title: string;
  subject: string;
  shortSubject: string;
  faculty: string;
  due: string;
  order: number;
  priority: Priority;
  status: AssignmentStatus;
  description: string;
}

export const assignments: Assignment[] = [
  { id: "a1", title: "Data Structures Tree Traversal", subject: "Data Structures", shortSubject: "Data Structures", faculty: "Dr. Priya Nair", due: "14 Sep", order: 1, priority: "Medium", status: "Overdue", description: "Implement inorder, preorder and postorder traversal for a binary tree." },
  { id: "a2", title: "Network Topology Report", subject: "Computer Networks", shortSubject: "Computer Networks", faculty: "Prof. Arjun Malik", due: "18 Sep", order: 2, priority: "Low", status: "Submitted", description: "Compare bus, star, ring and mesh topologies for a campus network." },
  { id: "a3", title: "APP Mini Project Milestone", subject: "Advanced Programming", shortSubject: "Advanced Programming", faculty: "Dr. Meera Sharma", due: "27 Sep", order: 4, priority: "High", status: "Pending", description: "Submit the milestone report and working demo of your APP team project." },
  { id: "a4", title: "Operating Systems Scheduling", subject: "Operating Systems", shortSubject: "Operating Systems", faculty: "Dr. Nidhi Verma", due: "30 Sep", order: 5, priority: "Medium", status: "Pending", description: "Simulate FCFS, SJF and Round Robin scheduling and compare waiting times." },
  { id: "a5", title: "DBMS Normalization Case Study", subject: "Database Management Systems", shortSubject: "DBMS", faculty: "Prof. Rohan Kapoor", due: "Tomorrow, 11:59 PM", order: 3, priority: "High", status: "Pending", description: "Normalize the given university schema up to BCNF with justification." },
];

export const exams = [
  { subject: "DBMS", type: "Mid Semester", place: "Academic Block A, 2nd Floor", days: 19, date: "12 October", time: "10:00 AM", room: "A-204" },
  { subject: "Operating Systems", type: "Mid Semester", place: "Academic Block B, 1st Floor", days: 23, date: "16 October", time: "2:00 PM", room: "B-105" },
  { subject: "Advanced Programming", type: "Practical", place: "Computer Lab Complex", days: 28, date: "21 October", time: "11:00 AM", room: "Lab C-302" },
  { subject: "Computer Networks", type: "Mid Semester", place: "Academic Block A, 1st Floor", days: 32, date: "25 October", time: "9:30 AM", room: "A-118" },
];

export const noticeCategories = ["All", "Academic", "Examination", "Events", "Administrative", "Urgent"] as const;
export const notices = [
  { title: "Mid Semester Examination Timetable Published", category: "Examination", date: "22 Sep", priority: "High" as Priority, body: "The examination cell has published the mid semester schedule for CSE students." },
  { title: "APP Project Review Slots", category: "Academic", date: "21 Sep", priority: "Medium" as Priority, body: "Project review slots for Advanced Programming Practice teams are now available." },
  { title: "Tech Fest Registration Open", category: "Events", date: "20 Sep", priority: "Medium" as Priority, body: "Register for coding, robotics and startup pitch competitions." },
  { title: "Library Extended Hours", category: "Administrative", date: "19 Sep", priority: "Low" as Priority, body: "The central library will remain open until 8 PM during examination preparation week." },
  { title: "Attendance Advisory", category: "Urgent", date: "18 Sep", priority: "High" as Priority, body: "Students below 85% attendance should meet their faculty advisors." },
];

export const events = [
  { id: "e1", title: "Tech Fest", org: "CSE Association", desc: "A full-day technology festival with coding contests, demos and innovation showcases.", date: "25 October", time: "10:00 AM", place: "SRM IST Delhi NCR Campus", past: false },
  { id: "e2", title: "AI Workshop", org: "AI Club", desc: "Hands-on introduction to AI application design and prompt engineering.", date: "30 September", time: "2:00 PM", place: "Seminar Hall", past: false },
];

export const attendanceSubjects = [
  { subject: "Data Structures", present: 24, total: 27, absent: 2, late: 1, pct: 88 },
  { subject: "Database Management Systems", present: 22, total: 27, absent: 4, late: 1, pct: 82 },
  { subject: "Operating Systems", present: 25, total: 27, absent: 1, late: 1, pct: 91 },
  { subject: "Computer Networks", present: 24, total: 28, absent: 3, late: 1, pct: 86 },
  { subject: "Advanced Programming", present: 24, total: 27, absent: 2, late: 1, pct: 89 },
];
export const attendanceHistory = [
  { date: "23 Sep", subject: "DBMS", status: "Present" },
  { date: "22 Sep", subject: "APP Lab", status: "Present" },
  { date: "21 Sep", subject: "Operating Systems", status: "Late" },
  { date: "20 Sep", subject: "Computer Networks", status: "Absent" },
  { date: "19 Sep", subject: "Data Structures", status: "Present" },
];

export const services = [
  { name: "Library", desc: "Books, journals, reading rooms and digital databases for academic research.", hours: "8:30 AM – 8:00 PM" },
  { name: "Cafeteria", desc: "Meals, snacks and refreshments inside the academic campus.", hours: "8:00 AM – 6:00 PM" },
  { name: "Transport", desc: "Campus bus routes, pickup points and route assistance.", hours: "7:00 AM – 7:00 PM" },
  { name: "Hostel", desc: "Student accommodation support, maintenance and warden assistance.", hours: "24/7 help desk" },
  { name: "Labs", desc: "Computer labs, programming practice rooms and project workstations.", hours: "9:00 AM – 5:30 PM" },
  { name: "Sports", desc: "Indoor and outdoor sports facilities, events and equipment issue.", hours: "6:00 AM – 7:00 PM" },
  { name: "Student Support", desc: "Academic counselling, faculty advisor meetings and student welfare support.", hours: "10:00 AM – 4:00 PM" },
  { name: "IT Helpdesk", desc: "Wi-Fi, login, lab systems and campus technology assistance.", hours: "9:00 AM – 6:00 PM" },
];

export const quickPrompts = [
  "What's my next class?",
  "Show pending assignments",
  "When is my next exam?",
  "Show today's timetable",
  "Show important notices",
  "What events are happening this week?",
  "Summarize my notices",
];

export const priorityTone: Record<Priority, Tone> = { High: "danger", Medium: "warning", Low: "success" };
export const statusTone: Record<string, Tone> = {
  Completed: "success", Current: "warning", Next: "warning", Upcoming: "muted",
  Pending: "warning", Submitted: "success", Overdue: "danger",
  Present: "success", Absent: "danger", Late: "warning",
};
