import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage() {
return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Header - Mobile First */}
            <div className="text-center mb-12 sm:mb-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                    BYD Bekasi Timur
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-700 mb-2 px-2">
                    Tracker App
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                    Sistem pelacakan komprehensif untuk test drive kendaraan dan charging station
                </p>
            </div>

            {/* Tracker Options - Mobile First Grid */}
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    
                    {/* Test Drive Tracker */}
                    <Link to="/testdrive" className="group tap-target">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
                            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4 sm:mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
                                <Car className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                            </div>
                            
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3 sm:mb-4">
                                Test Drive Tracker
                            </h3>
                            
                            <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                                Kelola dan pantau aktivitas test drive kendaraan BYD dengan sistem pencatatan lengkap
                            </p>
                            
                            <div className="space-y-2 mb-4 sm:mb-6">
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                                    <span>Status OUT/IN tracking</span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                                    <span>Dokumentasi foto kendaraan</span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                                    <span>Dashboard & reporting</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700 text-sm sm:text-base">
                                <span>Masuk ke Test Drive</span>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            </div>
                        </div>
                    </Link>

                    {/* Charging AC/DC Tracker */}
                    <Link to="/charging" className="group tap-target">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-1">
                            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4 sm:mb-6 mx-auto group-hover:bg-green-200 transition-colors">
                                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                            </div>
                            
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3 sm:mb-4">
                                Charging AC/DC Tracker
                            </h3>
                            
                            <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                                Monitor aktivitas charging kendaraan listrik di station AC dan DC
                            </p>
                            
                            <div className="space-y-2 mb-4 sm:mb-6">
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                                    <span>AC & DC charging tracking</span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                                    <span>Customer & vehicle info</span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                                    <span>Photo documentation</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center text-green-600 font-semibold group-hover:text-green-700 text-sm sm:text-base">
                                <span>Masuk ke Charging</span>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            </div>
                        </div>
                    </Link>

                </div>
            </div>

            {/* Footer Info - Mobile Optimized */}
            <div className="text-center mt-8 sm:mt-12 text-gray-500 text-xs sm:text-sm px-4">
                <p>© 2025 Tracker Management System developed by <a href="https://linktr.ee/kenalRaka" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">linktr.ee/kenalRaka</a></p>
            </div>
        </div>
    </div>
);
}
