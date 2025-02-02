import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import './alertsPromptContext.scss';
import { CheckCircle, Info, Warning, XCircle } from '@phosphor-icons/react';

const AlertsContext = createContext(undefined);

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsPromptProvider');
  }
  return context;
};

const getAlertIcon = (severity) => {
  switch (severity) {
    case 'success':
      return <CheckCircle />;
    case 'error':
      return <XCircle />;
    case 'info':
      return <Info />;
    case 'warning':
      return <Warning />;
    default:
      return <span>❔</span>;
  }
};

export const AlertsPromptProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = ({ title, severity, content }) => {
    const existingAlert = alerts.find(
      (alert) => alert.title === title && alert.severity === severity && alert.content === content
    );

    if (existingAlert) {
      return; 
    }

    const newAlert = {
      id: `${Date.now()}-${Math.random()}`, 
      title,
      severity,
      content,
      icon: getAlertIcon(severity),
    };
    setAlerts((prev) => [...prev, newAlert]);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (alerts.length > 0) {
        setAlerts((prev) => prev.slice(1));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [alerts]);

  return (
    <AlertsContext.Provider value={{ alerts, showAlert, removeAlert }}>
      {children}
      <div className="alerts-container">
        {alerts.map((alert, index) => (
          <div
            key={alert.id}
            className={`alert-card alert-${alert.severity}`}
            style={{ bottom: `${20 + index * 10}px` }}
            onClick={() => removeAlert(alert.id)}
          >
            <div className="alert-content-container">
              <div className="alert-icon">{alert.icon}</div>
              <div className="alert-header">
                <div className="alert-title">{alert.title}</div>
                <p className="alert-content">{alert.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AlertsContext.Provider>
  );
};
