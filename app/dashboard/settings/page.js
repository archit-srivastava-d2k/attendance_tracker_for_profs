"use client";
import React, { useState, useEffect } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
    Settings, 
    Moon, 
    Sun, 
    User,
    Mail,
    Calendar,
    Shield
} from 'lucide-react';

const SettingsPage = () => {
    const { user } = useKindeBrowserClient();
    const [darkMode, setDarkMode] = useState(false);

    // Load dark mode preference from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Handle dark mode toggle
    const handleDarkModeToggle = (checked) => {
        setDarkMode(checked);
        if (checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
            <div className='p-6 max-w-4xl mx-auto space-y-8'>
                {/* Header */}
                <div className='text-center space-y-2'>
                    <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        Settings
                    </h1>
                    <p className='text-gray-600 dark:text-gray-300 text-lg'>
                        Manage your preferences and account information
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* User Profile Card */}
                    <Card className='shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                                <User className='h-5 w-5 text-blue-600' />
                                User Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {/* User Avatar and Basic Info */}
                            <div className='flex items-center gap-4'>
                                <Avatar className='w-16 h-16'>
                                    <AvatarImage src={user?.picture} alt={user?.name} />
                                    <AvatarFallback className='text-lg font-semibold bg-blue-100 text-blue-600'>
                                        {getInitials(user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='flex-1'>
                                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                                        {user?.name || 'User Name'}
                                    </h3>
                                    <p className='text-gray-600 dark:text-gray-300'>
                                        {user?.email || 'user@example.com'}
                                    </p>
                                    <Badge variant="secondary" className='mt-2'>
                                        Administrator
                                    </Badge>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className='space-y-4'>
                                <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                    <Mail className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <div>
                                        <p className='text-sm font-medium text-gray-900 dark:text-white'>Email</p>
                                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                                            {user?.email || 'Not available'}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                    <Shield className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <div>
                                        <p className='text-sm font-medium text-gray-900 dark:text-white'>User ID</p>
                                        <p className='text-sm text-gray-600 dark:text-gray-300 font-mono'>
                                            {user?.id || 'Not available'}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                    <Calendar className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <div>
                                        <p className='text-sm font-medium text-gray-900 dark:text-white'>Member Since</p>
                                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                                            {formatDate(user?.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Theme Settings Card */}
                    <Card className='shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                                {darkMode ? (
                                    <Moon className='h-5 w-5 text-purple-600' />
                                ) : (
                                    <Sun className='h-5 w-5 text-yellow-600' />
                                )}
                                Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {/* Dark Mode Toggle */}
                            <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                <div className='space-y-1'>
                                    <Label className='text-base font-medium text-gray-900 dark:text-white'>
                                        Dark Mode
                                    </Label>
                                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                                        Switch between light and dark themes
                                    </p>
                                </div>
                                <Switch
                                    checked={darkMode}
                                    onCheckedChange={handleDarkModeToggle}
                                    className='data-[state=checked]:bg-purple-600'
                                />
                            </div>

                            {/* Theme Preview */}
                            <div className='space-y-3'>
                                <Label className='text-sm font-medium text-gray-900 dark:text-white'>
                                    Theme Preview
                                </Label>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className={`p-3 rounded-lg border-2 transition-all ${
                                        !darkMode 
                                            ? 'border-blue-500 bg-white' 
                                            : 'border-gray-300 bg-white'
                                    }`}>
                                        <div className='w-full h-8 bg-gray-100 rounded mb-2'></div>
                                        <div className='w-2/3 h-4 bg-gray-200 rounded mb-1'></div>
                                        <div className='w-1/2 h-4 bg-gray-200 rounded'></div>
                                        <p className='text-xs text-center mt-2 text-gray-600'>Light</p>
                                    </div>
                                    <div className={`p-3 rounded-lg border-2 transition-all ${
                                        darkMode 
                                            ? 'border-purple-500 bg-gray-800' 
                                            : 'border-gray-300 bg-gray-800'
                                    }`}>
                                        <div className='w-full h-8 bg-gray-700 rounded mb-2'></div>
                                        <div className='w-2/3 h-4 bg-gray-600 rounded mb-1'></div>
                                        <div className='w-1/2 h-4 bg-gray-600 rounded'></div>
                                        <p className='text-xs text-center mt-2 text-gray-300'>Dark</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats */}
                <Card className='shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2 text-gray-900 dark:text-white'>
                            <Settings className='h-5 w-5 text-green-600' />
                            Quick Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div className='text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                                <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                                    {darkMode ? 'Dark' : 'Light'}
                                </div>
                                <div className='text-sm text-gray-600 dark:text-gray-300'>Current Theme</div>
                            </div>
                            <div className='text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg'>
                                <div className='text-2xl font-bold text-green-600 dark:text-green-400'>Active</div>
                                <div className='text-sm text-gray-600 dark:text-gray-300'>Account Status</div>
                            </div>
                            <div className='text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
                                <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>Admin</div>
                                <div className='text-sm text-gray-600 dark:text-gray-300'>User Role</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;