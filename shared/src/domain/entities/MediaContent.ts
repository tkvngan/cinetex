import {Entity, Id} from "../types";

export type MediaContent = Entity & Readonly<{
    id: Id;
    name?: string;
    contentType: string;
    data: Buffer;
}>
