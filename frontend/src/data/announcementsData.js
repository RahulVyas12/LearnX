// To add a new announcement, simply append a new object to the ANNOUNCEMENTS_DATA array.
// Ensure the ID is unique and the icon is one of the supported types.
// =============================================================
//  announcementsData.js
//  Static announcement entries for the Announcements page.
//  Each entry has: id, tag, tagColor, date, title, body, icon
//  icon: 'star' | 'wrench' | 'bolt' | 'info' | 'check'
// =============================================================

export const ANNOUNCEMENTS_DATA = [
  {
    id: 1,
    tag: 'New Feature',
    tagColor: 'green',
    date: '2026-03-01',
    title: 'New Skill Path: React Developer',
    body: 'We are excited to announce the upcoming React Developer skill path, launching next week! It includes 12 structured modules covering hooks, context, routing, and advanced patterns.',
    icon: 'star',
  },
  {
    id: 2,
    tag: 'Maintenance',
    tagColor: 'orange',
    date: '2026-02-28',
    title: 'System Maintenance — March 5',
    body: 'LearnX will undergo scheduled maintenance on March 5, 2026 from 2:00 AM to 4:00 AM UTC. During this window, the platform may be temporarily unavailable.',
    icon: 'wrench',
  },
  {
    id: 3,
    tag: 'Feature Update',
    tagColor: 'purple',
    date: '2026-02-25',
    title: 'Certificate Generation Now Available',
    body: 'Students who have completed all levels of a skill path can now generate their verified certificates directly from the Certificates page.',
    icon: 'bolt',
  },
  {
    id: 4,
    tag: 'Improvement',
    tagColor: 'blue',
    date: '2026-02-20',
    title: 'Enhanced Practice Test Experience',
    body: 'We have redesigned the practice test player with a cleaner UI, instant answer feedback, and a detailed results summary at the end of each session.',
    icon: 'check',
  },
  {
    id: 5,
    tag: 'New Feature',
    tagColor: 'green',
    date: '2026-02-15',
    title: 'Progress Dashboard Improvements',
    body: 'The dashboard now shows more granular progress metrics, including time spent per module and a streak tracker to keep you motivated every day.',
    icon: 'star',
  },
];
