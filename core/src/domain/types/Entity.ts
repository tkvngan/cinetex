export type Entity = Readonly<{
    id: Id;
}>

export type Id = string;

let _newObjectId: () => Id = () => { throw new Error("newObjectId not set"); }

export function setObjectIdFactory(factory: () => Id) {
    _newObjectId = factory
}

export function newObjectId(): Id {
    return _newObjectId()
}
