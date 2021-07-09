import { 
    makeObservable, 
    observable, 
    reaction 
} from "mobx";

export enum DisplayModes {
    none,
    selecting,
    deleteAll,
    creating
}

export default class NavigationViewModel {

    //#region properties
    @observable
    public leftMenuOpen: boolean = false;

    @observable
    public rightMenuOpen: boolean = false;

    @observable
    public displayMode: DisplayModes = DisplayModes.none;

    @observable
    public hasNext: boolean = true;

    @observable
    public hasPrev: boolean = true;
    //#endregion

    constructor() {
        makeObservable(this);
        reaction(
            () => this.displayMode,
            () => {
                if (this.displayMode === DisplayModes.selecting) {
                    this.rightMenuOpen = this.leftMenuOpen = false;
                }
            }
        );
    }

}