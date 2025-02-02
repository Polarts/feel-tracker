import React, { useState } from 'react';
import SettingsItem from '../../../settings-item/SettingsItem';
import { db } from '../../../../../data/Database';
import { DELETE_GUARD, DELETE_SUCCESS } from '../userData.constants';
import { useAlerts } from '@/components/generic/Alert';

const DeleteData = () => {
  const [deleteGuard, setDeleteGuard] = useState(true);
  const { showAlert } = useAlerts();

  const handleOnClick = async () => {
    if (deleteGuard) {
      showAlert({
        title: DELETE_GUARD.title,
        description: DELETE_GUARD.description,
        severity: DELETE_GUARD.severity,
      });
      setDeleteGuard(false);

      setTimeout(() => {
        setDeleteGuard(true);
      }, 5000);

      return;
    }

    await db.activities.clear();
    await db.categories.clear();

    showAlert({
      title: DELETE_SUCCESS.title,
      description: DELETE_SUCCESS.description,
      severity: DELETE_SUCCESS.severity,
    });
  };

  return (
    <SettingsItem
      label="Delete data"
      iconKey="Trash"
      onClick={handleOnClick}
    />
  );
};

export default DeleteData;
