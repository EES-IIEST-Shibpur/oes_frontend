'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'What is AptiCrack?',
            answer: 'AptiCrack is an online examination platform designed to help students prepare for and take aptitude tests. We provide a comprehensive suite of practice exams, mock tests, and detailed solutions to help you excel in your exams.'
        },
        {
            question: 'How do I create an account?',
            answer: 'Simply click on the "Sign Up" button in the navigation bar, fill in your details (name, email, password), and verify your email address. Once verified, your account will be ready to use!'
        },
        {
            question: 'Is AptiCrack free to use?',
            answer: 'AptiCrack offers both free and premium plans. The free plan includes access to limited practice questions and exams. Our premium plans unlock unlimited access to all exams, detailed analytics, and advanced features.'
        },
        {
            question: 'How many exams can I take?',
            answer: 'With our premium subscription, you can take unlimited exams. Each exam can be retaken multiple times to practice and improve your score. Free users have limited exam attempts.'
        },
        {
            question: 'Can I see my results immediately after taking an exam?',
            answer: 'Yes! You can view your results immediately after submitting an exam. Your score, performance analysis, and detailed solutions for each question are available right away.'
        },
        {
            question: 'Do you provide detailed explanations for answers?',
            answer: 'Absolutely! Every question in our bank comes with detailed step-by-step explanations to help you understand the concepts and improve your problem-solving skills.'
        },
        {
            question: 'Can I track my progress over time?',
            answer: 'Yes, our analytics dashboard provides comprehensive tracking of your performance, including score trends, weak areas, and improvement suggestions based on your exam history.'
        },
        {
            question: 'Is my personal data secure?',
            answer: 'We take security seriously. All your data is encrypted and stored securely. We never share your information with third parties. Please refer to our privacy policy for more details.'
        },
        {
            question: 'What types of exams do you offer?',
            answer: 'We offer a wide range of exams including quantitative aptitude, logical reasoning, verbal ability, data interpretation, and more. New exams are added regularly to match current industry requirements.'
        },
        {
            question: 'Can I access AptiCrack on mobile devices?',
            answer: 'Yes! AptiCrack is fully responsive and works seamlessly on smartphones, tablets, and desktops. You can access your exams and practice questions on any device with an internet connection.'
        },
        {
            question: 'How long are my exam results stored?',
            answer: 'Your exam results are stored indefinitely in your account. You can review your performance history anytime to track your progress and identify areas for improvement.'
        },
        {
            question: 'What if I forget my password?',
            answer: 'No problem! Click on the "Forgot Password" link on the login page, enter your email, and follow the instructions to reset your password. You\'ll receive a reset link via email.'
        }
    ];

    return (
        <>
        <Navbar />
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h1>
                        <p className="text-gray-600 text-lg">
                            Find answers to common questions about AptiCrack and how to make the most of our platform.
                        </p>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md overflow-hidden transition"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 text-left">{faq.question}</h3>
                                    <div
                                        className="flex-shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full transition"
                                        style={{
                                            backgroundColor: openIndex === index ? '#75B06F' : '#f3f4f6'
                                        }}
                                    >
                                        {openIndex === index ? (
                                            <ChevronUp className="w-5 h-5" style={{ color: openIndex === index ? 'white' : '#75B06F' }} />
                                        ) : (
                                            <ChevronDown className="w-5 h-5" style={{ color: '#75B06F' }} />
                                        )}
                                    </div>
                                </button>

                                {/* Answer */}
                                {openIndex === index && (
                                    <div className="px-6 pb-6 pt-0 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="mt-16 p-8 rounded-xl shadow-lg" style={{ backgroundColor: '#75B06F' }}>
                        <h2 className="text-2xl font-bold text-white mb-4">Didn't find your answer?</h2>
                        <p className="text-white/90 mb-6">
                            If you couldn't find the answer you're looking for, please don't hesitate to reach out to our support team.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block px-6 py-3 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
