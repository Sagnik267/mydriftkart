import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';

export default function AgentManager() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/agents').then(res => setAgents(res.data)).catch(console.error);
  }, []);

  const toggleSuspension = async (id, currentStatus) => {
    await axios.put(`/api/admin/users/${id}/suspend`, { isSuspended: !currentStatus });
    setAgents(agents.map(a => a._id === id ? { ...a, isSuspended: !currentStatus } : a));
  };

  return (
    <div className="admin-container-block">
      <h2>🛴 Delivery Agents</h2>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: 'var(--border)' }}>
            <th style={{ padding: '12px' }}>Name</th>
            <th style={{ padding: '12px' }}>Phone</th>
            <th style={{ padding: '12px' }}>Vehicle</th>
            <th style={{ padding: '12px' }}>Deliveries</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map(agent => (
            <tr key={agent._id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px' }}>{agent.name}</td>
              <td style={{ padding: '12px' }}>{agent.phone || 'N/A'}</td>
              <td style={{ padding: '12px' }}>{agent.agentDetails?.vehicleType || 'Any'}</td>
              <td style={{ padding: '12px' }}>{agent.agentDetails?.totalDeliveries || 0}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ color: agent.agentStatus === 'online' ? 'green' : 'gray' }}>
                  {agent.isSuspended ? 'Suspended' : agent.agentStatus}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => toggleSuspension(agent._id, agent.isSuspended)}>
                  {agent.isSuspended ? 'Unsuspend' : 'Suspend'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
