export interface User {
    eventList: Date[];
}

export interface ChatColumn {
    id: number;
    source: string;
    text: string;
    sent_at: Date;
}
