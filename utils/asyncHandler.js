
const asyncHandler = (fn)=>(req,res,next)=>{

    asyncHandler.resolve(fn(req,res,err)).catch((err)=>next(err))
}

export default asyncHandler;
