import { addProducts, getProducts } from "@/lib/data";
import { NextResponse,NextRequest } from "next/server";



export const GET = async (req : NextRequest, res : NextResponse) =>{
    try {
        
        const products = await getProducts();
        console.log(products);
        return NextResponse.json({message : "OK", products },{status: 200});

        
    } catch (err) {

       return NextResponse.json(
            { message: "Error", err },
            { status : 500}  
        ) ;
        
    }
};  

export const POST = async (req:Request, res:Response) =>{
    const{id,Name,Location,Size,Model,Company,Brand,Material,Year,Quantity,Units,UnitPrice,TotalValue} = await req.json();
    try {
        const product =  {id,Name,Location,Size,Model,Company,Brand,Material,Year,Quantity,Units,UnitPrice,TotalValue};
        addProducts(product);
        return NextResponse.json({message : "OK", product },{status: 201});
    } catch (err) {

        return NextResponse.json(
             { message: "Error", err },
             { status : 500}  
         ) ;
         
     }
};  