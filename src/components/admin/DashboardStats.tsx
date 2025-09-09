import React from 'react';
import { 
  Users, 
  Mail, 
  TrendingUp, 
  Eye, 
  Calendar,
  Globe,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import type { Lead } from '../../lib/types/leads';

interface DashboardStatsProps {
  leads: Lead[];
  loading?: boolean;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ leads, loading }) => {
  // Calculate statistics
  const stats = React.useMemo(() => {
    if (loading || leads.length === 0) {
      return {
        totalLeads: 0,
        subscribedLeads: 0,
        confirmedLeads: 0,
        todayLeads: 0,
        weekLeads: 0,
        monthLeads: 0,
        topSources: []
      };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const totalLeads = leads.length;
    const subscribedLeads = leads.filter(lead => lead.is_subscribed).length;
    const confirmedLeads = leads.filter(lead => lead.confirmed_at).length;
    
    const todayLeads = leads.filter(lead => new Date(lead.created_at) >= today).length;
    const weekLeads = leads.filter(lead => new Date(lead.created_at) >= weekAgo).length;
    const monthLeads = leads.filter(lead => new Date(lead.created_at) >= monthAgo).length;
    const lastMonthLeads = leads.filter(lead => {
      const date = new Date(lead.created_at);
      return date >= lastMonth && date < monthAgo;
    }).length;

    // Calculate sources
    const sourceCount = leads.reduce((acc, lead) => {
      const source = lead.source_page || 'unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSources = Object.entries(sourceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([source, count]) => ({ source, count }));

    return {
      totalLeads,
      subscribedLeads,
      confirmedLeads,
      todayLeads,
      weekLeads,
      monthLeads,
      lastMonthLeads,
      topSources
    };
  }, [leads, loading]);

  // Calculate growth percentages
  const calculateGrowth = (current: number, previous: number): { percentage: string; type: 'positive' | 'negative' | 'neutral' } => {
    if (previous === 0) {
      return { percentage: current > 0 ? '+100%' : '0%', type: current > 0 ? 'positive' : 'neutral' };
    }
    
    const growth = ((current - previous) / previous) * 100;
    const rounded = Math.round(growth);
    
    return {
      percentage: `${rounded > 0 ? '+' : ''}${rounded}%`,
      type: rounded > 0 ? 'positive' : rounded < 0 ? 'negative' : 'neutral'
    };
  };

  const monthGrowth = calculateGrowth(stats.monthLeads, stats.lastMonthLeads);
  const subscriptionRate = stats.totalLeads > 0 ? ((stats.subscribedLeads / stats.totalLeads) * 100).toFixed(1) : '0';
  const confirmationRate = stats.subscribedLeads > 0 ? ((stats.confirmedLeads / stats.subscribedLeads) * 100).toFixed(1) : '0';

  const statCards: StatCard[] = [
    {
      title: 'Total Leads',
      value: loading ? '...' : stats.totalLeads.toLocaleString(),
      change: monthGrowth.percentage,
      changeType: monthGrowth.type,
      icon: <Users className="h-6 w-6" />,
      description: 'All time lead collection'
    },
    {
      title: 'Active Subscribers',
      value: loading ? '...' : stats.subscribedLeads.toLocaleString(),
      change: `${subscriptionRate}% rate`,
      changeType: parseFloat(subscriptionRate) >= 80 ? 'positive' : parseFloat(subscriptionRate) >= 60 ? 'neutral' : 'negative',
      icon: <Mail className="h-6 w-6" />,
      description: 'Currently subscribed users'
    },
    {
      title: 'This Month',
      value: loading ? '...' : stats.monthLeads.toLocaleString(),
      change: monthGrowth.percentage,
      changeType: monthGrowth.type,
      icon: <Calendar className="h-6 w-6" />,
      description: 'Leads collected this month'
    },
    {
      title: 'Confirmation Rate',
      value: loading ? '...' : `${confirmationRate}%`,
      change: stats.confirmedLeads > 0 ? 'Active' : 'Setup needed',
      changeType: parseFloat(confirmationRate) >= 70 ? 'positive' : 'neutral',
      icon: <TrendingUp className="h-6 w-6" />,
      description: 'Email confirmations received'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900  mt-2">
                  {loading ? (
                    <div className="h-8 bg-gray-200  rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'positive' && (
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  )}
                  {stat.changeType === 'negative' && (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600 ' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-gray-500 '
                  }`}>
                    {loading ? '...' : stat.change}
                  </span>
                </div>
                <p className="text-xs text-gray-500  mt-1">
                  {stat.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100  rounded-lg flex items-center justify-center text-yellow-600 ">
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sources */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Sources
            </h3>
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200  rounded animate-pulse flex-1 mr-4"></div>
                  <div className="h-4 w-12 bg-gray-200  rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : stats.topSources.length > 0 ? (
            <div className="space-y-3">
              {stats.topSources.map((source, index) => {
                const percentage = ((source.count / stats.totalLeads) * 100).toFixed(1);
                return (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900  capitalize">
                        {source.source}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 ">
                        {source.count}
                      </div>
                      <div className="text-xs text-gray-500 ">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <Globe className="h-12 w-12 text-gray-300  mx-auto mb-2" />
              <p className="text-sm text-gray-500 ">
                No source data available
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200  rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200  rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200  rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100  rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600 " />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 ">
                    {stats.todayLeads} new leads today
                  </p>
                  <p className="text-xs text-gray-500 ">
                    Keep up the great work!
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100  rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600 " />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 ">
                    {stats.weekLeads} leads this week
                  </p>
                  <p className="text-xs text-gray-500 ">
                    {stats.weekLeads > stats.lastMonthLeads ? 'Above' : 'Below'} last week's average
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100  rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-yellow-600 " />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 ">
                    {subscriptionRate}% subscription rate
                  </p>
                  <p className="text-xs text-gray-500 ">
                    {parseFloat(subscriptionRate) >= 80 ? 'Excellent' : 
                     parseFloat(subscriptionRate) >= 60 ? 'Good' : 'Needs improvement'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;