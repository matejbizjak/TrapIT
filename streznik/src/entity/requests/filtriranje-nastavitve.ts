import {Project} from "../Project";

export class FiltriranjeNastavitve {
    public stNaStran: number;
    public stStrani: number;
    public filtrirajPo: string;
    public filtrirajAsc: boolean; // ascending or descending order
    public projekti: Project[] = [];

    constructor(stNaStran: number, stStrani: number, filtrirajPo: string, filtrirajAsc: boolean) {
        this.stNaStran = stNaStran;
        this.stStrani = stStrani;
        this.filtrirajPo = filtrirajPo;
        this.filtrirajAsc = filtrirajAsc;
    }
}
