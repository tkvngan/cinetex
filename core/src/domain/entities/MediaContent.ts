import {Entity, Id} from "../types/Entity";

export type MediaContent = Entity & Readonly<{
    id: Id;
    name?: string;
    contentType: string;
    data: Buffer;
}>
