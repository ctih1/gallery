export interface Props {
    weatherData: ServerResponse | undefined;
}

export interface RainlikeParticle {
    offset: number;
    position: {
        x: number;
        y: number;
    };
}

export interface Cloud {
    position: Position;
    rotation: number;
    scaleX: number;
    scaleY: number;
}

export interface Position {
    x: number;
    y: number;
}

export interface RenderObjects {
    flakes: RainlikeParticle[];
    rain: RainlikeParticle[];
    clouds: Cloud[];
    sun: Position;
}

export type FullPercentage = number; // like 100% stored as 100
export interface RenderEnvironment {
    snowFallSpeed: number;
    snowAmount: number;
    waterAmount: number;
    waterSpeed: number;
    visibilityMeters: number;
    cloudCover: FullPercentage;
    windSpeed: number;
}
