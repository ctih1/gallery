export interface DomainAnalysis {
    coordinates: [number, number];
    airport: string;
}

export interface ProbeResult {
    index: number
    domain: string
    ip: string
    delay: number
    domainAnalysis?: DomainAnalysis
}