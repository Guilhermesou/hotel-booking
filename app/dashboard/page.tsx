"use client"


import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Button, Select, SelectItem, Spinner } from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, Bed, Wrench, TrendingUp, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [data, setData] = useState({
    occupancy: null,
    revenue: null,
    bookings: null,
    guests: null,
    maintenance: null,
    forecast: null,
    staffPerformance: null
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          occupancyRes,
          revenueRes,
          bookingsRes,
          guestsRes,
          maintenanceRes,
          forecastRes,
          staffRes
        ] = await Promise.all([
          fetch('/api/reports/occupancy'),
          fetch(`/api/reports/revenue?period=${period}`),
          fetch(`/api/reports/bookings?period=${period}`),
          fetch('/api/reports/guests'),
          fetch('/api/reports/maintenance'),
          fetch('/api/reports/forecast'),
          fetch(`/api/reports/staff-performance?period=${period}`)
        ]);

        const [occupancy, revenue, bookings, guests, maintenance, forecast, staffPerformance] = await Promise.all([
          occupancyRes.json(),
          revenueRes.json(),
          bookingsRes.json(),
          guestsRes.json(),
          maintenanceRes.json(),
          forecastRes.json(),
          staffRes.json()
        ]);

        setData({
          occupancy,
          revenue,
          bookings,
          guests,
          maintenance,
          forecast,
          staffPerformance
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Visão geral do desempenho do hotel</p>
        </div>
        <Select
          label="Período"
          selectedKeys={[period]}
          onSelectionChange={(keys) => setPeriod(Array.from(keys)[0])}
          className="max-w-xs"
        >
          <SelectItem key="7">Últimos 7 dias</SelectItem>
          <SelectItem key="30">Últimos 30 dias</SelectItem>
          <SelectItem key="90">Últimos 3 meses</SelectItem>
        </Select>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bed className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Taxa de Ocupação</p>
              <p className="text-2xl font-bold">{data.occupancy?.occupancyRate}%</p>
              <p className="text-xs text-gray-500">
                {data.occupancy?.occupied}/{data.occupancy?.total} quartos
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold">{formatCurrency(data.revenue?.totalRevenue || 0)}</p>
              <p className="text-xs text-gray-500">
                ADR: {formatCurrency(data.revenue?.adr || 0)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hóspedes Ativos</p>
              <p className="text-2xl font-bold">{data.guests?.activeGuests || 0}</p>
              <p className="text-xs text-gray-500">
                +{data.guests?.newGuests || 0} novos
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center space-x-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wrench className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Manutenção</p>
              <p className="text-2xl font-bold">{data.maintenance?.pendingTasks || 0}</p>
              <p className="text-xs text-gray-500">
                {data.maintenance?.overdueTasks || 0} atrasadas
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receita por dia */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Receita Diária</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.revenue?.revenueByDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Ocupação prevista */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Previsão de Ocupação (30 dias)</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.forecast?.occupancyByDay?.slice(0, 10) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Line type="monotone" dataKey="occupancyRate" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Mais gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status das reservas */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Status das Reservas</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.bookings?.bookingsByStatus || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="_count.id"
                  nameKey="status"
                >
                  {(data.bookings?.bookingsByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Performance da equipe */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Performance da Equipe</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.staffPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completedTasks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Métricas adicionais */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Métricas Importantes</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">RevPAR</span>
              <span className="font-semibold">{formatCurrency(data.revenue?.revpar || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taxa de Cancelamento</span>
              <span className="font-semibold">{data.bookings?.cancellationRate || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tempo Médio de Estadia</span>
              <span className="font-semibold">{data.revenue?.averageStayLength?.toFixed(1) || 0} dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hóspedes Recorrentes</span>
              <span className="font-semibold">{data.guests?.recurringGuests || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Receita Projetada (30d)</span>
              <span className="font-semibold">{formatCurrency(data.forecast?.projectedRevenue || 0)}</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Alertas e notificações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertas
            </h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {data.maintenance?.overdueTasks > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">{data.maintenance.overdueTasks} tarefas de manutenção atrasadas</span>
              </div>
            )}
            {data.maintenance?.roomsInMaintenance > 0 && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">{data.maintenance.roomsInMaintenance} quartos em manutenção</span>
              </div>
            )}
            {data.bookings?.cancellationRate > 10 && (
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Taxa de cancelamento alta: {data.bookings.cancellationRate}%</span>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Top Hóspedes
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {data.guests?.topGuests?.slice(0, 5).map((guest, index) => (
                <div key={guest.id} className="flex justify-between items-center py-1">
                  <span className="text-sm">{guest.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {guest.reservationCount} reservas
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;