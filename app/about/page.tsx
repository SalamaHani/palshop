import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Footer';
import { Heart, Users, Globe, Award } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0a0a0a] dark:via-[#0f0f0f] dark:to-[#0a0a0a]">


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-[#215732] to-[#34d399] bg-clip-text text-transparent">
                            About PALshop
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Connecting the world with authentic Palestinian craftsmanship, culture, and tradition
                    </p>
                </div>

                {/* Story Section */}
                <div className="mb-20">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            Our Story
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            <p>
                                PALshop was founded with a simple yet powerful mission: to showcase the rich heritage and
                                exceptional craftsmanship of Palestinian artisans to the world.
                            </p>
                            <p>
                                Every product in our collection tells a story—from the ancient olive groves that produce
                                our golden oil to the skilled hands that create intricate embroidery passed down through
                                generations.
                            </p>
                            <p>
                                We believe that by choosing Palestinian products, you're not just purchasing items; you're
                                supporting families, preserving traditions, and celebrating a vibrant culture.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                        Our Values
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="inline-flex p-4 bg-gradient-to-br from-[#215732]/10 to-[#34d399]/10 rounded-2xl mb-4">
                                <Heart className="w-8 h-8 text-[#215732] dark:text-[#34d399]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                Authenticity
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                100% genuine Palestinian products, crafted with traditional methods
                            </p>
                        </div>

                        <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="inline-flex p-4 bg-gradient-to-br from-[#215732]/10 to-[#34d399]/10 rounded-2xl mb-4">
                                <Users className="w-8 h-8 text-[#215732] dark:text-[#34d399]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                Community
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Supporting local artisans and their families directly
                            </p>
                        </div>

                        <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="inline-flex p-4 bg-gradient-to-br from-[#215732]/10 to-[#34d399]/10 rounded-2xl mb-4">
                                <Globe className="w-8 h-8 text-[#215732] dark:text-[#34d399]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                Sustainability
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Eco-friendly practices and traditional sustainable methods
                            </p>
                        </div>

                        <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="inline-flex p-4 bg-gradient-to-br from-[#215732]/10 to-[#34d399]/10 rounded-2xl mb-4">
                                <Award className="w-8 h-8 text-[#215732] dark:text-[#34d399]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                Quality
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Premium products that meet the highest standards
                            </p>
                        </div>
                    </div>
                </div>

                {/* Impact Section */}
                <div className="bg-gradient-to-r from-[#215732] to-[#34d399] rounded-3xl p-8 md:p-12 text-white">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Our Impact
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold mb-2">500+</div>
                            <p className="text-lg opacity-90">Artisans Supported</p>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">10,000+</div>
                            <p className="text-lg opacity-90">Products Sold</p>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">50+</div>
                            <p className="text-lg opacity-90">Countries Reached</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
