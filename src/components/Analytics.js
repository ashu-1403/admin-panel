import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [registrationData, setRegistrationData] = useState({ labels: [], datasets: [] });
  const [total24h, setTotal24h] = useState(0);
  const [total7d, setTotal7d] = useState(0);
  const [total15d, setTotal15d] = useState(0);
  const [total30d, setTotal30d] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then((res) => {
        const users = res.data;
        const now = new Date();

        const filteredUsers = {
          last24h: users.filter(user => (now - new Date(user.registeredAt)) / (1000 * 60 * 60) <= 24).length,
          last7d: users.filter(user => (now - new Date(user.registeredAt)) / (1000 * 60 * 60 * 24) <= 7).length,
          last15d: users.filter(user => (now - new Date(user.registeredAt)) / (1000 * 60 * 60 * 24) <= 15).length,
          last30d: users.filter(user => (now - new Date(user.registeredAt)) / (1000 * 60 * 60 * 24) <= 30).length,
        };

        setTotal24h(filteredUsers.last24h);
        setTotal7d(filteredUsers.last7d);
        setTotal15d(filteredUsers.last15d);
        setTotal30d(filteredUsers.last30d);

        const registrationsByMonth = users.reduce((acc, user) => {
          const month = new Date(user.registeredAt).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        setRegistrationData({
          labels: Object.keys(registrationsByMonth),
          datasets: [{
            label: 'User Registrations',
            data: Object.values(registrationsByMonth),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
          }],
        });
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-200 p-6 rounded-lg shadow-lg text-center">
          <p className="text-xl font-semibold">Last 24 Hours</p>
          <p className="text-3xl font-bold text-blue-700">{total24h}</p>
        </div>
        <div className="bg-green-200 p-6 rounded-lg shadow-lg text-center">
          <p className="text-xl font-semibold">Last 7 Days</p>
          <p className="text-3xl font-bold text-green-700">{total7d}</p>
        </div>
        <div className="bg-yellow-200 p-6 rounded-lg shadow-lg text-center">
          <p className="text-xl font-semibold">Last 15 Days</p>
          <p className="text-3xl font-bold text-yellow-700">{total15d}</p>
        </div>
        <div className="bg-red-200 p-6 rounded-lg shadow-lg text-center">
          <p className="text-xl font-semibold">Last 30 Days</p>
          <p className="text-3xl font-bold text-red-700">{total30d}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Monthly User Registrations</h3>
        <div className="h-[400px] md:h-[600px]">
          <Bar 
            data={registrationData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    font: {
                      size: 14,
                      weight: 'bold',
                    }
                  }
                },
                title: {
                  display: true,
                  text: 'User Registrations Over the Months',
                  font: {
                    size: 18,
                    weight: 'bold',
                  },
                  padding: {
                    top: 20,
                    bottom: 20
                  }
                }
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    font: {
                      size: 14,
                    }
                  }
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    font: {
                      size: 14,
                    }
                  }
                }
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
