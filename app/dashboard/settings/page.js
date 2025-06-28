"use client";
import React, { useState, useEffect } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
    Settings, 
    LogOut, 
    User,
    Mail,
    Calendar,
    Shield,
    AlertTriangle
} from 'lucide-react';

const SettingsPage = () => {
    const { user } = useKindeBrowserClient();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
            <div className='p-6 max-w-4xl mx-auto space-y-8'>
                {/* Header */}
                <div className='text-center space-y-2'>
                    <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        Settings
                    </h1>
                    <p className='text-gray-600 text-lg'>
                        Manage your preferences and account information
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* User Profile Card */}
                    <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-gray-900'>
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
                                    <h3 className='text-xl font-semibold text-gray-900'>
                                        {user?.name || 'User Name'}
                                    </h3>
                                    <p className='text-gray-600'>
                                        {user?.email || 'user@example.com'}
                                    </p>
                                    <Badge variant="secondary" className='mt-2'>
                                        Administrator
                                    </Badge>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className='space-y-4'>
                                <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                                    <Mail className='h-5 w-5 text-gray-500' />
                                    <div>
                                        <p className='text-sm font-medium text-gray-900'>Email</p>
                                        <p className='text-sm text-gray-600'>
                                            {user?.email || 'Not available'}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                                    <Shield className='h-5 w-5 text-gray-500' />
                                    <div>
                                        <p className='text-sm font-medium text-gray-900'>User ID</p>
                                        <p className='text-sm text-gray-600 font-mono'>
                                            {user?.id || 'Not available'}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                                    <Calendar className='h-5 w-5 text-gray-500' />
                                    <div>
                                        <p className='text-sm font-medium text-gray-900'>Member Since</p>
                                        <p className='text-sm text-gray-600'>
                                            {formatDate(user?.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Actions Card */}
                    <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-gray-900'>
                                <Settings className='h-5 w-5 text-purple-600' />
                                Account Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {/* Account Status */}
                            <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                    <div>
                                        <p className='text-sm font-medium text-green-900'>Account Status</p>
                                        <p className='text-sm text-green-700'>Active and verified</p>
                                    </div>
                                </div>
                            </div>

                            {/* Logout Section */}
                            <div className='space-y-4'>
                                <div className='border-t pt-4'>
                                    <Label className='text-base font-medium text-gray-900 mb-3 block'>
                                        Session Management
                                    </Label>
                                    
                                    {!showLogoutConfirm ? (
                                        <Button
                                            onClick={() => setShowLogoutConfirm(true)}
                                            variant="outline"
                                            className='w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300'
                                        >
                                            <LogOut className='h-4 w-4' />
                                            Sign Out
                                        </Button>
                                    ) : (
                                        <div className='space-y-3'>
                                            <div className='flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200'>
                                                <AlertTriangle className='h-4 w-4 text-red-600' />
                                                <p className='text-sm text-red-800'>
                                                    Are you sure you want to sign out?
                                                </p>
                                            </div>
                                            <div className='flex gap-2'>
                                                <LogoutLink
                                                    className='flex-1'
                                                    postLogoutRedirectURL='/'
                                                >
                                                    <Button
                                                        variant="destructive"
                                                        className='w-full flex items-center gap-2'
                                                    >
                                                        <LogOut className='h-4 w-4' />
                                                        Yes, Sign Out
                                                    </Button>
                                                </LogoutLink>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowLogoutConfirm(false)}
                                                    className='flex-1'
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
                                <p className='text-sm text-blue-800'>
                                    <strong>Security Tip:</strong> Always sign out when using shared devices or public computers.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats */}
                <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2 text-gray-900'>
                            <Settings className='h-5 w-5 text-green-600' />
                            Account Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div className='text-center p-4 bg-blue-50 rounded-lg'>
                                <div className='text-2xl font-bold text-blue-600'>
                                    Active
                                </div>
                                <div className='text-sm text-gray-600'>Session Status</div>
                            </div>
                            <div className='text-center p-4 bg-green-50 rounded-lg'>
                                <div className='text-2xl font-bold text-green-600'>Verified</div>
                                <div className='text-sm text-gray-600'>Account Status</div>
                            </div>
                            <div className='text-center p-4 bg-purple-50 rounded-lg'>
                                <div className='text-2xl font-bold text-purple-600'>Admin</div>
                                <div className='text-sm text-gray-600'>User Role</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;