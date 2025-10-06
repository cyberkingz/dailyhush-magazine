import React from 'react';
import { 
  Users, 
  Mail, 
  TrendingUp, 
  Calendar,
  Globe,
  BarChart3,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import type { Lead } from '../../lib/types/leads';
import type { ContactSubmission } from '../../lib/types/contact';

interface DashboardStatsProps {
  leads: Lead[];
  contactSubmissions?: ContactSubmission[];
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

const DashboardStats: React.FC<DashboardStatsProps> = ({ leads, contactSubmissions = [], loading }) => {
  // Calculate statistics
  const stats = React.useMemo(() => {
    if (loading) {
      return {
        totalLeads: 0,
        subscribedLeads: 0,
        confirmedLeads: 0,
        todayLeads: 0,
        weekLeads: 0,
        monthLeads: 0,
        lastMonthLeads: 0,
        topSources: [],
        // Contact submission stats
        totalSubmissions: 0,
        newSubmissions: 0,
        inProgressSubmissions: 0,
        repliedSubmissions: 0,
        todaySubmissions: 0,
        overdueSubmissions: 0
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

    // Contact submission statistics
    const totalSubmissions = contactSubmissions.length;
    const newSubmissions = contactSubmissions.filter(s => s.status === 'new').length;
    const inProgressSubmissions = contactSubmissions.filter(s => s.status === 'in_progress').length;
    const repliedSubmissions = contactSubmissions.filter(s => s.status === 'replied').length;
    const todaySubmissions = contactSubmissions.filter(s => new Date(s.created_at) >= today).length;
    
    // Overdue submissions (new submissions > 24 hours old)
    const overdueSubmissions = contactSubmissions.filter(s => 
      s.status === 'new' && 
      (now.getTime() - new Date(s.created_at).getTime()) > 24 * 60 * 60 * 1000
    ).length;

    return {
      totalLeads,
      subscribedLeads,
      confirmedLeads,
      todayLeads,
      weekLeads,
      monthLeads,
      lastMonthLeads,
      topSources,
      // Contact submission stats
      totalSubmissions,
      newSubmissions,
      inProgressSubmissions,
      repliedSubmissions,
      todaySubmissions,
      overdueSubmissions
    };
  }, [leads, contactSubmissions, loading]);

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
      {/* Contact Submissions Alert */}
      {stats.overdueSubmissions > 0 && (
        <div className="bg-red-500/10 backdrop-blur-[16px] backdrop-saturate-[140%] border border-red-500/20 rounded-[12px] shadow-[0_4px_8px_rgba(239,68,68,0.1)] p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div>
            <div className="font-medium text-red-300">
              {stats.overdueSubmissions} contact submission{stats.overdueSubmissions > 1 ? 's' : ''} overdue
            </div>
            <div className="text-sm text-red-200/80">
              These submissions have been waiting for more than 24 hours and need immediate attention.
            </div>
          </div>
        </div>
      )}

      {/* Contact Submissions Summary */}
      {contactSubmissions.length > 0 && (
        <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] p-6 border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Contact Submissions</h3>
            <MessageSquare className="h-5 w-5 text-white/50" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-500/20 backdrop-blur-[8px] rounded-full mb-2">
                <MessageSquare className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white">{stats.newSubmissions}</div>
              <div className="text-sm text-white/60">New</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500/20 backdrop-blur-[8px] rounded-full mb-2">
                <Clock className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white">{stats.inProgressSubmissions}</div>
              <div className="text-sm text-white/60">In Progress</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500/20 backdrop-blur-[8px] rounded-full mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white">{stats.repliedSubmissions}</div>
              <div className="text-sm text-white/60">Replied</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-[8px] rounded-full mb-2">
                <Calendar className="h-5 w-5 text-white/60" />
              </div>
              <div className="text-xl font-bold text-white">{stats.todaySubmissions}</div>
              <div className="text-sm text-white/60">Today</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] p-6 border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] hover:shadow-[0_12px_20px_-4px_rgba(31,45,61,0.12),0_20px_36px_-8px_rgba(31,45,61,0.16)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-white/70">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-white mt-2">
                  {loading ? (
                    <div className="h-8 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] rounded-[8px] animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'positive' && (
                    <ArrowUp className="h-4 w-4 text-emerald-400 mr-1" />
                  )}
                  {stat.changeType === 'negative' && (
                    <ArrowDown className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-emerald-400' :
                    stat.changeType === 'negative' ? 'text-red-400' :
                    'text-amber-400'
                  }`}>
                    {loading ? '...' : stat.change}
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-1">
                  {stat.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-500/20 backdrop-blur-[8px] rounded-[12px] flex items-center justify-center text-amber-400">
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
        <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] p-6 border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Top Sources
            </h3>
            <Globe className="h-5 w-5 text-white/50" />
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] rounded-[8px] animate-pulse flex-1 mr-4"></div>
                  <div className="h-4 w-12 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] rounded-[8px] animate-pulse"></div>
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
                        index === 0 ? 'bg-amber-400' :
                        index === 1 ? 'bg-emerald-400' :
                        'bg-emerald-300'
                      }`}></div>
                      <span className="text-sm font-medium text-white capitalize">
                        {source.source}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">
                        {source.count}
                      </div>
                      <div className="text-xs text-white/60">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <Globe className="h-12 w-12 text-white/30 mx-auto mb-2" />
              <p className="text-sm text-white/60">
                No source data available
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] p-6 border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Recent Activity
            </h3>
            <BarChart3 className="h-5 w-5 text-white/50" />
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] rounded-[8px] animate-pulse mb-2"></div>
                    <div className="h-3 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] rounded-[8px] animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/20 backdrop-blur-[8px] rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {stats.todayLeads} new leads today
                  </p>
                  <p className="text-xs text-white/60">
                    Keep up the great work!
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/20 backdrop-blur-[8px] rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {stats.weekLeads} leads this week
                  </p>
                  <p className="text-xs text-white/60">
                    {stats.weekLeads > stats.lastMonthLeads ? 'Above' : 'Below'} last week's average
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-500/20 backdrop-blur-[8px] rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {subscriptionRate}% subscription rate
                  </p>
                  <p className="text-xs text-white/60">
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
