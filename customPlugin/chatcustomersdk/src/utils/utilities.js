export const timeConversion=(timeStamp)=>{
    const timestamp = timeStamp;
const date = new Date(timestamp);
const indianTime = date.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
return indianTime;
   }