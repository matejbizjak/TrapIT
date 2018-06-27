export class PotiSlik {
    public prejsnjaSlika: { pot: string, potHighRes: string };
    public trenutnaSlika: { pot: string, potHighRes: string };
    public naslednjaSlika: { pot: string, potHighRes: string };

    constructor(trenutnaSlika: { pot: string; potHighRes: string }, naslednjaSlika: { pot: string; potHighRes: string }) {
        this.trenutnaSlika = trenutnaSlika;
        this.naslednjaSlika = naslednjaSlika;
    }

    public naprej(vseSlike: string[], zapStTrenutneSlike: number) {

    }

    public nazaj(vseSlike: string[], zapStTrenutneSlike: number) {

    }
}
