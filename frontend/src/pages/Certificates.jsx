import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import SideBar from '../components/layout/SideBar';
import TopBar from '../components/layout/TopBar';

// Services
import certificateService from '../services/certificateService';
import { useAuth } from '../hooks/useAuth';
import { jsPDF } from 'jspdf';

export default function Certificates() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        async function fetchCertificates() {
            try {
                const response = await certificateService.getMyCertificates();
                const data = response.data;
                setCertificates(data);
                if (data.length > 0) {
                    setSelectedCertificate(data[0]);
                }
            } catch (error) {
                console.error('Error fetching certificates:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCertificates();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const downloadCertificate = (cert) => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // 1. Background & Border
        doc.setFillColor(248, 249, 250);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        doc.setDrawColor(79, 70, 229); // Indigo-600
        doc.setLineWidth(5);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');
        
        doc.setDrawColor(79, 70, 229, 0.1);
        doc.setLineWidth(1);
        doc.rect(13, 13, pageWidth - 26, pageHeight - 26, 'S');

        // 2. Branding
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(28);
        doc.setTextColor(49, 46, 129); // Indigo-900
        doc.text('LearnX', pageWidth / 2, 40, { align: 'center' });

        // 3. Main Text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(100, 116, 139); // Slate-500
        doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 60, { align: 'center' });

        doc.setFontSize(12);
        doc.text('THIS CERTIFIES THAT', pageWidth / 2, 80, { align: 'center' });

        doc.setFont('times', 'italic');
        doc.setFontSize(42);
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text(user?.name || 'LearnX Student', pageWidth / 2, 100, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text('HAS SUCCESSFULLY COMPLETED THE', pageWidth / 2, 120, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(49, 46, 129);
        doc.text(`${cert.skillPathTitle} Program`, pageWidth / 2, 135, { align: 'center' });

        // 4. Footer Details
        doc.setDrawColor(203, 213, 225); // Slate-300
        doc.setLineWidth(0.5);
        
        // Issued Date
        doc.line(40, 170, 100, 170);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184); // Slate-400
        doc.text('DATE ISSUED', 70, 175, { align: 'center' });
        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105); // Slate-600
        doc.text(formatDate(cert.issuedAt), 70, 182, { align: 'center' });

        // ID
        doc.line(pageWidth - 100, 170, pageWidth - 40, 170);
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text('CERTIFICATE ID', pageWidth - 70, 175, { align: 'center' });
        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105);
        doc.text(cert.id.substring(0, 8).toUpperCase(), pageWidth - 70, 182, { align: 'center' });

        // 5. Seal (Circle)
        doc.setDrawColor(251, 191, 36); // Amber-400
        doc.setFillColor(251, 191, 36);
        doc.circle(pageWidth / 2, 175, 12, 'FD');
        doc.setTextColor(120, 53, 15); // Amber-900
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('LX', pageWidth / 2, 178, { align: 'center' });

        // Save
        doc.save(`LearnX_Certificate_${cert.id.substring(0, 8)}.pdf`);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-['Plus_Jakarta_Sans']">
            <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} activePage="certificates" />

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto w-full lg:pl-72">
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🏆</span>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Certificates</h1>
                        </div>
                        <p className="text-slate-500 text-[15px] font-medium">
                            Manage and view your verified achievements.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                        </div>
                    ) : (
                        <>
                            {certificates.length === 0 ? (
                                <div className="bg-white rounded-[32px] p-12 text-center border border-slate-200/60 shadow-sm">
                                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📜</div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">No certificates earned yet</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
                                        Complete a skill path and pass all level mastery tests to earn your first certificate.
                                    </p>
                                    <button
                                        onClick={() => navigate('/skill-paths')}
                                        className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all"
                                    >
                                        Explore Skill Paths
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12">
                                    {certificates.map((cert) => (
                                        <div
                                            key={cert.id}
                                            onClick={() => setSelectedCertificate(cert)}
                                            className={`cursor-pointer bg-white rounded-[24px] p-6 border transition-all ${selectedCertificate?.id === cert.id ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-md' : 'border-slate-200/60 shadow-sm hover:shadow-md'}`}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                                                        <span className="text-2xl">🏅</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{cert.skillPathTitle}</h3>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                                            Issued on {formatDate(cert.issuedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-600 font-bold text-[11px] uppercase tracking-wider shrink-0 border border-emerald-100">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Verified
                                                </div>
                                            </div>
                                            <button className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors border border-slate-100">
                                                View Preview
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedCertificate && (
                                <div id="certificate-preview" className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-8 xl:p-12">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Certificate Preview</h2>
                                        <button
                                            onClick={() => downloadCertificate(selectedCertificate)}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Download PDF
                                        </button>
                                    </div>

                                    <div className="w-full bg-slate-100/50 rounded-2xl p-6 sm:p-12 flex items-center justify-center relative overflow-hidden">
                                        <div className="relative w-full max-w-2xl aspect-[1.414/1] bg-[#f8f9fa] shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm border-[12px] border-[#e2e8f0] p-10 flex flex-col items-center justify-center text-center z-10 transition-transform duration-500 hover:scale-[1.01]">
                                            <div className="absolute inset-4 border-2 border-indigo-900/10 pointer-events-none" />
                                            <div className="absolute inset-5 border border-indigo-900/5 pointer-events-none" />

                                            <div className="mb-6">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs italic">LX</div>
                                                    <span className="font-extrabold text-indigo-900 text-2xl tracking-tight">LearnX</span>
                                                </div>
                                            </div>

                                            <h1 className="text-[10px] font-bold text-indigo-900/50 uppercase tracking-[0.3em] mb-4">
                                                Certificate of Completion
                                            </h1>

                                            <p className="text-[10px] text-slate-500 font-medium tracking-wide mb-2 uppercase">
                                                This certifies that
                                            </p>

                                            <h2 className="text-3xl text-slate-800 font-serif italic font-medium mb-5">
                                                {user?.name || 'LearnX Student'}
                                            </h2>

                                            <p className="text-[10px] text-slate-500 font-medium tracking-wide mb-2 uppercase">
                                                has successfully completed the
                                            </p>

                                            <h3 className="text-lg font-bold text-indigo-900 tracking-tight mb-10">
                                                {selectedCertificate.skillPathTitle} Program
                                            </h3>

                                            <div className="w-full flex justify-between items-end mt-auto px-6">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-24 border-b border-slate-300 mb-2"></div>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Date Issued</span>
                                                    <span className="text-[11px] text-slate-600 font-semibold mt-1">{formatDate(selectedCertificate.issuedAt)}</span>
                                                </div>

                                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center shadow-lg border-4 border-[#f8f9fa] relative">
                                                    <span className="font-serif font-bold text-amber-900/80 text-sm">LX</span>
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <div className="w-24 border-b border-slate-300 mb-2"></div>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ID</span>
                                                    <span className="text-[11px] text-slate-600 font-semibold mt-1">{selectedCertificate.id.substring(0, 8).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
