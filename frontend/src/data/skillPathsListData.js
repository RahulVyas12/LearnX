import aptImg from '../assets/aptitude.png';
import dsaImg from '../assets/image1.png';
import pythonImg from '../assets/pythondev.png';
import sqlImg from '../assets/sql.png';

export const PATHS = [
    {
        title: 'Python Developer',
        description: 'Master Python from fundamentals to advanced concepts including OOP, data structures, file handling, and real-world project development.',
        image: pythonImg,
        modules: 12,
        levels: 3,
        hasCertificate: true,
        progress: 42,
        tags: ['Python', 'OOP'],
        color: '#4f46e5'
    },
    {
        title: 'SQL Developer',
        description: 'Master SQL from basic queries to advanced database design, optimization, and stored procedures.',
        image: sqlImg,
        modules: 10,
        levels: 3,
        hasCertificate: true,
        progress: 0,
        tags: ['SQL', 'Database'],
        color: '#6366f1'
    },
    {
        title: 'Data Structures & Algorithms',
        description: 'Build strong problem-solving skills with arrays, trees, graphs, sorting, searching, and dynamic programming.',
        image: dsaImg,
        modules: 14,
        levels: 3,
        hasCertificate: true,
        progress: 0,
        tags: ['DSA', 'Algorithms'],
        color: '#8b5cf6'
    },
    {
        title: 'Aptitude Preparation',
        description: 'Sharpen your quantitative, logical, and verbal reasoning skills for campus placements and competitive exams.',
        image: aptImg,
        modules: 9,
        levels: 3,
        hasCertificate: true,
        progress: 0,
        tags: ['Aptitude', 'Placement'],
        color: '#a78bfa'
    }
];
