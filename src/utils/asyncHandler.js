// const asyncHandler = () =>{}


// promise method.
const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise.resolve(req,res,next).catch((err))
    }
}

export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = (func) => {}
// const asyncHandler = (func) => async () => {}




//try catch methode.

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }