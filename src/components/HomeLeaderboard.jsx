'use client';

import React from 'react';
import { Calendar, Users, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { DEPT_MAP } from '@/constants/profileMaps';
import Image from 'next/image';

const HomeLeaderboard = () => {
  const { data: leaderboardResponse, isLoading } = useQuery({
    queryKey: ['home-leaderboard'],
    queryFn: () => apiFetch('/api/leaderboard/top-five'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const leaderboardData = leaderboardResponse?.data || {
    exam: {
      title: "Loading...",
      examDate: new Date().toISOString(),
      totalMarks: 100
    },
    data: [],
    totalParticipants: 0
  };

  const getRankIcon = (rank) => {
    const medals = {
      1: "🥇",
      2: "🥈",
      3: "🥉"
    };
    return medals[rank] ? <span className="text-3xl">{medals[rank]}</span> : null;
  };

  const getRankStyles = (rank) => {
    switch(rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
          border: 'border-amber-300',
          text: 'text-amber-900',
          rankBg: 'bg-gradient-to-r from-amber-400 to-yellow-400'
        };
      case 2:
        return {
          bg: 'bg-gradient-to-r from-slate-100 to-gray-100',
          border: 'border-slate-300',
          text: 'text-slate-900',
          rankBg: 'bg-gradient-to-r from-slate-300 to-gray-300'
        };
      case 3:
        return {
          bg: 'bg-gradient-to-r from-orange-100 to-amber-100',
          border: 'border-orange-300',
          text: 'text-orange-900',
          rankBg: 'bg-gradient-to-r from-orange-400 to-amber-400'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
          border: 'border-green-300',
          text: 'text-green-900',
          rankBg: 'bg-gradient-to-r from-green-300 to-emerald-400'
        };
    }
  };

  const getYearText = (year) => {
    const yearMap = {
      "ONE": "1st Year",
      "TWO": "2nd Year",
      "THREE": "3rd Year",
      "FOUR": "4th Year"
    };
    return yearMap[year] || year;
  };

  const getDepartmentName = (dept) => {
    return DEPT_MAP[dept] || dept;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const { exam, data, totalParticipants } = leaderboardData;

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 text-center">
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 relative bg-gradient-to-b from-gray-50 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="mb-12 relative z-10 max-w-7xl mx-auto">
        <div className="text-center space-y-3">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image 
              src="/images/AptiCrack_Logo-removebg.png" 
              alt="AptiCrack Logo" 
              width={220} 
              height={220}
              className="object-contain"
            />
          </div>
          
          <div className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent to-green-500 rounded-full"></div>
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="h-1 w-12 bg-gradient-to-l from-transparent to-green-500 rounded-full"></div>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 mb-3">
            Hall of Excellence
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            🏆 Celebrating outstanding achievement among <span className="font-bold text-green-700">{totalParticipants}</span> brilliant minds
          </p>
        </div>
      </div>

      {/* Exam Info Card */}
      <div className="relative z-10 bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-2xl shadow-2xl p-8 mb-12 border-2 border-green-300 overflow-hidden group hover:shadow-green-200 hover:shadow-3xl transition-all duration-500 max-w-7xl mx-auto">
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-block mb-2">
              <span className="px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                Latest Session
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{exam.title}</h3>
            <p className="text-gray-600 font-medium">Recent examination results</p>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center group/item hover:scale-110 transition-transform duration-300">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover/item:shadow-green-500/50 group-hover/item:rotate-6 transition-all duration-300">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Date</p>
              <p className="text-gray-900 font-black text-sm">{formatDate(exam.examDate)}</p>
            </div>
            <div className="text-center group/item hover:scale-110 transition-transform duration-300">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover/item:shadow-green-500/50 group-hover/item:rotate-6 transition-all duration-300">
                <Target className="w-7 h-7 text-white" />
              </div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Out of</p>
              <p className="text-gray-900 font-black text-sm">{exam.totalMarks}</p>
            </div>
            <div className="text-center group/item hover:scale-110 transition-transform duration-300">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover/item:shadow-green-500/50 group-hover/item:rotate-6 transition-all duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Total</p>
              <p className="text-gray-900 font-black text-sm">{totalParticipants}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-4 relative z-10 max-w-7xl mx-auto">
        {data.map((student, index) => {
          const styles = getRankStyles(student.rank);
          const isTopThree = student.rank <= 3;
          
          return (
            <div
              key={index}
              className={`${styles.bg} rounded-2xl p-6 border-2 ${styles.border} hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ${isTopThree ? 'shadow-xl' : 'shadow-md'} relative overflow-hidden group animate-slideIn`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
              
              {/* Top 3 special effects */}
              {isTopThree && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-transparent rounded-full filter blur-2xl opacity-30"></div>
              )}
              
              <div className="flex items-center justify-between relative z-10">
                {/* Left - Rank & Icon */}
                <div className="flex items-center gap-5 flex-1">
                  <div className="relative">
                    <div className={`${styles.rankBg} rounded-2xl w-16 h-16 flex items-center justify-center shadow-xl flex-shrink-0 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                      <span className="text-white font-black text-2xl">#{student.rank}</span>
                    </div>
                    {student.rank <= 3 && (
                      <div className="absolute -top-2 -right-2 animate-bounce">
                        {getRankIcon(student.rank)}
                      </div>
                    )}
                  </div>

                  {/* Name & Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg md:text-xl font-black ${styles.text} group-hover:scale-105 transition-transform duration-300`}>
                        {student.name}
                      </h3>
                      {student.rank === 1 && (
                        <span className="text-2xl animate-pulse">👑</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-gray-800 shadow-md border border-gray-200 hover:scale-105 transition-transform duration-300">
                        {getDepartmentName(student.department)}
                      </span>
                      <span className="text-sm font-bold text-gray-700 bg-white/70 px-3 py-1 rounded-full">
                        {getYearText(student.year)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right - Score */}
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="relative">
                    <div className={`text-3xl md:text-4xl font-black ${styles.text} group-hover:scale-110 transition-transform duration-300`}>
                      {student.score}
                    </div>
                    <div className="text-sm text-gray-600 font-bold mt-1">
                      of {exam.totalMarks}
                    </div>
                    {/* Percentage badge */}
                    <div className="mt-2">
                      <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {((student.score / exam.totalMarks) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center relative z-10">
        <div className="inline-block bg-gradient-to-r from-green-100 via-emerald-100 to-green-100 rounded-2xl px-8 py-4 shadow-lg border-2 border-green-300">
          <p className="text-base font-bold text-gray-700">
            Showcasing top <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">{data.length}</span> performers from{' '}
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">{totalParticipants}</span> exceptional candidates
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HomeLeaderboard;
