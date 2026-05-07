import aptImg from '../assets/aptitude.png';
import dsaImg from '../assets/image1.png';
import pythonImg from '../assets/pythondev.png';
import sql from '../assets/sql.png';

export const STAT_CARDS = [
  { icon: 'check', color: '#10b981', value: '5/45', label: 'Modules Completed' },
  { icon: 'book', color: '#6366f1', value: '1/4', label: 'Active Paths' },
  { icon: 'target', color: '#06b6d4', value: '3', label: 'Tests Passed' },
  { icon: 'award', color: '#f59e0b', value: '0', label: 'Certificates' },
];

export const SKILL_PATHS = [
  { name: 'Python Developer', img: pythonImg, modules: '5/12', pct: 42, color: '#4f46e5' },
  { name: 'SQL Developer', img: sql, modules: '0/10', pct: 0, color: '#6366f1' },
  { name: 'Data Structures & Algorithms', img: dsaImg, modules: '0/14', pct: 0, color: '#8b5cf6' },
  { name: 'Aptitude Preparation', img: aptImg, modules: '0/9', pct: 0, color: '#a78bfa' },
];

export const RECENT_ACTIVITY = [
  { type: 'completed', label: 'Python Basics & Setup', time: '2 hours ago', color: '#10b981' },
  { type: 'started', label: 'Functions & Scope', time: '1 day ago', color: '#6366f1' },
  { type: 'passed', label: 'Control Flow — Module Test', time: '2 days ago', color: '#f59e0b' },
  { type: 'earned', label: 'Python Beginner Badge', time: '3 days ago', color: '#8b5cf6' },
];

export const UPCOMING_TESTS = [
  { title: 'Functions & Scope Test', path: 'Python Developer', tag: 'Module Test', tagColor: '#6366f1', when: 'After module completion' },
  { title: 'Beginner Mastery Test', path: 'Python Developer', tag: 'Mastery Test', tagColor: '#f59e0b', when: 'After all modules' },
  { title: 'Arrays & Strings Test', path: 'DSA', tag: 'Module Test', tagColor: '#6366f1', when: 'Available now' },
];

export const ANNOUNCEMENTS = [
  {
    dot: '#10b981',
    title: 'New Skill Path: React Developer',
    body: 'We are excited to announce the upcoming React Developer skill path, launching ne…',
  },
  {
    dot: '#f59e0b',
    title: 'System Maintenance — March 5',
    body: 'LearnX will undergo scheduled maintenance on March 5, 2026 from 2:00 AM to 4:00 …',
  },
];
