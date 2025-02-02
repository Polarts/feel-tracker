import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { CheckCircle, Info, Warning, XCircle } from '@phosphor-icons/react';
import classNames from 'classnames/bind';
import classes from './Alert.module.scss';

const cx = classNames.bind(classes);

export type SeverityType = 'error' | 'warning' | 'info' | 'success';

interface AlertProps {
  severity: SeverityType;
  description?: string;
  title?: string;
  marginTop?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onDismiss?: () => void;
}

export type AlertType = {
  id: string;
  severity: SeverityType;
  title: string;
  description: string;
};

const AlertsContext = createContext<any>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsPromptProvider');
  }
  return context;
};

const getAlertIcon = (severity: SeverityType) => {
  const iconProps = { size: 50 };
  switch (severity) {
    case 'success':
      return <CheckCircle {...iconProps} />;
    case 'error':
      return <XCircle {...iconProps} />;
    case 'info':
      return <Info {...iconProps} />;
    case 'warning':
      return <Warning {...iconProps} />;
    default:
      return <span style={{ fontSize: '5em' }}>❔</span>;
  }
};

const Alert = ({ severity, title, description, marginTop, className, style, onDismiss }: AlertProps) => (
  <div
    className={cx(
      'alert-card',
      `alert-${severity}`,
      className,
      marginTop && 'marginTop'
    )}
    style={style}
    onClick={() => {
      onDismiss?.();
    }}
  >
    <div className={cx('alert-icon')}>{getAlertIcon(severity)}</div>
    <div className={cx('alert-content-container')}>
      {title && <div className={cx('alert-title')}>{title}</div>}
      {description && <div className={cx('alert-content')}>{description}</div>}
    </div>
  </div>
);

export const AlertsPromptProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const alertTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const showAlert = ({ title, severity, description }: Omit<AlertType, 'id'>) => {
    setAlerts((prev) => {
      if (prev.some((alert) => alert.severity === severity)) {
        return prev;
      }
      const id = `${Date.now()}-${Math.random()}`;
      const newAlert = { id, title, severity, description };

      alertTimeouts.current[id] = setTimeout(() => {
        removeAlert(id);
      }, 10000);

      return [...prev, newAlert];
    });
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    if (alertTimeouts.current[id]) {
      clearTimeout(alertTimeouts.current[id]);
      delete alertTimeouts.current[id];
    }
  };

  useEffect(() => {
    return () => {
      Object.values(alertTimeouts.current).forEach(clearTimeout);
      alertTimeouts.current = {};
    };
  }, []);

  return (
    <AlertsContext.Provider value={{ alerts, showAlert, removeAlert }}>
      {children}
      <div className={cx('alertsContainer')}>
        {alerts.map((alert, index) => (
          <Alert
            key={alert.id}
            severity={alert.severity}
            title={alert.title}
            description={alert.description}
            marginTop={index > 0}
            className={cx('stacked-alert')}
            style={{
              transform: `translate(-50%, ${index * 10}px) scaleY(${1 - index * 0.05})`,
              borderBottomWidth: `${5 - index}px`,
              transition: 'transform 0.3s, border-bottom-width 0.3s',
            }}
            onDismiss={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </AlertsContext.Provider>
  );
};

export default Alert;
