import {MediaContentRepository} from "../../application/repositories";
import {Model, SchemaDefinition} from "mongoose";
import {MediaContent} from "shared/dist/domain/entities";
import {TODO} from "shared/dist/utils";


export const MediaContentSchemaDefinition: SchemaDefinition = {
    name: {type: String, required: false},
    contentType: {type: String, required: true},
    data: {type: Buffer, required: true}
}

export function MongoDBMediaContentRepository(model: Model<MediaContent>): MediaContentRepository {
    return {
        async getMediaContentById(id: string): Promise<MediaContent | undefined> {
            TODO();
        },

        async getMediaContentIdsByName(name: string): Promise<string[]> {
            TODO();
        },

        async addMediaContent(mediaContent: MediaContent): Promise<void> {
            TODO();
        },

        async deleteMediaContentById(id: string): Promise<number> {
            TODO();
        },

        async updateMediaContentById(id: string, mediaStore: Partial<Omit<MediaContent, "id">>): Promise<number> {
            TODO();
        }
    }
}
