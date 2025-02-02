import React, { MouseEvent, TouchEvent, useEffect } from "react";
import FullscreenModal from "@modals/FullscreenModal";
import { X } from "@phosphor-icons/react";
import Alert, { useAlerts } from "../../../components/generic/Alert";
import Button from "../../../components/input/button/Button";
import DatePicker from "../../../components/input/date-picker/DatePicker";
import IconPicker from "../../../components/input/icon-picker/IconPicker";
import RatingPicker from "../../../components/input/rating-picker/RatingPicker";
import TextField from "../../../components/input/text-field/TextField";
import TimePicker from "../../../components/input/time-picker/TimePicker";
import { db } from "../../../data/Database";
import CategorySelect from "../../categories/category-selection/CategorySelect";
import { Activity } from "../Activity.interface";
import classes from "./ActivityEditForm.module.scss";
import { DELETE_GUARD_ALERT, VALIDATION_ALERTS } from "./state/activityForm.constants";
import useActivityForm from "./state/useActivityForm";

interface ActivityEditFormProps {
  onClose: () => void;
  activity?: Partial<Activity>;
  onCloseTemplateSelection?: () => void;
}

type SeverityType = "success" | "error" | "info" | "warning";

const CLOSE_ICON_PROPS = { size: 24 };

const ActivityEditForm = ({
  onClose,
  activity,
  onCloseTemplateSelection,
}: ActivityEditFormProps) => {
  const { showAlert, alerts, removeAlert } = useAlerts();

  const {
    state,
    validations,
    isChanged,
    deleteGuard,
    setTitle,
    setDescription,
    setRating,
    setDate,
    setTime,
    setIcon,
    setCategories,
    resetState,
    enableDeleteGuard,
    disableDeleteGuard,
  } = useActivityForm(activity);

  const { title, description, rating, startTime, endTime, iconKey, categoryIds } = state;

  const isFormValid = (): boolean => {
    for (const validation of VALIDATION_ALERTS) {
      const { type, severity, title, description } = validation;
      if (type !== "deleteGuard" && !validations[type]) {
        showAlert({ severity: severity as SeverityType, title, description });
        return false;
      }
    }
    return true;
  };

  const handlePrimaryButton = (event: MouseEvent | TouchEvent): void => {
    event.preventDefault();

    if (!isFormValid()) return;

    if (activity?.id) {
      db.activities.update(activity.id, { title, description, rating, startTime, endTime, iconKey, categoryIds });
      showAlert({ severity: "success", title: "Activity Updated", description: "The activity has been updated successfully." });
    } else {
      db.activities.add({ title, description, rating, startTime, endTime, iconKey, categoryIds } as Activity);
      showAlert({ severity: "success", title: "Activity Created", description: "The activity has been created successfully." });
    }

    onCloseTemplateSelection ? onCloseTemplateSelection() : onClose();
  };

  const handleSecondaryButton = async (event: MouseEvent | TouchEvent): Promise<void> => {
    event.preventDefault();

    if (activity?.id && deleteGuard) {
      showAlert(DELETE_GUARD_ALERT);
      disableDeleteGuard();
      return;
    }

    if (activity?.id) {
      await db.activities.delete(activity.id);
      showAlert({ severity: "info", title: "Activity Deleted", description: "The activity has been deleted." });
    }

    resetState();
    onClose();
  };

  const handleClose = (event: MouseEvent | TouchEvent): void => {
    event.preventDefault();
    onClose();
  };

  useEffect(() => {
    if (alerts.length > 0) {
      const firstAlert = document.querySelector(`.${classes.alertsContainer}`);
      const createButton = document.querySelector(".create-activity-button");

      if (firstAlert && createButton) {
        const buttonRect = createButton.getBoundingClientRect();
        (firstAlert as HTMLElement).style.bottom = `${window.innerHeight - buttonRect.top + 20}px`;
      }
    }
  }, [alerts]);

  return (
    <FullscreenModal>
      {alerts.length > 0 && (
        <>
          <div
            className="overlay"
            onClick={() => alerts.forEach((alert: { id: any }) => removeAlert(alert.id))}
          />
          <div className={classes.alertsContainer} tabIndex={-1}>
            {alerts.map((alert: { id: React.Key | null | undefined; severity: string; title: string | undefined; description: string | undefined; }, index: number) => (
              <Alert
                key={alert.id}
                severity={alert.severity as SeverityType}
                title={alert.title}
                description={alert.description}
                style={{
                  transform: `translate(-50%, ${index * 10}px) scaleY(${1 - index * 0.05})`,
                  borderBottomWidth: `${5 - index}px`,
                  transition: 'transform 0.3s, border-bottoam-width 0.3s',
                }}
                onDismiss={() => removeAlert(alert.id)}
              />
            ))}
          </div>
        </>
      )}
      <form className={classes.form}>
        <FullscreenModal.Header>
          <FullscreenModal.Title>
            {activity?.id ? "Edit Activity" : "Create a new activity"}
          </FullscreenModal.Title>
          <X {...CLOSE_ICON_PROPS} onClick={handleClose} />
        </FullscreenModal.Header>
        <div className={classes.inputs}>
          <div className={classes.titleAndIcon}>
            <IconPicker className={classes.iconPicker} label="Select an Icon" iconKey={iconKey} onIconChange={setIcon} />
            <TextField
              label="Title"
              iconKey={iconKey || "PencilLine"}
              name="title"
              max={50}
              placeholder="What's the name of your activity?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <TextField
            multiline
            label="Description"
            iconKey="FilmSlate"
            name="description"
            max={250}
            placeholder="Give a brief description of your activity."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <CategorySelect
            label="Categories (optional)"
            placeholder="Select a category for your activity."
            categoryIds={categoryIds}
            onCategoriesChange={setCategories}
          />
          <RatingPicker label="How did you feel about this activity?" rating={rating} onRatingChange={setRating} />
          <DatePicker label="Date" date={startTime} onDateChange={setDate} />
          <TimePicker label="Time" startTime={startTime} endTime={endTime} onTimeChange={setTime} isNow={false} />
        </div>
        <FullscreenModal.ButtonsPanel>
          <Button variant="primary" onClick={handlePrimaryButton} disabled={!isChanged && !!activity?.id}>
            {activity?.id ? "Save Changes" : "Create Activity"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleSecondaryButton}
            underline
            isDangerous={!!activity}
            disabled={!activity?.id && !isChanged}
          >
            {activity?.id ? "Delete Activity" : "Reset"}
          </Button>
        </FullscreenModal.ButtonsPanel>
      </form>
    </FullscreenModal>
  );
};

export default ActivityEditForm;
