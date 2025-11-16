import connectDB from "@/config/db"



export async function POST(request){
    try{

        const { userId } = getAuth(request)
        const { address } = await request.json()

        await connectDB()   
        const newAddress = await Address.create({...address,userId})

        return NextResponse.json({success:true,message:"Address added successfully"})
    }

    catch{
        

    }
}