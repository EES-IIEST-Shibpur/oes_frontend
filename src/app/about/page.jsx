'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { CheckCircle, Users, Zap, Target } from 'lucide-react';

export default function AboutPage() {
    return (
        <>
        <Navbar />
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6">About AptiCrack</h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Empowering students to master aptitude tests and excel in their careers through innovative online examination solutions.
                        </p>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="py-16 px-4 bg-gray-50">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To provide students with a comprehensive, accessible, and effective platform for preparing and taking aptitude examinations. We aim to democratize quality educational resources and help every student reach their full potential.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To become the leading online examination platform trusted by millions of students worldwide. We envision a world where quality education and fair assessment are accessible to everyone, regardless of their background or location.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features/Why Us */}
                <div className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Why Choose AptiCrack?</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ backgroundColor: '#75B06F' }}
                                >
                                    <Zap className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">Lightning Fast</h3>
                                <p className="text-gray-600 text-sm">
                                    Experience seamless, responsive exams with no lag or delays
                                </p>
                            </div>
                            <div className="text-center">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ backgroundColor: '#75B06F' }}
                                >
                                    <Target className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">Personalized</h3>
                                <p className="text-gray-600 text-sm">
                                    Adaptive learning paths tailored to your strengths and weaknesses
                                </p>
                            </div>
                            <div className="text-center">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ backgroundColor: '#75B06F' }}
                                >
                                    <CheckCircle className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">Comprehensive</h3>
                                <p className="text-gray-600 text-sm">
                                    Extensive question bank covering all major aptitude test formats
                                </p>
                            </div>
                            <div className="text-center">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ backgroundColor: '#75B06F' }}
                                >
                                    <Users className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">Community</h3>
                                <p className="text-gray-600 text-sm">
                                    Join thousands of students and share your learning journey
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Features */}
                <div className="py-16 px-4 bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Key Features</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: '#75B06F' }}
                                >
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Real-time Analytics</h3>
                                    <p className="text-gray-600">
                                        Track your progress with detailed performance metrics and insights
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: '#75B06F' }}
                                >
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Mock Exams</h3>
                                    <p className="text-gray-600">
                                        Practice with realistic exam simulations to build confidence
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: '#75B06F' }}
                                >
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Detailed Solutions</h3>
                                    <p className="text-gray-600">
                                        Comprehensive explanations for every question to enhance learning
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: '#75B06F' }}
                                >
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Mobile Friendly</h3>
                                    <p className="text-gray-600">
                                        Learn anytime, anywhere with our responsive mobile interface
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="py-16 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dedicated Team</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
                            Our passionate team of educators, developers, and designers are committed to creating the best learning experience for every student.
                        </p>
                        <button
                            className="px-8 py-3 rounded-lg text-white font-medium transition hover:opacity-90"
                            style={{ backgroundColor: '#75B06F' }}
                        >
                            Meet Our Team
                        </button>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-16 px-4 bg-gray-900 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-gray-300 text-lg mb-8">
                            Join thousands of students who are already using AptiCrack to ace their exams.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                className="px-8 py-3 rounded-lg font-medium transition hover:opacity-90"
                                style={{ backgroundColor: '#75B06F' }}
                            >
                                Start Practicing Now
                            </button>
                            <button className="px-8 py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-800 transition">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
