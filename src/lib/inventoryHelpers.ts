import { databases, ID, storage } from "../../appwrite"

const uploadImage = async (file: any) => {
    console.log('HERE', file)
    if (!file) return
    const fileUploaded = await storage.createFile(
        '6506be646ef5541d3ac7',
        ID.unique(),
        file.originFileObj
    )
    return fileUploaded
}

export const getUrl = async (bucketId: string, fileId: string) => {
    const url = storage.getFilePreview(bucketId, fileId)
    return url.href.toString()

}

export const getInventory = async () => {
    const data = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_INVENTORY_COLLECTION_ID!)

    const inventory = data.documents

    return inventory
}

export const addInventory = async (name: string, properties: any, imgProps: string[]) => {

    if (imgProps.length) {
        for (let i = 0; i < imgProps.length; i++) {
            const fileUploaded = await uploadImage(properties[imgProps[i]])
            if (fileUploaded) {
                properties[imgProps[i]] = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id
                }
            }
        }
    }

    const { $id } = await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_INVENTORY_COLLECTION_ID!,
        ID.unique(),
        {
            name: name,
            properties: JSON.stringify(properties)
        }
    )

    return $id
}

export const deleteInventory = async (id: string) => {
    await databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_INVENTORY_COLLECTION_ID!,
        id
    )
    return id
}

export const updateInventory = async (id: string, name: string, properties: any, imgProps: string[]) => {
    console.log(imgProps)
    if (imgProps.length) {
        for (let i = 0; i < imgProps.length; i++) {
            const fileUploaded = await uploadImage(properties[imgProps[i]])
            if (fileUploaded) {
                properties[imgProps[i]] = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id
                }
            }
        }
    }

    const data = {
        name: name,
        properties: JSON.stringify(properties)
    }

    const { $id } = await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_INVENTORY_COLLECTION_ID!,
        id,
        data
    )

    return data
}