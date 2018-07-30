export class FiltriranjeNastavitve {
    public stNaStran: number;
    public stStrani: number; // current page number
    public filtrirajPo: string;
    public filtrirajAsc: boolean; // ascending or descending order

    constructor(stNaStran: number, stStrani: number, filtrirajPo: string, filtrirajAsc: boolean) {
        this.stNaStran = stNaStran;
        this.stStrani = stStrani;
        this.filtrirajPo = filtrirajPo;
        this.filtrirajAsc = filtrirajAsc;
    }
}
