export interface Root {
    trip: Trip;
    vehicles: Vehicles;
}

export interface Trip {
    header: Header;
    entity: Entity[];
}

export interface Header {
    gtfsRealtimeVersion: string;
    incrementality: string;
    timestamp: string;
}

export interface Entity {
    id: string;
    tripUpdate: TripUpdate;
}

export interface TripUpdate {
    trip: Trip2;
    stopTimeUpdate: StopTimeUpdate[];
    vehicle: Vehicle;
    timestamp: string;
}

export interface Trip2 {
    tripId: string;
    startTime: string;
    startDate: string;
    scheduleRelationship: string;
    routeId: string;
    directionId: number;
}

export interface StopTimeUpdate {
    stopSequence: number;
    arrival?: Arrival;
    departure?: Departure;
    stopId: string;
    scheduleRelationship: string;
}

export interface Arrival {
    time: string;
}

export interface Departure {
    time: string;
}

export interface Vehicle {
    id: string;
    label: string;
    licensePlate?: string;
}

export interface Vehicles {
    header: Header2;
    entity: Entity2[];
}

export interface Header2 {
    gtfsRealtimeVersion: string;
    incrementality: string;
    timestamp: string;
}

export interface Entity2 {
    id: string;
    vehicle: Vehicle2;
}

export interface Vehicle2 {
    trip: Trip3;
    position: Position;
    currentStopSequence: number;
    currentStatus: string;
    timestamp: string;
    congestionLevel: string;
    stopId: string;
    vehicle: Vehicle3;
    occupancyStatus?: string;
    occupancyPercentage?: number;
}

export interface Trip3 {
    tripId: string;
    startTime: string;
    startDate: string;
    scheduleRelationship: string;
    routeId: string;
    directionId: number;
}

export interface Position {
    latitude: number;
    longitude: number;
    bearing: number;
    speed: number;
}

export interface Vehicle3 {
    id: string;
    label: string;
    licensePlate?: string;
}
