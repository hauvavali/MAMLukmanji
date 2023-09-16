import { error } from "console";

type Product = {
    id: number;
    Name:string;
    Location:string;
    Size:	string;
    Model:string;
    Company:string;
    Brand:string;
    Material:string;
    Year:string;	
    Quantity:string;
    Units:string;
    UnitPrice:string;
    TotalValue:string;

};

let products :Product[] = [
    {
        id: 1,
        Name: 'TEST',
        Location:'TEST',
        Size:	'TEST',
        Model:'TEST',
        Company:'TEST',
        Brand:'TEST',
        Material:'TEST',
        Year:'TEST',	
        Quantity:'TEST',
        Units:'TEST',
        UnitPrice:'TEST',
        TotalValue:'TEST'
    }
];

//handlers

export const getProducts = () => products;
export const addProducts =(product : Product) =>{

    products.push(product);

};
export const deleteProducts=(id : string) =>{

    products = products.filter((product) => product.id !== id);
}

export const updateProducts =
(id : string,Name:string,Location:string,Size:	string,Model:string,Company:string,Brand:string,Material:string,Year:string,Quantity:string, Units:string, UnitPrice:string,TotalValue:string) =>{
    const product = products.find((product)=> product.id == id);
    if (product){
        product.id= id;
        product.Name= Name;
        product.Location= Location;
        product.Size=	Size;
        product.Model= Model;
        product.Company = Company;
        product.Brand =Brand;
        product.Material= Material;
        product.Year = Year;	
        product.Quantity =  Quantity;
        product.Units= Units;
        product.UnitPrice = UnitPrice;
        product.TotalValue = TotalValue;

    }else{
        throw new Error("No product found! ");
    
    }
  
};

export const getByID= (id: string) => {
    return products.find((post)=> post.id === id);

};
