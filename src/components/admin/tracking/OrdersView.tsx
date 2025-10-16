import React, { useEffect, useState } from 'react'
import { getShopifyOrders, getRevenueMetrics } from '@/lib/services/trackingAnalytics'
import type { DateRange, ShopifyOrder, RevenueMetrics } from '@/lib/services/trackingAnalytics'
import { KPICard } from './KPICard'

interface OrdersViewProps {
  dateRange: DateRange
}

const OrdersView: React.FC<OrdersViewProps> = ({ dateRange }) => {
  const [orders, setOrders] = useState<ShopifyOrder[]>([])
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [ordersData, metricsData] = await Promise.all([
          getShopifyOrders(dateRange, 100),
          getRevenueMetrics(dateRange)
        ])
        setOrders(ordersData)
        setMetrics(metricsData)
      } catch (error) {
        console.error('Error fetching Shopify orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center text-white/60 py-8">
        No order data available
      </div>
    )
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
        />
        <KPICard
          label="Total Orders"
          value={metrics.totalOrders.toString()}
        />
        <KPICard
          label="Average Order Value"
          value={formatCurrency(metrics.averageOrderValue)}
        />
        <KPICard
          label="This Week"
          value={formatCurrency(metrics.weekRevenue)}
          subtitle={`${metrics.weekOrders} orders`}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Orders</h3>

        {orders.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            No orders found for the selected date range
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Order</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">UTM Campaign</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-mono text-xs">
                      {order.order_name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white">
                        {order.customer_first_name && order.customer_last_name
                          ? `${order.customer_first_name} ${order.customer_last_name}`
                          : order.customer_email || 'Guest'}
                      </div>
                      {order.customer_email && (
                        <div className="text-white/50 text-xs">{order.customer_email}</div>
                      )}
                      {order.billing_country && (
                        <div className="text-white/40 text-xs">{order.billing_country}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div>{order.product_name || 'N/A'}</div>
                      {order.quantity > 1 && (
                        <div className="text-white/50 text-xs">Qty: {order.quantity}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-white font-semibold">
                      {formatCurrency(order.total_price, order.currency)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.financial_status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : order.financial_status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {order.financial_status || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {order.utm_campaign ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
                          {order.utm_campaign}
                        </span>
                      ) : (
                        <span className="text-white/40 text-xs">No campaign</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-white/70 text-xs">
                      {formatDate(order.order_created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Campaign Attribution Summary */}
      {orders.length > 0 && (
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Revenue by Campaign</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(
              orders.reduce((acc, order) => {
                const campaign = order.utm_campaign || 'No Campaign'
                if (!acc[campaign]) {
                  acc[campaign] = { revenue: 0, orders: 0 }
                }
                acc[campaign].revenue += order.total_price
                acc[campaign].orders += 1
                return acc
              }, {} as Record<string, { revenue: number; orders: number }>)
            )
              .sort((a, b) => b[1].revenue - a[1].revenue)
              .map(([campaign, data]) => (
                <div key={campaign} className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/70 text-sm mb-1">{campaign}</div>
                  <div className="text-white text-2xl font-bold mb-1">
                    {formatCurrency(data.revenue)}
                  </div>
                  <div className="text-white/50 text-xs">
                    {data.orders} {data.orders === 1 ? 'order' : 'orders'}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersView
