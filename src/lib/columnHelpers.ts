import { databases, ID } from "../../appwrite"

export const getColumns = async () => {
    const data = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_COLUMNS_COLLECTION_ID!)

    const columns = data.documents


    return columns
}

export const addColumn = async (name: string, type: string, dropdown_values?: string[], image?: File | null) => {
    const { $id } = await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_COLUMNS_COLLECTION_ID!,
        ID.unique(),
        {
            name: name,
            type: type,
            dropdown_values: dropdown_values || [],
            image: image || null
        }
    )

    return $id
}

export const deleteColumn = async (id: string) => {
    await databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_COLUMNS_COLLECTION_ID!,
        id
    )
    return id
}

export const updateColumn = async (id: string, name: string, type: string, dropdown_values?: string[], image?: File | null) => {
    const { $id } = await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_COLUMNS_COLLECTION_ID!,
        id,
        {
            name: name,
            type: type,
            dropdown_values: dropdown_values || [],
            image: image || null
        }
    )

    return $id
}