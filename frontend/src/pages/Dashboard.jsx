import { useEffect, useState } from 'react';

// Layout Components
import { useAuth } from '../hooks/useAuth';
import SideBar from '../components/layout/SideBar';
import TopBar from '../components/layout/TopBar';

// Dashboard Components
import ActiveSkillPathsCard from '../components/dashboard/ActiveSkillPathsCard';
import AnnouncementsCard from '../components/dashboard/AnnouncementsCard';
import OverallProgressCard from '../components/dashboard/OverallProgressCard';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';
import StatCard from '../components/dashboard/StatCard';
import UpcomingTestsCard from '../components/dashboard/UpcomingTestsCard';
import WelcomeHeader from '../components/dashboard/WelcomeHeader';

// Services
import progressService from '../services/progressService';

// Data (Keep static for UI pieces not yet in API)
import {
  ANNOUNCEMENTS,
  RECENT_ACTIVITY,
  UPCOMING_TESTS
} from '../data/dashboardData';

export default function Dashboard() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [enrolledPaths, setEnrolledPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, pathsRes] = await Promise.all([
          progressService.getDashboard(),
          progressService.getEnrolledPaths()
        ]);
        setStats(statsRes.data);
        setEnrolledPaths(pathsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    {
      label: 'Modules Completed',
      value: stats?.modulesCompleted || 0,
      icon: 'check',
      color: '#10b981'
    },
    {
      label: 'Active Paths',
      value: stats?.activePaths || 0,
      icon: 'book',
      color: '#6366f1'
    },
    {
      label: 'Tests Passed',
      value: stats?.testsPassed || 0,
      icon: 'target',
      color: '#06b6d4'
    },
    {
      label: 'Certificates',
      value: stats?.certificatesEarned || 0,
      icon: 'award',
      color: '#f59e0b'
    }
  ];

  const totalModules = stats?.modulesCompleted > 45 ? stats?.modulesCompleted + 10 : 45; // Fallback or dynamic total if available

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activePage="dashboard" />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto lg:pl-72">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 bg-white px-4 py-4 sm:px-6 lg:px-8 sm:py-6">
          <WelcomeHeader name={user?.name?.split(' ')[0] || 'Student'} />

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                  <StatCard key={card.label} card={card} />
                ))}
              </div>

              {/* Progress & Skill Paths Row */}
              <div className="mb-5 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
                <OverallProgressCard completed={stats?.modulesCompleted || 0} total={totalModules} />
                <ActiveSkillPathsCard paths={enrolledPaths.map(p => ({
                    id: p.skillPathId,
                    name: p.title,
                    subtitle: p.domain,
                    pct: p.progressPercentage,
                    modules: p.completedModulesCount !== undefined ? `${p.completedModulesCount}/${p.totalModulesCount}` : '0/0',
                    color: '#6366f1',
                    img: p.imageUrl ? `http://localhost:5000${p.imageUrl}` : null
                }))} />
              </div>

              {/* Activity & Side Column Row */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
                <RecentActivityCard activities={RECENT_ACTIVITY} />

                <div className="flex flex-col gap-5">
                  <UpcomingTestsCard tests={UPCOMING_TESTS} />
                  <AnnouncementsCard announcements={ANNOUNCEMENTS} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
