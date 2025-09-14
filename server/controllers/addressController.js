import Address from "../models/Address.js"


// Add Address : /api/address/add
export const addAddress = async(req, res)=>{
    try {
        console.log('🔍 ADDRESS DEBUG: Request body:', req.body);
        console.log('🔍 ADDRESS DEBUG: User ID from middleware:', req.userId);
        
        const { address } = req.body;
        const userId = req.userId; // Get from middleware instead of body
        
        if (!userId) {
            return res.json({ success: false, message: "User ID not found in request" });
        }
        
        const addressData = {
            ...address,
            userId: userId
        };
        
        console.log('🔍 ADDRESS DEBUG: Final address data:', addressData);
        
        await Address.create(addressData);
        res.json({success: true, message: "Address added successfully"});
    } catch (error) {
        console.error('🔍 ADDRESS DEBUG: Error in addAddress:', error);
        res.json({ success: false, message: error.message });
    }
}

// Get Address : /api/address/get
export const getAddress = async(req, res)=>{
    try {
        console.log('🔍 ADDRESS DEBUG: Get addresses for user ID:', req.userId);
        
        const userId = req.userId; // Get from middleware instead of body
        
        if (!userId) {
            return res.json({ success: false, message: "User ID not found in request" });
        }
        
        const addresses = await Address.find({userId});
        console.log('🔍 ADDRESS DEBUG: Found addresses:', addresses.length);
        
        res.json({success: true, addresses});
    } catch (error) {
        console.error('🔍 ADDRESS DEBUG: Error in getAddress:', error);
        res.json({ success: false, message: error.message });
    }
}
