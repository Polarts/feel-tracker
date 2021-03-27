import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useActivitiesStore } from '../Stores/ActivitiesStore';
import { useHistory, useLocation } from 'react-router';
import { LocationState, Routes } from '../App';

export default observer(
    () => {

        //#region state

        const [hasNext, setHasNext] = useState(true);
        const [hasPrev, setHasPrev] = useState(true);

        //#endregion

        const location = useLocation();
        const history = useHistory();
        const store = useActivitiesStore();

        function onCenterButtonClicked() {
            if (store.selectMode) {
                store.selectedActivities = [];
            } else {
                history.push(Routes.edit);
            }
        }

        return (
            <footer className="nav-footer">
                <nav>
                    <button className="fab button-secondary"
                            disabled={!hasPrev || store.selectMode}>
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button className="fab button-primary" 
                            onClick={onCenterButtonClicked}>
                        <i className={`fas fa-plus${store.selectMode? ' rotated' : ''}`}></i>
                    </button>
                    <button className="fab button-secondary"
                            disabled={!hasNext || store.selectMode}>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </nav>
                <div className="bottom-filler"></div>
            </footer>
        );
    }
);