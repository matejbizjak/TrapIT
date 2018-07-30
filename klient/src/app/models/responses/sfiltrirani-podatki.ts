import {Media} from "../entities/media.entity";

export class SfiltriraniPodatki {
    public mediji: Media[]; // samo nekaj (limit)
    public stVsehMedijev: number;

    constructor(mediji: Media[], stVsehMedijev: number) {
        this.mediji = mediji;
        this.stVsehMedijev = stVsehMedijev;
    }
}