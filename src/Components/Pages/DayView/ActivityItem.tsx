import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import Hammer from 'react-hammerjs';
import { observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import { CSSTransition } from 'react-transition-group';

import Activity from '../../../Data/Models/Activity';
import DayViewModel from '../../../Data/ViewModels/Day/DayViewModel';
import { exclude } from '../../../Utils/ArrayHelpers';
import { option } from 'yargs';

type ActivityItemProps = {
    activity: Activity,
    dayVM: DayViewModel
};

export default observer(
    ({activity, dayVM}: ActivityItemProps) => {

        const sectionRef = useRef<HTMLElement>(null);
        const isSelected = computed(() => dayVM.selectedActivities.includes(activity));
        const momentTime = moment(activity.time);
        const [hammerInit, setHammerInit] = useState(false); // Used to bypass dependency on isSelected

        // useEffect(() => {
        //     if (sectionRef.current && !hammerInit) {
        //         const hammer = new Hammer(sectionRef.current);
        //         hammer.add(new Hammer.Press({
        //             event: 'press',
        //             time: 500,
        //         }));
        //         hammer.add(new Hammer.Tap({
        //             time: 150,
        //             taps: 1,
        //             posThreshold: 30
        //         }));
        //         hammer.on('press', () => {
        //             if (!isSelected.get()) {
        //                 dayVM.selectedActivities.push(activity);
        //             }
        //         });
        //         hammer.on('tap', () => {
        //             if (dayVM.selectedActivities.length > 0) {
        //                 if (isSelected.get()) {
        //                     dayVM.selectedActivities = exclude(dayVM.selectedActivities, activity);
        //                 } else {
        //                     dayVM.selectedActivities.push(activity); 
        //                 }
        //             }
        //         });
        //         //setHammerInit(true);
        //     }
        // }, [activity, dayVM, isSelected, /*hammerInit*/]);

        function onPressed() {
            if (!isSelected.get()) {
                dayVM.selectedActivities.push(activity);
            }
        }

        function onTapped() {
            if (dayVM.selectedActivities.length > 0) {
                if (isSelected.get()) {
                    dayVM.selectedActivities = exclude(dayVM.selectedActivities, activity);
                } else {
                    dayVM.selectedActivities.push(activity); 
                }
            }
        }

        function onEditClick() {
            dayVM.selectedActivities = exclude(dayVM.selectedActivities, activity);
            dayVM.currentlyEditing = activity;
        }

        function onRemoveClick() {
            dayVM.selectedActivities = exclude(dayVM.selectedActivities, activity);
            dayVM.delete(activity);
        }

        const SelectedParts = () => {
            return <div className="selected-parts">
                <button className="edit action-button"
                        onClick={onEditClick}>
                    <i className="fas fa-pen-square"></i>
                </button>
                <button className="delete action-button"
                        onClick={onRemoveClick}>
                    <i className="fas fa-minus-square"></i>
                </button>
                <div className="selected"></div>
            </div>
        }

        return (
            <Hammer onTap={onTapped} onPress={onPressed} options={{
                recognizers: {
                    tap: {
                        time: 150,
                        taps: 1,
                        posThreshold: 30
                    },
                    press: {
                        event: 'press',
                        time: 500,
                    }
                }
            }}>
                <section className="activity" ref={sectionRef}>
                    <div className="time-container" 
                        data-tod={Math.floor(momentTime.hour() / 3.1)}>
                        <time>{momentTime.format('HH:mm')}</time>
                    </div>
                    <span className="title">{activity.title}</span>
                    <div className="subtitle">
                        <span className="feeling-label">Feeling:</span>
                        <div className="feeling-mood" data-mood={activity.feeling}>
                            <span>{activity.feeling.toUpperCase()}</span>
                        </div>
                    </div>
                    <CSSTransition classNames="translate-x" 
                                in={isSelected.get()}
                                timeout={200}
                                unmountOnExit>
                        <SelectedParts/>
                    </CSSTransition>
                </section>  
            </Hammer>
        )   
    }
);