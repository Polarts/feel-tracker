import {
    observable, 
    computed, 
    IObservableArray, 
    action, 
    makeObservable 
} from 'mobx';
import moment from 'moment';
import Activity from '../Models/Activity';
import Feelings from '../Models/Feelings';

export const DATE_FORMAT = 'YYYY-MM-DD';

export function useActivitiesStore() {
    if (!ActivitiesStore.instance.isInit) {
        ActivitiesStore.instance.init();
    }
    return ActivitiesStore.instance;
}

export default class ActivitiesStore {

    //#region properties

    //#region activities

    @observable
    private _activities: Array<Activity> = [];

    @computed
    public get activities(): Array<Activity> {
        return this._activities
            .filter(this.filterActivity)
            .sort((a, b) => Math.sign(moment(a.time).diff(moment(b.time), 'minutes')));
    }
    
    //#endregion

    @observable
    public startDate: string = '';

    @observable
    public endTime: string = '';

    @observable
    public tags: string[] = [];

    @observable 
    public selectedTags: IObservableArray<string> = observable.array<string>();

    public isInit = false;

    //#endregion

    //#region singleton

    private static _instance: ActivitiesStore;

    private constructor() {
        makeObservable(this);
    }

    public static get instance(){ 
        return this._instance ?? (this._instance = new ActivitiesStore()); 
    }

    //#endregion

    //#region methods

    private filterActivity(act: Activity): boolean {

        const store = ActivitiesStore.instance;
        const date = moment(act.time).format(DATE_FORMAT);

        if (act.tags.every(tag => store.selectedTags.includes(tag))) {

            if (store.startDate === store.endTime && date === store.startDate) {
                return true;
            }
            
            if (date <= store.endTime && date >= store.startDate) {
                return true;
            }
        }
        return false;
    }

    @action
    public init(): void {
        // MOCK
        // TODO retrieve actual data from server
        // TODO think of pagination logic
        this.tags = [
            'health', 
            'fitness', 
            'food'
        ];
        this.selectedTags = observable.array(this.tags);

        for (let i=0; i<5; i++) {
            const rng = Math.random() * 23;
            this._activities.push(new Activity(
                "Lorem ipsum dolor sit amet!",
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui cupiditate similique, repellat alias veniam reprehenderit debitis maiores, architecto modi repellendus delectus saepe assumenda vero obcaecati adipisci nisi eius fugiat porro.",
                Feelings.ok,
                moment().startOf('day').add(rng, 'hours').format(),
                [],
                `act_${rng}`
            ));
        }

        this.startDate = this.endTime = moment().format(DATE_FORMAT);

        this.isInit = true;
    }

    @action
    public create(act: Activity): boolean {
        // MOCK
        // TODO create on server
        act.id = `act_${this._activities.length}`;
        this._activities.push(act);
        return true;
    }

    @action
    public update(act: Activity): boolean {
        // MOCK
        // TODO update on server
        let updateIdx = this._activities.findIndex(a => a.id === act.id);
        this._activities[updateIdx] = act;
        return true;
    }

    @action
    public delete(act: Activity): boolean {
        // MOCK
        // TODO delete from server
        this._activities.remove(act);
        return true;
    }

    //#endregion
}