export interface MeteoResponse {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;
	hourly_units: HourlyUnits;
	hourly: Hourly;
	daily_units: DailyUnits;
	daily: Daily;
}

export interface HourlyUnits {
	time: string;
	temperature_2m: string;
	cloud_cover: string;
	snowfall: string;
}

export interface Hourly {
	time: string[];
	temperature_2m: number[];
	cloud_cover: number[];
	snowfall: number[];
}

export interface DailyUnits {
	time: string;
	sunrise: string;
	sunset: string;
	sunshine_duration: string;
}

export interface Daily {
	time: string[];
	sunrise: string[];
	sunset: string[];
	sunshine_duration: number[];
}

export type MapData = { [k: string]: number };

export interface ServerResponse {
	timezoneOffsetHours: number;
	temperature: MapData;
	cloudCover: MapData;
	snowfall: MapData;
	sunrise: Date;
	sunset: Date;
}
