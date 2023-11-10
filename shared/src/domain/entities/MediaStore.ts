import {Entity, Id} from "../types";

export type MediaStore = Entity & Readonly<{
    id: Id;
    name?: string;
    contentType: string;
    data: Buffer;
}>
