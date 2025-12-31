import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await fetch('/api/dashboard/stats');
                const statsData = await statsRes.json();
                setStats(statsData);

                const logsRes = await fetch('/api/dashboard/logs');
                const logsData = await logsRes.json();
                setLogs(logsData.logs);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        fetchData();

        // Refresh logs every 5 seconds to simulate liveliness
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const triggerBuild = async () => {
        setLoading(true);
        try {
            await fetch('/api/dashboard/trigger', { method: 'POST' });
            // Simulate adding a new log line immediately
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Manual build triggered...`]);
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    if (!stats) return <div className="loading-screen">Loading Mission Control...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>MISSION CONTROL</h1>
                <div className="user-profile">
                    <button className="btn-logout" onClick={() => navigate('/')}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                    </button>
                    <span>Admin</span>
                    <div className="avatar">A</div>
                </div>
            </header>

            <main className="dashboard-grid">
                {/* Stats Row */}
                <div className="stat-card prod">
                    <h3>Production</h3>
                    <div className="status-indicator healthy">
                        <i className="fa-solid fa-circle-check"></i> {stats.production.status}
                    </div>
                    <p>Version: {stats.production.version}</p>
                    <p>Uptime: {stats.production.uptime}</p>
                </div>

                <div className="stat-card staging">
                    <h3>Staging</h3>
                    <div className="status-indicator warning">
                        <i className="fa-solid fa-rotate"></i> {stats.staging.status}
                    </div>
                    <p>Version: {stats.staging.version}</p>
                    <p>Uptime: {stats.staging.uptime}</p>
                </div>

                <div className="stat-card success-rate">
                    <h3>Success Rate</h3>
                    <div className="big-number">{stats.build_success_rate}%</div>
                    <div className="progress-bar">
                        <div className="fill" style={{ width: `${stats.build_success_rate}%` }}></div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="logs-panel">
                    <div className="panel-header">
                        <h3><i className="fa-solid fa-terminal"></i> Live Build Logs</h3>
                        <button className="btn-trigger" onClick={triggerBuild} disabled={loading}>
                            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-play"></i>}
                            Trigger Build
                        </button>
                    </div>
                    <div className="terminal-window">
                        {logs.map((log, index) => (
                            <div key={index} className="log-line">{log}</div>
                        ))}
                        <div className="cursor">_</div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
