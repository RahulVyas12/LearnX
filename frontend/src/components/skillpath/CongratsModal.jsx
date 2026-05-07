import React from 'react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../../hooks/useAuth';

export default function CongratsModal({ cert, onClose }) {
    const { user } = useAuth();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const downloadCertificate = () => {
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
        doc.text(cert.certificateNumber || cert.id.substring(0, 8).toUpperCase(), pageWidth - 70, 182, { align: 'center' });

        // 5. Seal (Circle)
        doc.setDrawColor(251, 191, 36); // Amber-400
        doc.setFillColor(251, 191, 36);
        doc.circle(pageWidth / 2, 175, 12, 'FD');
        doc.setTextColor(120, 53, 15); // Amber-900
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('LX', pageWidth / 2, 178, { align: 'center' });

        // Save
        doc.save(`LearnX_Certificate_${cert.skillPathTitle.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-indigo-500/10 w-full max-w-4xl overflow-hidden relative animate-in zoom-in-95 duration-500">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-8 text-slate-400 hover:text-slate-600 transition-colors p-2"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex flex-col md:flex-row h-full">
                    {/* Visual Side */}
                    <div className="w-full md:w-2/5 bg-linear-to-br from-indigo-600 to-violet-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl -ml-32 -mb-32" />
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                                <span className="text-3xl">🏆</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tight leading-tight">Achievement Unlocked!</h2>
                            <p className="text-indigo-100 font-bold mt-4 opacity-80 italic">
                                You have successfully mastered all levels and proven your expertise.
                            </p>
                        </div>

                        <div className="relative z-10 p-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-[28px]">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-2">Verified Achievement</p>
                            <h3 className="font-black text-lg">{cert.skillPathTitle}</h3>
                        </div>
                    </div>

                    {/* Action Side */}
                    <div className="flex-1 p-10 md:p-14 flex flex-col items-center justify-center text-center">
                        <div className="mb-10 w-full">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Issued to</h3>
                            <p className="text-3xl font-black text-slate-900 tracking-tight">{user?.name}</p>
                            <div className="h-1 w-12 bg-indigo-100 mx-auto mt-4 rounded-full" />
                        </div>

                        {/* Certificate Preview Mockup */}
                        <div className="w-full max-w-sm aspect-[1.414/1] bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10 shadow-sm relative group cursor-pointer overflow-hidden" onClick={downloadCertificate}>
                            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors duration-500" />
                            <div className="border border-indigo-100 h-full w-full rounded-lg flex flex-col items-center justify-center p-4">
                                <div className="text-[6px] font-black text-indigo-900/30 uppercase tracking-[0.3em] mb-2">Certificate of Completion</div>
                                <div className="text-slate-800 font-serif italic text-sm mb-2">{user?.name}</div>
                                <div className="text-[6px] font-bold text-indigo-900 truncate w-full text-center">{cert.skillPathTitle}</div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Preview & Download
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <button 
                                onClick={downloadCertificate}
                                className="flex-1 px-8 py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-[22px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download PDF
                            </button>
                            <button 
                                onClick={onClose}
                                className="px-8 py-5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-[22px] font-black uppercase tracking-widest transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
