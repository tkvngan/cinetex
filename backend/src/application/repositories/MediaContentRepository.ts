import {MediaContent} from "cinetex-core/dist/domain/entities";

export interface MediaContentRepository {

    getMediaContentById(id: string): Promise<MediaContent | undefined>;

    getMediaContentIdsByName(name: string): Promise<string[]>;

    addMediaContent(mediaContent: MediaContent): Promise<void>;

    deleteMediaContentById(id: string): Promise<number>;

    updateMediaContentById(id: string, mediaStore: Partial<Omit<MediaContent, "id">>): Promise<number>;
}
