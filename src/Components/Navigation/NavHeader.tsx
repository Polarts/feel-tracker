import React, { useState } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { useActivitiesStore } from '../../Stores/ActivitiesStore';
import { useLocation } from 'react-router';
import { Routes } from '../../App';
import { CSSTransition } from 'react-transition-group';
import NavHeaderViewModel, { SelectModes } from '../../ViewModels/NavHeaderViewModel';
import NavMenuItem from './NavMenuItem';

type NavHeaderProps = {
    vm: NavHeaderViewModel
}

export default observer(
    ({vm}: NavHeaderProps) => {
        
        const location = useLocation();
        const store = useActivitiesStore();

        function onLeftButtonClicked() {
            if (vm.selectMode === SelectModes.selecting) {
                vm.selectMode = SelectModes.none;
            } else {
                vm.leftMenuOpen = !vm.leftMenuOpen;
            }
        }

        function onRightButtonClicked() {
            if (vm.selectMode === SelectModes.selecting) {
                vm.selectMode = SelectModes.deleteAll;
            } else {
                vm.rightMenuOpen = !vm.rightMenuOpen;
            }
        }

        function Title() {
            switch(location.pathname) {
                case Routes.day:
                    return (
                        <h1>
                            <span>{moment(store.startDate).format('dddd').toUpperCase()}</span>
                            <span>{moment(store.startDate).format('DD MMM yyyy')}</span>
                        </h1>
                    );
                default:
                    return ( 
                        <h1>
                            <span>404</span>
                            <span>Page Not Found</span>
                        </h1>
                    );
            }
        }

        return (
            <header>
                <nav className="nav-header">
                    <button className="nav-menu-button action-button"
                            onClick={onLeftButtonClicked}>
                        <i className={`fas ${
                            vm.selectMode === SelectModes.selecting
                                ? 'fa-window-close' 
                                : vm.leftMenuOpen
                                    ? 'fa-times'
                                    : 'fa-calendar-day'
                            }`}/>
                    </button>
                    <Title/>
                    <button className="nav-menu-button action-button"
                            onClick={onRightButtonClicked}>
                        <i className={`fas ${
                            vm.selectMode === SelectModes.selecting
                            ? 'fa-trash-alt' 
                            : vm.rightMenuOpen
                                ? 'fa-times'
                                : 'fa-caret-square-down'
                        }`}/>
                    </button>
                    <div className="nav-menus">
                        <CSSTransition classNames="inflate" 
                                       in={vm.leftMenuOpen}
                                       timeout={300}
                                       unmountOnExit>
                            <ul className="nav-menu left">
                                <NavMenuItem icon="fa-calendar-day" text="Day View" route={Routes.day}/>
                                <NavMenuItem icon="fa-calendar-week" text="Week View" route={Routes.week}/>
                                <NavMenuItem icon="fa-calendar-alt" text="Month View" route={Routes.month}/>
                            </ul>
                        </CSSTransition>
                        <CSSTransition classNames="inflate" 
                                       in={vm.rightMenuOpen}
                                       timeout={300}
                                       unmountOnExit>
                            <ul className="nav-menu right">
                                <NavMenuItem icon="fa-cog" text="Settings" route={Routes.settings}/>
                                <NavMenuItem icon="fa-info-circle" text="About" route={Routes.about}/>
                                <NavMenuItem icon="fa-sign-out-alt" text="Logout" route={Routes.login}/>
                            </ul>
                        </CSSTransition>
                    </div>
                </nav>
            </header>
        );
    }
);